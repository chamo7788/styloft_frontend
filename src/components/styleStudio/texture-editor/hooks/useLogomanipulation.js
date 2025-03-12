"use client"

import { useState } from "react"

export const useLogoManipulation = (canvasLogos, setCanvasLogos, selectedLogoIndex, redrawCanvas) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const [rotateStartAngle, setRotateStartAngle] = useState(0)

  // Find which logo (if any) is at the given position
  const findLogoAtPosition = (x, y, canvasRef) => {
    for (let i = canvasLogos.length - 1; i >= 0; i--) {
      const logo = canvasLogos[i]

      // Get logo center
      const centerX = logo.x + logo.width / 2
      const centerY = logo.y + logo.height / 2

      // Translate point to origin
      const translatedX = x - centerX
      const translatedY = y - centerY

      // Rotate point in the opposite direction of logo rotation
      const rotation = logo.rotation || 0
      const rotatedX = translatedX * Math.cos(-rotation) - translatedY * Math.sin(-rotation)
      const rotatedY = translatedX * Math.sin(-rotation) + translatedY * Math.cos(-rotation)

      // Check if point is inside the logo's bounding box
      if (
        rotatedX >= -logo.width / 2 &&
        rotatedX <= logo.width / 2 &&
        rotatedY >= -logo.height / 2 &&
        rotatedY <= logo.height / 2
      ) {
        return i
      }
    }
    return -1
  }

  // Get which control point (if any) is at the given position
  const getControlPoint = (x, y, logo, canvasRef) => {
    const centerX = logo.x + logo.width / 2
    const centerY = logo.y + logo.height / 2
    const rotation = logo.rotation || 0

    // Check rotation handle
    // Apply rotation to the rotation handle position
    const rotateHandleX = centerX
    const rotateHandleY = centerY - logo.height / 2 - 25

    // Calculate distance to rotation handle
    const distToRotate = Math.sqrt(Math.pow(x - rotateHandleX, 2) + Math.pow(y - rotateHandleY, 2))
    if (distToRotate <= 8) {
      // Slightly larger hit area
      return "rotate"
    }

    // Calculate corner positions with rotation
    const halfWidth = logo.width / 2
    const halfHeight = logo.height / 2

    const corners = [
      {
        // Top-left
        x: -halfWidth,
        y: -halfHeight,
      },
      {
        // Top-right
        x: halfWidth,
        y: -halfHeight,
      },
      {
        // Bottom-right
        x: halfWidth,
        y: halfHeight,
      },
      {
        // Bottom-left
        x: -halfWidth,
        y: halfHeight,
      },
    ]

    // Apply rotation and translation to each corner
    const rotatedCorners = corners.map((corner) => {
      const rotatedX = corner.x * Math.cos(rotation) - corner.y * Math.sin(rotation)
      const rotatedY = corner.x * Math.sin(rotation) + corner.y * Math.cos(rotation)
      return {
        x: rotatedX + centerX,
        y: rotatedY + centerY,
      }
    })

    // Check if cursor is near any corner
    for (let i = 0; i < rotatedCorners.length; i++) {
      const dist = Math.sqrt(Math.pow(x - rotatedCorners[i].x, 2) + Math.pow(y - rotatedCorners[i].y, 2))
      if (dist <= 8) {
        // Slightly larger hit area
        return `resize-${i}`
      }
    }

    return null
  }

  // Handle logo manipulation (drag, resize, rotate)
  const handleLogoManipulation = (
    e,
    { isDragging, isResizing, isRotating, resizeHandle, dragStartPos, rotateStartAngle, setRotateStartAngle },
  ) => {
    if (!canvasLogos || selectedLogoIndex === null) return

    const canvas = e.target
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (isDragging) {
      // Handle logo dragging
      const newLogos = [...canvasLogos]
      newLogos[selectedLogoIndex] = {
        ...newLogos[selectedLogoIndex],
        x: x - dragStartPos.x,
        y: y - dragStartPos.y,
      }
      setCanvasLogos(newLogos)
      redrawCanvas()
    } else if (isResizing && resizeHandle) {
      // Handle logo resizing with rotation
      const logo = canvasLogos[selectedLogoIndex]
      const handleIndex = Number.parseInt(resizeHandle.split("-")[1])
      const rotation = logo.rotation || 0

      // Get logo center
      const centerX = logo.x + logo.width / 2
      const centerY = logo.y + logo.height / 2

      // Translate mouse position relative to center
      const relativeX = x - centerX
      const relativeY = y - centerY

      // Rotate mouse position to align with logo's coordinate system
      const rotatedX = relativeX * Math.cos(-rotation) - relativeY * Math.sin(-rotation)
      const rotatedY = relativeX * Math.sin(-rotation) + relativeY * Math.cos(-rotation)

      // Calculate new dimensions based on the handle being dragged
      let newWidth, newHeight

      // Determine which corner is being dragged and calculate new dimensions
      switch (handleIndex) {
        case 0: // Top-left
          newWidth = logo.width - 2 * rotatedX
          newHeight = logo.height - 2 * rotatedY
          break
        case 1: // Top-right
          newWidth = logo.width + 2 * rotatedX
          newHeight = logo.height - 2 * rotatedY
          break
        case 2: // Bottom-right
          newWidth = logo.width + 2 * rotatedX
          newHeight = logo.height + 2 * rotatedY
          break
        case 3: // Bottom-left
          newWidth = logo.width - 2 * rotatedX
          newHeight = logo.height + 2 * rotatedY
          break
      }

      // Ensure minimum size
      if (newWidth > 20 && newHeight > 20) {
        // Calculate new center position to maintain the opposite corner fixed
        const oppositeIndex = (handleIndex + 2) % 4
        const oppositeX =
          oppositeIndex === 1 || oppositeIndex === 2 ? centerX + logo.width / 2 : centerX - logo.width / 2
        const oppositeY =
          oppositeIndex === 2 || oppositeIndex === 3 ? centerY + logo.height / 2 : centerY - logo.height / 2

        // Calculate new center
        const newCenterX = (x + oppositeX) / 2
        const newCenterY = (y + oppositeY) / 2

        // Update logo with new dimensions and position
        const newLogos = [...canvasLogos]
        newLogos[selectedLogoIndex] = {
          ...newLogos[selectedLogoIndex],
          width: newWidth,
          height: newHeight,
          x: newCenterX - newWidth / 2,
          y: newCenterY - newHeight / 2,
        }
        setCanvasLogos(newLogos)
        redrawCanvas()
      }
    } else if (isRotating) {
      // Handle logo rotation
      const logo = canvasLogos[selectedLogoIndex]
      const centerX = logo.x + logo.width / 2
      const centerY = logo.y + logo.height / 2

      // Calculate angle
      const currentAngle = Math.atan2(y - centerY, x - centerX)
      const rotationDelta = currentAngle - rotateStartAngle

      // Update logo rotation
      const newLogos = [...canvasLogos]
      newLogos[selectedLogoIndex] = {
        ...newLogos[selectedLogoIndex],
        rotation: (logo.rotation || 0) + rotationDelta,
      }
      setCanvasLogos(newLogos)
      setRotateStartAngle(currentAngle)
      redrawCanvas()
    }
  }

  return {
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    isRotating,
    setIsRotating,
    resizeHandle,
    setResizeHandle,
    dragStartPos,
    setDragStartPos,
    rotateStartAngle,
    setRotateStartAngle,
    findLogoAtPosition,
    getControlPoint,
    handleLogoManipulation,
  }
}

