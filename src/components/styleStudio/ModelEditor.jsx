"use client"

import { useState, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, Environment } from "@react-three/drei"
import { OrbitControls } from "@react-three/drei"
import { Vector3 } from "three"

import Model from "./Model"
import Toolbar from "./Toolbar"
import TabPanel from "./TabPanel"
import ModelSelector from "./ModelSelector"
import PartSelector from "./PartSelector"
import ColorPicker from "./ColorPicker"
import FileUploader from "./FileUploader"
import TextPlacement from "./TextPlacement"
import LogoUploader from "./LogoUploader"
import LightingControls from "./LightingControls"
import TextPositionControls from "./TextPositionControls"
import LogoPositionControls from "./LogoPositionControls"
import "../../assets/css/StyleStudio/viewer.css"

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

export default function ModelEditor() {
  // Model state
  const [selectedModel, setSelectedModel] = useState("shirt")
  const [modelKey, setModelKey] = useState(0)
  const [selectedPart, setSelectedPart] = useState("main")

  // UI state
  const [activeTab, setActiveTab] = useState("model")
  const canvasRef = useRef(null)
  const cameraRef = useRef(null)

  // Text state
  const [textElements, setTextElements] = useState([])
  const [selectedTextIndex, setSelectedTextIndex] = useState(null)

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
  const [backgroundColor, setBackgroundColor] = useState("#f5f5f5")

  // History for undo/redo
  const [history, setHistory] = useState([{ colors: { main: "#ffffff" }, materials: {} }])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Handle model change
  const handleModelChange = (model) => {
    setSelectedModel(model)
    setModelKey((prevKey) => prevKey + 1)
    setSelectedPart("main")

    // Reset colors and materials for new model
    const newColors = {}
    const newMaterials = {}

    modelParts[model].forEach((part) => {
      newColors[part] = "#ffffff"
    })

    setColors(newColors)
    setMaterials(newMaterials)

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

  // Handle camera rotation
  const handleRotate = (direction) => {
    if (cameraRef.current) {
      const currentPosition = new Vector3().copy(cameraRef.current.position)

      if (direction === "left") {
        cameraRef.current.position.x = currentPosition.z
        cameraRef.current.position.z = -currentPosition.x
      } else if (direction === "right") {
        cameraRef.current.position.x = -currentPosition.z
        cameraRef.current.position.z = currentPosition.x
      } else if (direction === "reset") {
        cameraRef.current.position.set(0, 0, 10)
      }

      cameraRef.current.lookAt(0, 0, 0)
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
  }

  // Handle text position update
  const handleUpdateTextPosition = (index, position) => {
    const newTextElements = [...textElements]
    newTextElements[index] = {
      ...newTextElements[index],
      position,
    }
    setTextElements(newTextElements)
  }

  // Handle text update
  const handleUpdateText = (index, updatedText) => {
    const newTextElements = [...textElements]
    newTextElements[index] = updatedText
    setTextElements(newTextElements)
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

  return (
    <div className="model-editor-container">
      <div className="canvas-card" style={{ backgroundColor }}>
        <Toolbar
          onRotate={handleRotate}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onScreenshot={handleScreenshot}
          onSaveDesign={handleSaveDesign}
          onLoadDesign={handleLoadDesign}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />

        <div className="canvas-content">
          <Canvas shadows className="canvas" ref={canvasRef}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} ref={cameraRef} />
            <ambientLight intensity={lighting.intensity} />
            <directionalLight position={lighting.direction} intensity={lighting.intensity} castShadow />
            <Environment preset={lighting.environment} />

            <Suspense fallback={null}>
              <Model
                key={modelKey}
                modelPath={models[selectedModel]}
                colors={colors}
                materials={materials}
                modelType={selectedModel}
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
              />
            </Suspense>

            <OrbitControls enableZoom={true} />
          </Canvas>
        </div>

        {selectedPart && (
          <div className="part-indicator">
            Selected part: <span className="part-name">{selectedPart}</span>
          </div>
        )}
      </div>

      <div className="controls-card">
        <div className="controls-content">
          <TabPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: "model", label: "Model" },
              { id: "color", label: "Color" },
              { id: "texture", label: "Texture" },
              { id: "text", label: "Text" },
              { id: "logo", label: "Logo" },
              { id: "lighting", label: "Lighting" },
            ]}
          >
            <div id="model">
              <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />

              <div className="background-control">
                <label className="background-label">Background Color</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="background-color-input"
                />
              </div>
            </div>

            <div id="color">
              <PartSelector
                parts={modelParts[selectedModel]}
                selectedPart={selectedPart}
                onPartSelect={setSelectedPart}
              />

              <ColorPicker color={colors[selectedPart] || "#ffffff"} onChange={handleColorChange} />
            </div>

            <div id="texture">
              <PartSelector
                parts={modelParts[selectedModel]}
                selectedPart={selectedPart}
                onPartSelect={setSelectedPart}
              />

              <FileUploader
                label={`Upload Texture for ${selectedPart}`}
                accept="image/*"
                onChange={handleMaterialChange}
                preview={materials[selectedPart]}
              />
            </div>

            <div id="text">
              <TextPlacement
                onAddText={(textElement) => {
                  setTextElements([...textElements, textElement])
                  setSelectedTextIndex(textElements.length) // Select the newly added text
                }}
                textElements={textElements}
                onRemoveText={(index) => {
                  const newElements = [...textElements]
                  newElements.splice(index, 1)
                  setTextElements(newElements)
                  if (selectedTextIndex === index) {
                    setSelectedTextIndex(null)
                  } else if (selectedTextIndex > index) {
                    setSelectedTextIndex(selectedTextIndex - 1)
                  }
                }}
                onUpdateText={handleUpdateText}
              />

              {selectedTextIndex !== null && (
                <TextPositionControls
                  textElement={textElements[selectedTextIndex]}
                  onUpdatePosition={(position) => handleUpdateTextPosition(selectedTextIndex, position)}
                />
              )}
            </div>

            <div id="logo">
              <LogoUploader
                onAddLogo={(logoElement) => {
                  setLogoElements([...logoElements, logoElement])
                  setSelectedLogoIndex(logoElements.length) // Select the newly added logo
                }}
                logoElements={logoElements}
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
              />

              {selectedLogoIndex !== null && (
                <LogoPositionControls
                  logoElement={logoElements[selectedLogoIndex]}
                  onUpdatePosition={(position) => handleUpdateLogoPosition(selectedLogoIndex, position)}
                  onUpdateRotation={(rotation) => handleUpdateLogoRotation(selectedLogoIndex, rotation)}
                />
              )}
            </div>

            <div id="lighting">
              <LightingControls lighting={lighting} onChange={setLighting} />
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  )
}

