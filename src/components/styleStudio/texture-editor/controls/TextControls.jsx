export const TextControls = ({ textSettings, onTextSettingsChange, handleApplyTextToCanvas }) => {
  // Extended font options with your requested fonts
  const fontOptions = [
    // Web-safe fonts
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Georgia", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
    
    // Google fonts
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
    
    // Custom specialty fonts
    { value: "Vegan Style", label: "Vegan Style" },
    { value: "JURASICK", label: "JURASICK" },
    { value: "Lemon Jelly", label: "Lemon Jelly" },
    { value: "Beautiful People", label: "Beautiful People" },
    { value: "Beauty Mountains", label: "Beauty Mountains" },
    { value: "Stylish Calligraphy", label: "Stylish Calligraphy" }
  ];

  // Group fonts for better organization in the dropdown
  const fontGroups = {
    "Standard Fonts": fontOptions.slice(0, 5),
    "Google Fonts": fontOptions.slice(5, 8),
    "Specialty Fonts": fontOptions.slice(8)
  };

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
          <label className="text-control-label">Font</label>
          <select 
            value={textSettings.fontFamily || "Arial"} 
            onChange={(e) => onTextSettingsChange("fontFamily", e.target.value)}
            className="font-select"
          >
            {Object.entries(fontGroups).map(([groupName, fonts]) => (
              <optgroup label={groupName} key={groupName}>
                {fonts.map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

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

      <div className="text-font-preview" style={{ 
        fontFamily: textSettings.fontFamily || "Arial",
        fontSize: `${textSettings.fontSize}px`,
        color: textSettings.color 
      }}>
        {textSettings.text || "Font Preview"}
      </div>

      <div className="text-actions">
        <button className="text-add-button" onClick={handleApplyTextToCanvas} disabled={!textSettings.text?.trim()}>
          Add Text to Canvas
        </button>
      </div>
    </>
  )
}

