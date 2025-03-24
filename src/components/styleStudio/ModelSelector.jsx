import { PiShirtFolded, PiPantsLight } from "react-icons/pi";
import { IoShirtOutline } from "react-icons/io5";
import { GiLargeDress, GiUnderwearShorts } from "react-icons/gi";


function ModelSelector({ selectedModel, onModelChange }) {
  return (
    <div className="model-grid">
      <button
        className={`model-button ${selectedModel === "shirt" ? "model-button-selected" : ""}`}
        onClick={() => onModelChange("shirt")}
      >
        <IoShirtOutline className="model-icon" />
        <span>T-Shirt</span>
      </button>
      <button
        className={`model-button ${selectedModel === "trouser" ? "model-button-selected" : ""}`}
        onClick={() => onModelChange("trouser")}
      >
        <PiPantsLight className="model-icon" />
        <span>Trouser</span>
      </button>
      <button
        className={`model-button ${selectedModel === "short" ? "model-button-selected" : ""}`}
        onClick={() => onModelChange("short")}
      >
        <GiUnderwearShorts className="model-icon" />
        <span>Short</span>
      </button>
      <button
        className={`model-button ${selectedModel === "frock" ? "model-button-selected" : ""}`}
        onClick={() => onModelChange("frock")}
      >
        <GiLargeDress className="model-icon" />
        <span>Frock</span>
      </button>
      <button
        className={`model-button ${selectedModel === "Tshirt" ? "model-button-selected" : ""}`}
        onClick={() => onModelChange("Tshirt")}
      >
        <PiShirtFolded className="model-icon" />
        <span>Shirt</span>
      </button>
    </div>
  );
}

export default ModelSelector

