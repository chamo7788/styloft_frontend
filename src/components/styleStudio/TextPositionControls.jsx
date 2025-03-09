"use client"

import { useState, useEffect } from "react"

function TextPositionControls({ textElement, onUpdatePosition }) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })

  // Update local state when text element changes
  useEffect(() => {
    if (textElement && textElement.position) {
      const [x, y, z] = textElement.position
      setPosition({ x, y, z })
    }
  }, [textElement])

  const handlePositionChange = (axis, value) => {
    const newPosition = { ...position, [axis]: Number(value) }
    setPosition(newPosition)
    onUpdatePosition([newPosition.x, newPosition.y, newPosition.z])
  }

  // Predefined positions for quick placement
  const handleQuickPosition = (preset) => {
    let newPosition

    switch (preset) {
      case "center":
        newPosition = [0, 0, 0.5]
        break
      case "top":
        newPosition = [0, 2, 0.5]
        break
      case "bottom":
        newPosition = [0, -2, 0.5]
        break
      case "left":
        newPosition = [-2, 0, 0.5]
        break
      case "right":
        newPosition = [2, 0, 0.5]
        break
      default:
        return
    }

    setPosition({ x: newPosition[0], y: newPosition[1], z: newPosition[2] })
    onUpdatePosition(newPosition)
  }

  if (!textElement) return null

  return (
    <div className="text-position-controls">
      <h3 className="position-controls-title">Position Controls</h3>

      <div className="position-presets">
        <button className="position-preset-button" onClick={() => handleQuickPosition("top")}>
          Top
        </button>
        <button className="position-preset-button" onClick={() => handleQuickPosition("center")}>
          Center
        </button>
        <button className="position-preset-button" onClick={() => handleQuickPosition("bottom")}>
          Bottom
        </button>
        <button className="position-preset-button" onClick={() => handleQuickPosition("left")}>
          Left
        </button>
        <button className="position-preset-button" onClick={() => handleQuickPosition("right")}>
          Right
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
    </div>
  )
}

export default TextPositionControls

