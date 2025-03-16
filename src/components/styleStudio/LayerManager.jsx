import { useState, useEffect } from "react"
import {
  Layers,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Edit,
  Image,
  Type,
  Palette,
  Grid,
} from "lucide-react"

const LayerManager = ({
  textElements,
  logoElements,
  materials,
  colors,
  selectedPart,
  onUpdateTextElement,
  onRemoveTextElement,
  onDuplicateTextElement,
  onUpdateLogoElement,
  onRemoveLogoElement,
  onDuplicateLogoElement,
  onSelectTextElement,
  onSelectLogoElement,
  selectedTextIndex,
  selectedLogoIndex,
  onReorderLayers,
  onToggleTextureEditor,
  canvasObjects = [], // Canvas objects from texture editor
  onMoveCanvasObjectForward, // Function to move canvas object forward
  onMoveCanvasObjectBackward, // Function to move canvas object backward
  onBringCanvasObjectToFront, // Function to bring canvas object to front
  onSendCanvasObjectToBack, // Function to send canvas object to back
  onSelectCanvasObject, // Function to select a canvas object
  selectedCanvasObjectIndex, // Currently selected canvas object index
}) => {
  // Combine all elements into a single layers array with type and index information
  const [layers, setLayers] = useState([])
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(null)
  const [draggedLayerIndex, setDraggedLayerIndex] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState({
    logos: true,
    text: true,
    textures: true,
    colors: false,
    canvasObjects: true, // Add this line
  })

  // State for canvas objects
  const [selectedCanvasObjectIdx, setSelectedCanvasObjectIdx] = useState(null)

  // Update selected canvas object when selection changes
  useEffect(() => {
    if (selectedCanvasObjectIndex !== null && selectedCanvasObjectIndex !== undefined) {
      setSelectedCanvasObjectIdx(selectedCanvasObjectIndex)
    }
  }, [selectedCanvasObjectIndex])

  // Update layers when elements change
  useEffect(() => {
    const newLayers = []

    // Add logo elements
    logoElements.forEach((logo, index) => {
      newLayers.push({
        id: `logo-${index}`,
        type: "logo",
        originalIndex: index,
        element: logo,
        name: `Logo ${index + 1}`,
        visible: logo.visible !== false,
        locked: logo.locked || false,
        zIndex: logo.zIndex || 100 + index,
      })
    })

    // Add text elements
    textElements.forEach((text, index) => {
      newLayers.push({
        id: `text-${index}`,
        type: "text",
        originalIndex: index,
        element: text,
        name: text.text || `Text ${index + 1}`,
        visible: text.visible !== false,
        locked: text.locked || false,
        zIndex: text.zIndex || 200 + index,
      })
    })

    // Add material/texture layers
    Object.entries(materials).forEach(([part, material], index) => {
      if (material) {
        newLayers.push({
          id: `texture-${part}`,
          type: "texture",
          part: part,
          element: material,
          name: `${part.charAt(0).toUpperCase() + part.slice(1)} Texture`,
          visible: true,
          locked: false,
          zIndex: 50 + index,
        })
      }
    })

    // Add color layers
    Object.entries(colors).forEach(([part, color], index) => {
      if (color) {
        newLayers.push({
          id: `color-${part}`,
          type: "color",
          part: part,
          element: color,
          name: `${part.charAt(0).toUpperCase() + part.slice(1)} Color`,
          visible: true,
          locked: false,
          zIndex: index,
        })
      }
    })

    // Sort layers by z-index (highest first)
    newLayers.sort((a, b) => b.zIndex - a.zIndex)

    setLayers(newLayers)
  }, [textElements, logoElements, materials, colors])

  // Update selected layer when text or logo selection changes
  useEffect(() => {
    if (selectedTextIndex !== null) {
      const layerIndex = layers.findIndex((layer) => layer.type === "text" && layer.originalIndex === selectedTextIndex)
      setSelectedLayerIndex(layerIndex)
    } else if (selectedLogoIndex !== null) {
      const layerIndex = layers.findIndex((layer) => layer.type === "logo" && layer.originalIndex === selectedLogoIndex)
      setSelectedLayerIndex(layerIndex)
    }
  }, [selectedTextIndex, selectedLogoIndex, layers])

  const handleLayerSelect = (index) => {
    const layer = layers[index]

    if (layer.locked) return

    setSelectedLayerIndex(index)

    if (layer.type === "text") {
      onSelectTextElement(layer.originalIndex)
    } else if (layer.type === "logo") {
      onSelectLogoElement(layer.originalIndex)
    } else if (layer.type === "texture" || layer.type === "color") {
      // For textures and colors, we might want to select the part
      // This depends on how your app handles part selection
    }
  }

  const handleCanvasObjectSelect = (index) => {
    setSelectedCanvasObjectIdx(index)
    if (onSelectCanvasObject) {
      onSelectCanvasObject(index)
    }
  }

  const handleToggleVisibility = (index) => {
    const layer = layers[index]
    const newVisibility = !layer.visible

    if (layer.type === "text") {
      const updatedElement = { ...layer.element, visible: newVisibility }
      onUpdateTextElement(layer.originalIndex, updatedElement)
    } else if (layer.type === "logo") {
      const updatedElement = { ...layer.element, visible: newVisibility }
      onUpdateLogoElement(layer.originalIndex, updatedElement)
    }
    // For textures and colors, visibility toggling would need custom handlers
  }

  const handleToggleLock = (index) => {
    const layer = layers[index]
    const newLockState = !layer.locked

    if (layer.type === "text") {
      const updatedElement = { ...layer.element, locked: newLockState }
      onUpdateTextElement(layer.originalIndex, updatedElement)
    } else if (layer.type === "logo") {
      const updatedElement = { ...layer.element, locked: newLockState }
      onUpdateLogoElement(layer.originalIndex, updatedElement)
    }
    // For textures and colors, locking would need custom handlers
  }

  const handleRemoveLayer = (index) => {
    const layer = layers[index]

    if (layer.locked) return

    if (layer.type === "text") {
      onRemoveTextElement(layer.originalIndex)
    } else if (layer.type === "logo") {
      onRemoveLogoElement(layer.originalIndex)
    }
    // For textures and colors, removal would need custom handlers
  }

  const handleDuplicateLayer = (index) => {
    const layer = layers[index]

    if (layer.type === "text") {
      onDuplicateTextElement(layer.originalIndex)
    } else if (layer.type === "logo") {
      onDuplicateLogoElement(layer.originalIndex)
    }
    // For textures and colors, duplication would need custom handlers
  }

  const handleEditLayer = (index) => {
    const layer = layers[index]

    if (layer.locked) return

    handleLayerSelect(index)

    if (layer.type === "text" || layer.type === "logo" || layer.type === "texture") {
      onToggleTextureEditor()
    }
  }

  // Update the handleMoveLayer function to properly handle z-index changes
  const handleMoveLayer = (index, direction) => {
    // Find the current layer and the adjacent layer to swap with
    const currentLayer = layers[index]
    const adjacentIndex = direction === "up" ? index - 1 : index + 1

    // Check if the move is valid
    if (adjacentIndex < 0 || adjacentIndex >= layers.length) return

    const adjacentLayer = layers[adjacentIndex]

    // Swap z-indices
    const currentZIndex = currentLayer.zIndex
    const adjacentZIndex = adjacentLayer.zIndex

    if (currentLayer.type === "text") {
      const updatedCurrentElement = {
        ...currentLayer.element,
        zIndex: adjacentZIndex,
        position: [
          currentLayer.element.position[0],
          currentLayer.element.position[1],
          direction === "up" ? currentLayer.element.position[2] + 0.1 : currentLayer.element.position[2] - 0.1,
        ],
      }
      const updatedAdjacentElement = {
        ...adjacentLayer.element,
        zIndex: currentZIndex,
        position: [
          adjacentLayer.element.position[0],
          adjacentLayer.element.position[1],
          direction === "up" ? adjacentLayer.element.position[2] - 0.1 : adjacentLayer.element.position[2] + 0.1,
        ],
      }

      onUpdateTextElement(currentLayer.originalIndex, updatedCurrentElement)
      onUpdateTextElement(adjacentLayer.originalIndex, updatedAdjacentElement)
    } else if (currentLayer.type === "logo") {
      const updatedCurrentElement = {
        ...currentLayer.element,
        zIndex: adjacentZIndex,
        position: [
          currentLayer.element.position[0],
          currentLayer.element.position[1],
          direction === "up" ? currentLayer.element.position[2] + 0.1 : currentLayer.element.position[2] - 0.1,
        ],
      }
      const updatedAdjacentElement = {
        ...adjacentLayer.element,
        zIndex: currentZIndex,
        position: [
          adjacentLayer.element.position[0],
          adjacentLayer.element.position[1],
          direction === "up" ? adjacentLayer.element.position[2] - 0.1 : adjacentLayer.element.position[2] + 0.1,
        ],
      }

      onUpdateLogoElement(currentLayer.originalIndex, updatedCurrentElement)
      onUpdateLogoElement(adjacentLayer.originalIndex, updatedAdjacentElement)
    }

    // Call the reorder callback if provided
    if (onReorderLayers) {
      onReorderLayers(currentLayer, adjacentLayer)
    }
  }

  const handleDragStart = (e, index) => {
    if (layers[index].locked) return

    setDraggedLayerIndex(index)
    setIsDragging(true)

    // Set drag image (optional)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move"

      // Create a custom drag image
      const dragImage = document.createElement("div")
      dragImage.className = "layer-drag-image"
      dragImage.textContent = layers[index].name
      document.body.appendChild(dragImage)

      e.dataTransfer.setDragImage(dragImage, 0, 0)

      // Clean up the element after drag
      setTimeout(() => {
        document.body.removeChild(dragImage)
      }, 0)
    }
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()

    if (draggedLayerIndex === null || draggedLayerIndex === index) return

    // Highlight the drop target
    e.currentTarget.classList.add("layer-drop-target")
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("layer-drop-target")
  }

  // Update the handleDrop function to properly handle z-index changes during drag and drop
  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    e.currentTarget.classList.remove("layer-drop-target")

    if (draggedLayerIndex === null || draggedLayerIndex === dropIndex) return

    const draggedLayer = layers[draggedLayerIndex]
    const dropLayer = layers[dropIndex]

    // Only allow reordering within the same type
    if (draggedLayer.type !== dropLayer.type) return

    // Swap z-indices
    const draggedZIndex = draggedLayer.zIndex
    const dropZIndex = dropLayer.zIndex

    // Calculate new z-position based on whether we're moving up or down
    const movingUp = draggedLayerIndex > dropIndex
    const zDelta = 0.1

    if (draggedLayer.type === "text") {
      const updatedDraggedElement = {
        ...draggedLayer.element,
        zIndex: dropZIndex,
        position: [
          draggedLayer.element.position[0],
          draggedLayer.element.position[1],
          movingUp ? draggedLayer.element.position[2] + zDelta : draggedLayer.element.position[2] - zDelta,
        ],
      }
      const updatedDropElement = {
        ...dropLayer.element,
        zIndex: draggedZIndex,
        position: [
          dropLayer.element.position[0],
          dropLayer.element.position[1],
          movingUp ? dropLayer.element.position[2] - zDelta : dropLayer.element.position[2] + zDelta,
        ],
      }

      onUpdateTextElement(draggedLayer.originalIndex, updatedDraggedElement)
      onUpdateTextElement(dropLayer.originalIndex, updatedDropElement)
    } else if (draggedLayer.type === "logo") {
      const updatedDraggedElement = {
        ...draggedLayer.element,
        zIndex: dropZIndex,
        position: [
          draggedLayer.element.position[0],
          draggedLayer.element.position[1],
          movingUp ? draggedLayer.element.position[2] + zDelta : draggedLayer.element.position[2] - zDelta,
        ],
      }
      const updatedDropElement = {
        ...dropLayer.element,
        zIndex: draggedZIndex,
        position: [
          dropLayer.element.position[0],
          dropLayer.element.position[1],
          movingUp ? dropLayer.element.position[2] - zDelta : dropLayer.element.position[2] + zDelta,
        ],
      }

      onUpdateLogoElement(draggedLayer.originalIndex, updatedDraggedElement)
      onUpdateLogoElement(dropLayer.originalIndex, updatedDropElement)
    }

    // Call the reorder callback if provided
    if (onReorderLayers) {
      onReorderLayers(draggedLayer, dropLayer)
    }

    setDraggedLayerIndex(null)
    setIsDragging(false)
  }

  const handleDragEnd = () => {
    setDraggedLayerIndex(null)
    setIsDragging(false)
  }

  const toggleGroupExpansion = (group) => {
    setExpandedGroups({
      ...expandedGroups,
      [group]: !expandedGroups[group],
    })
  }

  // Add a merging capability to the layer system
  const handleMergeLayers = (layerIds) => {
    // This would combine multiple layers into one when requested
    const selectedLayers = layers.filter((layer) => layerIds.includes(layer.id))

    // Combining process would depend on layer types
    // For example, merging a texture layer with a logo layer would
    // bake the logo into the texture
  }

  // Group layers by type
  const logoLayers = layers.filter((layer) => layer.type === "logo")
  const textLayers = layers.filter((layer) => layer.type === "text")
  const textureLayers = layers.filter((layer) => layer.type === "texture")
  const colorLayers = layers.filter((layer) => layer.type === "color")

  // Helper function to render layer icon based on type
  const renderLayerIcon = (layer) => {
    switch (layer.type) {
      case "logo":
        return <Image size={16} />
      case "text":
        return <Type size={16} />
      case "texture":
        return <Grid size={16} />
      case "color":
        return <Palette size={16} />
      default:
        return <Layers size={16} />
    }
  }

  // Add visual indicators for combined layers
  const renderLayerWithComposites = (layer) => {
    const hasComposites = layer.compositeLayers && layer.compositeLayers.length > 0
    return (
      <div className={`layer-item ${hasComposites ? "has-composites" : ""}`}>
        {renderLayerIcon(layer)}
        <span className="layer-name">{layer.name}</span>
        {hasComposites && <span className="layer-composite-indicator">{layer.compositeLayers.length} elements</span>}
      </div>
    )
  }

  // Move a layer forward (increase z-index)
  const handleMoveForward = (index) => {
    const layer = layers[index]
    const zDelta = 0.2 // Larger delta for more noticeable change

    if (layer.type === "text") {
      const updatedElement = {
        ...layer.element,
        zIndex: (layer.element.zIndex || 0) + 10,
        position: [layer.element.position[0], layer.element.position[1], (layer.element.position[2] || 0) + zDelta],
      }
      onUpdateTextElement(layer.originalIndex, updatedElement)
    } else if (layer.type === "logo") {
      const updatedElement = {
        ...layer.element,
        zIndex: (layer.element.zIndex || 0) + 10,
        position: [layer.element.position[0], layer.element.position[1], (layer.element.position[2] || 0) + zDelta],
      }
      onUpdateLogoElement(layer.originalIndex, updatedElement)
    }

    // Force refresh of layers
    if (onReorderLayers) {
      onReorderLayers(layer, null)
    }
  }

  // Move a layer backward (decrease z-index)
  const handleMoveBackward = (index) => {
    const layer = layers[index]
    const zDelta = 0.2 // Larger delta for more noticeable change

    if (layer.type === "text") {
      const updatedElement = {
        ...layer.element,
        zIndex: (layer.element.zIndex || 0) - 10,
        position: [layer.element.position[0], layer.element.position[1], (layer.element.position[2] || 0) - zDelta],
      }
      onUpdateTextElement(layer.originalIndex, updatedElement)
    } else if (layer.type === "logo") {
      const updatedElement = {
        ...layer.element,
        zIndex: (layer.element.zIndex || 0) - 10,
        position: [layer.element.position[0], layer.element.position[1], (layer.element.position[2] || 0) - zDelta],
      }
      onUpdateLogoElement(layer.originalIndex, updatedElement)
    }

    // Force refresh of layers
    if (onReorderLayers) {
      onReorderLayers(layer, null)
    }
  }

  // Bring a layer to the front (highest z-index)
  const handleBringToFront = (index) => {
    const layer = layers[index]

    // Find the highest z-index in the same type of layers
    const sameTypeLayers = layers.filter((l) => l.type === layer.type)
    const highestZIndex =
      Math.max(
        ...sameTypeLayers.map((l) =>
          l.element.zIndex !== undefined ? l.element.zIndex : l.element.position?.[2] || 0,
        ),
      ) + 20

    const zPosition = Math.max(...sameTypeLayers.map((l) => l.element.position?.[2] || 0)) + 0.5

    if (layer.type === "text") {
      const updatedElement = {
        ...layer.element,
        zIndex: highestZIndex,
        position: [layer.element.position[0], layer.element.position[1], zPosition],
      }
      onUpdateTextElement(layer.originalIndex, updatedElement)
    } else if (layer.type === "logo") {
      const updatedElement = {
        ...layer.element,
        zIndex: highestZIndex,
        position: [layer.element.position[0], layer.element.position[1], zPosition],
      }
      onUpdateLogoElement(layer.originalIndex, updatedElement)
    }

    // Force refresh of layers
    if (onReorderLayers) {
      onReorderLayers(layer, null)
    }
  }

  // Send a layer to the back (lowest z-index)
  const handleSendToBack = (index) => {
    const layer = layers[index];
    const sameTypeLayers = layers.filter(l => l.type === layer.type);
    
    // Use reduce to find minimum values in a single pass
    const { minZIndex, minPosition } = sameTypeLayers.reduce((acc, l) => {
      const zIndex = l.element.zIndex ?? l.element.position?.[2] ?? 0;
      const position = l.element.position?.[2] ?? 0;
      
      return {
        minZIndex: Math.min(acc.minZIndex, zIndex),
        minPosition: Math.min(acc.minPosition, position)
      };
    }, { minZIndex: Infinity, minPosition: Infinity });
    
    // Calculate new values with offset
    const newZIndex = minZIndex - 20;
    const newPosition = minPosition - 0.5;
    
    // Create updated element
    const updatedElement = {
      ...layer.element,
      zIndex: newZIndex,
      position: [
        layer.element.position[0], 
        layer.element.position[1], 
        newPosition
      ]
    };
    
    // Use the appropriate update function based on layer type
    const updateFn = layer.type === "text" ? onUpdateTextElement : onUpdateLogoElement;
    updateFn(layer.originalIndex, updatedElement);
    
    // Force refresh layers
    onReorderLayers?.(layer, null);
  }

  return (
    <div className="layer-manager">
      <div className="layer-manager-header">
        <h3 className="layer-manager-title">
          <Layers size={16} />
          <span>Layers</span>
        </h3>
      </div>

      <div className="layer-groups">
        {/* Logo Layers Group */}
        {logoLayers.length > 0 && (
          <div className="layer-group">
            <div className="layer-group-header" onClick={() => toggleGroupExpansion("logos")}>
              <div className="group-title">
                <Image size={16} />
                <span>Logos</span>
                <span className="group-count">{logoLayers.length}</span>
              </div>
              <button className="group-toggle">
                {expandedGroups.logos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedGroups.logos && (
              <div className="layer-list">
                {logoLayers.map((layer, index) => {
                  const isSelected = selectedLayerIndex !== null && layers[selectedLayerIndex].id === layer.id

                  return (
                    <div
                      key={layer.id}
                      className={`layer-item ${isSelected ? "selected" : ""} ${layer.locked ? "locked" : ""}`}
                      onClick={() => handleLayerSelect(layers.indexOf(layer))}
                      draggable={!layer.locked}
                      onDragStart={(e) => handleDragStart(e, layers.indexOf(layer))}
                      onDragOver={(e) => handleDragOver(e, layers.indexOf(layer))}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, layers.indexOf(layer))}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="layer-info">
                        {renderLayerIcon(layer)}
                        <span className="layer-name">{layer.name}</span>
                      </div>

                      <div className="layer-actions">
                        <button
                          className="layer-action visibility-toggle"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleVisibility(layers.indexOf(layer))
                          }}
                          title={layer.visible ? "Hide" : "Show"}
                        >
                          {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>

                        <button
                          className="layer-action lock-toggle"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleLock(layers.indexOf(layer))
                          }}
                          title={layer.locked ? "Unlock" : "Lock"}
                        >
                          {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>

                        {/* Add explicit forward/backward buttons */}
                        <button
                          className="layer-action move-forward"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMoveForward(layers.indexOf(layer))
                          }}
                          title="Bring Forward"
                          disabled={layer.locked || index === 0}
                        >
                          <ChevronUp size={14} />
                        </button>

                        <button
                          className="layer-action move-backward"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMoveBackward(layers.indexOf(layer))
                          }}
                          title="Send Backward"
                          disabled={
                            layer.locked ||
                            index === (layer.type === "logo" ? logoLayers.length - 1 : textLayers.length - 1)
                          }
                        >
                          <ChevronDown size={14} />
                        </button>

                        <div className="layer-action-dropdown">
                          <button className="layer-action more-actions">
                            <span className="dots">•••</span>
                          </button>
                          <div className="layer-action-menu">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditLayer(layers.indexOf(layer))
                              }}
                              disabled={layer.locked}
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDuplicateLayer(layers.indexOf(layer))
                              }}
                            >
                              <Copy size={14} />
                              <span>Duplicate</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleBringToFront(layers.indexOf(layer))
                              }}
                              disabled={index === 0}
                            >
                              <ChevronUp size={14} />
                              <span>Bring to Front</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSendToBack(layers.indexOf(layer))
                              }}
                              disabled={
                                index === (layer.type === "logo" ? logoLayers.length - 1 : textLayers.length - 1)
                              }
                            >
                              <ChevronDown size={14} />
                              <span>Send to Back</span>
                            </button>
                            <button
                              className="delete-action"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveLayer(layers.indexOf(layer))
                              }}
                              disabled={layer.locked}
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Text Layers Group */}
        {textLayers.length > 0 && (
          <div className="layer-group">
            <div className="layer-group-header" onClick={() => toggleGroupExpansion("text")}>
              <div className="group-title">
                <Type size={16} />
                <span>Text</span>
                <span className="group-count">{textLayers.length}</span>
              </div>
              <button className="group-toggle">
                {expandedGroups.text ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedGroups.text && (
              <div className="layer-list">
                {textLayers.map((layer, index) => {
                  const isSelected = selectedLayerIndex !== null && layers[selectedLayerIndex].id === layer.id

                  return (
                    <div
                      key={layer.id}
                      className={`layer-item ${isSelected ? "selected" : ""} ${layer.locked ? "locked" : ""}`}
                      onClick={() => handleLayerSelect(layers.indexOf(layer))}
                      draggable={!layer.locked}
                      onDragStart={(e) => handleDragStart(e, layers.indexOf(layer))}
                      onDragOver={(e) => handleDragOver(e, layers.indexOf(layer))}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, layers.indexOf(layer))}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="layer-info">
                        {renderLayerIcon(layer)}
                        <span className="layer-name">{layer.name}</span>
                      </div>

                      <div className="layer-actions">
                        <button
                          className="layer-action visibility-toggle"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleVisibility(layers.indexOf(layer))
                          }}
                          title={layer.visible ? "Hide" : "Show"}
                        >
                          {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>

                        <button
                          className="layer-action lock-toggle"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleLock(layers.indexOf(layer))
                          }}
                          title={layer.locked ? "Unlock" : "Lock"}
                        >
                          {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>

                        {/* Add explicit forward/backward buttons */}
                        <button
                          className="layer-action move-forward"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMoveForward(layers.indexOf(layer))
                          }}
                          title="Bring Forward"
                          disabled={layer.locked || index === 0}
                        >
                          <ChevronUp size={14} />
                        </button>

                        <button
                          className="layer-action move-backward"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMoveBackward(layers.indexOf(layer))
                          }}
                          title="Send Backward"
                          disabled={
                            layer.locked ||
                            index === (layer.type === "logo" ? logoLayers.length - 1 : textLayers.length - 1)
                          }
                        >
                          <ChevronDown size={14} />
                        </button>

                        <div className="layer-action-dropdown">
                          <button className="layer-action more-actions">
                            <span className="dots">•••</span>
                          </button>
                          <div className="layer-action-menu">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditLayer(layers.indexOf(layer))
                              }}
                              disabled={layer.locked}
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDuplicateLayer(layers.indexOf(layer))
                              }}
                            >
                              <Copy size={14} />
                              <span>Duplicate</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleBringToFront(layers.indexOf(layer))
                              }}
                              disabled={index === 0}
                            >
                              <ChevronUp size={14} />
                              <span>Bring to Front</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSendToBack(layers.indexOf(layer))
                              }}
                              disabled={
                                index === (layer.type === "logo" ? logoLayers.length - 1 : textLayers.length - 1)
                              }
                            >
                              <ChevronDown size={14} />
                              <span>Send to Back</span>
                            </button>
                            <button
                              className="delete-action"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveLayer(layers.indexOf(layer))
                              }}
                              disabled={layer.locked}
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Texture Layers Group */}
        {textureLayers.length > 0 && (
          <div className="layer-group">
            <div className="layer-group-header" onClick={() => toggleGroupExpansion("textures")}>
              <div className="group-title">
                <Grid size={16} />
                <span>Textures</span>
                <span className="group-count">{textureLayers.length}</span>
              </div>
              <button className="group-toggle">
                {expandedGroups.textures ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedGroups.textures && (
              <div className="layer-list">
                {textureLayers.map((layer, index) => {
                  const isSelected = selectedLayerIndex !== null && layers[selectedLayerIndex].id === layer.id

                  return (
                    <div
                      key={layer.id}
                      className={`layer-item ${isSelected ? "selected" : ""}`}
                      onClick={() => handleLayerSelect(layers.indexOf(layer))}
                    >
                      <div className="layer-info">
                        {renderLayerIcon(layer)}
                        <span className="layer-name">{layer.name}</span>
                      </div>

                      <div className="layer-actions">
                        <button
                          className="layer-action visibility-toggle"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Custom handler for texture visibility
                          }}
                          title={layer.visible ? "Hide" : "Show"}
                        >
                          {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>

                        <button
                          className="layer-action edit-action"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditLayer(layers.indexOf(layer))
                          }}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Color Layers Group */}
        {colorLayers.length > 0 && (
          <div className="layer-group">
            <div className="layer-group-header" onClick={() => toggleGroupExpansion("colors")}>
              <div className="group-title">
                <Palette size={16} />
                <span>Colors</span>
                <span className="group-count">{colorLayers.length}</span>
              </div>
              <button className="group-toggle">
                {expandedGroups.colors ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedGroups.colors && (
              <div className="layer-list">
                {colorLayers.map((layer, index) => {
                  const isSelected = selectedLayerIndex !== null && layers[selectedLayerIndex].id === layer.id

                  return (
                    <div
                      key={layer.id}
                      className={`layer-item ${isSelected ? "selected" : ""}`}
                      onClick={() => handleLayerSelect(layers.indexOf(layer))}
                    >
                      <div className="layer-info">
                        <div className="color-swatch" style={{ backgroundColor: layer.element }}></div>
                        <span className="layer-name">{layer.name}</span>
                      </div>

                      <div className="layer-actions">
                        <button
                          className="layer-action visibility-toggle"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Custom handler for color visibility
                          }}
                          title={layer.visible ? "Hide" : "Show"}
                        >
                          {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Canvas Objects Group */}
        {canvasObjects.length > 0 && (
          <div className="layer-group">
            <div className="layer-group-header" onClick={() => toggleGroupExpansion("canvasObjects")}>
              <div className="group-title">
                <Layers size={16} />
                <span>Canvas Objects</span>
                <span className="group-count">{canvasObjects.length}</span>
              </div>
              <button className="group-toggle">
                {expandedGroups.canvasObjects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedGroups.canvasObjects && (
              <div className="layer-list">
                {canvasObjects.map((object, index) => {
                  const isSelected = selectedCanvasObjectIdx === index

                  return (
                    <div
                      key={`canvas-object-${index}`}
                      className={`layer-item ${isSelected ? "selected" : ""}`}
                      onClick={() => handleCanvasObjectSelect(index)}
                    >
                      <div className="layer-info">
                        {object.type === "text" ? (
                          <Type size={16} />
                        ) : object.type === "image" ? (
                          <Image size={16} />
                        ) : (
                          <Layers size={16} />
                        )}
                        <span className="layer-name">{object.name}</span>
                      </div>

                      <div className="layer-actions">
                        {/* Forward/Backward buttons */}
                        <button
                          className="layer-action move-forward"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onMoveCanvasObjectForward) onMoveCanvasObjectForward(index)
                          }}
                          title="Bring Forward"
                          disabled={index === canvasObjects.length - 1}
                        >
                          <ChevronUp size={14} />
                        </button>

                        <button
                          className="layer-action move-backward"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onMoveCanvasObjectBackward) onMoveCanvasObjectBackward(index)
                          }}
                          title="Send Backward"
                          disabled={index === 0}
                        >
                          <ChevronDown size={14} />
                        </button>

                        <div className="layer-action-dropdown">
                          <button className="layer-action more-actions">
                            <span className="dots">•••</span>
                          </button>
                          <div className="layer-action-menu">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (onToggleTextureEditor) onToggleTextureEditor()
                              }}
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (onBringCanvasObjectToFront) onBringCanvasObjectToFront(index)
                              }}
                              disabled={index === canvasObjects.length - 1}
                            >
                              <ChevronUp size={14} />
                              <span>Bring to Front</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (onSendCanvasObjectToBack) onSendCanvasObjectToBack(index)
                              }}
                              disabled={index === 0}
                            >
                              <ChevronDown size={14} />
                              <span>Send to Back</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="layer-manager-footer">
        <div className="layer-count">
          <span>{layers.length + canvasObjects.length} Layers</span>
        </div>
      </div>
    </div>
  )
}

export default LayerManager

