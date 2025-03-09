import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

function TextControls({ textElements, onRemoveText, onUpdateTextPosition }) {
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handleSelectText = (index) => {
    setSelectedTextIndex(index);
    if (textElements[index]) {
      const [x, y, z] = textElements[index].position || [0, 0, 0];
      setPosition({ x, y, z });
    }
  };

  const handlePositionChange = (axis, value) => {
    const newPosition = { ...position, [axis]: Number.parseFloat(value) };
    setPosition(newPosition);

    if (selectedTextIndex !== null) {
      onUpdateTextPosition(selectedTextIndex, [newPosition.x, newPosition.y, newPosition.z]);
    }
  };

  return (
    <div className="text-controls">
      <div ref={mountRef}></div>
      {textElements.length > 0 && (
        <div className="text-elements">
          <label className="text-elements-label">Text Elements</label>
          <div className="text-elements-list">
            {textElements.map((element, index) => (
              <div
                key={index}
                className={`text-element ${selectedTextIndex === index ? "text-element-selected" : ""}`}
                onClick={() => handleSelectText(index)}
              >
                <span
                  className="text-element-preview"
                  style={{
                    color: element.color,
                    fontSize: `${Math.min(element.fontSize, 24)}px`,
                  }}
                >
                  {element.text}
                </span>
                <button
                  className="text-element-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveText(index);
                    if (selectedTextIndex === index) {
                      setSelectedTextIndex(null);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {selectedTextIndex !== null && (
            <div className="text-position-controls">
              <h4 className="text-position-title">Position</h4>

              <div className="text-position-control">
                <label>X:</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={position.x}
                  onChange={(e) => handlePositionChange("x", e.target.value)}
                />
                <span>{position.x.toFixed(1)}</span>
              </div>

              <div className="text-position-control">
                <label>Y:</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={position.y}
                  onChange={(e) => handlePositionChange("y", e.target.value)}
                />
                <span>{position.y.toFixed(1)}</span>
              </div>

              <div className="text-position-control">
                <label>Z:</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={position.z}
                  onChange={(e) => handlePositionChange("z", e.target.value)}
                />
                <span>{position.z.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TextControls;

