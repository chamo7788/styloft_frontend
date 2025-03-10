"use client"

function LightingControls({ onChange, lighting }) {
  return (
    <div className="lighting-controls">
      <label className="lighting-label">Lighting</label>

      <div className="lighting-control">
        <label className="lighting-control-label">Intensity</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={lighting.intensity}
          onChange={(e) => onChange({ ...lighting, intensity: Number(e.target.value) })}
          className="lighting-range"
        />
        <span>{lighting.intensity.toFixed(1)}</span>
      </div>

      <div className="lighting-control">
        <label className="lighting-control-label">Direction</label>
        <div className="lighting-direction-controls">
          <button className="lighting-direction-button" onClick={() => onChange({ ...lighting, direction: [0, 5, 5] })}>
            Front
          </button>
          <button
            className="lighting-direction-button"
            onClick={() => onChange({ ...lighting, direction: [0, 5, -5] })}
          >
            Back
          </button>
          <button className="lighting-direction-button" onClick={() => onChange({ ...lighting, direction: [5, 5, 0] })}>
            Right
          </button>
          <button
            className="lighting-direction-button"
            onClick={() => onChange({ ...lighting, direction: [-5, 5, 0] })}
          >
            Left
          </button>
        </div>
      </div>

      <div className="lighting-control">
        <label className="lighting-control-label">Environment</label>
        <select
          className="lighting-select"
          value={lighting.environment}
          onChange={(e) => onChange({ ...lighting, environment: e.target.value })}
        >
          <option value="studio">Studio</option>
          <option value="sunset">Sunset</option>
          <option value="dawn">Dawn</option>
          <option value="night">Night</option>
          <option value="warehouse">Warehouse</option>
          <option value="forest">Forest</option>
          <option value="apartment">Apartment</option>
          <option value="city">City</option>
          <option value="park">Park</option>
          <option value="lobby">Lobby</option>
        </select>
      </div>
    </div>
  )
}

export default LightingControls

