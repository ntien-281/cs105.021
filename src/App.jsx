import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Physics } from "@react-three/rapier";
import Grid from "./components/Grid";
import Ui from "./components/Ui";
import Header from "./components/Header";
import Lights from "./components/Lights";
import CameraController from "./components/CameraController";
import Block from "./components/Block";
import { useGameStore } from "./store/store";

// Game parameters
const size = 12; // equal box size times 6
const divisions = 6;
const color = "gray";

function App() {

  return (
    <>
      <Header />

      <div id="canvas-container">
        <Canvas
          camera={{ fov: 60, near: 0.1, far: 1000, position: [20, 20, 40] }}
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