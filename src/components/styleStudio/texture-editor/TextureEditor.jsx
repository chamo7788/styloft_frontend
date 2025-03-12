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
  logoSettings,
  onLogoSettingsChange,
}) => {
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const [canvasSize] = useState({ width: 512, height: 512 })
  const [drawingMode, setDrawingMode] = useState("brush") // brush, eraser, text, logo
  const [brushColor, setBrushColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)

  // Logo manipulation state
  const [canvasLogos, setCanvasLogos] = useState([])
  const [selectedLogoIndex, setSelectedLogoIndex] = useState(null)

  // Track initialization status per part
  const [initializedParts, setInitializedParts] = useState({})

  // Canvas history
  const [canvasHistory, setCanvasHistory] = useState({})
  const [historyIndex, setHistoryIndex] = useState({})

  // Initialize canvas when component mounts or part changes
  useEffect(() => {
    // We need to wait for the canvas reference to be available
    if (!canvasRef.current) return;
    
    try {
      // Create the canvas container element dynamically
      const canvasContainer = document.createElement('div');
      canvasContainer.id = `canvas-container-${selectedPart}`;
      canvasContainer.style.width = `${canvasSize.width}px`;
      canvasContainer.style.height = `${canvasSize.height}px`;
      canvasRef.current.innerHTML = '';
      canvasRef.current.appendChild(canvasContainer);
      
      // Create the canvas element
      const canvasElement = document.createElement('canvas');
      canvasElement.id = `fabric-canvas-${selectedPart}`;
      canvasContainer.appendChild(canvasElement);
      
      // Initialize Fabric.js canvas with a small delay to ensure DOM is ready
      setTimeout(() => {
        // Clean up previous canvas if it exists
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }
        
        // Make sure fabric is properly imported
        if (!fabric || !fabric.Canvas) {
          console.error("Fabric.js is not properly loaded");
          return;
        }
        
        try {
          // Create new canvas
          const canvas = new fabric.Canvas(`fabric-canvas-${selectedPart}`, {
            width: canvasSize.width,
            height: canvasSize.height,
            backgroundColor: '#ffffff',
            selection: true,
            preserveObjectStacking: true,
          });
          
          fabricCanvasRef.current = canvas;
          
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
          
          // Set up event handlers
          canvas.on('object:modified', () => saveCanvasState());
          canvas.on('object:added', () => saveCanvasState());
          
          // Load existing texture if available
          if (canvasTextures[selectedPart]) {
            fabric.Image.fromURL(canvasTextures[selectedPart], (img) => {
              canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height
              });
            }, { crossOrigin: 'anonymous' });
          }
          
          // Set drawing mode after canvas is fully initialized
          setFabricDrawingMode(drawingMode);
          
          // Set as initialized
          setInitializedParts(prev => ({
            ...prev,
            [selectedPart]: true
          }));
          
          console.log("Canvas initialized successfully");
        } catch (error) {
          console.error("Error creating Fabric.js canvas:", error);
        }
      }, 100);
    } catch (error) {
      console.error("Error in canvas initialization:", error);
    }
    
    // Cleanup function
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [selectedPart]);

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

  // Apply logo to canvas
  const handleApplyLogoToCanvas = () => {
    if (!fabricCanvasRef.current || !logoSettings.image) return
    
    try {
      // Add logo as fabric image
      fabric.Image.fromURL(logoSettings.image, (img) => {
        // Scale down if the logo is too big
        const maxDim = 100
        let scale = 1
        
        if (img.width > maxDim || img.height > maxDim) {
          scale = Math.min(maxDim / img.width, maxDim / img.height)
        }
        
        img.scale(scale)
        img.set({
          left: canvasSize.width / 4,
          top: canvasSize.height / 4,
          cornerSize: 10,
          cornerColor: '#1a73e8',
          cornerStrokeColor: '#ffffff',
          transparentCorners: false,
          borderColor: '#1a73e8',
          borderScaleFactor: 2
        })
        
        fabricCanvasRef.current.add(img)
        fabricCanvasRef.current.setActiveObject(img)
        fabricCanvasRef.current.renderAll()
        
        // Save state
        saveCanvasState()
      }, { crossOrigin: 'anonymous' })
    } catch (error) {
      console.error('Error adding logo to canvas:', error)
    }
  }

  return (
    <div className="texture-editor-container">
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
            onLogoSettingsChange={onLogoSettingsChange}
            handleApplyLogoToCanvas={handleApplyLogoToCanvas}
            selectedLogoIndex={selectedLogoIndex}
          />
        )}
      </div>
    </div>
  )
}

export default TextureEditor

