function ColorPicker({ color, onChange }) {
  const colors = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ff9900",
    "#9900ff",
  ]

  return (
    <div className="color-grid">
      {colors.map((c) => (
        <button
          key={c}
          className={`color-button ${color === c ? "color-button-selected" : ""}`}
          style={{ backgroundColor: c }}
          onClick={() => onChange(c)}
          aria-label={`Select color ${c}`}
        />
      ))}
      <div className="custom-color-container">
        <label htmlFor="custom-color" className="color-label">
          Custom Color
        </label>
        <input
          id="custom-color"
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="custom-color-input"
        />
      </div>
    </div>
  )
}

export default ColorPicker

