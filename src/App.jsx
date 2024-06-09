import { Canvas } from "@react-three/fiber";
import Grid from "./components/Grid";
import Ui from "./components/Ui";
import Header from "./components/Header";
import Lights from "./components/Lights";
import CameraController from "./components/CameraController";
import { useGameStore } from "./store/store";
import { Box, Outlines } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateRandomGroup } from "./utils/block";
import Tetrimino from "./components/Tetrimino";
import GUI from "lil-gui";
import { roughness } from "three/examples/jsm/nodes/Nodes.js";
import { useSpring, animated } from "@react-spring/web";

// Game parameters
const size = 12; // equal box size times 6
const divisions = 6;
const color = "gray";

function App() {
  const isGame = useGameStore((state) => state.isGame);
  const setIsGame = useGameStore((state) => state.setIsGame);
  const gameOver = useGameStore((state) => state.gameOver);
  const setGameOver = useGameStore((state) => state.setGameOver);
  const isPause = useGameStore((state) => state.isPause);
  const setIsPause = useGameStore((state) => state.setIsPause);
  const resetGame = useGameStore((state) => state.resetGame);
  const currentBlock = useGameStore((state) => state.currentBlock);
  const setCurrentBlock = useGameStore((state) => state.setCurrentBlock);
  const addFallenBlock = useGameStore((state) => state.addFallenBlock);
  const gridLayers = useGameStore((state) => state.gridLayers);
  const removeFullLayers = useGameStore((state) => state.removeFullLayers);
  const nextBlock = useGameStore((state) => state.nextBlock);
  const setNextBlock = useGameStore((state) => state.setNextBlock);
  const materialSettings = useGameStore((state) => state.materialSettings);
  const setMaterialSettings = useGameStore(
    (state) => state.setMaterialSettings
  );

  const currentTetrimino = useRef();
  const fallInterval = useRef();

  const [position, setPosition] = useState([0, 0, 0]);

  const gridImpact = useCallback(
    (blockPos, tetriPos) => {
      const blockX = blockPos.x + position[0];
      const blockY = blockPos.y + position[1];
      const blockZ = blockPos.z + position[2];

      const llIndex = (blockY - 1) / 2 - 1;
      if (llIndex < 0) {
        return false;
      }
      // console.log(gridLayers);
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
    },
    [gridLayers, position]
  );
  const checkCollision = useCallback((blockPos, tetriPos,type) => {
    
    const blockX =  blockPos.x + tetriPos.x - 1;
    const blockY =  blockPos.y + tetriPos.y;
    const blockZ =  blockPos.z + tetriPos.z - 1;
    const layerIndex = (blockY - 1) / 2 - 1;
    const curLayer = gridLayers[layerIndex];
    console.log(gridLayers);
    // if (type == 1) {
    //   for (let i = 0; i < curLayer.length; i++) {
    //     let x = curLayer[i].position[0];
    //     let z = curLayer[i].position[1];
    //     if (blockX - 2 == x || blockZ - 2 == z) {
    //       return true;
    //     }
    //   }
    //   return false;
    // }
    // else if (type == 2) {
    //   for (let i = 0; i < curLayer.length; i++) {
    //     let x = curLayer[i].position[0];
    //     let z = curLayer[i].position[1];
    //     if (blockX + 2 == x || blockZ + 2 == z) {
    //       return true;
    //     }
    //   }
    //   return false;
    // }
    
  }, [gridLayers]);
  const handleFullLayers = useCallback(() => {
    // TODO: animation here

    removeFullLayers();
  }, [removeFullLayers]);

  useEffect(() => {
    for (let i = 12; i < gridLayers.length; i++) {
      if (gridLayers[i].length > 0) {
        setIsGame();
        setGameOver(true);
      }
    }
    // INFO: handle scores and full layers clearing
    handleFullLayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridLayers]);

  useEffect(() => {
    const randomGroup = generateRandomGroup();
    const newNextBlock = {
      typeid: randomGroup.typeid,
      color: randomGroup.color,
      xInit: randomGroup.xInit,
      zInit: randomGroup.zInit,
    };
    setNextBlock(newNextBlock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGame]);

  const generateNewBlock = () => {
    // INFO: foward next block to current block
    console.log("generating new block");
    setPosition([nextBlock.xInit, 28, nextBlock.zInit]);
    const newBlock = {
      color: nextBlock.color,
      typeid: nextBlock.typeid,
    };
    setCurrentBlock(newBlock);
  
    // Generate a new next block
    const randomGroup = generateRandomGroup();
    const newNextBlock = {
      typeid: randomGroup.typeid,
      color: randomGroup.color,
      xInit: randomGroup.xInit,
      zInit: randomGroup.zInit,
    };
    setNextBlock(newNextBlock);
  };  
  // INFO: tetrimino impact handling
  useEffect(() => {
    if (!isGame) {
      // console.log("clearing interval");
      clearInterval(fallInterval);
    }
    if (isGame && !isPause) {
      fallInterval.current = setInterval(() => {
        const [x, y, z] = position;
        setPosition([x, y - 2, z]);
        const currTetri = currentTetrimino.current;
        console.log("falling");
        // INFO: Check if any block in tetrimino touches the floor
        // or another block in grid layers
        for (let i = 0; i < currTetri.children.length; i++) {
          let currChildPos = currTetri.children[i].position;
          let fallenLayer = (position[1] + currChildPos.y - 1) / 2;
          if (fallenLayer == 0 || gridImpact(currChildPos, position)) {
            currTetri.children.forEach((child) => {
              let fallenLayer = (position[1] + child.position.y - 1) / 2;
              if (fallenLayer >= 0) {
                const block = {
                  position: [
                    child.position.x + position[0],
                    child.position.z + position[2],
                  ],
                  color: child.color,
                };
                addFallenBlock(block, fallenLayer);
              }
            });
            generateNewBlock();
            break;
          }
        }
      }, 500);
    }
    return () => {
      if (fallInterval.current) {
        console.log("clearing interval");
        clearInterval(fallInterval.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGame, isPause, gridLayers, currentBlock, nextBlock, position]);

  // INFO: Movement logic
  const takeMaxPosCube = (currentTetrimino, type) => {
    const curChild = currentTetrimino.current.children;
    if (type == 1) {
      let max = curChild[0].position.z;
      let max_posZ = curChild[0].position
      for (let i = 0; i < curChild.length; i++) {
        if (max < curChild[i].position.z) {
          max = curChild[i].position.z;
          max_posZ = curChild[i].position;
        }
      }
      return max_posZ;
    } else {
      let max =curChild[0].position.x;
      let max_posX = curChild[0].position
      for (let i = 0; i < curChild.length; i++) {
        if (max < curChild[i].position.x) {
          max = curChild[i].position.x;
          max_posX = curChild[i].position
        }
      }
      return max_posX;
    }
  };

  // take min position of cube in blocks
  const takeMinPosCube = (currentTetrimino, type) => {
    const curChild = currentTetrimino.current.children;
    if (type == 1) {
      let min = curChild[0].position.z;
      let min_posZ = curChild[0].position;
      for (let i = 0; i < curChild.length; i++) {
        if (min > curChild[i].position.z) {
          min = curChild[i].position.z;
          min_posZ = curChild[i].position;
        }
      }
      return min_posZ;
    } else {
      let min = curChild[0].position.x;
      let min_posX = curChild[0].position;
      for (let i = 0; i < curChild.length; i++) {
        if (min > curChild[i].position.x) {
          min = curChild[i].position.x;
          min_posX = curChild[i].position;
        }
      }
      return min_posX;
    }
  };
  const rotateTetri = (currTetri, type) => {
    const curChild = currTetri.current.children;
    console.log('Rotate');
    if (type == 'x') {
      for (let i = 0; i < curChild.length; i++) {
        const vectorZ = curChild[i].position.z - curChild[0].position.z;
        const vectorY = curChild[i].position.y - curChild[0].position.y;
        curChild[i].position.z = curChild[0].position.z + vectorY;
        curChild[i].position.y = curChild[0].position.y - vectorZ;
      }
    }
  };
  const handleKeyDown = (event) => {
    if (!currentTetrimino.current) return;
    event.preventDefault();
    event.stopPropagation();
    const curTetri = currentTetrimino;
    const curPos = curTetri.current.position;
    switch (event.key) {
      case "a":
        if (
          takeMinPosCube(currentTetrimino, 2).x +
            position[0] -
            3 >=
          0
        ) {
          const [x, y, z] = position;
          setPosition([x - 2, y, z]);
          console.log(position);
        }
        checkCollision(takeMinPosCube(curTetri,2),curPos);
        break;
      case "d":
        if (
          takeMaxPosCube(currentTetrimino, 2).x +
            position[0] +
            1 <=
          10
        ) {
          const [x, y, z] = position;
          setPosition([x + 2, y, z]);
          // console.log(position);
        }
        break;
      case "w":
        if (
          takeMinPosCube(currentTetrimino, 1).z +
            position[2] -
            3 >=
          0
        ) {
          const [x, y, z] = position;
          setPosition([x, y, z - 2]);
          // console.log(position);
        }
        break;
      case "s":
        if (
          takeMaxPosCube(currentTetrimino, 1).z +
            position[2] +
            1 <=
          10
        ) {
          const [x, y, z] = position;
          setPosition([x, y, z + 2]);
          // console.log(position);
        }
        break;
      case "q":
        rotateTetri(curTetri,'x')
        break;
      case "e":
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  // INFO: Game trigger buttons
  const startPauseGame = (event) => {
    if (!isGame) {
      setIsGame();
      console.log("started");
      generateNewBlock();
    } else {
      // game in progress, only pause
      if (isPause) {
        console.log("resumed");
      } else {
        console.log("paused");
      }
      setIsPause();
    }
  };
  const resetClick = () => {
    console.log("reseted");
    resetGame();
  };

  // INFO: Material settings:
  useEffect(() => {
    let values = { ...materialSettings };
    const gui = new GUI({ width: 300 });
    gui
      .add(values, "roughness", 0, 1, 0.1)
      .onFinishChange((value) =>
        setMaterialSettings({ ...materialSettings, roughness: value })
      );
    gui
      .add(values, "metalness", 0, 1, 0.1)
      .onFinishChange((value) =>
        setMaterialSettings({ ...materialSettings, metalness: value })
      );

    return () => {
      gui.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialSettings]);

  return (
    <>
      <Header startPauseGame={startPauseGame} resetClick={resetClick} />

      <div id="canvas-container">
        <Canvas
          camera={{ fov: 60, near: 0.1, far: 1000, position: [30, 40, 30] }}
          shadows
        >
          <CameraController />
          <Lights />

          {/* Current tetrimino */}
          {(isGame && !gameOver) && (
            <Tetrimino
              controlRef={currentTetrimino}
              color={currentBlock.color}
              position={position}
              typeid={currentBlock.typeid}
            />
          )}

          <Grid color={color} divisions={divisions} size={size} />
          {/* Fallen blocks */}
          {gridLayers.map((layer, index) => (
            <group key={index}>
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
          ))}
        </Canvas>
      </div>
      <Ui />
    </>
  );
}

export default App;
