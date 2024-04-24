import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

const LevelStage = () => {
  return (
    <>
      {/* Lower level */}
      <RigidBody type="fixed" position={[0, 0, 0]} friction={3}>
        <Box args={[20, 1, 20]} receiveShadow>
          <meshStandardMaterial color={"#888"}  />
        </Box>
      </RigidBody>
    </>
  );
};

export default LevelStage;
