"use client"

import { useState } from "react"

export const useCanvasHistory = (selectedPart, canvasRef) => {
  const [canvasHistory, setCanvasHistory] = useState({})
  const [canvasHistoryIndex, setCanvasHistoryIndex] = useState({})

  // Save current canvas state for undo
  const saveCanvasState = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Get current canvas data
    const imageData = canvas.toDataURL()

    // Get current history for this part
    const partHistory = canvasHistory[selectedPart] || []
    const partHistoryIndex = canvasHistoryIndex[selectedPart] || 0

    // Remove any future history if we're not at the end
    const newPartHistory = partHistory.slice(0, partHistoryIndex + 1)

    // Add current state to history
    newPartHistory.push(imageData)

    // Update history
    setCanvasHistory({
      ...canvasHistory,
      [selectedPart]: newPartHistory,
    })

    // Update index
    setCanvasHistoryIndex({
      ...canvasHistoryIndex,
      [selectedPart]: newPartHistory.length - 1,
    })
  }

  // Undo canvas change
  const handleCanvasUndo = () => {
    const partHistory = canvasHistory[selectedPart] || []
    const partHistoryIndex = canvasHistoryIndex[selectedPart] || 0

    if (partHistoryIndex > 0) {
      const newIndex = partHistoryIndex - 1
      const previousState = partHistory[newIndex]

      // Load previous state
      if (previousState) {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
        img.src = previousState
      }

      // Update index
      setCanvasHistoryIndex({
        ...canvasHistoryIndex,
        [selectedPart]: newIndex,
      })
    }
  }

  return {
    canvasHistory,
    setCanvasHistory,
    canvasHistoryIndex,
    setCanvasHistoryIndex,
    saveCanvasState,
    handleCanvasUndo,
  }
}

