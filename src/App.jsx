import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';


const Cube = () => {
  const meshRef = useRef(null);

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <PerspectiveCamera />
      <boxGeometry args={[2,2,2]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

function App() {

  return (
    <div id="canvas-container">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Cube />
      </Canvas>
    </div>
  )
}

export default App
