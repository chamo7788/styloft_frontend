"use client"

import { useState, useRef } from "react"
import ModelViewer from "./ModelViewer"
import TextureEditor from "./TextureEditor"
import ControlPanel from "./ControlPanel"
import Toolbar from "./Toolbar"
import "../../assets/css/StyleStudio/viewer.css"
import "../../assets/css/StyleStudio/text-editor.css"

// Model settings for different scale and position
const models = {
  shirt: "/models/shirt_baked.glb",
  trouser: "/models/1861_trousers.glb",
  short: "/models/man_shorts.glb",
  frock: "/models/ladies_black_frock.glb",
}

// Define model parts for multi-zone coloring
const modelParts = {
  shirt: ["body", "collar", "sleeves"],
  trouser: ["main", "pockets", "waistband"],
  short: ["main", "pockets"],
  frock: ["body", "sleeves", "collar"],
}

// Model settings for different scale and position
const modelSettings = {
  shirt: { scale: 6.5, position: [0, 0.5, 0] },
  trouser: { scale: 4, position: [0, -2.5, 0] },
  short: { scale: 4.5, position: [0, -3.3, 0] },
  frock: { scale: 3, position: [0, -4.2, 0] },
}

// UV mapping coordinates for different model parts
const uvMappings = {
  shirt: {
    body: { x: 0, y: 0, width: 1, height: 1 },
    collar: { x: 0, y: 0, width: 1, height: 0.2 },
    sleeves: { x: 0, y: 0.2, width: 1, height: 0.4 },
  },
  trouser: {
    main: { x: 0, y: 0, width: 1, height: 1 },
    pockets: { x: 0.2, y: 0.2, width: 0.6, height: 0.3 },
    waistband: { x: 0, y: 0, width: 1, height: 0.2 },
  },
  short: {
    main: { x: 0, y: 0, width: 1, height: 1 },
    pockets: { x: 0.2, y: 0.2, width: 0.6, height: 0.3 },
  },
  frock: {
    body: { x: 0, y: 0, width: 1, height: 1 },
    sleeves: { x: 0, y: 0.2, width: 1, height: 0.4 },
    collar: { x: 0, y: 0, width: 1, height: 0.2 },
  },
}

export default function ModelEditor() {
  // Model state
  const [selectedModel, setSelectedModel] = useState("shirt")
  const [modelKey, setModelKey] = useState(0)
  const [selectedPart, setSelectedPart] = useState("body")

  // UI state
  const [activeTab, setActiveTab] = useState("model")
  const canvasRef = useRef(null)
  const [showTextureEditor, setShowTextureEditor] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState("#f5f5f5")

  // Text state
  const [textElements, setTextElements] = useState([])
  const [selectedTextIndex, setSelectedTextIndex] = useState(null)
  const [textSettings, setTextSettings] = useState({
    text: "",
    fontSize: 24,
    color: "#000000",
    fontWeight: "normal",
    fontStyle: "normal",
    fontFamily: "Arial",
    textAlign: "center",
  })

  // Texture state
  const [textures, setTextures] = useState({})
  const [canvasTextures, setCanvasTextures] = useState({})

  // Logo state
  const [logoElements, setLogoElements] = useState([])
  const [selectedLogoIndex, setSelectedLogoIndex] = useState(null)

  // Feature states
  const [colors, setColors] = useState({ main: "#ffffff" })
  const [materials, setMaterials] = useState({})
  const [lighting, setLighting] = useState({
    intensity: 0.5,
    direction: [5, 5, 5],
    environment: "studio",
  })

  // History for undo/redo
  const [history, setHistory] = useState([{ colors: { main: "#ffffff" }, materials: {} }])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Handle model change
  const handleModelChange = (model) => {
    setSelectedModel(model)
    setModelKey((prevKey) => prevKey + 1)
    setSelectedPart(modelParts[model][0])

    // Reset colors and materials for new model
    const newColors = {}
    const newMaterials = {}
    const newCanvasTextures = {}

    modelParts[model].forEach((part) => {
      newColors[part] = "#ffffff"
      newCanvasTextures[part] = null
    })

    setColors(newColors)
    setMaterials(newMaterials)
    setCanvasTextures(newCanvasTextures)

    // Add to history
    addToHistory(newColors, newMaterials)
  }

  // Handle color change
  const handleColorChange = (color) => {
    const newColors = { ...colors, [selectedPart]: color }
    setColors(newColors)

    // Add to history
    addToHistory(newColors, materials)
  }

  // Handle material change
  const handleMaterialChange = (material) => {
    const newMaterials = { ...materials, [selectedPart]: material }
    setMaterials(newMaterials)

    // Add to history
    addToHistory(colors, newMaterials)
  }

  // Add to history
  const addToHistory = (newColors, newMaterials) => {
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1)

    // Add new state to history
    newHistory.push({ colors: { ...newColors }, materials: { ...newMaterials } })

    // Update history and index
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const { colors: newColors, materials: newMaterials } = history[newIndex]

      setColors(newColors)
      setMaterials(newMaterials)
      setHistoryIndex(newIndex)
    }
  }

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const { colors: newColors, materials: newMaterials } = history[newIndex]

      setColors(newColors)
      setMaterials(newMaterials)
      setHistoryIndex(newIndex)
    }
  }

  // Take screenshot
  const handleScreenshot = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const link = document.createElement("a")
      link.download = `${selectedModel}-design.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }

  // Save design
  const handleSaveDesign = () => {
    const design = {
      model: selectedModel,
      colors,
      materials,
      textElements,
      logoElements,
      lighting,
      backgroundColor,
    }

    const blob = new Blob([JSON.stringify(design)], { type: "application/json" })
    const link = document.createElement("a")
    link.download = `${selectedModel}-design.json`
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  // Load design
  const handleLoadDesign = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const design = JSON.parse(e.target.result)

          setSelectedModel(design.model)
          setColors(design.colors)
          setMaterials(design.materials)
          setTextElements(design.textElements || [])
          setLogoElements(design.logoElements || [])
          setLighting(design.lighting || lighting)
          setBackgroundColor(design.backgroundColor || backgroundColor)

          // Reset history
          setHistory([{ colors: design.colors, materials: design.materials }])
          setHistoryIndex(0)

          // Force model reload
          setModelKey((prevKey) => prevKey + 1)
        } catch (error) {
          console.error("Failed to load design:", error)
          alert("Failed to load design. The file might be corrupted.")
        }
      }
      reader.readAsText(file)
    }
  }

  // Handle text selection
  const handleTextSelect = (index) => {
    setSelectedTextIndex(index)
    setSelectedLogoIndex(null)
    setActiveTab("text") // Switch to text tab when text is selected

    if (index !== null) {
      const element = textElements[index]
      setTextSettings({
        text: element.text,
        fontSize: element.fontSize || 24,
        color: element.color || "#000000",
        fontWeight: element.fontWeight || "normal",
        fontStyle: element.fontStyle || "normal",
        fontFamily: element.fontFamily || "Arial",
        textAlign: element.textAlign || "center",
      })
    }
  }

  // Handle text update
  const handleUpdateText = (index, updatedText) => {
    const newTextElements = [...textElements]
    newTextElements[index] = updatedText
    setTextElements(newTextElements)
  }

  // Handle adding new text
  const handleAddText = () => {
    if (textSettings.text.trim()) {
      // Default position for front of shirt
      const position = [0, 0, 0.5] // Slightly in front of the model

      const newTextElement = {
        ...textSettings,
        position,
      }

      setTextElements([...textElements, newTextElement])
      setSelectedTextIndex(textElements.length) // Select the newly added text
      setShowTextureEditor(true) // Show the text editor
    }
  }

  // Handle removing text
  const handleRemoveText = (index) => {
    const newElements = [...textElements]
    newElements.splice(index, 1)
    setTextElements(newElements)

    if (selectedTextIndex === index) {
      setSelectedTextIndex(null)
    } else if (selectedTextIndex > index) {
      setSelectedTextIndex(selectedTextIndex - 1)
    }
  }

  // Handle text settings change
  const handleTextSettingsChange = (setting, value) => {
    setTextSettings({
      ...textSettings,
      [setting]: value,
    })

    if (selectedTextIndex !== null) {
      const updatedText = {
        ...textElements[selectedTextIndex],
        [setting]: value,
      }
      handleUpdateText(selectedTextIndex, updatedText)
    }
  }

  // Handle logo selection
  const handleLogoSelect = (index) => {
    setSelectedLogoIndex(index)
    setSelectedTextIndex(null)
    setActiveTab("logo") // Switch to logo tab when logo is selected
  }

  // Handle logo position update
  const handleUpdateLogoPosition = (index, position) => {
    const newLogoElements = [...logoElements]
    newLogoElements[index] = {
      ...newLogoElements[index],
      position,
    }
    setLogoElements(newLogoElements)
  }

  // Handle logo rotation update
  const handleUpdateLogoRotation = (index, rotation) => {
    const newLogoElements = [...logoElements]
    newLogoElements[index] = {
      ...newLogoElements[index],
      rotation,
    }
    setLogoElements(newLogoElements)
  }

  // Handle logo update
  const handleUpdateLogo = (index, updatedLogo) => {
    const newLogoElements = [...logoElements]
    newLogoElements[index] = updatedLogo
    setLogoElements(newLogoElements)
  }

  // Toggle texture editor visibility
  const toggleTextureEditor = () => {
    setShowTextureEditor(!showTextureEditor)
  }

  return (
    <div className="model-editor-container">
      <div className={`model-view-container ${showTextureEditor ? "with-editor" : ""}`}>
        <div className="canvas-card" style={{ backgroundColor }}>
          <Toolbar
            onRotate={() => {}} // Will be handled by ModelViewer
            onUndo={handleUndo}
            onRedo={handleRedo}
            onScreenshot={handleScreenshot}
            onSaveDesign={handleSaveDesign}
            onLoadDesign={handleLoadDesign}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />

          <div className="canvas-content">
            <ModelViewer
              ref={canvasRef}
              modelKey={modelKey}
              selectedModel={selectedModel}
              modelPath={models[selectedModel]}
              colors={colors}
              materials={materials}
              modelSettings={modelSettings}
              modelParts={modelParts}
              selectedPart={selectedPart}
              setSelectedPart={setSelectedPart}
              textElements={textElements}
              selectedTextIndex={selectedTextIndex}
              onTextSelect={handleTextSelect}
              logoElements={logoElements}
              selectedLogoIndex={selectedLogoIndex}
              onLogoSelect={handleLogoSelect}
              textures={textures}
              lighting={lighting}
            />
          </div>

          {selectedPart && (
            <div className="part-indicator">
              Selected part: <span className="part-name">{selectedPart}</span>
            </div>
          )}
        </div>

        {showTextureEditor && (
          <TextureEditor
            selectedModel={selectedModel}
            selectedPart={selectedPart}
            uvMappings={uvMappings}
            textElements={textElements}
            textSettings={textSettings}
            onTextSettingsChange={handleTextSettingsChange}
            canvasTextures={canvasTextures}
            setCanvasTextures={setCanvasTextures}
            setTextures={setTextures}
          />
        )}
      </div>

      <ControlPanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        selectedPart={selectedPart}
        setSelectedPart={setSelectedPart}
        modelParts={modelParts[selectedModel]}
        colors={colors}
        onColorChange={handleColorChange}
        materials={materials}
        onMaterialChange={handleMaterialChange}
        showTextureEditor={showTextureEditor}
        toggleTextureEditor={toggleTextureEditor}
        textElements={textElements}
        selectedTextIndex={selectedTextIndex}
        onTextSelect={handleTextSelect}
        onRemoveText={handleRemoveText}
        logoElements={logoElements}
        selectedLogoIndex={selectedLogoIndex}
        onAddLogo={(logoElement) => {
          setLogoElements([...logoElements, logoElement])
          setSelectedLogoIndex(logoElements.length)
        }}
        onRemoveLogo={(index) => {
          const newElements = [...logoElements]
          newElements.splice(index, 1)
          setLogoElements(newElements)
          if (selectedLogoIndex === index) {
            setSelectedLogoIndex(null)
          } else if (selectedLogoIndex > index) {
            setSelectedLogoIndex(selectedLogoIndex - 1)
          }
        }}
        onUpdateLogo={handleUpdateLogo}
        onUpdateLogoPosition={(position) =>
          selectedLogoIndex !== null && handleUpdateLogoPosition(selectedLogoIndex, position)
        }
        onUpdateLogoRotation={(rotation) =>
          selectedLogoIndex !== null && handleUpdateLogoRotation(selectedLogoIndex, rotation)
        }
        lighting={lighting}
        setLighting={setLighting}
      />
    </div>
  )
}

