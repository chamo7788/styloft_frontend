"use client"

import { useState } from "react"
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from "lucide-react"

function TextPlacement({ onAddText, textElements, onRemoveText, onUpdateText }) {
  const [text, setText] = useState("")
  const [fontSize, setFontSize] = useState(24)
  const [textColor, setTextColor] = useState("#000000")
  const [fontWeight, setFontWeight] = useState("normal")
  const [fontStyle, setFontStyle] = useState("normal")
  const [textAlign, setTextAlign] = useState("center")
  const [selectedTextIndex, setSelectedTextIndex] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleAddText = () => {
    if (text.trim()) {
      // Default position for front of shirt
      const position = [0, 0, 0.5] // Slightly in front of the model

      onAddText({
        text,
        fontSize,
        color: textColor,
        position,
        fontWeight,
        fontStyle,
        textAlign,
      })

      // Reset form
      setText("")
      setIsEditing(false)
      setSelectedTextIndex(null)
    }
  }

  const handleEditText = (index) => {
    const textElement = textElements[index]
    setText(textElement.text)
    setFontSize(textElement.fontSize)
    setTextColor(textElement.color)
    setFontWeight(textElement.fontWeight || "normal")
    setFontStyle(textElement.fontStyle || "normal")
    setTextAlign(textElement.textAlign || "center")
    setSelectedTextIndex(index)
    setIsEditing(true)
  }

  const handleUpdateText = () => {
    if (selectedTextIndex !== null && text.trim()) {
      const updatedText = {
        ...textElements[selectedTextIndex],
        text,
        fontSize,
        color: textColor,
        fontWeight,
        fontStyle,
        textAlign,
      }

      onUpdateText(selectedTextIndex, updatedText)

      // Reset form
      setText("")
      setIsEditing(false)
      setSelectedTextIndex(null)
    }
  }

  const handleCancelEdit = () => {
    setText("")
    setIsEditing(false)
    setSelectedTextIndex(null)
  }

  return (
    <div>
      <div className="text-editor">
        <div className="text-editor-header">
          <h3 className="text-editor-title">
            <Type size={16} className="text-icon" />
            {isEditing ? "Edit Text" : "Add Text"}
          </h3>
        </div>

        <div className="text-input-group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here"
            className="text-input"
          />
        </div>

        <div className="text-controls-grid">
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
            <span className="text-value">{fontSize}px</span>
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

          <div className="text-control text-style-controls">
            <label className="text-control-label">Style</label>
            <div className="text-style-buttons">
              <button
                className={`style-button ${fontWeight === "bold" ? "active" : ""}`}
                onClick={() => setFontWeight(fontWeight === "bold" ? "normal" : "bold")}
                title="Bold"
              >
                <Bold size={16} />
              </button>
              <button
                className={`style-button ${fontStyle === "italic" ? "active" : ""}`}
                onClick={() => setFontStyle(fontStyle === "italic" ? "normal" : "italic")}
                title="Italic"
              >
                <Italic size={16} />
              </button>
            </div>
          </div>

          <div className="text-control text-align-controls">
            <label className="text-control-label">Align</label>
            <div className="text-align-buttons">
              <button
                className={`align-button ${textAlign === "left" ? "active" : ""}`}
                onClick={() => setTextAlign("left")}
                title="Align Left"
              >
                <AlignLeft size={16} />
              </button>
              <button
                className={`align-button ${textAlign === "center" ? "active" : ""}`}
                onClick={() => setTextAlign("center")}
                title="Align Center"
              >
                <AlignCenter size={16} />
              </button>
              <button
                className={`align-button ${textAlign === "right" ? "active" : ""}`}
                onClick={() => setTextAlign("right")}
                title="Align Right"
              >
                <AlignRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="text-actions">
          {isEditing ? (
            <>
              <button className="text-update-button" onClick={handleUpdateText} disabled={!text.trim()}>
                Update Text
              </button>
              <button className="text-cancel-button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <button className="text-add-button" onClick={handleAddText} disabled={!text.trim()}>
              Add Text to Model
            </button>
          )}
        </div>
      </div>

      {textElements && textElements.length > 0 && (
        <div className="text-elements">
          <h3 className="text-elements-title">Text Elements</h3>
          <div className="text-elements-list">
            {textElements.map((element, index) => (
              <div key={index} className={`text-element ${selectedTextIndex === index ? "text-element-selected" : ""}`}>
                <div className="text-element-preview">
                  <span
                    style={{
                      color: element.color,
                      fontSize: `${Math.min(element.fontSize, 24)}px`,
                      fontWeight: element.fontWeight || "normal",
                      fontStyle: element.fontStyle || "normal",
                      textAlign: element.textAlign || "center",
                    }}
                  >
                    {element.text}
                  </span>
                </div>
                <div className="text-element-actions">
                  <button className="text-element-edit" onClick={() => handleEditText(index)}>
                    Edit
                  </button>
                  <button className="text-element-remove" onClick={() => onRemoveText(index)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TextPlacement

