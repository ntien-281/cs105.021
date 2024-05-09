import { Canvas } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { Physics } from "@react-three/rapier";
import Grid from "./components/Grid";
import Ui from "./components/Ui";
import Header from "./components/Header";
import Lights from "./components/Lights";
import CameraController from "./components/CameraController";

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
  const size = 12; // equal box size times 6
  const box_size = 2;
  const divisions = 6;
  const color = "gray";


  return (
    <>
      <Header />

      <div id="canvas-container">
        <Canvas
          camera={{ fov: 60, near: 0.1, far: 1000, position: [20, 20, 20] }}
          shadows
        >
          <CameraController />
          <Lights />

          <Grid color={color} divisions={divisions} size={size} />

          {/* INFO: Mẫu block */}
          <group position={[0, -3, 0]}>
            <RoundedBox args={[box_size, box_size, box_size]} position={[1,1,1]} castShadow receiveShadow>
              <meshStandardMaterial color="#00ff00" />
            </RoundedBox>
            <RoundedBox args={[box_size, box_size, box_size]} position={[1,1,1 + box_size]} castShadow receiveShadow>
              <meshStandardMaterial color="#00ff00" />
            </RoundedBox>
            <RoundedBox args={[box_size, box_size, box_size]} position={[1,1 + box_size,1]} castShadow receiveShadow>
              <meshStandardMaterial color="#00ff00" />
            </RoundedBox>
            <RoundedBox args={[box_size, box_size, box_size]} position={[1 + box_size,1,1]} castShadow receiveShadow>
              <meshStandardMaterial color="#00ff00" />
            </RoundedBox>
          </group>

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
