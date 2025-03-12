"use client"

import { useRef, useState, useEffect, createRef, useMemo } from "react"
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
  logoElements,
  selectedLogoIndex,
  onLogoSelect,
  textures,
}) {
  const { scene } = useGLTF(modelPath, true)
  const modelRef = useRef()
  const [loadedTextures, setLoadedTextures] = useState({})
  const { camera } = useThree()
  const textRefs = useRef([])
  const logoRefs = useRef([])

  // Initialize refs
  useEffect(() => {
    textRefs.current = textElements.map((_, i) => textRefs.current[i] || createRef())
    logoRefs.current = logoElements.map((_, i) => logoRefs.current[i] || createRef())
  }, [textElements, logoElements])

  // Load textures when materials change
  useEffect(() => {
    const newTextures = {}
    const loader = new TextureLoader()

    Object.entries(materials).forEach(([part, material]) => {
      if (material) {
        loader.load(material, (texture) => {
          newTextures[part] = texture
          setLoadedTextures((prev) => ({ ...prev, [part]: texture }))
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

    // Check if we clicked on a logo
    if (e.object.isLogo) {
      const logoIndex = logoElements.findIndex((_, i) => logoRefs.current[i]?.current === e.object)
      if (logoIndex !== -1) {
        onLogoSelect(logoIndex)
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

          // Apply texture if available from materials
          if (loadedTextures[part]) {
            child.material.map = loadedTextures[part]
            child.material.needsUpdate = true
          }

          // Apply canvas texture if available
          if (textures && textures[part]) {
            child.material.map = textures[part]
            child.material.needsUpdate = true
          }
        }
      })
    }
  })

  // Load logo textures using useMemo to avoid recreating them on every render
  const logoTextures = useMemo(() => {
    return logoElements.map((logo) => {
      return new TextureLoader().load(logo.image)
    })
  }, [logoElements])

  // Render logo elements
  const logoMeshes = logoElements.map((logo, index) => {
    const texture = logoTextures[index]

    return (
      <mesh
        key={`logo-${index}`}
        position={logo.position}
        rotation={logo.rotation}
        onClick={(e) => {
          e.stopPropagation()
          onLogoSelect(index)
        }}
        userData={{ isLogo: true }}
      >
        <planeGeometry args={[logo.size, logo.size]} />
        <meshBasicMaterial map={texture} transparent opacity={selectedLogoIndex === index ? 0.8 : 1} />
      </mesh>
    )
  })

  return (
    <group>
      <primitive ref={modelRef} object={scene} onClick={handleClick} />

      {/* Render text elements with improved positioning and wrapping */}
      {textElements &&
        textElements.map((element, index) => (
          <group
            key={`text-group-${index}`}
            position={element.position}
            onClick={(e) => {
              e.stopPropagation()
              onTextSelect(index)
            }}
          >
            <Text
              ref={textRefs.current[index]}
              color={element.color}
              fontSize={element.fontSize * 0.02}
              maxWidth={2} // Add text wrapping support
              lineHeight={1.2}
              textAlign={element.textAlign || "center"}
              anchorX={element.textAlign || "center"}
              anchorY="middle"
              fontWeight={element.fontWeight || "normal"}
              fontStyle={element.fontStyle || "normal"}
              renderOrder={1}
              userData={{ isText: true, isSelected: index === selectedTextIndex }}
              material-toneMapped={false} // Ensures text color is accurate
              material-transparent={true}
              material-depthTest={true}
              material-depthWrite={true}
              material-opacity={0.95}
              outlineWidth={index === selectedTextIndex ? 0.01 : 0} // Highlight selected text
              outlineColor="#ffffff"
            >
              {element.text}
            </Text>

            {/* Add a draggable handle when text is selected */}
            {index === selectedTextIndex && (
              <mesh
                position={[0, 0, 0.05]}
                scale={[element.text.length * element.fontSize * 0.0008, element.fontSize * 0.0015, 0.001]}
                userData={{ isDragHandle: true }}
              >
                <planeGeometry />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
              </mesh>
            )}
          </group>
        ))}
      {logoMeshes}
    </group>
  )
}

export default Model

