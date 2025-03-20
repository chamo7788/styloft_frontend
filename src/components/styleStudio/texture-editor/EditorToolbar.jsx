import { memo } from "react"
import { Brush, Eraser, Type, ImageIcon, RotateCw, RotateCcw, Trash2, Save } from "lucide-react"

export const EditorToolbar = memo(
  ({
    drawingMode,
    setDrawingMode,
    handleCanvasUndo,
    handleCanvasRedo,
    handleClearCanvas,
    updateTextureFromCanvas,
    canUndo = false,
    canRedo = false,
  }) => {
    return (
      <div className="texture-editor-toolbar">
        {/* Drawing tools */}
        <button
          className={`texture-editor-tool ${drawingMode === "brush" ? "active" : ""}`}
          onClick={() => setDrawingMode("brush")}
          title="Brush"
        >
          <Brush size={16} />
        </button>

        <button
          className={`texture-editor-tool ${drawingMode === "eraser" ? "active" : ""}`}
          onClick={() => setDrawingMode("eraser")}
          title="Eraser"
        >
          <Eraser size={16} />
        </button>

        <button
          className={`texture-editor-tool ${drawingMode === "text" ? "active" : ""}`}
          onClick={() => setDrawingMode("text")}
          title="Text"
        >
          <Type size={16} />
        </button>

        <button
          className={`texture-editor-tool ${drawingMode === "logo" ? "active" : ""}`}
          onClick={() => setDrawingMode("logo")}
          title="Logo"
        >
          <ImageIcon size={16} />
        </button>

        <div className="texture-editor-tool-spacer"></div>

        {/* History and actions */}
        <button
          className="texture-editor-tool"
          onClick={handleCanvasUndo}
          disabled={!canUndo}
          title="Undo"
          
        >
          <RotateCcw size={16} />
        </button>

        <button
          className="texture-editor-tool"
          onClick={handleCanvasRedo}
          disabled={!canRedo}
          title="Redo"
          
        >
          <RotateCw size={16} />
        </button>

        <button className="texture-editor-tool" onClick={handleClearCanvas} title="Clear">
          <Trash2 size={16} />
        </button>

        <button className="texture-editor-tool" onClick={updateTextureFromCanvas} title="Apply to Model">
          <Save size={16} />
        </button>
      </div>
    )
  },
)

EditorToolbar.displayName = "EditorToolbar"

