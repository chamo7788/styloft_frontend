"use client"

import { useState, useEffect } from "react"
import { Move, Maximize, Grid3x3Icon as Grid3, Layers } from "lucide-react"

// Enhance the TextPositionControls component
function TextPositionControls({
  textElement,
  onUpdatePosition,
  onSnapToSurface,
  onApplyEffect,
  modelParts,
  selectedModel,
}) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const [showSnappingGrid, setShowSnappingGrid] = useState(false)

  // Initialize position from textElement
  useEffect(() => {
    if (textElement && textElement.position) {
      const [x, y, z] = textElement.position
      setPosition({ x, y, z })
    }
  }, [textElement])

  const handlePositionChange = (axis, value) => {
    const newPosition = { ...position, [axis]: Number.parseFloat(value) }
    setPosition(newPosition)
    onUpdatePosition([newPosition.x, newPosition.y, newPosition.z])
  }

  const handleSnapToPosition = (preset) => {
    let newPosition = { ...position }

    switch (preset) {
      case "center":
        newPosition = { x: 0, y: 0, z: 0.5 }
        break
      case "chest":
        newPosition = { x: 0, y: 0.5, z: 0.5 }
        break
      case "back":
        newPosition = { x: 0, y: 0.5, z: -0.5 }
        break
      case "sleeve-left":
        newPosition = { x: -1.5, y: 0, z: 0 }
        break
      case "sleeve-right":
        newPosition = { x: 1.5, y: 0, z: 0 }
        break
      default:
        break
    }

    setPosition(newPosition)
    onUpdatePosition([newPosition.x, newPosition.y, newPosition.z])
  }

  if (!textElement) return null

  return (
    <div className="text-position-controls">
      <h4 className="text-position-title">
        <Move size={16} className="position-icon" /> Position
      </h4>

      <div className="position-controls-grid">
        <div className="position-control">
          <label>X (Left/Right):</label>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={position.x}
            onChange={(e) => handlePositionChange("x", e.target.value)}
          />
          <span>{position.x.toFixed(1)}</span>
        </div>

        <div className="position-control">
          <label>Y (Up/Down):</label>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={position.y}
            onChange={(e) => handlePositionChange("y", e.target.value)}
          />
          <span>{position.y.toFixed(1)}</span>
        </div>

        <div className="position-control">
          <label>Z (Front/Back):</label>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={position.z}
            onChange={(e) => handlePositionChange("z", e.target.value)}
          />
          <span>{position.z.toFixed(1)}</span>
        </div>
      </div>

      <div className="position-presets">
        <h5 className="presets-title">
          <Grid3 size={14} /> Quick Position
        </h5>
        <div className="preset-buttons">
          <button onClick={() => handleSnapToPosition("center")}>Center</button>
          <button onClick={() => handleSnapToPosition("chest")}>Chest</button>
          <button onClick={() => handleSnapToPosition("back")}>Back</button>
          <button onClick={() => handleSnapToPosition("sleeve-left")}>Left Sleeve</button>
          <button onClick={() => handleSnapToPosition("sleeve-right")}>Right Sleeve</button>
        </div>
      </div>

      {modelParts && (
        <div className="snap-to-part">
          <h5 className="snap-title">
            <Layers size={14} /> Snap to Part
          </h5>
          <div className="part-buttons">
            {modelParts.map((part) => (
              <button key={part} onClick={() => onSnapToSurface && onSnapToSurface(part)} className="part-button">
                {part.charAt(0).toUpperCase() + part.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-effects">
        <h5 className="effects-title">
          <Maximize size={14} /> Text Effects
        </h5>
        <div className="effect-buttons">
          <button onClick={() => onApplyEffect && onApplyEffect("arc")}>Arc</button>
          <button onClick={() => onApplyEffect && onApplyEffect("wave")}>Wave</button>
          <button onClick={() => onApplyEffect && onApplyEffect("3d")}>3D</button>
          <button onClick={() => onApplyEffect && onApplyEffect("flat")}>Flat</button>
        </div>
      </div>

      <div className="position-toggle">
        <label className="toggle-label">
          <input type="checkbox" checked={showSnappingGrid} onChange={() => setShowSnappingGrid(!showSnappingGrid)} />
          Show Positioning Grid
        </label>
      </div>
    </div>
  )
}

export default TextPositionControls

