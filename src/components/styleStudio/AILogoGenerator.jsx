"use client"

import { useState } from 'react'
import { Sparkles, Loader } from 'lucide-react'

const AILogoGenerator = ({ onLogoGenerated }) => {
  const [logoPrompt, setLogoPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLogos, setGeneratedLogos] = useState([])
  const [error, setError] = useState(null)
  
  const generateLogo = async () => {
    if (!logoPrompt.trim()) return
    
    setIsGenerating(true)
    setError(null)
    setGeneratedLogos([])
    
    try {
      // Connect to your NestJS backend
      const response = await fetch('http://localhost:3000/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: logoPrompt })
      })
      
      if (!response.ok) {
        throw new Error('Logo generation failed')
      }
      
      const data = await response.json()
      
      // Process the returned URLs to include the full domain
      if (data.logoUrls && data.logoUrls.length > 0) {
        const fullLogoUrls = data.logoUrls.map(url => `http://localhost:3000${url}`)
        setGeneratedLogos(fullLogoUrls)
      }
    } catch (error) {
      console.error('Logo generation error:', error)
      setError('Failed to generate logos. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }
  
  return (
    <div className="ai-logo-generator">
      <h3>AI Logo Generator</h3>
      
      <div className="logo-generator-input">
        <input 
          type="text"
          value={logoPrompt}
          onChange={(e) => setLogoPrompt(e.target.value)}
          placeholder="Describe the logo you want..."
          className="logo-prompt-input"
          disabled={isGenerating}
        />
        <button 
          className="generate-logo-button"
          onClick={generateLogo}
          disabled={isGenerating || !logoPrompt.trim()}
        >
          {isGenerating ? <Loader className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {isGenerating ? 'Creating...' : 'Create Logo'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {generatedLogos.length > 0 && (
        <div className="generated-logos">
          <h4>Generated Logos</h4>
          <div className="logo-results-grid">
            {generatedLogos.map((logoUrl, index) => (
              <div key={index} className="generated-logo-item">
                <img 
                  src={logoUrl} 
                  alt={`Generated logo ${index + 1}`}
                  className="generated-logo-image"
                />
                <button 
                  className="use-logo-button"
                  onClick={() => onLogoGenerated(logoUrl)}
                >
                  Use This Logo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AILogoGenerator