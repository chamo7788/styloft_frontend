import { useState, useRef, useCallback, useMemo } from "react"
import ModelViewer from "./ModelViewer"
import TextureEditor from "./texture-editor/TextureEditor"
import ControlPanel from "./ControlPanel"
import Toolbar from "./Toolbar"
import "../../assets/css/StyleStudio/text-editor.css"
import "../../assets/css/StyleStudio/main.css"
import "../../assets/css/StyleStudio/new-features.css"

// Add LayerManager import at the top of the file
import LayerManager from "./LayerManager"

// Move constants outside component to prevent recreation on each render
const models = {
  shirt: "/models/shirt_baked.glb",
  trouser: "/models/1861_trousers.glb",
  short: "/models/man_shorts.glb",
  frock: "/models/ladies_black_frock.glb",
}

const modelParts = {
  shirt: ["body", "collar", "sleeves"],
  trouser: ["main", "pockets", "waistband"],
  short: ["main", "pockets"],
  frock: ["body", "sleeves", "collar"],
}

const modelSettings = {
  shirt: { scale: 6.5, position: [0, 0.5, 0] },
  trouser: { scale: 4, position: [0, -2.5, 0] },
  short: { scale: 4.5, position: [0, -3.3, 0] },
  frock: { scale: 3, position: [0, -4.2, 0] },
}

const uvMappings = {
  shirt: {
    body: { x: 0, y: 0, width: 1, height: 1 },
    collar: { x: 0, y: 0, width: 1, height: 0.2 },
    sleeves: { x: 0, y: 0, width: 1, height: 0.4 },
  },
  trouser: {
    main: { x: 0, y: 0, width: 1, height: 1 },
    pockets: { x: 0.2, y: 0.2, width: 0.6, height: 0.3 },
    waistband: { x: 0, y: 0, width: 1, height: 0.2 },
  },
  short: {
    main: { x: 0, y: 0, width: 1, height: 1 },
    pockets: { x: 0.2, y: 0.2, width: 0.6, height: 0.3 },
  },
  frock: {
    body: { x: 0, y: 0, width: 1, height: 1 },
    sleeves: { x: 0, y: 0, width: 1, height: 0.4 },
    collar: { x: 0, y: 0, width: 1, height: 0.2 },
  },
}

// Default state values
const defaultTextSettings = {
  text: "",
  fontSize: 24,
  color: "#000000",
  fontWeight: "normal",
  fontStyle: "normal",
  fontFamily: "Arial",
  textAlign: "center",
}

const defaultLogoSettings = {
  image: null,
  size: 1,
  position: [0, 0, 0.5],
  rotation: [0, 0, 0],
}

const defaultLighting = {
  intensity: 0.5,
  direction: [5, 5, 5],
  environment: "studio",
}

export default function ModelEditor() {
  const canvasRef = useRef(null)

  // Model state
  const [selectedModel, setSelectedModel] = useState("shirt")
  const [modelKey, setModelKey] = useState(0)
  const [selectedPart, setSelectedPart] = useState("body")

  // UI state
  const [activeTab, setActiveTab] = useState("model")
  const [showTextureEditor, setShowTextureEditor] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState("#f5f5f5")

  // Feature states
  const [colors, setColors] = useState({ main: "#ffffff" })
  const [materials, setMaterials] = useState({})
  const [textures, setTextures] = useState({})
  const [canvasTextures, setCanvasTextures] = useState({})
  const [lighting, setLighting] = useState(defaultLighting)

  // Text state
  const [textElements, setTextElements] = useState([])
  const [selectedTextIndex, setSelectedTextIndex] = useState(null)
  const [textSettings, setTextSettings] = useState(defaultTextSettings)

  // Logo state
  const [logoElements, setLogoElements] = useState([])
  const [selectedLogoIndex, setSelectedLogoIndex] = useState(null)
  const [logoSettings, setLogoSettings] = useState(defaultLogoSettings)

  // History for undo/redo
  const [history, setHistory] = useState([{ colors: { main: "#ffffff" }, materials: {} }])
  const [historyIndex, setHistoryIndex] = useState(0)

  // State for canvas objects from texture editor
  const [canvasObjects, setCanvasObjects] = useState([])
  const [selectedCanvasObjectIndex, setSelectedCanvasObjectIndex] = useState(null)

  // Memoize current model parts to prevent recalculation
  const currentModelParts = useMemo(() => modelParts[selectedModel], [selectedModel])

  // Add state for layer manager visibility
  const [showLayerManager, setShowLayerManager] = useState(false)

  const textureEditorRef = useRef(null)

  // Handle model change - optimized with useCallback
  const handleModelChange = useCallback((model) => {
    setSelectedModel(model)
    setModelKey((prevKey) => prevKey + 1)
    setSelectedPart(modelParts[model][0])

    // Reset colors and materials for new model
    const newColors = {}
    const newMaterials = {}
    const newCanvasTextures = {}

    modelParts[model].forEach((part) => {
      newColors[part] = "#ffffff"
      newCanvasTextures[part] = null
    })

    setColors(newColors)
    setMaterials(newMaterials)
    setCanvasTextures(newCanvasTextures)

    // Add to history
    addToHistory(newColors, newMaterials)
  }, [])

  // Handle color change - optimized with useCallback
  const handleColorChange = useCallback(
    (color) => {
      setColors((prev) => {
        const newColors = { ...prev, [selectedPart]: color }
        // Add to history
        addToHistory(newColors, materials)
        return newColors
      })
    },
    [selectedPart, materials],
  )

  // Handle material change - optimized with useCallback
  const handleMaterialChange = useCallback(
    (material) => {
      setMaterials((prev) => {
        const newMaterials = { ...prev, [selectedPart]: material }

        // Add to history
        addToHistory(colors, newMaterials)

        // If we have a texture editor open and a canvas, we need to update it
        if (showTextureEditor && textureEditorRef.current) {
          // This will trigger the texture editor to reload with the new material
          // while preserving any existing canvas objects
          textureEditorRef.current.loadMaterialAsBackground(material)
        }

        return newMaterials
      })
    },
    [selectedPart, colors, showTextureEditor, textureEditorRef],
  )

  // Add to history - optimized with useCallback
  const addToHistory = useCallback(
    (newColors, newMaterials) => {
      setHistory((prev) => {
        // Remove any future history if we're not at the end
        const newHistory = prev.slice(0, historyIndex + 1)
        // Add new state to history
        newHistory.push({ colors: { ...newColors }, materials: { ...newMaterials } })
        return newHistory
      })

      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex],
  )

  // Undo - optimized with useCallback
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const { colors: newColors, materials: newMaterials } = history[newIndex]

      setColors(newColors)
      setMaterials(newMaterials)
      setHistoryIndex(newIndex)
    }
  }, [historyIndex, history])

  // Redo - optimized with useCallback
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const { colors: newColors, materials: newMaterials } = history[newIndex]

      setColors(newColors)
      setMaterials(newMaterials)
      setHistoryIndex(newIndex)
    }
  }, [historyIndex, history])

  // Take screenshot - optimized with useCallback
  const handleScreenshot = useCallback(() => {
    if (canvasRef.current) {
      requestAnimationFrame(() => {
        const canvas = canvasRef.current
        const link = document.createElement("a")
        link.download = `${selectedModel}-design.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      })
    }
  }, [selectedModel])

  // Save design - optimized with useCallback
  const handleSaveDesign = useCallback(() => {
    // Capture canvas objects from texture editor if available
    let canvasData = {};
    let canvasHistoryData = {};
    
    if (textureEditorRef.current) {
      try {
        // Get all canvas objects data from texture editor
        canvasData = textureEditorRef.current.getAllCanvasData();
        canvasHistoryData = textureEditorRef.current.getCanvasHistory();
      } catch (error) {
        console.error("Error retrieving canvas data:", error);
      }
    }
  
    const design = {
      model: selectedModel,
      colors,
      materials,
      textElements,
      logoElements,
      lighting,
      backgroundColor,
      // Add canvas objects and layer information
      canvasData,
      canvasHistory: canvasHistoryData,
      // Add layer information  
      layers: {
        // Store zIndex and visibility states
        textLayers: textElements.map((element, index) => ({
          id: `text-${index}`,
          zIndex: element.zIndex || 200 + index,
          visible: element.visible !== false,
          locked: element.locked || false
        })),
        logoLayers: logoElements.map((element, index) => ({
          id: `logo-${index}`,
          zIndex: element.zIndex || 100 + index,
          visible: element.visible !== false,
          locked: element.locked || false
        })),
        // Store part visibility states
        parts: Object.keys(colors).map(part => ({
          id: part,
          visible: true // Add part visibility tracking if needed
        }))
      }
    };
  
    const blob = new Blob([JSON.stringify(design)], { type: "application/json" });
    const link = document.createElement("a");
    link.download = `${selectedModel}-design.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }, [selectedModel, colors, materials, textElements, logoElements, lighting, backgroundColor, textureEditorRef])

  // Load design - optimized with useCallback
  const handleLoadDesign = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const design = JSON.parse(e.target.result);
  
        setSelectedModel(design.model);
        setColors(design.colors);
        setMaterials(design.materials);
        setTextElements(design.textElements || []);
        setLogoElements(design.logoElements || []);
        setLighting(design.lighting || defaultLighting);
        setBackgroundColor(design.backgroundColor || "#f5f5f5");
  
        // Reset history
        setHistory([{ colors: design.colors, materials: design.materials }]);
        setHistoryIndex(0);
  
        // Force model reload
        setModelKey((prevKey) => prevKey + 1);
        
        // Load texture canvas data if available
        if (design.canvasData && textureEditorRef.current) {
          // Schedule this after the component has had time to initialize
          setTimeout(() => {
            try {
              textureEditorRef.current.loadCanvasData(design.canvasData);
              
              // Restore canvas history if available
              if (design.canvasHistory) {
                textureEditorRef.current.restoreCanvasHistory(design.canvasHistory);
              }
            } catch (error) {
              console.error("Error loading canvas data:", error);
            }
          }, 500); // Give time for the texture editor to initialize
        }
        
        // Apply layer properties if available
        if (design.layers) {
          // Update text and logo elements with saved layer properties
          if (design.layers.textLayers) {
            setTextElements(prev => 
              prev.map((elem, idx) => {
                const savedLayer = design.layers.textLayers[idx];
                if (savedLayer) {
                  return {
                    ...elem,
                    zIndex: savedLayer.zIndex || elem.zIndex,
                    visible: savedLayer.visible,
                    locked: savedLayer.locked
                  };
                }
                return elem;
              })
            );
          }
          
          if (design.layers.logoLayers) {
            setLogoElements(prev => 
              prev.map((elem, idx) => {
                const savedLayer = design.layers.logoLayers[idx];
                if (savedLayer) {
                  return {
                    ...elem,
                    zIndex: savedLayer.zIndex || elem.zIndex,
                    visible: savedLayer.visible,
                    locked: savedLayer.locked
                  };
                }
                return elem;
              })
            );
          }
        }
      } catch (error) {
        console.error("Failed to load design:", error);
        alert("Failed to load design. The file might be corrupted.");
      }
    };
    reader.readAsText(file);
  }, [textureEditorRef]);

  // Text handling functions - optimized with useCallback
  const handleTextSelect = useCallback(
    (index) => {
      setSelectedTextIndex(index)
      setSelectedLogoIndex(null)
      setActiveTab("text") // Switch to text tab when text is selected

      if (index !== null) {
        const element = textElements[index]
        setTextSettings({
          text: element.text,
          fontSize: element.fontSize || 24,
          color: element.color || "#000000",
          fontWeight: element.fontWeight || "normal",
          fontStyle: element.fontStyle || "normal",
          fontFamily: element.fontFamily || "Arial",
          textAlign: element.textAlign || "center",
        })
      }
    },
    [textElements],
  )

  const handleUpdateText = useCallback((index, updatedText) => {
    setTextElements((prev) => {
      const newElements = [...prev]
      newElements[index] = updatedText
      return newElements
    })
  }, [])

  const handleAddText = useCallback(() => {
    if (textSettings.text.trim()) {
      // Default position for front of shirt
      const position = [0, 0, 0.5] // Slightly in front of the model

      const newTextElement = {
        ...textSettings,
        position,
      }

      setTextElements((prev) => [...prev, newTextElement])
      setSelectedTextIndex((prev) => prev.length) // Select the newly added text
      setShowTextureEditor(true) // Show the text editor
    }
  }, [textSettings])

  const handleRemoveText = useCallback((index) => {
    setTextElements((prev) => {
      const newElements = [...prev]
      newElements.splice(index, 1)
      return newElements
    })

    setSelectedTextIndex((prev) => {
      if (prev === index) return null
      if (prev > index) return prev - 1
      return prev
    })
  }, [])

  const handleTextSettingsChange = useCallback(
    (setting, value) => {
      setTextSettings((prev) => ({
        ...prev,
        [setting]: value,
      }))

      if (selectedTextIndex !== null) {
        setTextElements((prev) => {
          const newElements = [...prev]
          newElements[selectedTextIndex] = {
            ...newElements[selectedTextIndex],
            [setting]: value,
          }
          return newElements
        })
      }
    },
    [selectedTextIndex],
  )

  // Logo handling functions - optimized with useCallback
  const handleLogoSelect = useCallback(
    (index) => {
      setSelectedLogoIndex(index)
      setSelectedTextIndex(null)
      setActiveTab("logo")

      if (index !== null) {
        const element = logoElements[index]
        setLogoSettings({
          image: element.image,
          size: element.size || 1,
          position: element.position || [0, 0, 0.5],
          rotation: element.rotation || [0, 0, 0],
        })
      }
    },
    [logoElements],
  )

  const handleUpdateLogo = useCallback((index, updatedLogo) => {
    setLogoElements((prev) => {
      const newElements = [...prev]
      newElements[index] = updatedLogo
      return newElements
    })
  }, [])

  const handleAddLogo = useCallback(
    (logoData) => {
      const newLogoElement = {
        ...logoSettings,
        ...logoData,
      }

      setLogoElements((prev) => [...prev, newLogoElement])
      setSelectedLogoIndex((prev) => prev.length)
      setShowTextureEditor(true)
    },
    [logoSettings],
  )

  const handleRemoveLogo = useCallback((index) => {
    setLogoElements((prev) => {
      const newElements = [...prev]
      newElements.splice(index, 1)
      return newElements
    })

    setSelectedLogoIndex((prev) => {
      if (prev === index) return null
      if (prev > index) return prev - 1
      return prev
    })
  }, [])

  const handleLogoSettingsChange = useCallback(
    (setting, value) => {
      setLogoSettings((prev) => ({
        ...prev,
        [setting]: value,
      }))

      if (selectedLogoIndex !== null) {
        setLogoElements((prev) => {
          const newElements = [...prev]
          newElements[selectedLogoIndex] = {
            ...newElements[selectedLogoIndex],
            [setting]: value,
          }
          return newElements
        })
      }
    },
    [selectedLogoIndex],
  )

  const handleUpdateLogoPosition = useCallback(
    (position) => {
      if (selectedLogoIndex === null) return

      setLogoElements((prev) => {
        const newElements = [...prev]
        newElements[selectedLogoIndex] = {
          ...newElements[selectedLogoIndex],
          position,
        }
        return newElements
      })
    },
    [selectedLogoIndex],
  )

  const handleUpdateLogoRotation = useCallback(
    (rotation) => {
      if (selectedLogoIndex === null) return

      setLogoElements((prev) => {
        const newElements = [...prev]
        newElements[selectedLogoIndex] = {
          ...newElements[selectedLogoIndex],
          rotation,
        }
        return newElements
      })
    },
    [selectedLogoIndex],
  )

  const toggleTextureEditor = useCallback(() => {
    setShowTextureEditor((prev) => !prev)

    // If we're opening the texture editor, make sure we have a part selected
    if (!showTextureEditor) {
      if (!selectedPart && modelParts[selectedModel].length > 0) {
        setSelectedPart(modelParts[selectedModel][0])
      }

      // If we're opening the texture editor, switch to the texture tab
      setActiveTab("texture")

      // Ensure the current material is loaded when opening the editor
      if (textureEditorRef.current && materials[selectedPart]) {
        // Small delay to ensure the editor is fully mounted
        setTimeout(() => {
          textureEditorRef.current.loadMaterialAsBackground(materials[selectedPart])
        }, 100)
      }
    }
  }, [showTextureEditor, selectedPart, modelParts, selectedModel, materials, textureEditorRef])

  const handleLoadTemplate = useCallback(
    (templateDesign, templateModel) => {
      if (templateModel !== selectedModel) {
        setSelectedModel(templateModel)
        setModelKey((prevKey) => prevKey + 1)
      }

      // Load design properties
      if (templateDesign.colors) setColors(templateDesign.colors)
      if (templateDesign.materials) setMaterials(templateDesign.materials)
      if (templateDesign.textElements) setTextElements(templateDesign.textElements)
      if (templateDesign.logoElements) setLogoElements(templateDesign.logoElements)
      if (templateDesign.lighting) setLighting(templateDesign.lighting)
      if (templateDesign.backgroundColor) setBackgroundColor(templateDesign.backgroundColor)

      // Reset history
      setHistory([{ colors: templateDesign.colors, materials: templateDesign.materials }])
      setHistoryIndex(0)
    },
    [selectedModel],
  )

  // Handle canvas objects changes from texture editor
  const handleCanvasObjectsChange = (objects, part) => {
    if (part === selectedPart) {
      setCanvasObjects(objects)
    }
  }

  // Handle canvas object selection
  const handleSelectCanvasObject = (index) => {
    setSelectedCanvasObjectIndex(index)
    if (textureEditorRef.current) {
      textureEditorRef.current.selectObject(index)
    }
  }

  // Handle moving canvas object forward
  const handleMoveCanvasObjectForward = (index) => {
    if (textureEditorRef.current && textureEditorRef.current.moveObjectForward) {
      textureEditorRef.current.moveObjectForward(index)
    }
  }

  // Handle moving canvas object backward
  const handleMoveCanvasObjectBackward = (index) => {
    if (textureEditorRef.current && textureEditorRef.current.moveObjectBackward) {
      textureEditorRef.current.moveObjectBackward(index)
    }
  }

  // Handle bringing canvas object to front
  const handleBringCanvasObjectToFront = (index) => {
    if (textureEditorRef.current && textureEditorRef.current.bringObjectToFront) {
      textureEditorRef.current.bringObjectToFront(index)
    }
  }

  // Handle sending canvas object to back
  const handleSendCanvasObjectToBack = (index) => {
    if (textureEditorRef.current && textureEditorRef.current.sendObjectToBack) {
      textureEditorRef.current.sendObjectToBack(index)
    }
  }

  // Add these functions to handle layer management
  const handleUpdateTextElement = useCallback((index, updatedText) => {
    setTextElements((prev) => {
      const newElements = [...prev]
      newElements[index] = updatedText
      return newElements
    })
  }, [])

  const handleUpdateLogoElement = useCallback((index, updatedLogo) => {
    setLogoElements((prev) => {
      const newElements = [...prev]
      newElements[index] = updatedLogo
      return newElements
    })
  }, [])

  const handleReorderLayers = useCallback((layer1, layer2) => {
    // This function is called after the layer positions have been updated
    // We can use it to trigger a re-render or perform additional actions
    setModelKey((prevKey) => prevKey + 1) // Force model to re-render
  }, [])

  // Add toggle function for layer manager
  const toggleLayerManager = useCallback(() => {
    setShowLayerManager((prev) => !prev)
  }, [])

  // Update the return statement to include the LayerManager component
  return (
    <div className="model-editor-container">
      <div className={`model-view-container ${showTextureEditor ? "with-editor" : ""}`}>
        <div className="canvas-card" style={{ backgroundColor }}>
          <Toolbar
            onRotate={() => {}} // Will be handled by ModelViewer
            onUndo={handleUndo}
            onRedo={handleRedo}
            onScreenshot={handleScreenshot}
            onSaveDesign={handleSaveDesign}
            onLoadDesign={handleLoadDesign}
            onToggleLayerManager={toggleLayerManager}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            showLayerManager={showLayerManager}
          />

          <div className="canvas-content">
            <ModelViewer
              ref={canvasRef}
              modelKey={modelKey}
              selectedModel={selectedModel}
              modelPath={models[selectedModel]}
              colors={colors}
              materials={materials}
              modelSettings={modelSettings}
              modelParts={modelParts}
              selectedPart={selectedPart}
              setSelectedPart={setSelectedPart}
              textElements={textElements}
              selectedTextIndex={selectedTextIndex}
              onTextSelect={handleTextSelect}
              logoElements={logoElements}
              selectedLogoIndex={selectedLogoIndex}
              onLogoSelect={handleLogoSelect}
              textures={textures}
              lighting={lighting}
            />
          </div>

          {selectedPart && (
            <div className="part-indicator">
              Selected part: <span className="part-name">{selectedPart}</span>
            </div>
          )}

          {showLayerManager && (
            <div className="layer-manager-overlay">
              <LayerManager
                textElements={textElements}
                logoElements={logoElements}
                materials={materials}
                colors={colors}
                selectedPart={selectedPart}
                onUpdateTextElement={handleUpdateTextElement}
                onRemoveTextElement={handleRemoveText}
                onDuplicateTextElement={(index) => {
                  const element = textElements[index]
                  setTextElements((prev) => [
                    ...prev,
                    {
                      ...element,
                      position: [element.position[0], element.position[1] + 0.1, element.position[2] + 0.1],
                      zIndex: (element.zIndex || 0) + 1,
                    },
                  ])
                }}
                onUpdateLogoElement={handleUpdateLogoElement}
                onRemoveLogoElement={handleRemoveLogo}
                onDuplicateLogoElement={(index) => {
                  const element = logoElements[index]
                  setLogoElements((prev) => [
                    ...prev,
                    {
                      ...element,
                      position: [element.position[0], element.position[1] + 0.1, element.position[2] + 0.1],
                      zIndex: (element.zIndex || 0) + 1,
                    },
                  ])
                }}
                onSelectTextElement={handleTextSelect}
                onSelectLogoElement={handleLogoSelect}
                selectedTextIndex={selectedTextIndex}
                selectedLogoIndex={selectedLogoIndex}
                onReorderLayers={handleReorderLayers}
                onToggleTextureEditor={toggleTextureEditor}
                canvasObjects={canvasObjects}
                onMoveCanvasObjectForward={handleMoveCanvasObjectForward}
                onMoveCanvasObjectBackward={handleMoveCanvasObjectBackward}
                onBringCanvasObjectToFront={handleBringCanvasObjectToFront}
                onSendCanvasObjectToBack={handleSendCanvasObjectToBack}
                onSelectCanvasObject={handleSelectCanvasObject}
                selectedCanvasObjectIndex={selectedCanvasObjectIndex}
              />
            </div>
          )}
        </div>

        {showTextureEditor && (
          <TextureEditor
            ref={textureEditorRef}
            selectedModel={selectedModel}
            selectedPart={selectedPart}
            uvMappings={uvMappings}
            textElements={textElements}
            textSettings={textSettings}
            onTextSettingsChange={handleTextSettingsChange}
            canvasTextures={canvasTextures}
            setCanvasTextures={setCanvasTextures}
            setTextures={setTextures}
            logoElements={logoElements}
            logoSettings={logoSettings}
            onLogoSettingsChange={handleLogoSettingsChange}
            onClose={toggleTextureEditor}
            onCanvasObjectsChange={handleCanvasObjectsChange}
          />
        )}
      </div>

      <ControlPanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        selectedPart={selectedPart}
        setSelectedPart={setSelectedPart}
        modelParts={currentModelParts}
        colors={colors}
        onColorChange={handleColorChange}
        materials={materials}
        onMaterialChange={handleMaterialChange}
        showTextureEditor={showTextureEditor}
        toggleTextureEditor={toggleTextureEditor}
        textElements={textElements}
        selectedTextIndex={selectedTextIndex}
        onTextSelect={handleTextSelect}
        onRemoveText={handleRemoveText}
        logoElements={logoElements}
        selectedLogoIndex={selectedLogoIndex}
        onLogoSelect={handleLogoSelect}
        onAddLogo={handleAddLogo}
        onRemoveLogo={handleRemoveLogo}
        onUpdateLogo={handleUpdateLogo}
        onUpdateLogoPosition={handleUpdateLogoPosition}
        onUpdateLogoRotation={handleUpdateLogoRotation}
        lighting={lighting}
        setLighting={setLighting}
        onLoadTemplate={handleLoadTemplate}
      />
    </div>
  )
}

