"use client"

import { useState } from "react"
import { Shirt, Droplet, Wind, Sun, Sparkles } from "lucide-react"

const MaterialSimulation = ({ onApplyMaterial, selectedPart }) => {
  const [materialType, setMaterialType] = useState("cotton")
  const [roughness, setRoughness] = useState(0.5)
  const [metalness, setMetalness] = useState(0)
  const [reflectivity, setReflectivity] = useState(0.2)
  const [bumpScale, setBumpScale] = useState(0.1)
  const [isApplying, setIsApplying] = useState(false)

  const materialTypes = [
    { id: "cotton", name: "Cotton", icon: <Shirt size={20} /> },
    { id: "silk", name: "Silk", icon: <Wind size={20} /> },
    { id: "leather", name: "Leather", icon: <Droplet size={20} /> },
    { id: "denim", name: "Denim", icon: <Sun size={20} /> },
  ]

  const materialPresets = [
    {
      name: "Matte Cotton",
      settings: { type: "cotton", roughness: 0.8, metalness: 0, reflectivity: 0.1, bumpScale: 0.05 },
    },
    {
      name: "Glossy Silk",
      settings: { type: "silk", roughness: 0.2, metalness: 0.1, reflectivity: 0.6, bumpScale: 0.02 },
    },
    {
      name: "Worn Leather",
      settings: { type: "leather", roughness: 0.7, metalness: 0.1, reflectivity: 0.3, bumpScale: 0.2 },
    },
    {
      name: "Rough Denim",
      settings: { type: "denim", roughness: 0.9, metalness: 0, reflectivity: 0.1, bumpScale: 0.3 },
    },
    {
      name: "Metallic Finish",
      settings: { type: "silk", roughness: 0.3, metalness: 0.8, reflectivity: 0.7, bumpScale: 0.05 },
    },
  ]

  const applyPreset = (preset) => {
    setMaterialType(preset.settings.type)
    setRoughness(preset.settings.roughness)
    setMetalness(preset.settings.metalness)
    setReflectivity(preset.settings.reflectivity)
    setBumpScale(preset.settings.bumpScale)
  }

  const handleApplyMaterial = () => {
    setIsApplying(true)

    // Create material settings object
    const materialSettings = {
      type: materialType,
      roughness,
      metalness,
      reflectivity,
      bumpScale,
    }

    // Small delay to show loading state
    setTimeout(() => {
      onApplyMaterial(materialSettings)
      setIsApplying(false)
    }, 500)
  }

  return (
    <div className="material-simulation">
      <h3 className="material-simulation-title">
        <Sparkles size={16} className="material-icon" />
        Material Simulation
      </h3>

      <div className="material-types">
        {materialTypes.map((material) => (
          <button
            key={material.id}
            className={`material-type-button ${materialType === material.id ? "selected" : ""}`}
            onClick={() => setMaterialType(material.id)}
          >
            <div className="material-icon">{material.icon}</div>
            <span className="material-name">{material.name}</span>
          </button>
        ))}
      </div>

      <div className="material-properties">
        <div className="material-property">
          <div className="property-label">
            <span className="property-name">Roughness</span>
            <span className="property-value">{roughness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={roughness}
            onChange={(e) => setRoughness(Number.parseFloat(e.target.value))}
            className="property-slider"
          />
        </div>

        <div className="material-property">
          <div className="property-label">
            <span className="property-name">Metalness</span>
            <span className="property-value">{metalness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={metalness}
            onChange={(e) => setMetalness(Number.parseFloat(e.target.value))}
            className="property-slider"
          />
        </div>

        <div className="material-property">
          <div className="property-label">
            <span className="property-name">Reflectivity</span>
            <span className="property-value">{reflectivity.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reflectivity}
            onChange={(e) => setReflectivity(Number.parseFloat(e.target.value))}
            className="property-slider"
          />
        </div>

        <div className="material-property">
          <div className="property-label">
            <span className="property-name">Texture Depth</span>
            <span className="property-value">{bumpScale.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={bumpScale}
            onChange={(e) => setBumpScale(Number.parseFloat(e.target.value))}
            className="property-slider"
          />
        </div>
      </div>

      <button className="apply-material-button" onClick={handleApplyMaterial} disabled={isApplying}>
        {isApplying ? (
          <>
            <Sparkles className="animate-spin" size={16} />
            <span>Applying...</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>Apply to {selectedPart}</span>
          </>
        )}
      </button>

      <div className="material-presets">
        <h4 className="presets-title">Material Presets</h4>
        <div className="preset-buttons">
          {materialPresets.map((preset, index) => (
            <button key={index} className="preset-button" onClick={() => applyPreset(preset)}>
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MaterialSimulation

