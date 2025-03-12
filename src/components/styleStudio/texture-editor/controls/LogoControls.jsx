"use client"

export const LogoControls = ({ logoSettings, onLogoSettingsChange, handleApplyLogoToCanvas, selectedLogoIndex }) => {
  return (
    <>
      <div className="logo-input-group">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                onLogoSettingsChange("image", event.target.result)
              }
              reader.readAsDataURL(file)
            }
          }}
          className="logo-input"
        />
      </div>

      <div className="logo-controls-grid">
        <div className="logo-control">
          <label className="logo-control-label">Size</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={logoSettings.size}
            onChange={(e) => onLogoSettingsChange("size", Number(e.target.value))}
            className="logo-range"
          />
          <span className="logo-value">{logoSettings.size.toFixed(1)}x</span>
        </div>
      </div>

      <div className="logo-actions">
        <button className="logo-add-button" onClick={handleApplyLogoToCanvas} disabled={!logoSettings.image}>
          Add Logo to Canvas
        </button>
        {selectedLogoIndex !== null && (
          <div className="logo-manipulation-info">
            <p>• Drag to move the logo</p>
            <p>• Drag corners to resize</p>
            <p>• Drag top handle to rotate</p>
          </div>
        )}
      </div>
    </>
  )
}

