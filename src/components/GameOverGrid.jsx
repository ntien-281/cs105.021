import React, { useRef, useState } from "react";
import BoxWithPhysics from "./BoxWithPhysics";
import { useFrame } from "@react-three/fiber";

const GameOverGrid = ({ grid, collapseSpeed }) => {
  const boxes = useRef([]);

  return (
    <>
      {grid.map((layer, index) => (
        <group key={index}>
          {layer.map((block, indexBlock) => {
            return (
              <BoxWithPhysics
                key={indexBlock}
                ref={(ref) => (boxes.current[index] = ref)}
                position={[block.position[0], index * 2 + 1, block.position[1]]}
                args={[2, 2, 2]}
                receiveShadow
              />
            );
          })}
        </group>
      ))}
    </>
  );
};

export default GameOverGrid;
