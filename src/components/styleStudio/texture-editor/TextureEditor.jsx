import { useState, useRef, useEffect } from "react"
import { CanvasTexture } from "three"
import * as fabric from 'fabric'
import { CanvasEditor } from "./CanvasEditor"
import { EditorToolbar } from "./EditorToolbar"
import { BrushControls } from "./controls/BrushControls"
import { TextControls } from "./controls/TextControls"
import { LogoControls } from "./controls/LogoControls"
import { useCanvasHistory } from "./hooks/useCanvasHistory"

const TextureEditor = ({
  selectedModel,
  selectedPart,
  uvMappings,
  textElements,
  textSettings,
  onTextSettingsChange,
  canvasTextures,
  setCanvasTextures,
  setTextures,
  logoElements,
  onLogoSettingsChange,
  onClose,
}) => {
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const [canvasSize] = useState({ width: 512, height: 512 })
  const [drawingMode, setDrawingMode] = useState("brush")
  const [brushColor, setBrushColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)

  // Logo state
  const [selectedLogoIndex, setSelectedLogoIndex] = useState(null)
  const [logoSettings, setLogoSettings] = useState({
    image: null,
    size: 1.0,
    opacity: 1.0,
    lockMovement: false,
    lockRotation: false,
    lockScaling: false
  })

  // Track initialization status per part
  const [initializedParts, setInitializedParts] = useState({})

  // Canvas history
  const [canvasHistory, setCanvasHistory] = useState({})
  const [historyIndex, setHistoryIndex] = useState({})

  // Initialize canvas when component mounts or part changes
  useEffect(() => {
    // Initialize the canvas when the component mounts or when the selected part changes
    if (canvasRef.current) {
      const canvas = initializeCanvas();
      
      // Set drawing mode after canvas is fully initialized
      if (canvas) {
        setFabricDrawingMode(drawingMode);
        
        // Mark the part as initialized
        setInitializedParts(prev => ({
          ...prev,
          [selectedPart]: true
        }));
      }
    }
    
    // Cleanup function
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.off();
        fabricCanvasRef.current.dispose();
      }
    };
  }, [selectedPart]); // Only re-run the effect if selectedPart changes

  // Set fabric drawing mode whenever drawingMode changes
  useEffect(() => {
    setFabricDrawingMode(drawingMode)
  }, [drawingMode])

  // Update brush properties when they change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    // Only update brush if drawing mode is active and brush exists
    if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [brushColor, brushSize])

  // Add this in your useEffect for fabric canvas setup
  useEffect(() => {
    if (!fabricCanvasRef.current) return
    
    fabricCanvasRef.current.on('selection:created', handleObjectSelected)
    fabricCanvasRef.current.on('selection:updated', handleObjectSelected)
    fabricCanvasRef.current.on('selection:cleared', () => setSelectedLogoIndex(null))
    
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.off('selection:created', handleObjectSelected)
        fabricCanvasRef.current.off('selection:updated', handleObjectSelected)
        fabricCanvasRef.current.off('selection:cleared')
      }
    }
  }, [fabricCanvasRef.current])

  // Set drawing mode in Fabric.js
  const setFabricDrawingMode = (mode) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Disable all modes first
    canvas.isDrawingMode = false;
    if (canvas.getActiveObject()) {
      canvas.discardActiveObject();
    }
    canvas.renderAll();
    
    // Enable the selected mode
    switch (mode) {
      case 'brush':
        canvas.isDrawingMode = true;
        // We need to ensure the brush is created before setting properties
        if (!canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = brushColor;
        canvas.freeDrawingBrush.width = brushSize;
        break;
        
      case 'eraser':
        canvas.isDrawingMode = true;
        // We need to ensure the brush is created before setting properties
        if (!canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = '#ffffff';
        canvas.freeDrawingBrush.width = brushSize;
        break;
        
      case 'text':
      case 'logo':
        // These modes don't have a direct Fabric.js equivalent
        // They'll be handled through the controls
        break;
        
      default:
        break;
    }
  }

  // Save current canvas state to history
  const saveCanvasState = () => {
    if (!fabricCanvasRef.current) return
    
    try {
      const currentState = JSON.stringify(fabricCanvasRef.current.toJSON())
      const currentIndex = historyIndex[selectedPart] || 0
      
      // Truncate history if we're not at the end
      const newHistory = [
        ...(canvasHistory[selectedPart] || []).slice(0, currentIndex + 1),
        currentState
      ]
      
      setCanvasHistory(prev => ({
        ...prev,
        [selectedPart]: newHistory
      }))
      
      setHistoryIndex(prev => ({
        ...prev,
        [selectedPart]: newHistory.length - 1
      }))
      
      // Update the texture
      updateTextureFromCanvas()
    } catch (error) {
      console.error('Error saving canvas state:', error)
    }
  }

  // Handle undo
  const handleCanvasUndo = () => {
    if (!fabricCanvasRef.current) return
    
    const currentIndex = historyIndex[selectedPart] || 0
    if (currentIndex <= 0) return
    
    const newIndex = currentIndex - 1
    const stateToRestore = canvasHistory[selectedPart][newIndex]
    
    try {
      fabricCanvasRef.current.loadFromJSON(JSON.parse(stateToRestore), () => {
        fabricCanvasRef.current.renderAll()
        setHistoryIndex(prev => ({
          ...prev,
          [selectedPart]: newIndex
        }))
        updateTextureFromCanvas()
      })
    } catch (error) {
      console.error('Error during undo operation:', error)
    }
  }

  // Handle redo
  const handleCanvasRedo = () => {
    if (!fabricCanvasRef.current) return
    
    const currentIndex = historyIndex[selectedPart] || 0
    const maxIndex = (canvasHistory[selectedPart]?.length || 1) - 1
    
    if (currentIndex >= maxIndex) return
    
    const newIndex = currentIndex + 1
    const stateToRestore = canvasHistory[selectedPart][newIndex]
    
    try {
      fabricCanvasRef.current.loadFromJSON(JSON.parse(stateToRestore), () => {
        fabricCanvasRef.current.renderAll()
        setHistoryIndex(prev => ({
          ...prev,
          [selectedPart]: newIndex
        }))
        updateTextureFromCanvas()
      })
    } catch (error) {
      console.error('Error during redo operation:', error)
    }
  }

  // Clear canvas
  const handleClearCanvas = () => {
    if (!fabricCanvasRef.current) return
    
    try {
      // Remove all objects
      fabricCanvasRef.current.clear()
      fabricCanvasRef.current.backgroundColor = '#ffffff'
      fabricCanvasRef.current.renderAll()
      
      // Save this state
      saveCanvasState()
    } catch (error) {
      console.error('Error clearing canvas:', error)
    }
  }

  // Update texture from canvas
  const updateTextureFromCanvas = () => {
    if (!fabricCanvasRef.current) return
    
    try {
      // Get canvas data URL
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1
      })
      
      // Update canvas textures
      setCanvasTextures(prev => ({
        ...prev,
        [selectedPart]: dataURL
      }))
      
      // Get the DOM canvas element
      const canvasEl = fabricCanvasRef.current.getElement()
      
      // Create Three.js texture from canvas
      const texture = new CanvasTexture(canvasEl)
      texture.needsUpdate = true
      
      // Update textures
      setTextures(prev => ({
        ...prev,
        [selectedPart]: texture
      }))
    } catch (error) {
      console.error('Error updating texture:', error)
    }
  }

  // Apply text to canvas
  const handleApplyTextToCanvas = () => {
    if (!fabricCanvasRef.current || !textSettings.text.trim()) return
    
    try {
      // Create fabric text object
      const text = new fabric.Text(textSettings.text, {
        left: canvasSize.width / 2,
        top: canvasSize.height / 2,
        fontSize: textSettings.fontSize || 24,
        fontWeight: textSettings.fontWeight || 'normal',
        fontStyle: textSettings.fontStyle || 'normal',
        fontFamily: textSettings.fontFamily || 'Arial',
        fill: textSettings.color || '#000000',
        originX: 'center',
        originY: 'center'
      })
      
      // Add text to canvas
      fabricCanvasRef.current.add(text)
      
      // Select the text for immediate editing
      fabricCanvasRef.current.setActiveObject(text)
      fabricCanvasRef.current.renderAll()
      
      // Save state
      saveCanvasState()
    } catch (error) {
      console.error('Error adding text to canvas:', error)
    }
  }

  // Replace your existing handleApplyLogoToCanvas function with this simplified version
const handleApplyLogoToCanvas = () => {
  if (!fabricCanvasRef.current || !logoSettings.image) {
    console.error("Missing canvas or image data");
    return;
  }
  
  console.log("Adding logo to canvas...");
  
  // Create a new image element directly
  const imgElement = new Image();
  
  imgElement.onload = () => {
    console.log("Image loaded successfully", imgElement.width, "x", imgElement.height);
    
    // Create a fabric.Image instance from the loaded HTML Image element
    const fabricImage = new fabric.Image(imgElement, {
      left: canvasSize.width / 2,
      top: canvasSize.height / 2,
      originX: 'center',
      originY: 'center',
      cornerSize: 10,
      borderColor: '#1a73e8',
      cornerColor: '#1a73e8',
      cornerStrokeColor: '#ffffff',
      transparentCorners: false,
    });
    
    // Apply settings
    const scale = logoSettings.size || 1;
    
    // Scale the image to a reasonable size if needed
    const maxSize = 200; // Maximum size in pixels
    if (fabricImage.width > maxSize || fabricImage.height > maxSize) {
      const scaleFactor = Math.min(maxSize / fabricImage.width, maxSize / fabricImage.height);
      fabricImage.scale(scaleFactor * scale);
    } else {
      fabricImage.scale(scale);
    }
    
    fabricImage.set({
      opacity: logoSettings.opacity || 1
    });
    
    // Add to canvas
    fabricCanvasRef.current.add(fabricImage);
    fabricCanvasRef.current.setActiveObject(fabricImage);
    fabricCanvasRef.current.renderAll();
    
    console.log("Image added to canvas");
    
    // Save canvas state
    saveCanvasState();
  };
  
  imgElement.onerror = (err) => {
    console.error("Error loading image:", err);
  };
  
  // Set source to trigger loading
  imgElement.src = logoSettings.image;
};

  // Alternative direct approach to test image loading
  const handleApplyLogoToCanvasDirect = () => {
    if (!canvasRef.current || !logoSettings.image) return;
    
    console.log("Using direct canvas approach...");
    
    try {
      // Create a new image element
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded directly:", img.width, "x", img.height);
        
        // Get the 2D context
        const ctx = canvasRef.current.querySelector('canvas').getContext('2d');
        if (!ctx) {
          console.error("Could not get 2D context");
          return;
        }
        
        // Draw the image in the center
        const x = (canvasSize.width / 2) - (img.width * logoSettings.size / 2);
        const y = (canvasSize.height / 2) - (img.height * logoSettings.size / 2);
        
        ctx.drawImage(
          img, 
          x, 
          y, 
          img.width * logoSettings.size, 
          img.height * logoSettings.size
        );
        
        console.log("Image drawn directly to canvas");
      };
      
      img.onerror = (err) => {
        console.error("Image loading error:", err);
      };
      
      // Set the source to start loading
      img.src = logoSettings.image;
      
    } catch (error) {
      console.error('Error in direct canvas approach:', error);
    }
  };

  // Add this function to handle object selection
  const handleObjectSelected = (e) => {
    if (!e.selected || e.selected.length === 0) return
    
    const obj = e.selected[0]
    if (obj.type === 'image') {
      // This is a logo, update the selected index
      // Find the index of this object in the canvas objects
      const objects = fabricCanvasRef.current.getObjects()
      const index = objects.indexOf(obj)
      setSelectedLogoIndex(index)
      
      // Update logo settings based on selected object properties
      setLogoSettings(prev => ({
        ...prev,
        opacity: obj.opacity || 1,
        lockMovement: obj.lockMovementX || false,
        lockRotation: obj.lockRotation || false,
        lockScaling: obj.lockScalingX || false
      }))
    } else {
      setSelectedLogoIndex(null)
    }
  }

  // Handle logo settings changes locally
  const handleLogoSettingsChange = (property, value) => {
    setLogoSettings(prev => ({
      ...prev,
      [property]: value
    }))

    // If external handler exists, call it too
    if (onLogoSettingsChange) {
      onLogoSettingsChange(property, value)
    }

    // If we have a selected logo object, update it directly
    if (selectedLogoIndex !== null && fabricCanvasRef.current) {
      const activeObject = fabricCanvasRef.current.getActiveObject()
      if (activeObject && activeObject.type === 'image') {
        switch(property) {
          case 'opacity':
            activeObject.set('opacity', value)
            break
          case 'lockMovement':
            activeObject.lockMovementX = value
            activeObject.lockMovementY = value
            break
          case 'lockRotation':
            activeObject.lockRotation = value
            break
          case 'lockScaling':
            activeObject.lockScalingX = value
            activeObject.lockScalingY = value
            break
        }
        fabricCanvasRef.current.renderAll()
        saveCanvasState()
      }
    }
  }

  // Add a function to remove selected logo
  const removeLogo = () => {
    if (!fabricCanvasRef.current) return
    
    const activeObject = fabricCanvasRef.current.getActiveObject()
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject)
      fabricCanvasRef.current.renderAll()
      saveCanvasState()
      setSelectedLogoIndex(null)
    }
  }

  // Your canvas initialization function - replace with this more robust version
const initializeCanvas = () => {
  if (!canvasRef.current) return;
  
  console.log("Initializing Fabric.js canvas");
  
  // Clear previous content
  canvasRef.current.innerHTML = '';
  
  // Create a container for the canvas
  const canvasContainer = document.createElement('div');
  canvasContainer.className = 'fabric-canvas-container';
  canvasRef.current.appendChild(canvasContainer);
  
  // Create the canvas element
  const canvasElement = document.createElement('canvas');
  canvasElement.width = canvasSize.width;
  canvasElement.height = canvasSize.height;
  canvasElement.id = 'fabric-canvas';
  canvasContainer.appendChild(canvasElement);
  
  try {
    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas('fabric-canvas', {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true
    });
    
    fabricCanvasRef.current = canvas;
    console.log("Fabric.js canvas initialized successfully");
    
    // Set up event handlers
    canvas.on('selection:created', handleObjectSelected);
    canvas.on('selection:updated', handleObjectSelected);
    canvas.on('selection:cleared', () => setSelectedLogoIndex(null));
    canvas.on('object:modified', saveCanvasState);
    canvas.on('object:added', saveCanvasState);
    
    // Initialize part history if needed
    if (!canvasHistory[selectedPart]) {
      setCanvasHistory(prev => ({
        ...prev,
        [selectedPart]: [JSON.stringify(canvas.toJSON())]
      }));
      
      setHistoryIndex(prev => ({
        ...prev,
        [selectedPart]: 0
      }));
    }
    
    // Load existing texture if available
    if (canvasTextures[selectedPart]) {
      fabric.Image.fromURL(canvasTextures[selectedPart], (img) => {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height
        });
      }, { crossOrigin: 'anonymous' });
    }
    
    return canvas;
  } catch (error) {
    console.error("Error initializing Fabric.js canvas:", error);
    return null;
  }
};

  return (
    <div className="texture-editor-container">
      <div className="texture-editor-toolbar">
        <EditorToolbar
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
          handleCanvasUndo={handleCanvasUndo}
          handleCanvasRedo={handleCanvasRedo}
          handleClearCanvas={handleClearCanvas}
          updateTextureFromCanvas={updateTextureFromCanvas} // Pass the function here
          canUndo={historyIndex[selectedPart] > 0}
          canRedo={historyIndex[selectedPart] < (canvasHistory[selectedPart]?.length || 1) - 1}
        />
        <button 
          className="texture-editor-tool" 
          onClick={onClose} 
          data-tooltip="Close Editor"
        >
          <span>✕</span>
        </button>
      </div>
      
      <div className="texture-editor-canvas-container">
        <div ref={canvasRef} className="texture-editor-canvas-wrapper" />
      </div>

      <div className="texture-editor-controls">
        {drawingMode === "brush" && (
          <BrushControls
            brushColor={brushColor}
            setBrushColor={setBrushColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
          />
        )}

        {drawingMode === "eraser" && (
          <BrushControls isEraser={true} brushSize={brushSize} setBrushSize={setBrushSize} />
        )}

        {drawingMode === "text" && (
          <TextControls
            textSettings={textSettings}
            onTextSettingsChange={onTextSettingsChange}
            handleApplyTextToCanvas={handleApplyTextToCanvas}
          />
        )}

        {drawingMode === "logo" && (
          <LogoControls
            logoSettings={logoSettings}
            onLogoSettingsChange={handleLogoSettingsChange} // Use the local handler
            handleApplyLogoToCanvas={handleApplyLogoToCanvas}
            selectedLogoIndex={selectedLogoIndex}
            removeLogo={removeLogo}
          />
        )}
      </div>
    </div>
  )
}

export default TextureEditor

