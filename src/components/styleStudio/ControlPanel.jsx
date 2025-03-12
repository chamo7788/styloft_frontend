"use client"

import TabPanel from "./TabPanel"
import ModelSelector from "./ModelSelector"
import PartSelector from "./PartSelector"
import ColorPicker from "./ColorPicker"
import FileUploader from "./FileUploader"
import LogoUploader from "./LogoUploader"
import LogoPositionControls from "./LogoPositionControls"
import LightingControls from "./LightingControls"

const ControlPanel = ({
  activeTab,
  setActiveTab,
  selectedModel,
  onModelChange,
  backgroundColor,
  setBackgroundColor,
  selectedPart,
  setSelectedPart,
  modelParts,
  colors,
  onColorChange,
  materials,
  onMaterialChange,
  showTextureEditor,
  toggleTextureEditor,
  textElements,
  selectedTextIndex,
  onTextSelect,
  onRemoveText,
  logoElements,
  selectedLogoIndex,
  onLogoSelect,
  onAddLogo,
  onRemoveLogo,
  onUpdateLogo,
  onUpdateLogoPosition,
  onUpdateLogoRotation,
  lighting,
  setLighting,
}) => {
  return (
    <div className="controls-card">
      <div className="controls-content">
        <TabPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: "model", label: "Model" },
            { id: "color", label: "Color" },
            { id: "texture", label: "Texture" },
            { id: "text", label: "Text" },
            { id: "logo", label: "Logo" },
            { id: "lighting", label: "Lighting" },
          ]}
        >
          <div id="model">
            <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />

            <div className="background-control">
              <label className="background-label">Background Color</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="background-color-input"
              />
            </div>
          </div>

          <div id="color">
            <PartSelector parts={modelParts} selectedPart={selectedPart} onPartSelect={setSelectedPart} />

            <ColorPicker color={colors[selectedPart] || "#ffffff"} onChange={onColorChange} />
          </div>

          <div id="texture">
            <PartSelector parts={modelParts} selectedPart={selectedPart} onPartSelect={setSelectedPart} />

            <div className="texture-editor-toggle">
              <button className="texture-editor-toggle-button" onClick={toggleTextureEditor}>
                {showTextureEditor ? "Hide Texture Editor" : "Show Texture Editor"}
              </button>
            </div>

            <FileUploader
              label={`Upload Texture for ${selectedPart}`}
              accept="image/*"
              onChange={onMaterialChange}
              preview={materials[selectedPart]}
            />

            <div className="sample-materials">
              <h3>Sample Materials</h3>
              <div className="material-grid">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="material-sample"
                    style={{ backgroundImage: `url(/materials/material${index + 1}.jpg)` }}
                    onClick={() => onMaterialChange(`/materials/material${index + 1}.jpg`)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div id="text">
            <div className="text-elements">
              <h3 className="text-elements-title">Text Elements</h3>
              <div className="text-elements-list">
                {textElements.map((element, index) => (
                  <div
                    key={index}
                    className={`text-element ${selectedTextIndex === index ? "text-element-selected" : ""}`}
                    onClick={() => onTextSelect(index)}
                  >
                    <div className="text-element-preview">
                      <span
                        style={{
                          color: element.color,
                          fontSize: `${Math.min(element.fontSize, 24)}px`,
                          fontWeight: element.fontWeight || "normal",
                          fontStyle: element.fontStyle || "normal",
                          textAlign: element.textAlign || "center",
                        }}
                      >
                        {element.text}
                      </span>
                    </div>
                    <div className="text-element-actions">
                      <button
                        className="text-element-edit"
                        onClick={(e) => {
                          e.stopPropagation()
                          onTextSelect(index)
                          toggleTextureEditor()
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-element-remove"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveText(index)
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="logo">
            <LogoUploader
              onAddLogo={onAddLogo}
              logoElements={logoElements}
              onRemoveLogo={onRemoveLogo}
              onUpdateLogo={onUpdateLogo}
              selectedLogoIndex={selectedLogoIndex}
              onLogoSelect={onLogoSelect}
            />

            {selectedLogoIndex !== null && (
              <LogoPositionControls
                logoElement={logoElements[selectedLogoIndex]}
                onUpdatePosition={onUpdateLogoPosition}
                onUpdateRotation={onUpdateLogoRotation}
              />
            )}
          </div>

          <div id="lighting">
            <LightingControls lighting={lighting} onChange={setLighting} />
          </div>
        </TabPanel>
      </div>
    </div>
  )
}

export default ControlPanel

