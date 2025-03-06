import { useState, useRef, Suspense, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { TextureLoader } from "three"
import { useFrame } from "@react-three/fiber"
import { Shirt, PenIcon, SubscriptIcon, SaladIcon } from "lucide-react"
import "../../assets/css/StyleStudio/viewer.css"
import LogoUploader from "./LogoUploader"

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

function Model({ modelPath, color, material, modelType }) {
  const { scene } = useGLTF(modelPath, true)
  const modelRef = useRef()
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (material) {
      const loader = new TextureLoader()
      loader.load(material, (newTexture) => {
        setTexture(newTexture)
      })
    } else {
      setTexture(null)
    }
  }, [material])

  useFrame(() => {
    if (modelRef.current) {
      const { scale, position } = modelSettings[modelType]
      modelRef.current.scale.set(scale, scale, scale)
      modelRef.current.position.set(...position)

      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(color)
          if (texture) {
            child.material.map = texture
            child.material.needsUpdate = true
          }
        }
      })
    }
  })

  return <primitive ref={modelRef} object={scene} />
}

function ColorPicker({ color, onChange }) {
  const colors = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ff9900",
    "#9900ff",
  ]

  return (
    <div className="color-grid">
      {colors.map((c) => (
        <button
          key={c}
          className={`color-button ${color === c ? "color-button-selected" : ""}`}
          style={{ backgroundColor: c }}
          onClick={() => onChange(c)}
          aria-label={`Select color ${c}`}
        />
      ))}
      <div className="custom-color-container">
        <label htmlFor="custom-color" className="color-label">
          Custom Color
        </label>
        <input
          id="custom-color"
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="custom-color-input"
        />
      </div>
    </div>
  )
}

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

export default function ModelEditor() {
  const [color, setColor] = useState("#ffffff");
  const [material, setMaterial] = useState(null);
  const [logo, setLogo] = useState(null);
  const [selectedModel, setSelectedModel] = useState("shirt");
  const [modelKey, setModelKey] = useState(0);
  const [activeTab, setActiveTab] = useState("model");

  const handleModelChange = (model) => {
    setSelectedModel(model);
    setModelKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="model-editor-container">
      <div className="canvas-card">
        <div className="canvas-content">
          <Canvas shadows className="canvas">
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <directionalLight position={[5, 5, 5]} />
            <pointLight position={[-10, -10, -10]} />
            <Suspense fallback={null}>
              <Model
                key={modelKey}
                modelPath={models[selectedModel]}
                color={color}
                material={material}
                modelType={selectedModel}
              />
            </Suspense>
            <OrbitControls enableZoom={true} />
          </Canvas>
        </div>
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
            </div>

            <div className={`tab-content ${activeTab === "color" ? "tab-content-active" : ""}`}>
              <ColorPicker color={color} onChange={setColor} />
            </div>

            <div className={`tab-content ${activeTab === "texture" ? "tab-content-active" : ""}`}>
              <FileUploader
                label="Upload Material Texture"
                accept="image/*"
                onChange={setMaterial}
                preview={material}
              />

              <LogoUploader onLogoUpload={setLogo} preview={logo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

