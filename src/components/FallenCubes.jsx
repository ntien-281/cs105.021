import { Box, Outlines } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import { useGameStore } from "../store/store";
import { Physics, RigidBody } from "@react-three/rapier";
import GameOverGrid from "./GameOverGrid";

const scaleDuration = 0.25;
const frameRate = 60;
const totalFrames = scaleDuration * frameRate;
const scaleDecrement = 0.1 / totalFrames;

const FallenCubes = ({
  gridLayers,
  isFullLayerAnimation,
  setIsAnimating,
  fullIndexes,
  handleAnimationComplete,
}) => {
  const layerRef = useRef([]);
  const gameOver = useGameStore((state) => state.gameOver);
  // console.log(fullIndexes);
  useFrame((state, delta) => {
    if (isFullLayerAnimation) {
      // console.log("animating");
      let doneAnimation = true;
      fullIndexes.forEach((i) => {
        layerRef.current[i].scale.x = Math.max(
          layerRef.current[i].scale.x - scaleDecrement,
          0
        );
        layerRef.current[i].scale.y = Math.max(
          layerRef.current[i].scale.y - scaleDecrement,
          0
        );
        layerRef.current[i].scale.z = Math.max(
          layerRef.current[i].scale.z - scaleDecrement,
          0
        );
      });
      fullIndexes.forEach((i) => {
        if (
          layerRef.current[i].scale.x !== 0 ||
          layerRef.current[i].scale.y !== 0 ||
          layerRef.current[i].scale.z !== 0
        ) {
          doneAnimation = false;
        }
      });
      if (doneAnimation) {
        setIsAnimating(false);
        cleanUpAnimation(fullIndexes);
        handleAnimationComplete(fullIndexes);
      }
    }
  });
  const cleanUpAnimation = (fullIndexes) => {
    fullIndexes.forEach((i) => {
      layerRef.current[i].scale.x = 1;
      layerRef.current[i].scale.y = 1;
      layerRef.current[i].scale.z = 1;
    });
  };

  return (
    <>
      {!gameOver ? (
        gridLayers.map((layer, index) => (
          <group key={index} ref={(el) => (layerRef.current[index] = el)}>
            {layer.map((block, indexBlock) => {
              return (
                <Box
                  key={indexBlock}
                  position={[
                    block.position[0],
                    index * 2 + 1,
                    block.position[1],
                  ]}
                  args={[2, 2, 2]}
                  receiveShadow
                >
                  <Outlines thickness={1} screenspace={true} />
                  <meshStandardMaterial color="gray" />
                </Box>
              );
            })}
          </group>
        ))
      ) : (
        <Suspense>
          <Physics>
            <GameOverGrid grid={gridLayers} collapseSpeed={0.5} />
            <RigidBody type="fixed" position={[6, 0, 6]}>
              <Box args={[12, 1, 12]}>
                <meshStandardMaterial color={"#888"} />
              </Box>
            </RigidBody>
          </Physics>
        </Suspense>
      )}
    </>
  );
};

export default FallenCubes;
