"use client"

import { useState, useEffect } from "react"
import { Heart, RefreshCw, Copy, Check } from "lucide-react"

const ColorPaletteSuggestions = ({ onColorSelect }) => {
  const [palettes, setPalettes] = useState([])
  const [paletteType, setPaletteType] = useState("monochromatic")
  const [baseColor, setBaseColor] = useState("#4f46e5")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedColor, setCopiedColor] = useState(null)
  const [favorites, setFavorites] = useState([])

  const paletteTypes = [
    { id: "monochromatic", name: "Monochromatic" },
    { id: "analogous", name: "Analogous" },
    { id: "complementary", name: "Complementary" },
    { id: "triadic", name: "Triadic" },
    { id: "tetradic", name: "Tetradic" },
  ]

  // Generate palettes when component mounts or parameters change
  useEffect(() => {
    generatePalettes()
  }, [paletteType, baseColor])

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("stylestudio-favorite-colors")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {
        console.error("Error loading favorite colors", e)
      }
    }
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("stylestudio-favorite-colors", JSON.stringify(favorites))
  }, [favorites])

  // Convert hex to HSL
  const hexToHSL = (hex) => {
    // Remove the # if present
    hex = hex.replace(/^#/, "")

    // Parse the hex values
    const r = Number.parseInt(hex.substring(0, 2), 16) / 255
    const g = Number.parseInt(hex.substring(2, 4), 16) / 255
    const b = Number.parseInt(hex.substring(4, 6), 16) / 255

    // Find min and max values
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    // Calculate lightness
    let l = (max + min) / 2

    let h, s

    if (max === min) {
      // Achromatic
      h = s = 0
    } else {
      // Calculate saturation
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)

      // Calculate hue
      switch (max) {
        case r:
          h = (g - b) / (max - min) + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / (max - min) + 2
          break
        case b:
          h = (r - g) / (max - min) + 4
          break
      }

      h /= 6
    }

    // Convert to degrees and percentages
    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)

    return { h, s, l }
  }

  // Convert HSL to hex
  const hslToHex = (h, s, l) => {
    // Ensure values are in the right range
    h = h % 360
    s = Math.max(0, Math.min(100, s)) / 100
    l = Math.max(0, Math.min(100, l)) / 100

    // Formula to convert HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r, g, b

    if (h >= 0 && h < 60) {
      ;[r, g, b] = [c, x, 0]
    } else if (h >= 60 && h < 120) {
      ;[r, g, b] = [x, c, 0]
    } else if (h >= 120 && h < 180) {
      ;[r, g, b] = [0, c, x]
    } else if (h >= 180 && h < 240) {
      ;[r, g, b] = [0, x, c]
    } else if (h >= 240 && h < 300) {
      ;[r, g, b] = [x, 0, c]
    } else {
      ;[r, g, b] = [c, 0, x]
    }

    // Convert to hex
    const toHex = (value) => {
      const hex = Math.round((value + m) * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const generatePalettes = () => {
    setIsLoading(true)

    // Convert base color to HSL
    const { h, s, l } = hexToHSL(baseColor)

    let newPalettes = []

    switch (paletteType) {
      case "monochromatic":
        // Vary lightness
        newPalettes = [
          { name: "Lightest", color: hslToHex(h, s, Math.min(l + 40, 95)) },
          { name: "Lighter", color: hslToHex(h, s, Math.min(l + 20, 85)) },
          { name: "Base", color: baseColor },
          { name: "Darker", color: hslToHex(h, s, Math.max(l - 20, 15)) },
          { name: "Darkest", color: hslToHex(h, s, Math.max(l - 40, 5)) },
        ]
        break

      case "analogous":
        // Colors adjacent on the color wheel
        newPalettes = [
          { name: "Adjacent -2", color: hslToHex((h - 40 + 360) % 360, s, l) },
          { name: "Adjacent -1", color: hslToHex((h - 20 + 360) % 360, s, l) },
          { name: "Base", color: baseColor },
          { name: "Adjacent +1", color: hslToHex((h + 20) % 360, s, l) },
          { name: "Adjacent +2", color: hslToHex((h + 40) % 360, s, l) },
        ]
        break

      case "complementary":
        // Base color and its complement (opposite on the color wheel)
        const complement = (h + 180) % 360
        newPalettes = [
          { name: "Base Lighter", color: hslToHex(h, s, Math.min(l + 20, 90)) },
          { name: "Base", color: baseColor },
          { name: "Base Darker", color: hslToHex(h, s, Math.max(l - 20, 10)) },
          { name: "Complement Lighter", color: hslToHex(complement, s, Math.min(l + 20, 90)) },
          { name: "Complement", color: hslToHex(complement, s, l) },
          { name: "Complement Darker", color: hslToHex(complement, s, Math.max(l - 20, 10)) },
        ]
        break

      case "triadic":
        // Three colors evenly spaced on the color wheel
        newPalettes = [
          { name: "Base", color: baseColor },
          { name: "Triad 1", color: hslToHex((h + 120) % 360, s, l) },
          { name: "Triad 2", color: hslToHex((h + 240) % 360, s, l) },
        ]
        break

      case "tetradic":
        // Four colors evenly spaced on the color wheel
        newPalettes = [
          { name: "Base", color: baseColor },
          { name: "Tetrad 1", color: hslToHex((h + 90) % 360, s, l) },
          { name: "Tetrad 2", color: hslToHex((h + 180) % 360, s, l) },
          { name: "Tetrad 3", color: hslToHex((h + 270) % 360, s, l) },
        ]
        break

      default:
        newPalettes = [{ name: "Base", color: baseColor }]
    }

    // Add a small delay to show loading state
    setTimeout(() => {
      setPalettes(newPalettes)
      setIsLoading(false)
    }, 300)
  }

  const copyColorToClipboard = (color) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedColor(null)
    }, 2000)
  }

  const toggleFavorite = (color) => {
    if (favorites.includes(color)) {
      setFavorites(favorites.filter((c) => c !== color))
    } else {
      setFavorites([...favorites, color])
    }
  }

  const randomizeBaseColor = () => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    setBaseColor(color)
  }

  return (
    <div className="color-palette-suggestions">
      <h3 className="palette-title">Color Palette Suggestions</h3>

      <div className="base-color-selector">
        <div className="color-input-group">
          <label className="control-label">Base Color</label>
          <div className="color-input-with-random">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="base-color-input"
            />
            <button className="randomize-color-button" onClick={randomizeBaseColor} title="Randomize Color">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="palette-type-selector">
        <label className="control-label">Palette Type</label>
        <div className="palette-type-buttons">
          {paletteTypes.map((type) => (
            <button
              key={type.id}
              className={`palette-type-button ${paletteType === type.id ? "selected" : ""}`}
              onClick={() => setPaletteType(type.id)}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="palette-results">
        {isLoading ? (
          <div className="palette-loading">
            <RefreshCw className="animate-spin" size={24} />
            <span>Generating palette...</span>
          </div>
        ) : (
          <div className="color-swatches">
            {palettes.map((palette, index) => (
              <div key={index} className="color-swatch-item">
                <div
                  className="color-swatch"
                  style={{ backgroundColor: palette.color }}
                  onClick={() => onColorSelect(palette.color)}
                >
                  <div className="swatch-actions">
                    <button
                      className="swatch-action-button favorite-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(palette.color)
                      }}
                      title={favorites.includes(palette.color) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart
                        size={16}
                        fill={favorites.includes(palette.color) ? "#ef4444" : "none"}
                        color={favorites.includes(palette.color) ? "#ef4444" : "#ffffff"}
                      />
                    </button>
                    <button
                      className="swatch-action-button copy-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyColorToClipboard(palette.color)
                      }}
                      title="Copy color code"
                    >
                      {copiedColor === palette.color ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="color-swatch-info">
                  <span className="swatch-name">{palette.name}</span>
                  <span className="swatch-hex">{palette.color}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="favorite-colors">
          <h4 className="favorites-title">
            <Heart size={16} fill="#ef4444" color="#ef4444" />
            <span>Favorite Colors</span>
          </h4>
          <div className="favorite-swatches">
            {favorites.map((color, index) => (
              <div
                key={index}
                className="favorite-swatch"
                style={{ backgroundColor: color }}
                onClick={() => onColorSelect(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPaletteSuggestions

