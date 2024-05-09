import { Canvas } from '@react-three/fiber'
import { KeyboardControls, OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { Physics } from '@react-three/rapier';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

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
  const blockColor = new THREE.Color("purple");
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
          <group position={[-10, -5, 0]}>
              <gridHelper
                  args={[size, divisions, color]}
                  position={[size / 2, 0, size / 2]} />
              <gridHelper
                  args={[size, divisions, color]}
                  rotation={[Math.PI / 2, 0, Math.PI / 2]}
                  position={[0, 3 * size / 2, size / 2]} />
              <gridHelper
                  args={[size, divisions, color]}
                  rotation={[Math.PI / 2, 0, Math.PI / 2]}
                  position={[0, size / 2, size / 2]} />
              <gridHelper
                  args={[size, divisions, color]}
                  rotation={[Math.PI / 2, 0, 0]}
                  position={[size / 2, 3 * size / 2, 0]} />
              <gridHelper
                  args={[size, divisions, color]}
                  rotation={[Math.PI / 2, 0, 0]}
                  position={[size / 2, size / 2, 0]} />
            </group>
            <Html position={[5, 10, 0]} className='instructions-label'>
              <ul>
                  <li><strong>Drag:</strong> <span>Mouse</span></li>
                  <li><strong>Rotate:</strong>
                      <ul>
                          <li><strong>X-axis:</strong> Q</li>
                          <li><strong>Y-axis:</strong> E</li>
                          <li><strong>Z-axis:</strong> R</li>
                      </ul>
                  </li>
                  <li><strong>Hard Drop:</strong> <span>Space</span></li>
              </ul>
            </Html>
            <group>
              <Box position={[-1, 0, 0]} color={blockColor}/>
              <Box position={[0, 0, 0]} color={blockColor} />
              <Box position={[1, 0, 0]} color={blockColor} />
              <Box position={[1, 1, 0]} color={blockColor} />
            </group>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
