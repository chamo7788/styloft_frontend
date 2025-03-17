import { useState, useRef, useEffect } from "react"
import { Wand2, Repeat, Grid, Palette, RefreshCw, Check } from "lucide-react"

const PatternGenerator = ({ onPatternGenerated }) => {
  const [patternType, setPatternType] = useState("stripes")
  const [primaryColor, setPrimaryColor] = useState("#4f46e5")
  const [secondaryColor, setSecondaryColor] = useState("#ffffff")
  const [patternSize, setPatternSize] = useState(20)
  const [patternRotation, setPatternRotation] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef(null)

  const patternTypes = [
    { id: "stripes", name: "Stripes", icon: <Repeat size={16} /> },
    { id: "dots", name: "Polka Dots", icon: <Grid size={16} /> },
    { id: "chevron", name: "Chevron", icon: <Wand2 size={16} /> },
    { id: "checkered", name: "Checkered", icon: <Check size={16} /> },
  ]

  // Generate pattern when parameters change
  useEffect(() => {
    generatePattern()
  }, [patternType, primaryColor, secondaryColor, patternSize, patternRotation])

  const generatePattern = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Fill with background color
    ctx.fillStyle = secondaryColor
    ctx.fillRect(0, 0, width, height)

    // Apply rotation if needed
    if (patternRotation !== 0) {
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.rotate((patternRotation * Math.PI) / 180)
      ctx.translate(-width / 2, -height / 2)
    }

    // Draw pattern based on selected type
    ctx.fillStyle = primaryColor

    switch (patternType) {
      case "stripes":
        drawStripes(ctx, width, height, patternSize)
        break
      case "dots":
        drawDots(ctx, width, height, patternSize)
        break
      case "chevron":
        drawChevron(ctx, width, height, patternSize)
        break
      case "checkered":
        drawCheckered(ctx, width, height, patternSize)
        break
      default:
        drawStripes(ctx, width, height, patternSize)
    }

    // Restore canvas state if rotated
    if (patternRotation !== 0) {
      ctx.restore()
    }
  }

  const drawStripes = (ctx, width, height, size) => {
    const stripeWidth = size

    for (let x = 0; x < width; x += stripeWidth * 2) {
      ctx.fillRect(x, 0, stripeWidth, height)
    }
  }

  const drawDots = (ctx, width, height, size) => {
    const radius = size / 2
    const spacing = size * 2

    for (let y = radius; y < height; y += spacing) {
      for (let x = radius; x < width; x += spacing) {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Offset dots in between
    for (let y = radius + spacing / 2; y < height; y += spacing) {
      for (let x = radius + spacing / 2; x < width; x += spacing) {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  const drawChevron = (ctx, width, height, size) => {
    const chevronHeight = size
    const chevronWidth = size * 2

    for (let y = 0; y < height + chevronHeight; y += chevronHeight) {
      ctx.beginPath()
      for (let x = 0; x < width + chevronWidth; x += chevronWidth) {
        ctx.lineTo(x, y - chevronHeight / 2)
        ctx.lineTo(x + chevronWidth / 2, y)
        ctx.lineTo(x + chevronWidth, y - chevronHeight / 2)
      }
      ctx.lineTo(width, y - chevronHeight / 2)
      ctx.lineTo(width, y + chevronHeight / 2)
      ctx.lineTo(0, y + chevronHeight / 2)
      ctx.closePath()
      ctx.fill()
    }
  }

  const drawCheckered = (ctx, width, height, size) => {
    const squareSize = size

    for (let y = 0; y < height; y += squareSize * 2) {
      for (let x = 0; x < width; x += squareSize * 2) {
        ctx.fillRect(x, y, squareSize, squareSize)
        ctx.fillRect(x + squareSize, y + squareSize, squareSize, squareSize)
      }
    }
  }

  const applyPattern = () => {
    setIsGenerating(true)

    // Small delay to show loading state
    setTimeout(() => {
      const canvas = canvasRef.current
      if (canvas) {
        const patternUrl = canvas.toDataURL("image/png")
        onPatternGenerated(patternUrl)
      }
      setIsGenerating(false)
    }, 500)
  }

  const randomizeColors = () => {
    const colors = [
      "#4f46e5",
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#6366f1",
      "#14b8a6",
      "#f43f5e",
    ]

    const randomPrimary = colors[Math.floor(Math.random() * colors.length)]
    let randomSecondary

    do {
      randomSecondary = colors[Math.floor(Math.random() * colors.length)]
    } while (randomSecondary === randomPrimary)

    setPrimaryColor(randomPrimary)
    setSecondaryColor(randomSecondary)
  }

  return (
    <div className="pattern-generator">
      <h3 className="pattern-generator-title">Pattern Generator</h3>

      <div className="pattern-preview">
        <canvas ref={canvasRef} width={256} height={256} className="pattern-canvas" />
      </div>

      <div className="pattern-controls">
        <div className="pattern-type-selector">
          <label className="control-label">Pattern Type</label>
          <div className="pattern-type-buttons">
            {patternTypes.map((type) => (
              <button
                key={type.id}
                className={`pattern-type-button ${patternType === type.id ? "selected" : ""}`}
                onClick={() => setPatternType(type.id)}
              >
                {type.icon}
                <span>{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pattern-color-controls">
          <div className="color-control">
            <label className="control-label">Primary</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="color-input"
            />
          </div>

          <div className="color-control">
            <label className="control-label">Secondary</label>
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="color-input"
            />
          </div>

          <button className="randomize-colors-button" onClick={randomizeColors}>
            <RefreshCw size={16} />
            <span>Randomize Colors</span>
          </button>
        </div>

        <div className="pattern-size-control">
          <label className="control-label">Pattern Size: {patternSize}px</label>
          <input
            type="range"
            min="5"
            max="50"
            value={patternSize}
            onChange={(e) => setPatternSize(Number.parseInt(e.target.value))}
            className="size-slider"
          />
        </div>

        <div className="pattern-rotation-control">
          <label className="control-label">Rotation: {patternRotation}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={patternRotation}
            onChange={(e) => setPatternRotation(Number.parseInt(e.target.value))}
            className="rotation-slider"
          />
        </div>

        <button className="apply-pattern-button" onClick={applyPattern} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin" size={16} />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Palette size={16} />
              <span>Apply Pattern</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default PatternGenerator

