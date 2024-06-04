import React from "react";
import { Box, Outlines } from "@react-three/drei";
import { groupsOfBlocks } from "../utils/block";

const box_size = 2;

const Tetrimino = ({ controlRef, color, xInit, zInit, typeid, top=true}) => {

  const blockGroup = groupsOfBlocks[typeid];

  return (
    <group position={[top ? xInit : 0, top ? 24: 0, top ? zInit : 0]} ref={controlRef}>
      {blockGroup.coords.map((position, index) => (
      <Box
        key={index}
        args={[box_size, box_size, box_size]}
        position={position}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} />
        <Outlines thickness={1} screenspace={true} />
      </Box>
    ))}
    </group>
  )
}

export default Tetrimino