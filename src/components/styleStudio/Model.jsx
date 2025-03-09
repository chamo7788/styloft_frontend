"use client"

import { useRef, useState, useEffect, createRef } from "react"
import { useGLTF, Text } from "@react-three/drei"
import { TextureLoader } from "three"
import { useFrame, useThree } from "@react-three/fiber"

function Model({
  modelPath,
  colors,
  materials,
  modelType,
  modelSettings,
  modelParts,
  selectedPart,
  setSelectedPart,
  textElements,
  selectedTextIndex,
  onTextSelect,
  onTextMove,
}) {
  const { scene } = useGLTF(modelPath, true)
  const modelRef = useRef()
  const [textures, setTextures] = useState({})
  const { camera } = useThree()
  const textRefs = useRef([])

  // Initialize text refs
  useEffect(() => {
    textRefs.current = textElements.map((_, i) => textRefs.current[i] || createRef())
  }, [textElements])

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

    // Check if we clicked on text
    if (e.object.isText) {
      const textIndex = textElements.findIndex((_, i) => textRefs.current[i]?.current === e.object)
      if (textIndex !== -1) {
        onTextSelect(textIndex)
        return
      }
    }

    // Otherwise, select the part that was clicked
    const meshName = e.object.name.toLowerCase()
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

  return (
    <group>
      <primitive ref={modelRef} object={scene} onClick={handleClick} />

      {/* Render text elements */}
      {textElements &&
        textElements.map((element, index) => (
          <Text
            ref={textRefs.current[index]}
            key={index}
            color={element.color}
            fontSize={element.fontSize * 0.02} // Scale down for 3D space
            position={element.position}
            anchorX={element.textAlign || "center"}
            anchorY="middle"
            fontWeight={element.fontWeight || "normal"}
            fontStyle={element.fontStyle || "normal"}
            onClick={(e) => {
              e.stopPropagation()
              onTextSelect(index)
            }}
            // Make text always face the camera
            lookAt={camera.position}
            // Add a small offset to prevent z-fighting
            renderOrder={1}
            // Highlight selected text
            userData={{ isSelected: index === selectedTextIndex }}
          >
            {element.text}
            {index === selectedTextIndex && <meshBasicMaterial color={element.color} transparent opacity={0.8} />}
          </Text>
        ))}
    </group>
  )
}

export default Model

