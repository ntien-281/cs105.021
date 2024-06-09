import React from "react";
import { Box, Outlines } from "@react-three/drei";
import { groupsOfBlocks } from "../utils/block";
import { useGameStore } from "../store/store";

const box_size = 2;

const Tetrimino = ({ controlRef, color, position, typeid}) => {

  const blockGroup = groupsOfBlocks[typeid];
  const materialSettings = useGameStore(state => state.materialSettings);

  // console.log(position);

  return (
    <group position={position ? position :[0,0,0]} ref={controlRef}>
      {blockGroup.coords.map((position, index) => (
      <Box
        key={index}
        args={[box_size, box_size, box_size]}
        position={position}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} roughness={materialSettings.roughness} metalness={materialSettings.metalness} />
        <Outlines thickness={1} screenspace={true} />
      </Box>
    ))}
    </group>
  )
}

export default Tetrimino