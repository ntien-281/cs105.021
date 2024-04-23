import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Husk from './loaders/Husk/Husk'
import LevelStage from './components/LevelStage/LevelStage';


function App() {

  return (
    <div id="canvas-container">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [5, 30, 40] }}>
        <OrbitControls />
        <PerspectiveCamera />

        {/* <ambientLight intensity={2} /> */}
        <directionalLight position={[5, 5, 5]} intensity={2} castShadow color={"#fffff0"} />

        {/* INFO: Floor */}
        <LevelStage />

        <Husk castShadow />
      </Canvas>
    </div>
  )
}

export default App
