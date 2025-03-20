import { useState } from 'react';
import CloudinaryService from '../../../../utils/CloudinaryService';

export const LogoControls = ({ logoSettings, onLogoSettingsChange, handleApplyLogoToCanvas, selectedLogoIndex, removeLogo }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log("File selected:", file.name, "size:", file.size, "type:", file.type);
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      console.error("Selected file is not an image");
      setUploadError("Please select an image file");
      return;
    }
    
    // Validate file size (limit to 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      console.error("File too large");
      setUploadError("Please select an image smaller than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      
      // Upload to Cloudinary using your service
      const uploadResult = await CloudinaryService.uploadImage(file);
      console.log("Uploaded to Cloudinary:", uploadResult);
      
      // Store the Cloudinary URL instead of base64 data
      onLogoSettingsChange("image", uploadResult.url);
      
      // Clear any previous errors
      setUploadError(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
          disabled={isUploading}
        />
        <label htmlFor="logo-upload" className="logo-upload-label">
          {isUploading ? "Uploading..." : "Choose Logo File"}
        </label>
        
        {uploadError && (
          <div className="logo-upload-error">
            {uploadError}
          </div>
        )}
        
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
            disabled={isUploading}
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
            disabled={isUploading}
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
                disabled={isUploading}
              />
              <label htmlFor="lock-movement">Lock Position</label>
            </div>
            
            <div className="logo-control-checkbox">
              <input
                type="checkbox"
                id="lock-rotation"
                checked={logoSettings.lockRotation || false}
                onChange={(e) => onLogoSettingsChange("lockRotation", e.target.checked)}
                disabled={isUploading}
              />
              <label htmlFor="lock-rotation">Lock Rotation</label>
            </div>
            
            <div className="logo-control-checkbox">
              <input
                type="checkbox"
                id="lock-scaling"
                checked={logoSettings.lockScaling || false}
                onChange={(e) => onLogoSettingsChange("lockScaling", e.target.checked)}
                disabled={isUploading}
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
          disabled={!logoSettings.image || isUploading}
        >
          {isUploading ? "Uploading..." : "Add Logo to Canvas"}
        </button>
        
        {selectedLogoIndex !== null && (
          <>
            <button 
              className="logo-remove-button"
              onClick={removeLogo}
              disabled={isUploading}
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

