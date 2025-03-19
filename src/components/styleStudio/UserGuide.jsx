"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Shirt, PenIcon, Palette, Grid, Wand2, Sun, Save, Layers } from "lucide-react"
import welcomeImage from "../../assets/images/StyleStudio/welcome.png"

const UserGuide = ({ onClose, showOnStartup, setShowOnStartup }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(!showOnStartup)

  const steps = [
    {
      title: "Welcome to Style Studio",
      content:
        "Your powerful 3D garment design tool that brings your fashion ideas to life. Let's take a quick tour to help you get started.",
      image: welcomeImage,
      icon: <Shirt size={24} />,
    },
    {
      title: "Choose Your Model",
      content:
        "Start by selecting the garment type you want to design. Choose from shirts, trousers, shorts, or frocks.",
      image: "/assets/images/StyleStudio/model-selection.png",
      icon: <Shirt size={24} />,
    },
    {
      title: "Customize Colors",
      content:
        "Select different parts of your garment and apply colors. You can use the color picker or choose from suggested color palettes.",
      image: "/assets/images/StyleStudio/color-customization.png",
      icon: <Palette size={24} />,
    },
    {
      title: "Apply Textures & Patterns",
      content:
        "Add textures and patterns to your design. Upload your own images or use our pattern generator to create unique looks.",
      image: "/assets/images/StyleStudio/textures.png",
      icon: <Grid size={24} />,
    },
    {
      title: "Add Text & Logos",
      content:
        "Personalize your design with text and logos. Use the texture editor to position and customize these elements.",
      image: "/assets/images/StyleStudio/text-logo.png",
      icon: <PenIcon size={24} />,
    },
    {
      title: "Adjust Lighting",
      content:
        "Change the lighting to see how your design looks in different environments. Adjust intensity and direction for the perfect view.",
      image: "/assets/images/StyleStudio/lighting.png",
      icon: <Sun size={24} />,
    },
    {
      title: "Manage Layers",
      content:
        "Use the layer manager to organize and adjust the elements in your design. Reorder, hide, or lock layers as needed.",
      image: "/assets/images/StyleStudio/layers.png",
      icon: <Layers size={24} />,
    },
    {
      title: "Save & Share",
      content:
        "Save your designs to your account and publish them to your portfolio. You can also download screenshots of your creations.",
      image: "/assets/images/StyleStudio/save-share.png",
      icon: <Save size={24} />,
    },
    {
      title: "You're Ready to Design!",
      content:
        "Now you know the basics of Style Studio. Explore and experiment to create amazing designs. Happy creating!",
      image: "/assets/images/StyleStudio/ready.png",
      icon: <Wand2 size={24} />,
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    // Update the showOnStartup preference based on checkbox
    if (setShowOnStartup) {
      setShowOnStartup(!dontShowAgain)
    }

    // Close the guide
    if (onClose) {
      onClose()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        handleNext()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        handlePrevious()
      } else if (e.key === "Escape") {
        handleClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep])

  return (
    <div className="user-guide-overlay">
      <div className="user-guide-modal">
        <button className="user-guide-close" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="user-guide-content">
          <div className="user-guide-header">
            <div className="user-guide-icon">{steps[currentStep].icon}</div>
            <h2 className="user-guide-title">{steps[currentStep].title}</h2>
          </div>

          <div className="user-guide-body">
            <div className="user-guide-image">
              {/* Placeholder image - replace with actual screenshots */}
              <div className="user-guide-placeholder">
                {steps[currentStep].image ? (
                  <img
                    src={steps[currentStep].image || "/placeholder.svg"}
                    alt={steps[currentStep].title}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg?height=300&width=500"
                    }}
                  />
                ) : (
                  <div className="user-guide-placeholder-icon">{steps[currentStep].icon}</div>
                )}
              </div>
            </div>

            <p className="user-guide-description">{steps[currentStep].content}</p>
          </div>

          <div className="user-guide-progress">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentStep ? "active" : ""}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          <div className="user-guide-footer">
            <div className="user-guide-checkbox">
              <input
                type="checkbox"
                id="dont-show-again"
                checked={dontShowAgain}
                onChange={() => setDontShowAgain(!dontShowAgain)}
              />
              <label htmlFor="dont-show-again">Don't show this guide again</label>
            </div>

            <div className="user-guide-buttons">
              {currentStep > 0 && (
                <button className="user-guide-button secondary" onClick={handlePrevious}>
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
              )}

              <button className="user-guide-button primary" onClick={handleNext}>
                <span>{currentStep < steps.length - 1 ? "Next" : "Get Started"}</span>
                {currentStep < steps.length - 1 ? <ChevronRight size={16} /> : null}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserGuide

