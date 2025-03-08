import { useState, useRef, Suspense, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, PerspectiveCamera, Html, TransformControls } from "@react-three/drei"
import { TextureLoader, Vector3 } from "three"
import { useFrame } from "@react-three/fiber"
import {
  Shirt,
  PenIcon,
  SubscriptIcon,
  SaladIcon,
  RotateCcw,
  RotateCw,
  Download,
  Undo,
  Redo,
  Save,
  Upload,
} from "lucide-react"
import "../../assets/css/StyleStudio/viewer.css"
import LightingControls from "./LightingControls";
import TextPlacement from "./TextPlacement";
import ColorPicker from "./ColorPicker";

// Model settings for different scale and position
const models = {
  shirt: "/models/shirt_baked.glb",
  trouser: "/models/1861_trousers.glb",
  short: "/models/man_shorts.glb",
  frock: "/models/ladies_black_frock.glb",
}

const modelSettings = {
  shirt: { scale: 6.5, position: [0, 0.5, 0] },
  trouser: { scale: 4, position: [0, -2.5, 0] },
  short: { scale: 4.5, position: [0, -3.3, 0] },
  frock: { scale: 3, position: [0, -4.2, 0] },
}

// Define model parts for multi-zone coloring
const modelParts = {
  shirt: ["body", "collar", "sleeves"],
  trouser: ["main", "pockets", "waistband"],
  short: ["main", "pockets"],
  frock: ["body", "sleeves", "collar"],
}

function Model({ modelPath, colors, materials, modelType, selectedPart, setSelectedPart }) {
  const { scene } = useGLTF(modelPath, true)
  const modelRef = useRef()
  const [textures, setTextures] = useState({})

  // Load textures when materials change
  useEffect(() => {
    const newTextures = {}
    const loader = new TextureLoader()

    Object.entries(materials).forEach(([part, material]) => {
      if (material) {
        loader.load(material, (texture) => {
          newTextures[part] = texture
          setTextures((prev) => ({ ...prev, [part]: texture }))
        })
      }
    })
  }, [materials])

  // Handle part selection on click
  const handleClick = (e) => {
    e.stopPropagation()
    // Get the clicked mesh name and find which part it belongs to
    const meshName = e.object.name.toLowerCase()

    // This is a simplified example - in a real app, you'd map mesh names to parts
    // based on your model structure
    const part =
      modelParts[modelType].find((part) => meshName.includes(part) || part.includes(meshName)) ||
      modelParts[modelType][0]

    setSelectedPart(part)
  }

  useFrame(() => {
    if (modelRef.current) {
      const { scale, position } = modelSettings[modelType]
      modelRef.current.scale.set(scale, scale, scale)
      modelRef.current.position.set(...position)

      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          // Determine which part this mesh belongs to
          // This is simplified - in a real app, you'd have a more robust mapping
          const meshName = child.name.toLowerCase()
          const part =
            modelParts[modelType].find((part) => meshName.includes(part) || part.includes(meshName)) ||
            modelParts[modelType][0]

          // Apply the color for this part
          child.material.color.set(colors[part] || colors.main || "#ffffff")

          // Apply texture if available
          if (textures[part]) {
            child.material.map = textures[part]
            child.material.needsUpdate = true
          }
        }
      })
    }
  })

  return <primitive ref={modelRef} object={scene} onClick={handleClick} />
}

// Color picker component
<ColorPicker></ColorPicker>

function FileUploader({ label, accept, onChange, preview }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="file-uploader">
      <label className="file-label">{label}</label>
      <div className="file-controls">
        <button className="file-button" onClick={() => fileInputRef.current.click()}>
          Choose File
        </button>
        <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden-input" />
        {preview && (
          <div className="file-preview">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="preview-image" />
          </div>
        )}
      </div>
    </div>
  )
}

<div>
  <TextPlacement></TextPlacement>
  <LightingControls></LightingControls>
</div>

// Main component
export default function ModelEditor() {
  // Model state
  const [selectedModel, setSelectedModel] = useState("shirt")
  const [modelKey, setModelKey] = useState(0)
  const [selectedPart, setSelectedPart] = useState("main")

  // UI state
  const [activeTab, setActiveTab] = useState("model")
  const canvasRef = useRef(null)
  const cameraRef = useRef(null)

  // Feature states
  const [colors, setColors] = useState({ main: "#ffffff" })
  const [materials, setMaterials] = useState({})
  const [textElements, setTextElements] = useState([])
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

  return (
    <div className="model-editor-container">
      <div className="canvas-card" style={{ backgroundColor }}>
        <div className="canvas-toolbar">
          <div className="toolbar-group">
            <button className="toolbar-button" onClick={() => handleRotate("left")} title="Rotate Left">
              <RotateCcw size={16} />
            </button>
            <button className="toolbar-button" onClick={() => handleRotate("right")} title="Rotate Right">
              <RotateCw size={16} />
            </button>
          </div>

          <div className="toolbar-group">
            <button className="toolbar-button" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo">
              <Undo size={16} />
            </button>
            <button
              className="toolbar-button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
            >
              <Redo size={16} />
            </button>
          </div>

          <div className="toolbar-group">
            <button className="toolbar-button" onClick={handleScreenshot} title="Take Screenshot">
              <Download size={16} />
            </button>
            <button className="toolbar-button" onClick={handleSaveDesign} title="Save Design">
              <Save size={16} />
            </button>
            <label className="toolbar-button" title="Load Design">
              <Upload size={16} />
              <input type="file" accept=".json" onChange={handleLoadDesign} className="hidden-input" />
            </label>
          </div>
        </div>

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
                selectedPart={selectedPart}
                setSelectedPart={setSelectedPart}
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
          <div className="tabs">
            <div className="tabs-list">
              <button
                className={`tab-button ${activeTab === "model" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("model")}
              >
                Model
              </button>
              <button
                className={`tab-button ${activeTab === "color" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("color")}
              >
                Color
              </button>
              <button
                className={`tab-button ${activeTab === "texture" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("texture")}
              >
                Texture
              </button>
              <button
                className={`tab-button ${activeTab === "text" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("text")}
              >
                Text
              </button>
              <button
                className={`tab-button ${activeTab === "lighting" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("lighting")}
              >
                Lighting
              </button>
            </div>

            <div className={`tab-content ${activeTab === "model" ? "tab-content-active" : ""}`}>
              <div className="model-grid">
                <button
                  className={`model-button ${selectedModel === "shirt" ? "model-button-selected" : ""}`}
                  onClick={() => handleModelChange("shirt")}
                >
                  <Shirt className="model-icon" />
                  <span>Shirt</span>
                </button>
                <button
                  className={`model-button ${selectedModel === "trouser" ? "model-button-selected" : ""}`}
                  onClick={() => handleModelChange("trouser")}
                >
                  <PenIcon className="model-icon" />
                  <span>Trouser</span>
                </button>
                <button
                  className={`model-button ${selectedModel === "short" ? "model-button-selected" : ""}`}
                  onClick={() => handleModelChange("short")}
                >
                  <SubscriptIcon className="model-icon" />
                  <span>Short</span>
                </button>
                <button
                  className={`model-button ${selectedModel === "frock" ? "model-button-selected" : ""}`}
                  onClick={() => handleModelChange("frock")}
                >
                  <SaladIcon className="model-icon" />
                  <span>Frock</span>
                </button>
              </div>

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

            <div className={`tab-content ${activeTab === "color" ? "tab-content-active" : ""}`}>
              <div className="part-selector">
                <label className="part-selector-label">Select Part</label>
                <div className="part-buttons">
                  {modelParts[selectedModel].map((part) => (
                    <button
                      key={part}
                      className={`part-button ${selectedPart === part ? "part-button-selected" : ""}`}
                      onClick={() => setSelectedPart(part)}
                    >
                      {part}
                    </button>
                  ))}
                </div>
              </div>

              <ColorPicker color={colors[selectedPart] || "#ffffff"} onChange={handleColorChange} />
            </div>

            <div className={`tab-content ${activeTab === "texture" ? "tab-content-active" : ""}`}>
              <div className="part-selector">
                <label className="part-selector-label">Select Part</label>
                <div className="part-buttons">
                  {modelParts[selectedModel].map((part) => (
                    <button
                      key={part}
                      className={`part-button ${selectedPart === part ? "part-button-selected" : ""}`}
                      onClick={() => setSelectedPart(part)}
                    >
                      {part}
                    </button>
                  ))}
                </div>
              </div>

              <FileUploader
                label={`Upload Texture for ${selectedPart}`}
                accept="image/*"
                onChange={handleMaterialChange}
                preview={materials[selectedPart]}
              />
            </div>

            <div className={`tab-content ${activeTab === "text" ? "tab-content-active" : ""}`}>
              <TextPlacement
                onAddText={(textElement) => {
                  setTextElements([...textElements, textElement])
                }}
              />

              {textElements.length > 0 && (
                <div className="text-elements">
                  <label className="text-elements-label">Text Elements</label>
                  <div className="text-elements-list">
                    {textElements.map((element, index) => (
                      <div key={index} className="text-element">
                        <span
                          className="text-element-preview"
                          style={{
                            color: element.color,
                            fontSize: `${Math.min(element.fontSize, 24)}px`,
                          }}
                        >
                          {element.text}
                        </span>
                        <button
                          className="text-element-remove"
                          onClick={() => {
                            const newElements = [...textElements]
                            newElements.splice(index, 1)
                            setTextElements(newElements)
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`tab-content ${activeTab === "lighting" ? "tab-content-active" : ""}`}>
              <LightingControls lighting={lighting} onChange={setLighting} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

