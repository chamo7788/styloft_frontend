import { Shirt, PenIcon, SubscriptIcon, SaladIcon } from "lucide-react"

function ModelSelector({ selectedModel, onModelChange }) {
  return (
    <div className="model-grid">
      <button
        className={`model-button ${selectedModel === "shirt" ? "model-button-selected" : ""}`}
        onClick={() => onModelChange("shirt")}
      >
        <Shirt className="model-icon" />
        <span>Shirt</span>
      </button>
      <button
        className={`model-button ${selectedModel === "trouser" ? "model-button-selected" : ""}`}
        onClick={() => onModelChange("trouser")}
      >
        <PenIcon className="model-icon" />
        <span>Trouser</span>
      </button>
      <button
        className={`model-button ${selectedModel === "short" ? "model-button-selected" : ""}`}
        onClick={() => onModelChange("short")}
      >
        <SubscriptIcon className="model-icon" />
        <span>Short</span>
      </button>
      <button
        className={`model-button ${selectedModel === "frock" ? "model-button-selected" : ""}`}
        onClick={() => onModelChange("frock")}
      >
        <SaladIcon className="model-icon" />
        <span>Frock</span>
      </button>
    </div>
  )
}

export default ModelSelector

