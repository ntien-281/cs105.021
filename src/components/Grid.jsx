import { Plane } from '@react-three/drei';
import React, { useEffect, useRef } from 'react';
import { DoubleSide } from 'three';
import { useGameStore } from '../store/store';
import Block from './Block';
import { generateRandomGroup } from '../utils/block';

const Grid = ({ size, divisions, color }) => {
  const gridSize = size;
  const isGame = useGameStore((state) => state.isGame);
  const isPause = useGameStore((state) => state.isPause);
  const currentBlock = useGameStore((state) => state.currentBlock);
  const setCurrentBlock = useGameStore((state) => state.setCurrentBlock);
  const addFallenBlock = useGameStore((state) => state.addFallenBlock);
  const fallenBlock = useGameStore((state) => state.fallenBlock);
  const setLowestPointOfCurrentBlock = useGameStore((state) => state.setLowestPointOfCurrentBlock);
  const setCurrentBlockColor = useGameStore((state) => state.setCurrentBlockColor);
  const setCurrentBlockType = useGameStore((state) => state.setCurrentBlockType);

  const currentTetrimino = useRef();
  const fallInterval = useRef();

  useEffect(() => {
    console.log(fallenBlock);
  }, [fallenBlock]);

  useEffect(() => {
    if (isGame) {
      const randomGroup = generateRandomGroup();
      setLowestPointOfCurrentBlock(randomGroup.lowestY);
      setCurrentBlockColor(randomGroup.color);
      setCurrentBlockType(randomGroup.typeid);
      setCurrentBlock(
        <Block
          controlRef={currentTetrimino}
          color={randomGroup.color}
          xInit={randomGroup.xInit}
          zInit={randomGroup.zInit}
          typeid={randomGroup.typeid}
        />
      );
    }
  }, [isGame, fallenBlock, setLowestPointOfCurrentBlock, setCurrentBlockColor, setCurrentBlockType, setCurrentBlock]);

  useEffect(() => {
    if (!isGame) {
      clearInterval(fallInterval.current);
      return;
    }
    if (isGame && !isPause && currentBlock.block) {
      fallInterval.current = setInterval(() => {
        currentTetrimino.current.position.y -= 2;
        const currentLowest = currentTetrimino.current.position.y - currentBlock.lowest;
        if (currentLowest === -10) {
          const fallen = {
            ...currentBlock,
            lastX: currentTetrimino.current.position.x,
            lastY: currentTetrimino.current.position.y,
            lastZ: currentTetrimino.current.position.z,
          };
          addFallenBlock(fallen);
        }
      }, 1000);
    }
    return () => {
      clearInterval(fallInterval.current);
    };
  }, [isGame, isPause, currentBlock, addFallenBlock]);
  // take max position of cube in blocks
  const takeMaxPosCube = (currentTetrimino,type) => {
    if (type == 1) {
      let max = currentTetrimino.current.children[0].position.z;
      for (let  i= 0; i < currentTetrimino.current.children.length; i++) {
        if (max < currentTetrimino.current.children[i].position.z) {
          max = currentTetrimino.current.children[i].position.z
        }
      }
      return max
    }
    else {
      let max = currentTetrimino.current.children[0].position.x;
      for (let  i= 0; i < currentTetrimino.current.children.length; i++) {
        if (max < currentTetrimino.current.children[i].position.x) {
          max = currentTetrimino.current.children[i].position.x
        }
      }
      return max
    }
  }
  // take min position of cube in blocks
  const takeMinPosCube = (currentTetrimino,type) => {
    if (type == 1) {
      let min = currentTetrimino.current.children[0].position.z;
      for (let  i= 0; i < currentTetrimino.current.children.length; i++) {
        if (min > currentTetrimino.current.children[i].position.z) {
          min = currentTetrimino.current.children[i].position.z
        }
      }
      return min
    }
    else {
      let min = currentTetrimino.current.children[0].position.x;
      for (let  i= 0; i < currentTetrimino.current.children.length; i++) {
        if (min > currentTetrimino.current.children[i].position.x) {
          min = currentTetrimino.current.children[i].position.x
        }
      }
      return min
    }
  }
  const canRotate = (currentTetrimino,type) => {
    // if (type == 'y') {
    //   for (let  i= 0; i < currentTetrimino.current.children.length; i++) {
    //     if (min > currentTetrimino.current.children[i].position.x) {
    //       min = currentTetrimino.current.children[i].position.x
    //     }
    //   }
    // }
  }
  const handleKeyDown = (event) => {
    if (!currentTetrimino.current) return;
    switch (event.key) {
      case 'a':
        if (takeMinPosCube(currentTetrimino,2) + currentTetrimino.current.position.x - 3 >= 0) {
          currentTetrimino.current.position.x -= 2;
        }
        break;
      case 'd':
        if (takeMaxPosCube(currentTetrimino,2) + currentTetrimino.current.position.x + 1 <= 10) {
          currentTetrimino.current.position.x += 2;
        }
        break;
      case 'w':
        if (takeMinPosCube(currentTetrimino,1) + currentTetrimino.current.position.z - 3 >= 0) {
          currentTetrimino.current.position.z -= 2;
        }
        break;
      case 's':
        if (takeMaxPosCube(currentTetrimino,1) + currentTetrimino.current.position.z + 1 <= 10) {
          currentTetrimino.current.position.z += 2;
        }
        break;
      case 'q':
        if (canRotate(currentTetrimino,'z')){
          console.log(currentTetrimino.current.position)
          for (let  i= 0; i < currentTetrimino.current.children.length; i++){
            console.log(currentTetrimino.current.children[i].position)
          }
          currentTetrimino.current.rotation.z += Math.PI/4;
          console.log(currentTetrimino.current.position)
          for (let  i= 0; i < currentTetrimino.current.children.length; i++){
            console.log(currentTetrimino.current.children[i].position)
          }
        }
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
      {isGame && currentBlock.block}
      {fallenBlock.map((fall, index) => (
        <Block
          key={index}
          controlRef={null}
          color={fall.color}
          xInit={fall.lastX}
          zInit={fall.lastZ}
          yInit={fall.lastY}
          typeid={fall.typeid}
        />
      ))}
      <group position={[0, -10, 0]}>
        <gridHelper args={[size, divisions, color]} position={[size / 2, 0, size / 2]} receiveShadow />
        <Plane args={[size, size]} rotation={[-Math.PI / 2, 0, 0]} position={[size / 2, 0, size / 2]} receiveShadow>
          <meshStandardMaterial shadowSide={DoubleSide} />
        </Plane>
        <gridHelper args={[size, divisions, color]} rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, (3 * size) / 2, size / 2]} />
        <gridHelper args={[size, divisions, color]} rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, size / 2, size / 2]} />
        <gridHelper args={[size, divisions, color]} rotation={[Math.PI / 2, 0, 0]} position={[size / 2, (3 * size) / 2, 0]} />
        <gridHelper args={[size, divisions, color]} rotation={[Math.PI / 2, 0, 0]} position={[size / 2, size / 2, 0]} />
      </group>
    </>
  );
};

export default Grid;
