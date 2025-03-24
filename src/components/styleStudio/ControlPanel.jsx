import TabPanel from "./TabPanel"
import ModelSelector from "./ModelSelector"
import PartSelector from "./PartSelector"
import ColorPicker from "./ColorPicker"
import FileUploader from "./FileUploader"
import LightingControls from "./LightingControls"
import PatternGenerator from "./PatternGenerator"
import MaterialSimulation from "./MaterialSimulation"
import ColorPaletteSuggestions from "./ColorPaletteSuggestions"
import DesignTemplates from "./DesignTemplates"

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
  logoElements,
  lighting,
  setLighting,
  onLoadTemplate,
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
            { id: "lighting", label: "Lighting" },
            { id: "patterns", label: "Patterns" },
            { id: "materials", label: "Materials" },
            { id: "palettes", label: "Palettes" },
            { id: "templates", label: "Templates" },
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
                {[
                  "Fabrics-Background-PNG-Image.png",
                  "Fabrics-PNG-Images-HD.png",
                  "Fabrics-PNG-Photo-Image.png",
                  "Fabrics-Transparent-Background.png",
                ].map((imageName, index) => (
                  <div
                    key={index}
                    className="material-sample"
                    style={{
                      backgroundImage: `url(/src/assets/images/StyleStudio/${imageName})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => onMaterialChange(`/src/assets/images/StyleStudio/${imageName}`)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div id="lighting">
            <LightingControls lighting={lighting} onChange={setLighting} />
          </div>

          <div id="patterns">
            <PatternGenerator onPatternGenerated={onMaterialChange} />
          </div>

          <div id="materials">
            <MaterialSimulation onApplyMaterial={onMaterialChange} selectedPart={selectedPart} />
          </div>

          <div id="palettes">
            <ColorPaletteSuggestions onColorSelect={onColorChange} />
          </div>

          <div id="templates">
            <DesignTemplates
              currentDesign={{
                colors,
                materials,
                textElements,
                logoElements,
                lighting,
                backgroundColor,
              }}
              onLoadTemplate={onLoadTemplate}
              selectedModel={selectedModel}
            />
          </div>
        </TabPanel>
      </div>
    </div>
  )
}

export default ControlPanel

