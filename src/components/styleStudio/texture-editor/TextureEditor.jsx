import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import * as fabric from 'fabric';
import { CanvasTexture } from 'three';
import { EditorToolbar } from "./EditorToolbar"
import { BrushControls } from "./controls/BrushControls"
import { TextControls } from "./controls/TextControls"
import { LogoControls } from "./controls/LogoControls"

// Use forwardRef to expose methods to parent component
const TextureEditor = forwardRef(
  (
    {
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
      onCanvasObjectsChange,
    },
    ref,
  ) => {
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
      lockScaling: false,
    })

    // Track initialization status per part
    const [initializedParts, setInitializedParts] = useState({})

    // Canvas history
    const [canvasHistory, setCanvasHistory] = useState({})
    const [historyIndex, setHistoryIndex] = useState({})

    // Track canvas objects for layer management
    const [canvasObjects, setCanvasObjects] = useState([])

    // Update texture from canvas - Define this first!
    const updateTextureFromCanvas = () => {
      if (!fabricCanvasRef.current) return;

      try {
        // Get canvas data URL
        const dataURL = fabricCanvasRef.current.toDataURL({
          format: "png",
          quality: 1,
        });

        // Update canvas textures
        setCanvasTextures((prev) => ({
          ...prev,
          [selectedPart]: dataURL,
        }));

        // Get the DOM canvas element
        const canvasEl = fabricCanvasRef.current.getElement();

        // Create a temporary canvas for flipping the texture
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = canvasEl.width;
        tempCanvas.height = canvasEl.height;

        // Draw the original canvas flipped vertically
        tempCtx.translate(0, canvasEl.height);
        tempCtx.scale(1, -1);
        tempCtx.drawImage(canvasEl, 0, 0, canvasEl.width, canvasEl.height);

        // Create Three.js texture from the flipped canvas
        const texture = new CanvasTexture(tempCanvas);
        texture.needsUpdate = true;

        // Update textures
        setTextures((prev) => ({
          ...prev,
          [selectedPart]: texture,
        }));
      } catch (error) {
        console.error("Error updating texture:", error);
      }
    };

    // Save current canvas state to history
    const saveCanvasState = () => {
      if (!fabricCanvasRef.current) return;

      try {
        const currentState = JSON.stringify(fabricCanvasRef.current.toJSON());
        const currentIndex = historyIndex[selectedPart] || 0;

        // Truncate history if we're not at the end
        const newHistory = [...(canvasHistory[selectedPart] || []).slice(0, currentIndex + 1), currentState];

        setCanvasHistory((prev) => ({
          ...prev,
          [selectedPart]: newHistory,
        }));

        setHistoryIndex((prev) => ({
          ...prev,
          [selectedPart]: newHistory.length - 1,
        }));

        // Update the texture
        updateTextureFromCanvas();
      } catch (error) {
        console.error("Error saving canvas state:", error);
      }
    };

    // Move a canvas object forward (bring it one level up)
    const moveObjectForward = (objectIndex) => {
      if (!fabricCanvasRef.current) return;
      
      const canvas = fabricCanvasRef.current;
      const objects = canvas.getObjects();

      if (objectIndex >= objects.length - 1) return; // Already at the top

      // Get the object to move and the one above it
      const object = objects[objectIndex];
      const upperObject = objects[objectIndex + 1];

      // Swap their indices
      canvas.moveTo(object, objectIndex + 1);
      canvas.moveTo(upperObject, objectIndex);

      // Render and save state
      canvas.renderAll();
      saveCanvasState();
    };

    // Move a canvas object backward (send it one level down)
    const moveObjectBackward = (objectIndex) => {
      if (!fabricCanvasRef.current) return;

      const canvas = fabricCanvasRef.current;
      const objects = canvas.getObjects();

      if (objectIndex <= 0) return; // Already at the bottom

      // Get the object to move and the one below it
      const object = objects[objectIndex];
      const lowerObject = objects[objectIndex - 1];

      // Swap their indices
      canvas.moveTo(object, objectIndex - 1);
      canvas.moveTo(lowerObject, objectIndex);

      // Render and save state
      canvas.renderAll();
      saveCanvasState();
    };

    // Bring a canvas object to the front (top of stack)
    const bringObjectToFront = (objectIndex) => {
      if (!fabricCanvasRef.current) return;

      const canvas = fabricCanvasRef.current;
      const objects = canvas.getObjects();

      if (objectIndex < 0 || objectIndex >= objects.length) return;

      const object = objects[objectIndex];
      canvas.bringToFront(object);
      canvas.renderAll();
      saveCanvasState();
    };

    // Send a canvas object to the back (bottom of stack)
    const sendObjectToBack = (objectIndex) => {
      if (!fabricCanvasRef.current) return;

      const canvas = fabricCanvasRef.current;
      const objects = canvas.getObjects();

      if (objectIndex < 0 || objectIndex >= objects.length) return;

      const object = objects[objectIndex];
      canvas.sendToBack(object);
      canvas.renderAll();
      saveCanvasState();
    };

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      moveObjectForward: (index) => {
        console.log("Moving object forward:", index)
        moveObjectForward(index)
      },
      moveObjectBackward: (index) => {
        console.log("Moving object backward:", index)
        moveObjectBackward(index)
      },
      bringObjectToFront: (index) => {
        console.log("Bringing object to front:", index)
        bringObjectToFront(index)
      },
      sendObjectToBack: (index) => {
        console.log("Sending object to back:", index)
        sendObjectToBack(index)
      },
      selectObject: (index) => {
        console.log("Selecting object:", index)
        if (!fabricCanvasRef.current) return

        const objects = fabricCanvasRef.current.getObjects()
        if (index >= 0 && index < objects.length) {
          fabricCanvasRef.current.setActiveObject(objects[index])
          fabricCanvasRef.current.renderAll()
        }
      },
      // Add this new method
      loadMaterialAsBackground: (materialUrl) => {
        console.log("Loading material as background:", materialUrl)
        if (!fabricCanvasRef.current) return

        const canvas = fabricCanvasRef.current

        // Find and remove any existing base-texture object
        const existingBaseTexture = canvas.getObjects().find((obj) => obj.name === "base-texture")
        if (existingBaseTexture) {
          canvas.remove(existingBaseTexture)
        }

        // Load the new material as a background image
        fabric.Image.fromURL(
          materialUrl,
          (img) => {
            // Set as a locked bottom layer
            img.set({
              selectable: false,
              evented: false,
              lockMovementX: true,
              lockMovementY: true,
              lockRotation: true,
              lockScalingX: true,
              lockScalingY: true,
              hasControls: false,
              hasBorders: false,
              name: "base-texture",
              excludeFromExport: false,
            })

            // Scale to fit canvas
            img.scaleToWidth(canvas.width)
            img.scaleToHeight(canvas.height)

            // Add to canvas and send to back
            canvas.add(img)
            canvas.sendToBack(img)
            canvas.renderAll()

            // Save this state to history
            saveCanvasState()

            // Update the texture
            updateTextureFromCanvas()
          },
          { crossOrigin: "anonymous" },
        )
      },
      // Add this new method to get all canvas data
      getAllCanvasData: () => {
        if (!fabricCanvasRef.current) return {};
        
        // Create a data structure with canvas objects for each part
        const canvasData = {
          [selectedPart]: fabricCanvasRef.current.toJSON()
        };
        
        return canvasData;
      },
      
      // Add this new method to get canvas history
      getCanvasHistory: () => {
        return {
          canvasHistory,
          historyIndex
        };
      },
      // Add this method to load canvas data
      loadCanvasData: (canvasObjects) => {
        if (!fabricCanvasRef.current) return;
        
        const partData = canvasObjects[selectedPart];
        if (partData) {
          fabricCanvasRef.current.loadFromJSON(partData, () => {
            fabricCanvasRef.current.renderAll();
            // Update texture after loading
            updateTextureFromCanvas();
          });
        }
      },
      
      // Add this method to restore canvas history
      restoreCanvasHistory: (historyData) => {
        if (historyData.canvasHistory) {
          setCanvasHistory(historyData.canvasHistory);
        }
        if (historyData.historyIndex) {
          setHistoryIndex(historyData.historyIndex);
        }
      }
    }), [selectedPart, canvasHistory, historyIndex, updateTextureFromCanvas])

    // Function to expose canvas objects to parent component
    useEffect(() => {
      if (fabricCanvasRef.current) {
        const updateCanvasObjectsList = () => {
          const objects = fabricCanvasRef.current.getObjects()
          const formattedObjects = objects.map((obj, index) => ({
            id: obj.id || `canvas-object-${index}`,
            type: obj.type,
            name: obj.text || (obj.type === "image" ? `Logo ${index + 1}` : `Object ${index + 1}`),
            fabricObject: obj,
            zIndex: fabricCanvasRef.current.getObjects().indexOf(obj),
          }))
          setCanvasObjects(formattedObjects)

          // If parent component provided a callback to receive canvas objects
          if (typeof onCanvasObjectsChange === "function") {
            onCanvasObjectsChange(formattedObjects, selectedPart)
          }
        }

        fabricCanvasRef.current.on("object:added", updateCanvasObjectsList)
        fabricCanvasRef.current.on("object:removed", updateCanvasObjectsList)
        fabricCanvasRef.current.on("object:modified", updateCanvasObjectsList)
        fabricCanvasRef.current.on("object:moved", updateCanvasObjectsList)

        // Initial update
        updateCanvasObjectsList()

        return () => {
          if (fabricCanvasRef.current) {
            fabricCanvasRef.current.off("object:added", updateCanvasObjectsList)
            fabricCanvasRef.current.off("object:removed", updateCanvasObjectsList)
            fabricCanvasRef.current.off("object:modified", updateCanvasObjectsList)
            fabricCanvasRef.current.off("object:moved", updateCanvasObjectsList)
          }
        }
      }
    }, [fabricCanvasRef.current])

    // Initialize canvas when component mounts or part changes
    useEffect(() => {
      // Initialize the canvas when the component mounts or when the selected part changes
      if (canvasRef.current) {
        const canvas = initializeCanvas()

        // Set drawing mode after canvas is fully initialized
        if (canvas) {
          setFabricDrawingMode(drawingMode)

          // Mark the part as initialized
          setInitializedParts((prev) => ({
            ...prev,
            [selectedPart]: true,
          }))
        }
      }

      // Cleanup function
      return () => {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.off()
          fabricCanvasRef.current.dispose()
        }
      }
    }, [selectedPart]) // Only re-run the effect if selectedPart changes

    // Set fabric drawing mode whenever drawingMode changes
    useEffect(() => {
      setFabricDrawingMode(drawingMode)
    }, [drawingMode])

    // Update brush properties when they change
    useEffect(() => {
      if (!fabricCanvasRef.current) return

      const canvas = fabricCanvasRef.current
      // Only update brush if drawing mode is active and brush exists
      if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = brushColor
        canvas.freeDrawingBrush.width = brushSize
      }
    }, [brushColor, brushSize])

    // Add this in your useEffect for fabric canvas setup
    useEffect(() => {
      if (!fabricCanvasRef.current) return

      fabricCanvasRef.current.on("selection:created", handleObjectSelected)
      fabricCanvasRef.current.on("selection:updated", handleObjectSelected)
      fabricCanvasRef.current.on("selection:cleared", () => setSelectedLogoIndex(null))

      return () => {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.off("selection:created", handleObjectSelected)
          fabricCanvasRef.current.off("selection:updated", handleObjectSelected)
          fabricCanvasRef.current.off("selection:cleared")
        }
      }
    }, [fabricCanvasRef.current])

    // Set drawing mode in Fabric.js
    const setFabricDrawingMode = (mode) => {
      if (!fabricCanvasRef.current) return

      const canvas = fabricCanvasRef.current

      // Disable all modes first
      canvas.isDrawingMode = false
      if (canvas.getActiveObject()) {
        canvas.discardActiveObject()
      }
      canvas.renderAll()

      // Enable the selected mode
      switch (mode) {
        case "brush":
          canvas.isDrawingMode = true
          // We need to ensure the brush is created before setting properties
          if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
          }
          canvas.freeDrawingBrush.color = brushColor
          canvas.freeDrawingBrush.width = brushSize
          break

        case "eraser":
          canvas.isDrawingMode = true
          // We need to ensure the brush is created before setting properties
          if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
          }
          canvas.freeDrawingBrush.color = "#ffffff"
          canvas.freeDrawingBrush.width = brushSize
          break

        case "text":
        case "logo":
          // These modes don't have a direct Fabric.js equivalent
          // They'll be handled through the controls
          break

        default:
          break
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
          setHistoryIndex((prev) => ({
            ...prev,
            [selectedPart]: newIndex,
          }))
          updateTextureFromCanvas()
        })
      } catch (error) {
        console.error("Error during undo operation:", error)
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
          setHistoryIndex((prev) => ({
            ...prev,
            [selectedPart]: newIndex,
          }))
          updateTextureFromCanvas()
        })
      } catch (error) {
        console.error("Error during redo operation:", error)
      }
    }

    // Clear canvas
    const handleClearCanvas = () => {
      if (!fabricCanvasRef.current) return

      try {
        // Find the base texture object
        const baseTexture = fabricCanvasRef.current.getObjects().find((obj) => obj.name === "base-texture")

        // Remove all objects
        fabricCanvasRef.current.clear()

        // Restore the base texture if it existed
        if (baseTexture) {
          fabricCanvasRef.current.add(baseTexture)
        } else {
          // If no base texture, just set background color
          fabricCanvasRef.current.backgroundColor = "#ffffff"
        }

        fabricCanvasRef.current.renderAll()

        // Save this state
        saveCanvasState()
      } catch (error) {
        console.error("Error clearing canvas:", error)
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
          fontWeight: textSettings.fontWeight || "normal",
          fontStyle: textSettings.fontStyle || "normal",
          fontFamily: textSettings.fontFamily || "Arial",
          fill: textSettings.color || "#000000",
          originX: "center",
          originY: "center",
        })

        // Add text to canvas
        fabricCanvasRef.current.add(text)

        // Select the text for immediate editing
        fabricCanvasRef.current.setActiveObject(text)
        fabricCanvasRef.current.renderAll()

        // Save state
        saveCanvasState()
      } catch (error) {
        console.error("Error adding text to canvas:", error)
      }
    }

    // Replace your existing handleApplyLogoToCanvas function with this updated version:

const handleApplyLogoToCanvas = () => {
  if (!fabricCanvasRef.current || !logoSettings.image) {
    console.error("Canvas or logo image not available");
    return;
  }

  console.log("Adding logo to canvas from URL:", logoSettings.image);

  // Create a new image element
  const imgElement = new Image();
  
  // Add crossOrigin attribute for CORS support with Cloudinary
  imgElement.crossOrigin = "anonymous";

  imgElement.onload = () => {
    console.log("Logo image loaded successfully");
    try {
      // Create a fabric.js Image object
      const fabricImage = new fabric.Image(imgElement, {
        left: fabricCanvasRef.current.width / 2,
        top: fabricCanvasRef.current.height / 2,
        originX: 'center',
        originY: 'center',
        opacity: logoSettings.opacity || 1.0,
        scaleX: logoSettings.size,
        scaleY: logoSettings.size,
        selectable: true,
      });

      // Add any additional properties from logoSettings
      if (logoSettings.lockMovement) fabricImage.lockMovementX = fabricImage.lockMovementY = true;
      if (logoSettings.lockRotation) fabricImage.lockRotation = true;
      if (logoSettings.lockScaling) fabricImage.lockScalingX = fabricImage.lockScalingY = true;
      
      // Store the original Cloudinary URL with the object
      fabricImage.set('cloudinaryUrl', logoSettings.image);

      // Add to canvas
      fabricCanvasRef.current.add(fabricImage);
      fabricCanvasRef.current.setActiveObject(fabricImage);
      fabricCanvasRef.current.renderAll();
      
      // Save canvas state
      saveCanvasState();
      
      // Update the canvas objects for layer management
      if (onCanvasObjectsChange) {
        const objects = fabricCanvasRef.current.getObjects();
        onCanvasObjectsChange(objects, selectedPart);
      }
    } catch (error) {
      console.error("Error creating fabric image object:", error);
    }
  };

  imgElement.onerror = (err) => {
    console.error("Error loading logo image:", err);
    alert("Failed to load the logo image. Please try a different image.");
  };
  
  // Set source to trigger loading
  imgElement.src = logoSettings.image;
};

    // Add this function to handle object selection
    const handleObjectSelected = (e) => {
      if (!e.selected || e.selected.length === 0) return

      const obj = e.selected[0]
      if (obj.type === "image") {
        // This is a logo, update the selected index
        // Find the index of this object in the canvas objects
        const objects = fabricCanvasRef.current.getObjects()
        const index = objects.indexOf(obj)
        setSelectedLogoIndex(index)

        // Update logo settings based on selected object properties
        setLogoSettings((prev) => ({
          ...prev,
          opacity: obj.opacity || 1,
          lockMovement: obj.lockMovementX || false,
          lockRotation: obj.lockRotation || false,
          lockScaling: obj.lockScalingX || false,
        }))
      } else {
        setSelectedLogoIndex(null)
      }
    }

    // Handle logo settings changes locally
    const handleLogoSettingsChange = (property, value) => {
      setLogoSettings((prev) => ({
        ...prev,
        [property]: value,
      }))

      // If external handler exists, call it too
      if (onLogoSettingsChange) {
        onLogoSettingsChange(property, value)
      }

      // If we have a selected logo object, update it directly
      if (selectedLogoIndex !== null && fabricCanvasRef.current) {
        const activeObject = fabricCanvasRef.current.getActiveObject()
        if (activeObject && activeObject.type === "image") {
          switch (property) {
            case "opacity":
              activeObject.set("opacity", value)
              break
            case "lockMovement":
              activeObject.lockMovementX = value
              activeObject.lockMovementY = value
              break
            case "lockRotation":
              activeObject.lockRotation = value
              break
            case "lockScaling":
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
      if (!canvasRef.current) return

      console.log("Initializing Fabric.js canvas")

      // Clear previous content
      canvasRef.current.innerHTML = ""

      // Create a container for the canvas
      const canvasContainer = document.createElement("div")
      canvasContainer.className = "fabric-canvas-container"
      canvasRef.current.appendChild(canvasContainer)

      // Create the canvas element
      const canvasElement = document.createElement("canvas")
      canvasElement.width = canvasSize.width
      canvasElement.height = canvasSize.height
      canvasElement.id = "fabric-canvas"
      canvasContainer.appendChild(canvasElement)

      try {
        // Initialize Fabric.js canvas
        const canvas = new fabric.Canvas("fabric-canvas", {
          width: canvasSize.width,
          height: canvasSize.height,
          backgroundColor: "#ffffff",
          preserveObjectStacking: true,
          selection: true,
        })

        fabricCanvasRef.current = canvas
        console.log("Fabric.js canvas initialized successfully")

        // Set up event handlers
        canvas.on("selection:created", handleObjectSelected)
        canvas.on("selection:updated", handleObjectSelected)
        canvas.on("selection:cleared", () => setSelectedLogoIndex(null))
        canvas.on("object:modified", saveCanvasState)
        canvas.on("object:added", saveCanvasState)

        // Initialize part history if needed
        if (!canvasHistory[selectedPart]) {
          setCanvasHistory((prev) => ({
            ...prev,
            [selectedPart]: [JSON.stringify(canvas.toJSON())],
          }))

          setHistoryIndex((prev) => ({
            ...prev,
            [selectedPart]: 0,
          }))
        }

        // Load existing texture if available
        if (canvasTextures[selectedPart]) {
          // Important: Load the existing texture as background image
          fabric.Image.fromURL(
            canvasTextures[selectedPart],
            (img) => {
              // Instead of setting as background, add as a locked bottom layer
              img.set({
                selectable: false,
                evented: false,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,
                lockScalingX: true,
                lockScalingY: true,
                hasControls: false,
                hasBorders: false,
                name: "base-texture",
                excludeFromExport: false, // Make sure it's included in export
              })

              // Scale to fit canvas
              img.scaleToWidth(canvas.width)
              img.scaleToHeight(canvas.height)

              // Add to canvas and send to back
              canvas.add(img)
              canvas.sendToBack(img)
              canvas.renderAll()

              // Save this state to history
              saveCanvasState()
            },
            { crossOrigin: "anonymous" },
          )
        }

        return canvas
      } catch (error) {
        console.error("Error initializing Fabric.js canvas:", error)
        return null
      }
    }

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
          <button className="texture-editor-tool" onClick={onClose} data-tooltip="Close Editor">
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
  },
)

export default TextureEditor

