"use client"

import { useState } from "react"

function TextPlacement({ onAddText, textElements, onRemoveText }) {
  const [text, setText] = useState("")
  const [fontSize, setFontSize] = useState(24)
  const [textColor, setTextColor] = useState("#000000")

  const handleAddText = () => {
    if (text.trim()) {
      onAddText({
        text,
        fontSize,
        color: textColor,
      })
      setText("")
    }
  }

  return (
    <div>
      <div className="text-placement">
        <label className="text-label">Add Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
          className="text-input"
        />

        <div className="text-controls">
          <div className="text-control">
            <label className="text-control-label">Size</label>
            <input
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="text-range"
            />
            <span>{fontSize}px</span>
          </div>

          <div className="text-control">
            <label className="text-control-label">Color</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="text-color-input"
            />
          </div>
        </div>

        <button className="text-add-button" onClick={handleAddText}>
          Add Text
        </button>
      </div>

      {textElements && textElements.length > 0 && (
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
                <button className="text-element-remove" onClick={() => onRemoveText(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TextPlacement

