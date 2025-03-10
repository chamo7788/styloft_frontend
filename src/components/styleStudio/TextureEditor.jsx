"use client"

import { useState, useRef, useEffect } from "react"
import { CanvasTexture } from "three"
import { RotateCw, Type, Trash2, Save, Brush, Eraser } from "lucide-react"

const TextureEditor = ({
  selectedModel,
  selectedPart,
  uvMappings,
  textElements,
  textSettings,
  onTextSettingsChange,
  canvasTextures,
  setCanvasTextures,
  setTextures,
}) => {
  const editorCanvasRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState({ width: 512, height: 512 })
  const [drawingMode, setDrawingMode] = useState("brush") // brush, eraser, text
  const [brushColor, setBrushColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  // Canvas history for undo/redo
  const [canvasHistory, setCanvasHistory] = useState({})
  const [canvasHistoryIndex, setCanvasHistoryIndex] = useState({})

  // Initialize canvas history for the selected part
  useEffect(() => {
    if (!canvasHistory[selectedPart]) {
      setCanvasHistory((prev) => ({
        ...prev,
        [selectedPart]: [null],
      }))

      setCanvasHistoryIndex((prev) => ({
        ...prev,
        [selectedPart]: 0,
      }))
    }
  }, [selectedPart, canvasHistory])

  // Initialize canvas when part changes
  useEffect(() => {
    initializeCanvas()
  }, [selectedPart])

  // Initialize canvas for texture editing
  const initializeCanvas = () => {
    const canvas = editorCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // If we have an existing texture for this part, draw it
    if (canvasTextures[selectedPart]) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      img.src = canvasTextures[selectedPart]
    }

    // Draw text elements
    drawTextElements(ctx)
  }

  // Draw text elements on canvas
  const drawTextElements = (ctx) => {
    textElements.forEach((element) => {
      // Set text style
      const fontSize = element.fontSize || 24
      const fontWeight = element.fontWeight || "normal"
      const fontStyle = element.fontStyle || "normal"
      const fontFamily = element.fontFamily || "Arial"

      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
      ctx.fillStyle = element.color || "#000000"
      ctx.textAlign = element.textAlign || "center"

      // Calculate position based on UV mapping
      const mapping = uvMappings[selectedModel][selectedPart]
      const x = mapping.x * canvasSize.width + (mapping.width * canvasSize.width) / 2
      const y = mapping.y * canvasSize.height + (mapping.height * canvasSize.height) / 2

      // Draw text
      ctx.fillText(element.text, x, y)
    })
  }

  // Handle mouse down for drawing
  const handleMouseDown = (e) => {
    if (drawingMode !== "brush" && drawingMode !== "eraser") return

    const canvas = editorCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setLastPos({ x, y })

    // Save current canvas state for undo
    saveCanvasState()
  }

  // Handle mouse move for drawing
  const handleMouseMove = (e) => {
    if (!isDrawing) return

    const canvas = editorCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(x, y)
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (drawingMode === "brush") {
      ctx.strokeStyle = brushColor
    } else if (drawingMode === "eraser") {
      ctx.strokeStyle = "#ffffff"
    }

    ctx.stroke()

    setLastPos({ x, y })
  }

  // Handle mouse up for drawing
  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false)

      // Update texture from canvas
      updateTextureFromCanvas()
    }
  }

  // Save current canvas state for undo
  const saveCanvasState = () => {
    const canvas = editorCanvasRef.current
    if (!canvas) return

    // Get current canvas data
    const imageData = canvas.toDataURL()

    // Get current history for this part
    const partHistory = canvasHistory[selectedPart] || []
    const partHistoryIndex = canvasHistoryIndex[selectedPart] || 0

    // Remove any future history if we're not at the end
    const newPartHistory = partHistory.slice(0, partHistoryIndex + 1)

    // Add current state to history
    newPartHistory.push(imageData)

    // Update history
    setCanvasHistory({
      ...canvasHistory,
      [selectedPart]: newPartHistory,
    })

    // Update index
    setCanvasHistoryIndex({
      ...canvasHistoryIndex,
      [selectedPart]: newPartHistory.length - 1,
    })
  }

  // Undo canvas change
  const handleCanvasUndo = () => {
    const partHistory = canvasHistory[selectedPart] || []
    const partHistoryIndex = canvasHistoryIndex[selectedPart] || 0

    if (partHistoryIndex > 0) {
      const newIndex = partHistoryIndex - 1
      const previousState = partHistory[newIndex]

      // Load previous state
      if (previousState) {
        const canvas = editorCanvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const img = new Image()
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Update texture
          updateTextureFromCanvas()
        }
        img.src = previousState
      }

      // Update index
      setCanvasHistoryIndex({
        ...canvasHistoryIndex,
        [selectedPart]: newIndex,
      })
    }
  }

  // Update texture from canvas
  const updateTextureFromCanvas = () => {
    const canvas = editorCanvasRef.current
    if (!canvas) return

    // Get canvas data URL
    const dataURL = canvas.toDataURL()

    // Update canvas textures
    setCanvasTextures((prev) => ({
      ...prev,
      [selectedPart]: dataURL,
    }))

    // Create Three.js texture
    const texture = new CanvasTexture(canvas)
    texture.needsUpdate = true

    // Update textures
    setTextures((prev) => ({
      ...prev,
      [selectedPart]: texture,
    }))
  }

  // Clear canvas
  const handleClearCanvas = () => {
    const canvas = editorCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Save current state for undo
    saveCanvasState()

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Update texture
    updateTextureFromCanvas()
  }

  // Apply text to canvas
  const handleApplyTextToCanvas = () => {
    if (!textSettings.text.trim()) return

    const canvas = editorCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Save current state for undo
    saveCanvasState()

    // Set text style
    const fontSize = textSettings.fontSize || 24
    const fontWeight = textSettings.fontWeight || "normal"
    const fontStyle = textSettings.fontStyle || "normal"
    const fontFamily = textSettings.fontFamily || "Arial"

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.fillStyle = textSettings.color || "#000000"
    ctx.textAlign = textSettings.textAlign || "center"

    // Calculate position based on UV mapping
    const mapping = uvMappings[selectedModel][selectedPart]
    const x = mapping.x * canvasSize.width + (mapping.width * canvasSize.width) / 2
    const y = mapping.y * canvasSize.height + (mapping.height * canvasSize.height) / 2

    // Draw text
    ctx.fillText(textSettings.text, x, y)

    // Update texture
    updateTextureFromCanvas()
  }

  return (
    <div className="texture-editor-container">
      <div className="texture-editor-toolbar">
        <button
          className={`texture-editor-tool ${drawingMode === "brush" ? "active" : ""}`}
          onClick={() => setDrawingMode("brush")}
          title="Brush"
        >
          <Brush size={16} />
        </button>
        <button
          className={`texture-editor-tool ${drawingMode === "eraser" ? "active" : ""}`}
          onClick={() => setDrawingMode("eraser")}
          title="Eraser"
        >
          <Eraser size={16} />
        </button>
        <button
          className={`texture-editor-tool ${drawingMode === "text" ? "active" : ""}`}
          onClick={() => setDrawingMode("text")}
          title="Text"
        >
          <Type size={16} />
        </button>
        <button className="texture-editor-tool" onClick={handleCanvasUndo} title="Undo">
          <RotateCw size={16} />
        </button>
        <button className="texture-editor-tool" onClick={handleClearCanvas} title="Clear Canvas">
          <Trash2 size={16} />
        </button>
        <button className="texture-editor-tool" onClick={updateTextureFromCanvas} title="Apply to Model">
          <Save size={16} />
        </button>
      </div>

      <div className="texture-editor-canvas-container">
        <canvas
          ref={editorCanvasRef}
          className="texture-editor-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className="texture-editor-controls">
        {drawingMode === "brush" && (
          <>
            <div className="brush-control">
              <label className="brush-control-label">Brush Color</label>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="brush-color-input"
              />
            </div>
            <div className="brush-control">
              <label className="brush-control-label">Brush Size: {brushSize}px</label>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="brush-size-input"
              />
            </div>
          </>
        )}

        {drawingMode === "eraser" && (
          <div className="brush-control">
            <label className="brush-control-label">Eraser Size: {brushSize}px</label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="brush-size-input"
            />
          </div>
        )}

        {drawingMode === "text" && (
          <>
            <div className="text-input-group">
              <input
                type="text"
                value={textSettings.text}
                onChange={(e) => onTextSettingsChange("text", e.target.value)}
                placeholder="Enter your text here"
                className="text-input"
              />
            </div>

            <div className="text-controls-grid">
              <div className="text-control">
                <label className="text-control-label">Size</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={textSettings.fontSize}
                  onChange={(e) => onTextSettingsChange("fontSize", Number(e.target.value))}
                  className="text-range"
                />
                <span className="text-value">{textSettings.fontSize}px</span>
              </div>

              <div className="text-control">
                <label className="text-control-label">Color</label>
                <input
                  type="color"
                  value={textSettings.color}
                  onChange={(e) => onTextSettingsChange("color", e.target.value)}
                  className="text-color-input"
                />
              </div>
            </div>

            <div className="text-actions">
              <button
                className="text-add-button"
                onClick={handleApplyTextToCanvas}
                disabled={!textSettings.text.trim()}
              >
                Add Text to Canvas
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TextureEditor

