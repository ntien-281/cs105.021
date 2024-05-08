import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { Physics } from "@react-three/rapier";
import Grid from "./components/Grid";
import Ui from "./components/Ui";

function App() {
  const keyMapping = useMemo(
    () => [
      { name: "foward", keys: ["KeyW"] },
      { name: "back", keys: ["KeyS"] },
      { name: "left", keys: ["KeyA"] },
      { name: "right", keys: ["KeyD"] },
    ],
    []
  );
  const size = 10;
  const divisions = 6;
  const color = "gray";
  return (
    <>
      <div id="canvas-container">
        <Canvas
          camera={{ fov: 75, near: 0.1, far: 1000, position: [5, 15, 30] }}
        >
          <OrbitControls />
          <PerspectiveCamera />
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={2}
            castShadow
            color={"#fffff0"}
          />

          <Grid color={color} divisions={divisions} size={size} />

          <Suspense>
            <Physics debug></Physics>
          </Suspense>
        </Canvas>
      </div>
      <Ui />
    </>
  );
}

export default App;
