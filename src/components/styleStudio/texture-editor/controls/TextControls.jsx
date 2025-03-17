export const TextControls = ({ textSettings, onTextSettingsChange, handleApplyTextToCanvas }) => {
  return (
    <>
      <div className="text-input-group">
        <input
          type="text"
          value={textSettings.text}
          onChange={(e) => onTextSettingsChange("text", e.target.value)}
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
            value={textSettings.fontSize}
            onChange={(e) => onTextSettingsChange("fontSize", Number(e.target.value))}
            className="text-range"
          />
          <span className="text-value">{textSettings.fontSize}px</span>
        </div>

        <div className="text-control">
          <label className="text-control-label">Color</label>
          <input
            type="color"
            value={textSettings.color}
            onChange={(e) => onTextSettingsChange("color", e.target.value)}
            className="text-color-input"
          />
        </div>
      </div>

      <div className="text-actions">
        <button className="text-add-button" onClick={handleApplyTextToCanvas} disabled={!textSettings.text?.trim()}>
          Add Text to Canvas
        </button>
      </div>
    </>
  )
}

