import { CylinderCollider, Physics, RigidBody } from "@react-three/rapier";
import { ContactShadows, Cylinder } from "@react-three/drei";

const LevelStage = () => {
  return (
    <>
      {/* Lower level */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial color={"#f3e5ab"} toneMapped={false} />
      </mesh>

      {/* INFO: Main stage */}
      <Physics>
        <RigidBody colliders={false} type="fixed" position-y={-2}>
          <CylinderCollider args={[1 / 2, 5]} />
          {/* scale x-radius, height, y-radius */}
          <Cylinder scale={[15, 1.5, 15]}>
            <meshBasicMaterial color={"#ee4b2b"} />
          </Cylinder>
        </RigidBody>
        <ContactShadows frames={1} position={[0, -1, 0]} scale={100} opacity={0.8} far={30} blur={0.8} color={"#343434"} />
      </Physics>
    </>
  );
};

export default LevelStage;
