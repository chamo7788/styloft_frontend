export const LogoControls = ({ logoSettings, onLogoSettingsChange, handleApplyLogoToCanvas, selectedLogoIndex, removeLogo }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log("File selected:", file.name, "size:", file.size, "type:", file.type);
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      console.error("Selected file is not an image");
      alert("Please select an image file");
      return;
    }
    
    // Validate file size (limit to 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      console.error("File too large");
      alert("Please select an image smaller than 5MB");
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      console.log("File read complete");
      const imageData = event.target.result;
      
      // Validate the data URL format
      if (!imageData || !imageData.startsWith('data:image/')) {
        console.error("Invalid image data");
        return;
      }
      
      // Pre-load the image to check if it's valid
      const img = new Image();
      img.onload = () => {
        console.log("Image pre-loaded successfully", img.width, "x", img.height);
        onLogoSettingsChange("image", imageData);
        console.log("Image data passed to settings");
      };
      
      img.onerror = () => {
        console.error("Failed to pre-load image");
        alert("Selected image appears to be corrupt or invalid");
      };
      
      img.src = imageData;
    };
    
    reader.onerror = () => {
      console.error("Error reading file");
      alert("Error reading the selected file");
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="logo-controls">
      <h4 className="logo-controls-title">Logo Controls</h4>

      <div className="logo-input-group">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="logo-input"
          id="logo-upload"
        />
        <label htmlFor="logo-upload" className="logo-upload-label">
          Choose Logo File
        </label>
        {logoSettings.image && (
          <div className="logo-preview">
            <p>Logo selected ✓</p>
            <img 
              src={logoSettings.image} 
              alt="Logo preview" 
              style={{ 
                maxWidth: '100px', 
                maxHeight: '50px', 
                marginTop: '5px',
                border: '1px solid #ddd'
              }} 
            />
          </div>
        )}
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
        
        <div className="logo-control">
          <label className="logo-control-label">Opacity</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={logoSettings.opacity || 1}
            onChange={(e) => onLogoSettingsChange("opacity", Number(e.target.value))}
            className="logo-range"
          />
          <span className="logo-value">{Math.round((logoSettings.opacity || 1) * 100)}%</span>
        </div>
        
        {selectedLogoIndex !== null && (
          <div className="logo-advanced-controls">
            <div className="logo-control-checkbox">
              <input
                type="checkbox"
                id="lock-movement"
                checked={logoSettings.lockMovement || false}
                onChange={(e) => onLogoSettingsChange("lockMovement", e.target.checked)}
              />
              <label htmlFor="lock-movement">Lock Position</label>
            </div>
            
            <div className="logo-control-checkbox">
              <input
                type="checkbox"
                id="lock-rotation"
                checked={logoSettings.lockRotation || false}
                onChange={(e) => onLogoSettingsChange("lockRotation", e.target.checked)}
              />
              <label htmlFor="lock-rotation">Lock Rotation</label>
            </div>
            
            <div className="logo-control-checkbox">
              <input
                type="checkbox"
                id="lock-scaling"
                checked={logoSettings.lockScaling || false}
                onChange={(e) => onLogoSettingsChange("lockScaling", e.target.checked)}
              />
              <label htmlFor="lock-scaling">Lock Scaling</label>
            </div>
          </div>
        )}
      </div>

      <div className="logo-actions">
        <button 
          className="logo-add-button"
          onClick={handleApplyLogoToCanvas}
          disabled={!logoSettings.image}
        >
          Add Logo to Canvas
        </button>
        
        {selectedLogoIndex !== null && (
          <>
            <button 
              className="logo-remove-button"
              onClick={removeLogo}
            >
              Remove Selected Logo
            </button>
            <div className="logo-manipulation-info">
              <p>• Drag to move the logo</p>
              <p>• Drag corners to resize</p>
              <p>• Drag rotation control to rotate</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

