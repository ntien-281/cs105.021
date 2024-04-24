
const LevelStage = () => {
  return (
    <>
      {/* Lower level */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial color={"#f3e5ab"} toneMapped={false} />
      </mesh>
    </>
  );
};

export default LevelStage;
