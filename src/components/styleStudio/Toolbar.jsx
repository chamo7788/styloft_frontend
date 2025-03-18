import React, { useState } from 'react';
import { RotateCcw, RotateCw, Undo, Redo, Download, Save, Upload, Layers, X } from "lucide-react";

function Toolbar({
  onRotate,
  onUndo,
  onRedo,
  onScreenshot,
  onSaveDesign,
  onLoadDesign,
  onToggleLayerManager,
  canUndo,
  canRedo,
  showLayerManager,
}) {
  const [designs, setDesigns] = useState([]);
  const [showDesigns, setShowDesigns] = useState(false);
  const [designName, setDesignName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchDesigns() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user.uid) {
      setError("Please login to view your designs");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/design/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'userId': user.uid,
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const designs = await response.json();
      console.log('Fetched designs:', designs);
      setDesigns(designs);
      setShowDesigns(true);
    } catch (error) {
      console.error('Error fetching designs:', error);
      setError("Failed to load designs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  async function saveDesignToBackend(designData) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user.uid) {
      alert("Please login to save your design");
      return;
    }

    // Prompt user for design name if not already set
    const name = designName || prompt("Enter a name for your design:", designData.model ? `${designData.model} design` : "My Design");
    if (!name) return; // User cancelled
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/design/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userId': user.uid,
        },
        body: JSON.stringify({ 
          designData,
          designName: name 
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Design saved successfully:', result);
      setDesignName(name); // Save the name for next time
      alert("Design saved successfully!");
    } catch (error) {
      console.error('Error saving design:', error);
      setError("Failed to save design. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = () => {
    const designData = onSaveDesign();
    saveDesignToBackend(designData);
  };

  const handleLoadDesignClick = () => {
    fetchDesigns();
  };

  const handleDesignSelect = (design) => {
    console.log('Design selected:', design);
    
    if (!design || !design.designData) {
      console.error('Invalid design data:', design);
      return;
    }
    
    try {
      // Pass the design data to the parent component
      onLoadDesign(design.designData);
      setShowDesigns(false); // Hide the designs list after selection
      setDesignName(design.designName || ""); // Set the current design name
    } catch (error) {
      console.error('Error loading design:', error);
      setError("Failed to load design. The format may be incompatible.");
    }
  };

  return (
    <div className="canvas-toolbar">
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={() => onRotate("left")} title="Rotate Left">
          <RotateCcw size={16} />
        </button>
        <button className="toolbar-button" onClick={() => onRotate("right")} title="Rotate Right">
          <RotateCw size={16} />
        </button>
      </div>

      <div className="toolbar-group">
        <button className="toolbar-button" onClick={onUndo} disabled={!canUndo} title="Undo">
          <Undo size={16} />
        </button>
        <button className="toolbar-button" onClick={onRedo} disabled={!canRedo} title="Redo">
          <Redo size={16} />
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className={`toolbar-button ${showLayerManager ? "active" : ""}`}
          onClick={onToggleLayerManager}
          title="Toggle Layer Manager"
        >
          <Layers size={16} />
        </button>
        <button className="toolbar-button" onClick={onScreenshot} title="Take Screenshot">
          <Download size={16} />
        </button>
        <button 
          className="toolbar-button" 
          onClick={handleSave} 
          title="Save Design"
          disabled={isLoading}
        >
          <Save size={16} />
        </button>
        <button 
          className="toolbar-button" 
          title="Load Design" 
          onClick={handleLoadDesignClick}
          disabled={isLoading}
        >
          <Upload size={16} />
        </button>
      </div>

      {showDesigns && (
        <div className="designs-list">
          <div className="designs-list-header">
            <h3>Your Saved Designs</h3>
            <button className="close-button" onClick={() => setShowDesigns(false)}>
              <X size={16} />
            </button>
          </div>
          
          {isLoading && <div className="loading">Loading designs...</div>}
          
          {error && <div className="error-message">{error}</div>}
          
          {!isLoading && !error && designs.length > 0 ? (
            <div className="designs-items">
              {designs.map((design, index) => (
                <div 
                  key={design.id || index} 
                  className="design-item" 
                  onClick={() => handleDesignSelect(design)}
                >
                  <div className="design-name">{design.designName || `Design ${index + 1}`}</div>
                  <div className="design-date">
                    {new Date(design.createdAt).toLocaleDateString()} 
                    {" "}
                    {new Date(design.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && !error && <div className="no-designs">No saved designs found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Toolbar;