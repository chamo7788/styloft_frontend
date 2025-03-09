"use client"

import { useState } from "react"

function TextControls({ textElements, onRemoveText, onUpdateTextPosition }) {
  const [selectedTextIndex, setSelectedTextIndex] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })

  const handleSelectText = (index) => {
    setSelectedTextIndex(index)
    // Set position sliders to current text position
    if (textElements[index]) {
      const [x, y, z] = textElements[index].position || [0, 0, 0]
      setPosition({ x, y, z })
    }
  }

  const handlePositionChange = (axis, value) => {
    const newPosition = { ...position, [axis]: Number.parseFloat(value) }
    setPosition(newPosition)

    if (selectedTextIndex !== null) {
      onUpdateTextPosition(selectedTextIndex, [newPosition.x, newPosition.y, newPosition.z])
    }
  }

  return (
    <div className="text-controls">
      {textElements.length > 0 && (
        <div className="text-elements">
          <label className="text-elements-label">Text Elements</label>
          <div className="text-elements-list">
            {textElements.map((element, index) => (
              <div
                key={index}
                className={`text-element ${selectedTextIndex === index ? "text-element-selected" : ""}`}
                onClick={() => handleSelectText(index)}
              >
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
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveText(index)
                    if (selectedTextIndex === index) {
                      setSelectedTextIndex(null)
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {selectedTextIndex !== null && (
            <div className="text-position-controls">
              <h4 className="text-position-title">Position</h4>

              <div className="text-position-control">
                <label>X:</label>
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

              <div className="text-position-control">
                <label>Y:</label>
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

              <div className="text-position-control">
                <label>Z:</label>
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
          )}
        </div>
      )}
    </div>
  )
}

export default TextControls

