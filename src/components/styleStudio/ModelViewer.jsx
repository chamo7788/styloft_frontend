import { forwardRef, useRef, Suspense, memo, useImperativeHandle } from "react"
import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, Environment, OrbitControls } from "@react-three/drei"
import { Vector3 } from "three"
import Model from "./Model"

// Create a loading fallback component
const LoadingFallback = () => (
  <mesh>
    <sphereGeometry args={[1, 16, 16]} />
    <meshStandardMaterial color="#cccccc" wireframe />
  </mesh>
)

// Memoize the Model component to prevent unnecessary re-renders
const MemoizedModel = memo(Model)

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

    // Update the ModelViewer component to expose the handleRotate method through the ref
    // First, modify the handleRotate function to make it accessible
    const handleRotate = (direction) => {
      if (!cameraRef.current) return

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

    // Then, expose the handleRotate method through the ref
    // Add this after the handleRotate function and before the return statement
    // This makes the handleRotate function accessible from the ref
    useImperativeHandle(
      ref,
      () => ({
        handleRotate: (direction) => {
          console.log("ModelViewer handleRotate called with direction:", direction)
          if (!cameraRef.current) {
            console.error("Camera ref is not available")
            return
          }

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
        },
      }),
      [cameraRef],
    )

    return (
      <Canvas
        shadows
        className="canvas"
        ref={ref}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 10], fov: 45 }}
        performance={{ min: 0.5 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} ref={cameraRef} />
        <ambientLight intensity={lighting.intensity} />
        <directionalLight
          position={lighting.direction}
          intensity={lighting.intensity}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <Environment preset={lighting.environment} />

        <Suspense fallback={<LoadingFallback />}>
          <MemoizedModel
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

        <OrbitControls enableZoom={true} enableDamping={true} dampingFactor={0.25} />
      </Canvas>
    )
  },
)

ModelViewer.displayName = "ModelViewer"

export default ModelViewer

