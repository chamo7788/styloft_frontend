import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { TextureLoader } from 'three';
import PropTypes from 'prop-types';
import ColorPicker from './ColorPicker';
import MaterialUploader from './MaterialUploader';
import "../../assets/css/StyleStudio/Viewer.css";

const models = {
  shirt: '/models/shirt_baked.glb',
  trouser: '/models/1861_trousers.glb',
  short: '/models/man_shorts.glb',
  frock: '/models/ladies_black_frock.glb',
};

// Model settings for different scale and position
const modelSettings = {
  shirt: { scale: 6.5, position: [0, .5, 0] },
  trouser: { scale: 4, position: [0, -2.5, 0] },
  short: { scale: 4.5, position: [0, -3.3, 0] },
  frock: { scale: 3, position: [0, -4.2, 0] }
};

function Model({ modelPath, color, material, modelType }) {
  const { scene } = useGLTF(modelPath, true); // Load the model
  const modelRef = useRef();
  const texture = material ? useLoader(TextureLoader, material) : null;

  useFrame(() => {
    if (modelRef.current) {
      const { scale, position } = modelSettings[modelType]; // Get scale and position for the selected model
      modelRef.current.scale.set(scale, scale, scale);
      modelRef.current.position.set(...position);
      
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(color);
          if (material) {
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        }
      });
    }
  });

  return <primitive ref={modelRef} object={scene} />;
}

Model.propTypes = {
  modelPath: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  material: PropTypes.string,
  modelType: PropTypes.string.isRequired, // Added modelType prop
};

const Viewer = () => {
  const [color, setColor] = useState('#ffffff');
  const [material, setMaterial] = useState(null);
  const [selectedModel, setSelectedModel] = useState('shirt'); // Default model
  const [modelKey, setModelKey] = useState(0); // State to force reload of the model

  // Reset the model key when the selected model changes
  useEffect(() => {
    setModelKey(prevKey => prevKey + 1); // Update the key to force reloading the model
  }, [selectedModel]);

  return (
    <div className="canvas-container">
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[5, 5, 5]} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <Model
            key={modelKey}  // Adding the key ensures the model gets reloaded when the model changes
            modelPath={models[selectedModel]}
            color={color}
            material={material}
            modelType={selectedModel} // Pass selected model type
          />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* Buttons to switch models */}
      <div className="model-selector">
        <button onClick={() => setSelectedModel('shirt')}>Shirt</button>
        <button onClick={() => setSelectedModel('trouser')}>Trouser</button>
        <button onClick={() => setSelectedModel('short')}>Short</button>
        <button onClick={() => setSelectedModel('frock')}>Frock</button>
      </div>

      <MaterialUploader onMaterialUpload={setMaterial} />
      <div className="controls">
        <ColorPicker onColorChange={setColor} />
      </div>
    </div>
  );
};

export default Viewer;
