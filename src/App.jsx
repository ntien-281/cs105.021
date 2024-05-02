import { Canvas } from '@react-three/fiber'
import { KeyboardControls, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Husk from './loaders/Husk/Husk'
import LevelStage from './components/LevelStage/LevelStage';
import { Suspense, useMemo } from 'react';
import CharacterController from './components/CharacterController/CharacterController';
import { Physics } from '@react-three/rapier';


function App() {

  const keyMapping = useMemo(() => [
    { name: "foward", keys: ["KeyW"] },
    { name: "back", keys: ["KeyS"] },
    { name: "left", keys: ["KeyA"] },
    { name: "right", keys: ["KeyD"] },
  ], []);

  return (
    <div id="canvas-container">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [5, 15, 10] }}>
        <OrbitControls />
        <PerspectiveCamera />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={2} castShadow color={"#fffff0"} />


        <Suspense>
          <Physics debug>
            
          {/* TODO: create grid box 3d & right UI */}
            
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
