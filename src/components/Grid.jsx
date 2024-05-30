import { Box, Outlines, Plane } from '@react-three/drei'
import React, { useCallback, useEffect, useRef } from 'react'
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

  const currentTetrimino = useRef();
  const fallInterval = useRef();
  
  const gridImpact = useCallback((blockPos, tetriPos) => {
    
    const blockX =  blockPos.x + tetriPos.x;
    const blockY =  blockPos.y + tetriPos.y;
    const blockZ =  blockPos.z + tetriPos.z;
    
    const lowerLayer = gridLayers[(blockY - 1) / 2 - 1];
    console.log("lower layer: ", lowerLayer);
    for (let i = 0; i < lowerLayer.length; i++) {
      const x = lowerLayer[i].position[0];
      const z = lowerLayer[i].position[2];
      console.log("current comparision x, z: ", x, z, "block: ", blockX, blockZ);
      if (x == blockX && z == blockZ) {
        return true;
      }
    }
    return false;
    
  }, [gridLayers])

  // useEffect(() => {
    // console.log(gridLayers);
  //   console.log("curr block: ", currentBlock);
  //   currentTetrimino.current?.children.map(child => {
  //     console.log(child.position);
  //   });
  // }, [currentBlock, currentTetrimino])

  useEffect(() => {
    // INFO: create new block on game begin or current block had fallen
    if (isGame) {
      const randomGroup = generateRandomGroup();
      const newBlock = {
        block: <Tetrimino controlRef={currentTetrimino} color={randomGroup.color} xInit={randomGroup.xInit} zInit={randomGroup.zInit} typeid={randomGroup.typeid} />,
        color: randomGroup.color,
        typeid: randomGroup.typeid
      };
      setCurrentBlock(newBlock);
    }
  }, [isGame, setCurrentBlock, gridLayers]);
  

  // INFO: tetrimino impact handling
  useEffect(() => {
    if (!isGame) {
      clearInterval(fallInterval);
    }
    if (isGame && !isPause && currentBlock.block) {
      fallInterval.current = setInterval(() => {
        // INFO: Handling floor impact  
        currentTetrimino.current.position.y -= 2;

        // INFO: Test if:
        // TODO collision with other blocks
        // - collision with floor

        const currTetri = currentTetrimino.current;

        // INFO: Check if any block in tetrimino touches the floor
        // TODO: or another block in grid layers
        for (let i = 0; i < currTetri.children.length; i++) {
          let currChildPos = currTetri.children[i].position;
          let currTetriPos = currTetri.position;
          let fallenLayer = (currTetriPos.y + currChildPos.y - 1) / 2;
          if (fallenLayer == 0 || gridImpact(currChildPos, currTetriPos)) {
            currTetri.children.forEach((child) => {
              let fallenLayer = (currTetriPos.y + child.position.y - 1) / 2;
              const block = {
                position: [
                  child.position.x + currTetriPos.x,
                  fallenLayer * 2 + 1,
                  child.position.z + currTetriPos.z,
                ],
                color: child.color
              }
              addFallenBlock(block, fallenLayer);
            });
            break;
          }
          
        }
      }, 1000)
    }
    return () => {
      clearInterval(fallInterval.current);
    }
  }, [isGame, isPause, currentBlock, addFallenBlock, gridLayers, gridImpact])

  return (
    <>
      {/* Current tetrimino */}
      {isGame && currentBlock.block}

      {/* Fallen blocks */}
      {gridLayers.map((layer, index) => 
        <group key={index}>
          {layer.map((block, index) => {
            return <Box key={index} position={block.position} args={[2,2,2]}>
              <Outlines thickness={1} screenspace={true} />
              <meshStandardMaterial color={block.color} />
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