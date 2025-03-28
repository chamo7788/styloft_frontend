import { useState } from 'react'
import { Wand2, Loader } from 'lucide-react'

const AITextureGenerator = ({ onTextureGenerated, selectedPart }) => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [presets] = useState([
    "denim fabric", 
    "cotton fabric", 
    "silk pattern", 
    "leather texture",
    "knitted wool"
  ])

  const generateTexture = async (textPrompt) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      // Connect to your NestJS backend
      const response = await fetch('https://styloftbackendnew-production.up.railway.app/api/generate-texture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textPrompt })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate texture')
      }
      
      const data = await response.json()
      if (data.textureUrl) {
        // The backend returns a URL like /api/uploads/textures/filename.png
        const fullTextureUrl = `https://styloftbackendnew-production.up.railway.app${data.textureUrl}`
        onTextureGenerated(fullTextureUrl)
      }
    } catch (error) {
      console.error('Texture generation failed:', error)
      setError('Failed to generate texture. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="ai-texture-generator">
      <h3>AI Texture Generator</h3>
      <div className="generator-input-area">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Describe a texture for ${selectedPart}...`}
          className="texture-prompt-input"
          disabled={isGenerating}
        />
        <button 
          className="generate-button"
          onClick={() => generateTexture(prompt)}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? <Loader className="animate-spin" size={16} /> : <Wand2 size={16} />}
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="texture-presets">
        <h4>Quick Prompts:</h4>
        <div className="preset-buttons">
          {presets.map(preset => (
            <button 
              key={preset} 
              className="preset-button"
              onClick={() => {
                setPrompt(preset)
                generateTexture(preset)
              }}
              disabled={isGenerating}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AITextureGenerator