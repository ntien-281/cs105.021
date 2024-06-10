import React, { useEffect, useRef } from "react";
import { Box, Outlines } from "@react-three/drei";
import { groupsOfBlocks } from "../utils/block";
import { useGameStore } from "../store/store";
import { TextureLoader } from "three";

const box_size = 2;

const Tetrimino = ({ controlRef, color, position, blocks}) => {
  const materialSettings = useGameStore(state => state.materialSettings);
  const textureUrl = useGameStore(state => state.textureUrl);
  const material = useRef([]);

  useEffect(() => {
    if (textureUrl) {
      const textureLoader = new TextureLoader()
      textureLoader.load(textureUrl, (t) => {
        if (material.current) {
          for (let i = 0; i < material.current.length; i++) {
            material.current[i].map = t
            material.current[i].needsUpdate = true
          }
        }
      })
    }
  }, [textureUrl])

  // console.log(position);

  return (
    <group position={position ? position :[0,0,0]} ref={controlRef}>
      {blocks.map((position, index) => (
      <Box
        key={index}
        args={[box_size, box_size, box_size]}
        position={position}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} roughness={materialSettings.roughness} metalness={materialSettings.metalness} ref={el => material.current[index] = el} />
        <Outlines thickness={1} screenspace={true} />
      </Box>
    ))}
    </group>
  )
}

export default Tetrimino