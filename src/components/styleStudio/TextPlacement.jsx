import React, { useState } from 'react';

function TextPlacement({ onAddText }) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState("#000000");
  const [texts, setTexts] = useState([]);

  const handleAddText = () => {
    if (text.trim()) {
      const newText = {
        id: Date.now(),
        text,
        fontSize,
        color: textColor,
        position: [0, 0, 0],
      };
      setTexts([...texts, newText]);
      setText("");
    }
  };

  return (
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
  );
}

export default TextPlacement;