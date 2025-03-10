"use client"

import { useState } from "react"
import TextEditor2D from "./TextEditor2D"
import TextPlacement from "./TextPlacement"

function TextEditorPanel({ textElements, selectedTextIndex, onAddText, onUpdateText, onRemoveText, onTextSelect }) {
  const [activeTab, setActiveTab] = useState("canvas")

  return (
    <div className="text-editor-panel">
      <div className="text-editor-tabs">
        <button
          className={`text-editor-tab ${activeTab === "canvas" ? "active" : ""}`}
          onClick={() => setActiveTab("canvas")}
        >
          Canvas Editor
        </button>
        <button
          className={`text-editor-tab ${activeTab === "controls" ? "active" : ""}`}
          onClick={() => setActiveTab("controls")}
        >
          Text Controls
        </button>
      </div>

      <div className="text-editor-content">
        {activeTab === "canvas" ? (
          <TextEditor2D
            textElements={textElements}
            selectedTextIndex={selectedTextIndex}
            onTextSelect={onTextSelect}
            onUpdateText={onUpdateText}
          />
        ) : (
          <TextPlacement
            onAddText={onAddText}
            textElements={textElements}
            onRemoveText={onRemoveText}
            onUpdateText={onUpdateText}
          />
        )}
      </div>
    </div>
  )
}

export default TextEditorPanel

