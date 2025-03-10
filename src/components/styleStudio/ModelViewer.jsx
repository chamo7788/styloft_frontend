"use client"

import { forwardRef, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, Environment, OrbitControls } from "@react-three/drei"
import { Vector3 } from "three"
import Model from "./Model"

const ModelViewer = forwardRef(
  (
    {
      modelKey,
      selectedModel,
      modelPath,
      colors,
      materials,
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
      lighting,
    },
    ref,
  ) => {
    const cameraRef = useRef(null)

    // Handle camera rotation
    const handleRotate = (direction) => {
      if (cameraRef.current) {
        const currentPosition = new Vector3().copy(cameraRef.current.position)

        if (direction === "left") {
          cameraRef.current.position.x = currentPosition.z
          cameraRef.current.position.z = -currentPosition.x
        } else if (direction === "right") {
          cameraRef.current.position.x = -currentPosition.z
          cameraRef.current.position.z = currentPosition.x
        } else if (direction === "reset") {
          cameraRef.current.position.set(0, 0, 10)
        }

        cameraRef.current.lookAt(0, 0, 0)
      }
    }

    return (
      <Canvas shadows className="canvas" ref={ref}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} ref={cameraRef} />
        <ambientLight intensity={lighting.intensity} />
        <directionalLight position={lighting.direction} intensity={lighting.intensity} castShadow />
        <Environment preset={lighting.environment} />

        <Suspense fallback={null}>
          <Model
            key={modelKey}
            modelPath={modelPath}
            colors={colors}
            materials={materials}
            modelType={selectedModel}
            modelSettings={modelSettings}
            modelParts={modelParts}
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
            textElements={textElements}
            selectedTextIndex={selectedTextIndex}
            onTextSelect={onTextSelect}
            logoElements={logoElements}
            selectedLogoIndex={selectedLogoIndex}
            onLogoSelect={onLogoSelect}
            textures={textures}
          />
        </Suspense>

        <OrbitControls enableZoom={true} />
      </Canvas>
    )
  },
)

ModelViewer.displayName = "ModelViewer"

export default ModelViewer

