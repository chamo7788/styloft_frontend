"use client"

import { useState } from "react"
import { useLogoManipulation } from "./hooks/useLogoManipulation"

export const CanvasEditor = ({
  canvasRef,
  drawingMode,
  brushColor,
  brushSize,
  canvasLogos,
  setCanvasLogos,
  selectedLogoIndex,
  setSelectedLogoIndex,
  saveCanvasState,
  updateTextureFromCanvas,
  redrawCanvas,
}) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const {
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    isRotating,
    setIsRotating,
    resizeHandle,
    setResizeHandle,
    dragStartPos,
    setDragStartPos,
    rotateStartAngle,
    setRotateStartAngle,
    findLogoAtPosition,
    getControlPoint,
    handleLogoManipulation,
  } = useLogoManipulation(canvasLogos, setCanvasLogos, selectedLogoIndex, redrawCanvas)

  // Handle mouse down for drawing or logo manipulation
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (drawingMode === "brush" || drawingMode === "eraser") {
      // Start drawing
      setIsDrawing(true)
      setLastPos({ x, y })
      saveCanvasState()
    } else if (drawingMode === "logo") {
      // Check if clicking on an existing logo
      const logoIndex = findLogoAtPosition(x, y, canvasRef)

      if (logoIndex !== -1) {
        // Select this logo
        setSelectedLogoIndex(logoIndex)
        const logo = canvasLogos[logoIndex]

        // Check if clicking on a control point
        const controlPoint = getControlPoint(x, y, logo, canvasRef)

        if (controlPoint === "rotate") {
          // Start rotating
          setIsRotating(true)
          const centerX = logo.x + logo.width / 2
          const centerY = logo.y + logo.height / 2
          setRotateStartAngle(Math.atan2(y - centerY, x - centerX))
        } else if (controlPoint && controlPoint.startsWith("resize")) {
          // Start resizing
          setIsResizing(true)
          setResizeHandle(controlPoint)
        } else {
          // Start dragging
          setIsDragging(true)
          setDragStartPos({ x: x - logo.x, y: y - logo.y })
        }
      } else {
        // Deselect if clicking outside
        setSelectedLogoIndex(null)
      }
    }
  }

  // Handle mouse move for drawing or logo manipulation
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Update cursor based on current operation
    updateCursor(e, canvas)

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (isDrawing) {
      // Handle drawing
      const ctx = canvas.getContext("2d")
      if (!ctx) return

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
    } else if (isDragging || isResizing || isRotating) {
      // Handle logo manipulation (drag, resize, rotate)
      handleLogoManipulation(e, {
        isDragging,
        isResizing,
        isRotating,
        resizeHandle,
        dragStartPos,
        rotateStartAngle,
        setRotateStartAngle,
      })
    }
  }

  // Update cursor based on current operation
  const updateCursor = (e, canvas) => {
    if (isDrawing) {
      canvas.style.cursor = drawingMode === "brush" ? "crosshair" : "crosshair"
    } else if (isDragging) {
      canvas.style.cursor = "move"
    } else if (isResizing) {
      const handleIndex = Number.parseInt(resizeHandle.split("-")[1])
      canvas.style.cursor = handleIndex % 2 === 0 ? "nwse-resize" : "nesw-resize"
    } else if (isRotating) {
      canvas.style.cursor = "grabbing"
    } else if (drawingMode === "logo") {
      // Check if hovering over a logo or control point
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const logoIndex = findLogoAtPosition(x, y, canvasRef)
      if (logoIndex !== -1) {
        const logo = canvasLogos[logoIndex]
        const controlPoint = getControlPoint(x, y, logo, canvasRef)

        if (controlPoint === "rotate") {
          canvas.style.cursor = "grab"
        } else if (controlPoint && controlPoint.startsWith("resize")) {
          const handleIndex = Number.parseInt(controlPoint.split("-")[1])
          canvas.style.cursor = handleIndex % 2 === 0 ? "nwse-resize" : "nesw-resize"
        } else {
          canvas.style.cursor = "move"
        }
      } else {
        canvas.style.cursor = "default"
      }
    } else {
      canvas.style.cursor = "default"
    }
  }

  // Handle mouse up for drawing or logo manipulation
  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false)
      updateTextureFromCanvas()
    }

    if (isDragging || isResizing || isRotating) {
      // Save the current state after manipulation
      saveCanvasState()
      updateTextureFromCanvas(true) // Pass true to prevent re-adding logos
    }

    setIsDragging(false)
    setIsResizing(false)
    setIsRotating(false)
    setResizeHandle(null)
  }

  return (
    <div className="texture-editor-canvas-container">
      <canvas
        ref={canvasRef}
        className="texture-editor-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}

