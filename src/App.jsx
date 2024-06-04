import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import Grid from "./components/Grid";
import Ui from "./components/Ui";
import Header from "./components/Header";
import Lights from "./components/Lights";
import CameraController from "./components/CameraController";
import { useGameStore } from "./store/store";
import { generateRandomGroup } from "./utils/block";

// Game parameters
const size = 12; // equal box size times 6
const divisions = 6;
const color = "gray";

function App() {
  const nextBlock = useGameStore(state => state.nextBlock);
  const setNextBlock = useGameStore(state => state.setNextBlock);

  

  return (
    <>
      <Header />

      <div id="canvas-container">
        <Canvas
          camera={{ fov: 60, near: 0.1, far: 1000, position: [30, 40, 30] }}
          shadows
        >
          <CameraController />
          <Lights />

          <Grid color={color} divisions={divisions} size={size} />
          {/* <Suspense>
            <Physics debug></Physics>
          </Suspense> */}
        </Canvas>
        
      </div>
      <Ui />
    </>
  );
}

export default App;