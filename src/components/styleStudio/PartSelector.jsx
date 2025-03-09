"use client"

function PartSelector({ parts, selectedPart, onPartSelect }) {
  return (
    <div className="part-selector">
      <label className="part-selector-label">Select Part</label>
      <div className="part-buttons">
        {parts.map((part) => (
          <button
            key={part}
            className={`part-button ${selectedPart === part ? "part-button-selected" : ""}`}
            onClick={() => onPartSelect(part)}
          >
            {part}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PartSelector

