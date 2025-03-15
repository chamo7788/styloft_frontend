"use client"

import { useState, useEffect } from "react"
import { Save, FolderOpen, Trash2, Star, StarOff, RefreshCw } from "lucide-react"

const DesignTemplates = ({ currentDesign, onLoadTemplate, selectedModel }) => {
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [templateName, setTemplateName] = useState("")
  const [saveError, setSaveError] = useState("")

  // Load templates from localStorage on component mount
  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      try {
        const savedTemplates = localStorage.getItem("stylestudio-templates")
        if (savedTemplates) {
          setTemplates(JSON.parse(savedTemplates))
        }
      } catch (error) {
        console.error("Error loading templates:", error)
      }

      setIsLoading(false)
    }, 500)
  }

  const saveTemplate = () => {
    if (!templateName.trim()) {
      setSaveError("Please enter a template name")
      return
    }

    // Check if name already exists
    if (templates.some((t) => t.name === templateName)) {
      setSaveError("A template with this name already exists")
      return
    }

    setSaveError("")

    // Create new template object
    const newTemplate = {
      id: Date.now().toString(),
      name: templateName,
      model: selectedModel,
      design: currentDesign,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    }

    // Add to templates array
    const updatedTemplates = [...templates, newTemplate]
    setTemplates(updatedTemplates)

    // Save to localStorage
    localStorage.setItem("stylestudio-templates", JSON.stringify(updatedTemplates))

    // Reset form
    setTemplateName("")
  }

  const deleteTemplate = (id) => {
    const updatedTemplates = templates.filter((template) => template.id !== id)
    setTemplates(updatedTemplates)
    localStorage.setItem("stylestudio-templates", JSON.stringify(updatedTemplates))
  }

  const toggleFavorite = (id) => {
    const updatedTemplates = templates.map((template) => {
      if (template.id === id) {
        return { ...template, isFavorite: !template.isFavorite }
      }
      return template
    })

    setTemplates(updatedTemplates)
    localStorage.setItem("stylestudio-templates", JSON.stringify(updatedTemplates))
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get thumbnail color based on model type
  const getThumbnailColor = (model) => {
    switch (model) {
      case "shirt":
        return "#4f46e5"
      case "trouser":
        return "#10b981"
      case "short":
        return "#f59e0b"
      case "frock":
        return "#ec4899"
      default:
        return "#6b7280"
    }
  }

  // Get model name for display
  const getModelName = (model) => {
    switch (model) {
      case "shirt":
        return "Shirt"
      case "trouser":
        return "Trouser"
      case "short":
        return "Short"
      case "frock":
        return "Frock"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="design-templates">
      <h3 className="templates-title">Design Templates</h3>

      <div className="save-template-form">
        <div className="template-input-group">
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter template name"
            className="template-name-input"
          />
          <button className="save-template-button" onClick={saveTemplate} disabled={!templateName.trim()}>
            <Save size={16} />
            <span>Save Current Design</span>
          </button>
        </div>

        {saveError && <p className="template-error">{saveError}</p>}
      </div>

      <div className="templates-list">
        <h4 className="templates-section-title">Your Templates</h4>

        {isLoading ? (
          <div className="templates-loading">
            <RefreshCw className="animate-spin" size={24} />
            <span>Loading templates...</span>
          </div>
        ) : templates.length === 0 ? (
          <div className="no-templates">
            <p>You haven't saved any templates yet.</p>
            <p>Save your current design to create a template!</p>
          </div>
        ) : (
          <>
            {/* Favorite templates */}
            {templates.some((t) => t.isFavorite) && (
              <div className="favorite-templates">
                <h5 className="templates-subsection-title">
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <span>Favorites</span>
                </h5>
                <div className="favorite-templates-grid">
                  {templates
                    .filter((t) => t.isFavorite)
                    .map((template) => (
                      <div key={template.id} className="template-card favorite">
                        <div
                          className="template-thumbnail"
                          style={{ backgroundColor: getThumbnailColor(template.model) }}
                        >
                          <span className="template-model-name">{getModelName(template.model)}</span>
                        </div>
                        <div className="template-info">
                          <h5 className="template-name">{template.name}</h5>
                          <p className="template-date">{formatDate(template.createdAt)}</p>
                        </div>
                        <div className="template-actions">
                          <button
                            className="template-action-button load-button"
                            onClick={() => onLoadTemplate(template.design, template.model)}
                            title="Load template"
                          >
                            <FolderOpen size={16} />
                          </button>
                          <button
                            className="template-action-button favorite-button"
                            onClick={() => toggleFavorite(template.id)}
                            title="Remove from favorites"
                          >
                            <StarOff size={16} />
                          </button>
                          <button
                            className="template-action-button delete-button"
                            onClick={() => deleteTemplate(template.id)}
                            title="Delete template"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* All templates */}
            <div className="all-templates">
              <h5 className="templates-subsection-title">All Templates</h5>
              <div className="templates-grid">
                {templates.map((template) => (
                  <div key={template.id} className="template-card">
                    <div className="template-thumbnail" style={{ backgroundColor: getThumbnailColor(template.model) }}>
                      <span className="template-model-name">{getModelName(template.model)}</span>
                    </div>
                    <div className="template-info">
                      <h5 className="template-name">{template.name}</h5>
                      <p className="template-date">{formatDate(template.createdAt)}</p>
                    </div>
                    <div className="template-actions">
                      <button
                        className="template-action-button load-button"
                        onClick={() => onLoadTemplate(template.design, template.model)}
                        title="Load template"
                      >
                        <FolderOpen size={16} />
                      </button>
                      <button
                        className="template-action-button favorite-button"
                        onClick={() => toggleFavorite(template.id)}
                        title={template.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {template.isFavorite ? <StarOff size={16} /> : <Star size={16} />}
                      </button>
                      <button
                        className="template-action-button delete-button"
                        onClick={() => deleteTemplate(template.id)}
                        title="Delete template"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DesignTemplates

