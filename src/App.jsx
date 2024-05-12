import { Canvas } from '@react-three/fiber'
import { KeyboardControls, OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import TetrisBlock from './components/Block';

function App() {

  const keyMapping = useMemo(() => [
    { name: "foward", keys: ["KeyW"] },
    { name: "back", keys: ["KeyS"] },
    { name: "left", keys: ["KeyA"] },
    { name: "right", keys: ["KeyD"] },
  ], []);
  const size = 6;
  const divisions = 6;
  const color = "gray"
  const texture = useMemo(() => new THREE.TextureLoader().load('./src/assets/brick_2.jpg'), []);

  return (
    <div id="canvas-container">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [5, 15, 10] }}>
        <OrbitControls />
        <PerspectiveCamera />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={2} castShadow color={"#fffff0"} />
        {/* <TetrisBlock/> */}
        <Suspense>
          <Physics debug>
          </Physics>
        </Suspense>
      </Canvas>
      <getBlock/>
    </div>
  )
}

export default App
