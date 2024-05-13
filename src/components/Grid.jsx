import { Plane } from '@react-three/drei'
import React, { useEffect, useRef } from 'react'
import { DoubleSide } from 'three'
import { useGameStore } from '../store/store'
import Block from './Block'
import { generateRandomGroup } from '../utils/block'

const Grid = ({size, divisions, color}) => {
  

  const isGame = useGameStore(state => state.isGame);
  const isPause = useGameStore(state => state.isPause);
  const currentBlock = useGameStore(state => state.currentBlock);
  const setCurrentBlock = useGameStore(state => state.setCurrentBlock);
  const addFallenBlock = useGameStore(state => state.addFallenBlock);
  const fallenBlock = useGameStore(state => state.fallenBlock);const setLowestPointOfCurrentBlock = useGameStore(
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
    console.log(fallenBlock);
  }, [fallenBlock])

  useEffect(() => {
    // INFO: create new block on game begin or current block had fallen
    if (isGame) {
      const randomGroup = generateRandomGroup();
      setLowestPointOfCurrentBlock(randomGroup.lowestY);
      setCurrentBlockColor(randomGroup.color);
      setCurrentBlockType(randomGroup.typeid);
      setCurrentBlock(<Block controlRef={currentTetrimino} color={randomGroup.color} xInit={randomGroup.xInit} zInit={randomGroup.zInit} typeid={randomGroup.typeid} />);
    }
  }, [isGame, setCurrentBlock, fallenBlock, setLowestPointOfCurrentBlock, setCurrentBlockColor, setCurrentBlockType]);
  
  // INFO: falling tetrimino handling
  useEffect(() => {
    if (!isGame) {
      // clear interval on reset
      // console.log("stopped...");
      clearInterval(fallInterval);
    }
    if (isGame && !isPause && currentBlock.block) {
      // console.log("falling...");
      fallInterval.current = setInterval(() => {
          currentTetrimino.current.position.y -= 2;// INFO: Reach bottom when == -10
          const currentLowest = currentTetrimino.current.position.y - currentBlock.lowest;
          if (currentLowest == -10) {
            // INFO: add to fallen blocks
            const fallen = {...currentBlock, lastX: currentTetrimino.current.position.x, lastY: currentTetrimino.current.position.y, lastZ: currentTetrimino.current.position.z};
            addFallenBlock(fallen);
          }
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
      {fallenBlock.map((fall, index) => 
        <Block key={index} controlRef={null} color={fall.color} xInit={fall.lastX} zInit={fall.lastZ} yInit={fall.lastY} typeid={fall.typeid} />
      )}
      {/* Grid */}
      <group position={[0, -10, 0]}>
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