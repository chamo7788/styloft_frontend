"use client"

import { useRef, useState, useEffect } from "react"
import { useGLTF } from "@react-three/drei"
import { TextureLoader } from "three"
import { useFrame } from "@react-three/fiber"

function Model({ modelPath, colors, materials, modelType, modelSettings, modelParts, selectedPart, setSelectedPart }) {
  const { scene } = useGLTF(modelPath, true)
  const modelRef = useRef()
  const [textures, setTextures] = useState({})

  // Load textures when materials change
  useEffect(() => {
    const newTextures = {}
    const loader = new TextureLoader()

    Object.entries(materials).forEach(([part, material]) => {
      if (material) {
        loader.load(material, (texture) => {
          newTextures[part] = texture
          setTextures((prev) => ({ ...prev, [part]: texture }))
        })
      }
    })
  }, [materials])

  // Handle part selection on click
  const handleClick = (e) => {
    e.stopPropagation()
    // Get the clicked mesh name and find which part it belongs to
    const meshName = e.object.name.toLowerCase()

    // This is a simplified example - in a real app, you'd map mesh names to parts
    // based on your model structure
    const part =
      modelParts[modelType].find((part) => meshName.includes(part) || part.includes(meshName)) ||
      modelParts[modelType][0]

    setSelectedPart(part)
  }

  useFrame(() => {
    if (modelRef.current) {
      const { scale, position } = modelSettings[modelType]
      modelRef.current.scale.set(scale, scale, scale)
      modelRef.current.position.set(...position)

      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          // Determine which part this mesh belongs to
          // This is simplified - in a real app, you'd have a more robust mapping
          const meshName = child.name.toLowerCase()
          const part =
            modelParts[modelType].find((part) => meshName.includes(part) || part.includes(meshName)) ||
            modelParts[modelType][0]

          // Apply the color for this part
          child.material.color.set(colors[part] || colors.main || "#ffffff")

          // Apply texture if available
          if (textures[part]) {
            child.material.map = textures[part]
            child.material.needsUpdate = true
          }
        }
      })
    }
  })

  return <primitive ref={modelRef} object={scene} onClick={handleClick} />
}

export default Model

