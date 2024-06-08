/* eslint-disable no-case-declarations */
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
  const removeFullLayers = useGameStore(state => state.removeFullLayers);
  const nextBlock = useGameStore(state => state.nextBlock);
  const setNextBlock = useGameStore(state => state.setNextBlock);

  const currentTetrimino = useRef();
  const fallInterval = useRef();
  
  const gridImpact = useCallback((blockPos, tetriPos) => {
    
    const blockX =  blockPos.x + tetriPos.x;
    const blockY =  blockPos.y + tetriPos.y;
    const blockZ =  blockPos.z + tetriPos.z;

    const llIndex = (blockY - 1) / 2 - 1;
    if (llIndex < 0) {
      return false;
    }
    
    const lowerLayer = gridLayers[llIndex];
    // console.log("lower layer: ", lowerLayer);
    for (let i = 0; i < lowerLayer.length; i++) {
      const x = lowerLayer[i].position[0];
      const z = lowerLayer[i].position[1];
      // console.log("current comparision x, z: ", x, z, "block: ", blockX, blockZ);
      if (x == blockX && z == blockZ) {
        return true;
      }
    }
    return false;
    
  }, [gridLayers])

  const handleFullLayers = useCallback(() => {
    // TODO: animation here

    removeFullLayers();
  }, [removeFullLayers])

  useEffect(() => {
    const randomGroup = generateRandomGroup();
    const newNextBlock = {
      typeid: randomGroup.typeid,
      color: randomGroup.color,
      xInit: randomGroup.xInit,
      zInit: randomGroup.zInit,
    }
    setNextBlock(newNextBlock);
  }, [])

  useEffect(() => {
    // INFO: create new block on game begin or current block had fallen
    if (isGame) {
      const randomGroup = generateRandomGroup();
      const newNextBlock = {
        typeid: randomGroup.typeid,
        color: randomGroup.color,
        xInit: randomGroup.xInit,
        zInit: randomGroup.zInit,
      }
      setNextBlock(newNextBlock);
      const newBlock = {
        block: <Tetrimino controlRef={currentTetrimino} color={nextBlock.color} xInit={nextBlock.xInit} zInit={nextBlock.zInit} typeid={nextBlock.typeid} />,
        color: nextBlock.color,
        typeid: nextBlock.typeid
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
        currentTetrimino.current.position.y -= 2;

        const currTetri = currentTetrimino.current;

        // INFO: Check if any block in tetrimino touches the floor
        // or another block in grid layers
        for (let i = 0; i < currTetri.children.length; i++) {
          let currChildPos = currTetri.children[i].position;
          let currTetriPos = currTetri.position;
          let fallenLayer = (currTetriPos.y + currChildPos.y - 1) / 2;
          if (fallenLayer == 0 || gridImpact(currChildPos, currTetriPos)) {
            currTetri.children.forEach((child) => {
              let fallenLayer = (currTetriPos.y + child.position.y - 1) / 2;
              if (fallenLayer >= 0) {
                const block = {
                  position: [
                    child.position.x + currTetriPos.x,
                    child.position.z + currTetriPos.z,
                  ],
                  color: child.color
                }
                addFallenBlock(block, fallenLayer);
              }
            });
            break;
          }
        }

        // INFO: handle scores and full layers clearing
        handleFullLayers();
      }, 500)
    }
    return () => {
      clearInterval(fallInterval.current);
    }
  }, [isGame, isPause, currentBlock, addFallenBlock, gridLayers, gridImpact, handleFullLayers])
  const takeMaxPosCube = (currentTetrimino,type) => {
    if (type == 1) {
      let max = currentTetrimino.current.children[0].position.z;
      let maxPos = currentTetrimino.current.children[0].position
      for (let  i= 0; i < currentTetrimino.current.children.length; i++) {
        if (max < currentTetrimino.current.children[i].position.z) {
          maxPos = currentTetrimino.current.children[i].position
          max = currentTetrimino.current.children[i].position.z
        }
      }
      return maxPos
    }
    else {
      let max = currentTetrimino.current.children[0].position.x;
      let maxPos = currentTetrimino.current.children[0].position
      for (let  i= 0; i < currentTetrimino.current.children.length; i++) {
        if (max < currentTetrimino.current.children[i].position.x) {
          maxPos = currentTetrimino.current.children[i].position
          max = currentTetrimino.current.children[i].position.x
        }
      }
      return maxPos
    }
  }

  // take min position of cube in blocks
  const takeMinPosCube = (currentTetrimino,type) => {
    if (type == 1) {
      let min = currentTetrimino.current.children[0].position.z;
      let minPos = currentTetrimino.current.children[0].position;
      for (let  i= 0; i < currentTetrimino.current.children.length; i++) {
        if (min > currentTetrimino.current.children[i].position.z) {
          min = currentTetrimino.current.children[i].position.z
          minPos = currentTetrimino.current.children[i].position;
        }
      }
      return minPos
    }
    else {
      let min = currentTetrimino.current.children[0].position.x;
      let minPos = currentTetrimino.current.children[0].position;
      for (let  i= 0; i < currentTetrimino.current.children.length; i++) {
        if (min > currentTetrimino.current.children[i].position.x) {
          min = currentTetrimino.current.children[i].position.x
          minPos = currentTetrimino.current.children[i].position;
        }
      }
      return minPos
    }
  }
  const checkCollision = useCallback((blockPos, tetriPos,type) => {
    
    const blockX =  blockPos.x + tetriPos.x - 1;
    const blockY =  blockPos.y + tetriPos.y;
    const blockZ =  blockPos.z + tetriPos.z - 1;
    // console.log(tetriPos)
    // console.log(blockX,blockY,blockZ)
    const curLayer = gridLayers[(blockY - 1) / 2];
    // console.log((blockY - 1) / 2)
    console.log(gridLayers)
    if (type == 1) {
      for (let i = 0; i < curLayer.length; i++) {
        let x = curLayer[i].position[0];
        let z = curLayer[i].position[1];
        if (blockX - 2 == x || blockZ - 2 == z) {
          return true;
        }
      }
      return false;
    }
    else if (type == 2) {
      for (let i = 0; i < curLayer.length; i++) {
        let x = curLayer[i].position[0];
        let z = curLayer[i].position[1];
        if (blockX + 2 == x || blockZ + 2 == z) {
          return true;
        }
      }
      return false;
    }
    
  }, [gridLayers])
  const rotateTetri = (currTetri,type) => {
    const curChild = currTetri.current.children
    console.log('Rotate')
    if (type =='x') {
      for (let i = 0; i < curChild.length; i++) {
          const vectorZ = curChild[i].position.z - curChild[0].position.z
          const vectorY = curChild[i].position.y - curChild[0].position.y
          const newZ = vectorY
          const newY = -vectorZ 
          curChild[i].position.z = curChild[0].position.z + newZ
          curChild[i].position.y = curChild[0].position.y + newY
      }
    }
  }
  const handleKeyDown = (event) => {
    if (!currentTetrimino.current) return;
    const posTetri = currentTetrimino.current.position
    switch (event.key) {
      case 'a':
        const minPosX = takeMinPosCube(currentTetrimino,2)
        if (minPosX.x + posTetri.x - 3 >= 0) {
          posTetri.x -= 2;
          
        }
        break;
      case 'd':
        const maxPosX = takeMaxPosCube(currentTetrimino,2)
        if (maxPosX.x + posTetri.x + 1 <= 10) {
          posTetri.x += 2;
        }
        break;
      case 'w':
        const minPosZ = takeMinPosCube(currentTetrimino,1)
        if (minPosZ.z + posTetri.z - 3 >= 0) {
          posTetri.z -= 2;
        }
        break;
      case 's':
        const maxPosZ = takeMaxPosCube(currentTetrimino,1)
        if (maxPosZ.z + posTetri.z + 1 <= 10) {
          posTetri.z += 2;
        } 
        break;
      case 'q':
        rotateTetri(currentTetrimino,'x')
        break;
      case 'e':
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <>
      {/* Current tetrimino */}
      {isGame && currentBlock.block}

      {/* Fallen blocks */}
      {gridLayers.map((layer, index) => 
        <group key={index}>
          {layer.map((block, indexBlock) => {
            return <Box key={indexBlock} position={[block.position[0], index * 2 + 1, block.position[1]]} args={[2,2,2]} receiveShadow>
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
