export const BrushControls = ({ isEraser = false, brushColor, setBrushColor, brushSize, setBrushSize }) => {
  return (
    <>
      {!isEraser && (
        <div className="brush-control">
          <label className="brush-control-label">Brush Color</label>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="brush-color-input"
          />
        </div>
      )}
      <div className="brush-control">
        <label className="brush-control-label">
          {isEraser ? "Eraser" : "Brush"} Size: {brushSize}px
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="brush-size-input"
        />
      </div>
    </>
  )
}

