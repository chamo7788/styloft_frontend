"use client"

import { useState, useEffect } from "react"
import { RotateCw } from "lucide-react"

function LogoPositionControls({ logoElement, onUpdatePosition, onUpdateRotation }) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })

  // Update local state when logo element changes
  useEffect(() => {
    if (logoElement && logoElement.position) {
      const [x, y, z] = logoElement.position
      setPosition({ x, y, z })
    }

    if (logoElement && logoElement.rotation) {
      const [x, y, z] = logoElement.rotation
      setRotation({ x, y, z })
    }
  }, [logoElement])

  const handlePositionChange = (axis, value) => {
    const newPosition = { ...position, [axis]: Number(value) }
    setPosition(newPosition)
    onUpdatePosition([newPosition.x, newPosition.y, newPosition.z])
  }

  const handleRotationChange = (axis, value) => {
    const newRotation = { ...rotation, [axis]: Number(value) }
    setRotation(newRotation)
    onUpdateRotation([newRotation.x, newRotation.y, newRotation.z])
  }

  // Predefined positions for quick placement
  const handleQuickPosition = (preset) => {
    let newPosition

    switch (preset) {
      case "center":
        newPosition = [0, 0, 0.51]
        break
      case "chest":
        newPosition = [0, 1, 0.51]
        break
      case "back":
        newPosition = [0, 0, -0.51]
        break
      case "left-sleeve":
        newPosition = [-2, 0, 0.51]
        break
      case "right-sleeve":
        newPosition = [2, 0, 0.51]
        break
      default:
        return
    }

    setPosition({ x: newPosition[0], y: newPosition[1], z: newPosition[2] })
    onUpdatePosition(newPosition)
  }

  if (!logoElement) return null

  return (
    <div className="logo-position-controls">
      <h3 className="position-controls-title">Logo Position</h3>

      <div className="position-presets">
        <button className="position-preset-button" onClick={() => handleQuickPosition("chest")}>
          Chest
        </button>
        <button className="position-preset-button" onClick={() => handleQuickPosition("center")}>
          Center
        </button>
        <button className="position-preset-button" onClick={() => handleQuickPosition("back")}>
          Back
        </button>
        <button className="position-preset-button" onClick={() => handleQuickPosition("left-sleeve")}>
          Left Sleeve
        </button>
        <button className="position-preset-button" onClick={() => handleQuickPosition("right-sleeve")}>
          Right Sleeve
        </button>
      </div>

      <div className="position-sliders">
        <div className="position-control">
          <label>X (Left/Right):</label>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={position.x}
            onChange={(e) => handlePositionChange("x", e.target.value)}
            className="position-slider"
          />
          <span className="position-value">{position.x.toFixed(1)}</span>
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
            className="position-slider"
          />
          <span className="position-value">{position.y.toFixed(1)}</span>
        </div>

        <div className="position-control">
          <label>Z (Front/Back):</label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={position.z}
            onChange={(e) => handlePositionChange("z", e.target.value)}
            className="position-slider"
          />
          <span className="position-value">{position.z.toFixed(1)}</span>
        </div>
      </div>

      <h3 className="rotation-controls-title">
        <RotateCw size={16} className="rotation-icon" />
        Logo Rotation
      </h3>

      <div className="rotation-sliders">
        <div className="rotation-control">
          <label>X Rotation:</label>
          <input
            type="range"
            min="0"
            max="6.28"
            step="0.1"
            value={rotation.x}
            onChange={(e) => handleRotationChange("x", e.target.value)}
            className="rotation-slider"
          />
          <span className="rotation-value">{(rotation.x * 57.3).toFixed(0)}°</span>
        </div>

        <div className="rotation-control">
          <label>Y Rotation:</label>
          <input
            type="range"
            min="0"
            max="6.28"
            step="0.1"
            value={rotation.y}
            onChange={(e) => handleRotationChange("y", e.target.value)}
            className="rotation-slider"
          />
          <span className="rotation-value">{(rotation.y * 57.3).toFixed(0)}°</span>
        </div>

        <div className="rotation-control">
          <label>Z Rotation:</label>
          <input
            type="range"
            min="0"
            max="6.28"
            step="0.1"
            value={rotation.z}
            onChange={(e) => handleRotationChange("z", e.target.value)}
            className="rotation-slider"
          />
          <span className="rotation-value">{(rotation.z * 57.3).toFixed(0)}°</span>
        </div>
      </div>
    </div>
  )
}

export default LogoPositionControls

