import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { TextureLoader } from 'three';
import PropTypes from 'prop-types';
import ColorPicker from './ColorPicker';
import MaterialUploader from './MaterialUploader';
import "../../assets/css/StyleStudio/Viewer.css";

function Model({ color, material,  }) {
  const { scene } = useGLTF('/models/shirt_baked.glb', true);
  const modelRef = useRef();
  const texture = material ? useLoader(TextureLoader, material) : null;

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(6.5, 6.5, 6.5); // Set the scale to a fixed size
      modelRef.current.position.set(0, 0, 0); // Set the position to a fixed point
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(color); // Set the model color
          if (material) {
            child.material.map = texture; // Set the model material
            child.material.needsUpdate = true;
          }
        }
      });
    }
  });

  return <primitive ref={modelRef} object={scene} />;
}

Model.propTypes = {
  color: PropTypes.string.isRequired,
  material: PropTypes.string,
};

const Viewer = () => {
  const [color, setColor] = useState('#ffffff'); // Default color
  const [material, setMaterial] = useState(null); // Default material

  return (
      <div className="canvas-container">
        <Canvas shadows


                >
          <ambientLight intensity={0.5}/>
          <pointLight position={[10, 10, 10]}/>
          <directionalLight position={[5, 5, 5]} />
          <pointLight position={[-10, -10, -10]}/>
          <Suspense fallback={null}>
            <Model color={color} material={material}/>
          </Suspense>
          <OrbitControls enableZoom={false}/>
        </Canvas>
        <MaterialUploader onMaterialUpload={setMaterial} />
        <div className="controls">
          <ColorPicker onColorChange={setColor} />

        </div>
      </div>
  );
};

export default Viewer;