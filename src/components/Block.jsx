import React, { useEffect } from "react";
import { Box, Outlines } from "@react-three/drei";
import { getRandomColor, getRandomPosition, groupsOfBlocks } from "../utils/block";

const box_size = 2;

const Block = ({ controlRef, color, xInit, zInit, yInit, typeid}) => {

  const blockGroup = groupsOfBlocks[typeid];

  return (
    <group position={[xInit, yInit ? yInit : 12, zInit]} ref={controlRef}>
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

export default Block