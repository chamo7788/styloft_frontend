"use client"

import { RotateCcw, RotateCw, Undo, Redo, Download, Save, Upload, Layers } from "lucide-react"

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
        <button className="toolbar-button" onClick={onSaveDesign} title="Save Design">
          <Save size={16} />
        </button>
        <label className="toolbar-button" title="Load Design">
          <Upload size={16} />
          <input type="file" accept=".json" onChange={onLoadDesign} className="hidden-input" />
        </label>
      </div>
    </div>
  )
}

export default Toolbar

