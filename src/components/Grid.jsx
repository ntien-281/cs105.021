import { Box, Outlines, Plane } from '@react-three/drei'
import React, { useEffect, useRef } from 'react'
import { DoubleSide } from 'three'
import { useGameStore } from '../store/store'
import Tetrimino from './Tetrimino'
import { generateRandomGroup } from '../utils/block'

const Grid = ({size, divisions, color}) => {
  

  const isGame = useGameStore(state => state.isGame);
  const isPause = useGameStore(state => state.isPause);
  const currentBlock = useGameStore(state => state.currentBlock);
  const setCurrentBlock = useGameStore(state => state.setCurrentBlock);
  const addFallenBlock = useGameStore(state => state.addFallenBlock);
  const gridLayers = useGameStore(state => state.gridLayers);
  const setLowestPointOfCurrentBlock = useGameStore(
    (state) => state.setLowestPointOfCurrentBlock
  );
  const setCurrentBlockColor = useGameStore(
    (state) => state.setCurrentBlockColor
  );
  const setCurrentBlockType = useGameStore(
    (state) => state.setCurrentBlockType
  );

  const currentTetrimino = useRef();
  const fallInterval = useRef();

  

  useEffect(() => {
    // TODO debug new block distorted
    console.log(gridLayers);
    // console.log(currentBlock)
  }, [gridLayers])

  useEffect(() => {
    // INFO: create new block on game begin or current block had fallen
    if (isGame) {
      const randomGroup = generateRandomGroup();
      setLowestPointOfCurrentBlock(randomGroup.lowestY);
      setCurrentBlockColor(randomGroup.color);
      setCurrentBlockType(randomGroup.typeid);
      setCurrentBlock(<Tetrimino controlRef={currentTetrimino} color={randomGroup.color} xInit={randomGroup.xInit} zInit={randomGroup.zInit} typeid={randomGroup.typeid} />);
    }
  }, [isGame, setCurrentBlock, gridLayers, setLowestPointOfCurrentBlock, setCurrentBlockColor, setCurrentBlockType]);
  

  // INFO: tetrimino impact handling
  useEffect(() => {
    if (!isGame) {
      // clear interval on reset
      // console.log("stopped...");
      clearInterval(fallInterval);
    }
    if (isGame && !isPause && currentBlock.block) {
      // console.log("falling...");
      fallInterval.current = setInterval(() => {
        // INFO: Handling floor impact  
        currentTetrimino.current.position.y -= 2;
        // const currentLowest = currentTetrimino.current.position.y - currentBlock.lowest;

        // INFO: Test if:
        // TODO collision with other blocks
        // - collision with floor

        const currTetri = currentTetrimino.current;
        console.log("debuggin...");
        for (let i = 0; i < currTetri.children.length; i++) {
          let fallenLayer = (currTetri.position.y + currTetri.children[i].position.y - 1) / 2;
          console.log(fallenLayer);
          if (fallenLayer == 0) {
            currTetri.children.map((child) => {
              let fallenLayer = (currTetri.position.y + child.position.y - 1) / 2;
              // let x = currTetri.position.x + child.position.x - 1;
              // let z = currTetri.position.z + child.position.z - 1;
              child.position.x += currTetri.position.x;
              child.position.z += currTetri.position.z;
              child.position.y = fallenLayer * 2 + 1;
              addFallenBlock(child, fallenLayer);
            });
            break;
          }
        }

          // INFO add to fallen blocks
          // const fallen = {...currentBlock, lastX: currentTetrimino.current.position.x, lastY: currentTetrimino.current.position.y, lastZ: currentTetrimino.current.position.z};
          
          // addFallenBlock(fallen);
      }, 1000)
    }
    return () => {
      // console.log("stopped...");
      clearInterval(fallInterval.current);
    }
  }, [isGame, isPause, currentBlock, addFallenBlock])

  return (
    <>
      {/* Current tetrimino */}
      {isGame && currentBlock.block}

      {/* Fallen blocks */}
      {gridLayers.map((layer, index) => 
        <group key={index}>
          {layer.map((block, index) => {
            // console.log("xyz: ", block);
            return <Box key={index} position={block} args={[2,2,2]}>
              <Outlines thickness={1} screenspace={true} />
              <meshStandardMaterial color="#839192" />
            </Box>
          })}
        </group>
      )}
      {/* Grid */}
      <group position={[0, 0, 0]}>
        <gridHelper
          args={[size, divisions, color]}
          position={[size / 2, 0, size / 2]}
          receiveShadow
        />
        <Plane 
          args={[12, 12]}
          rotation={[-Math.PI / 2, 0 ,0]}
          position={[size / 2, 0, size / 2]}
          receiveShadow
        >
          <meshStandardMaterial shadowSide={DoubleSide} />
        </Plane>
        <gridHelper
          args={[size, divisions, color]}
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
          position={[0, 3 * size / 2, size / 2]} 
        />
        <gridHelper
          args={[size, divisions, color]}
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
          position={[0, size / 2, size / 2]} 
        />
        <gridHelper
          args={[size, divisions, color]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[size / 2, 3 * size / 2, 0]} 
        />
        <gridHelper
          args={[size, divisions, color]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[size / 2, size / 2, 0]} 
        />
      </group>
    </>
  )
}

export default Grid