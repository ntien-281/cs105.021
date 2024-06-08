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
  const setMaterialSettings = useGameStore((state) => state.setMaterialSettings);

  const currentTetrimino = useRef();
  const fallInterval = useRef();

  const gridImpact = useCallback(
    (blockPos, tetriPos) => {
      const blockX = blockPos.x + tetriPos.x;
      const blockY = blockPos.y + tetriPos.y;
      const blockZ = blockPos.z + tetriPos.z;

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
    },
    [gridLayers]
  );

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
    const newBlock = {
      block: (
        <Tetrimino
          controlRef={currentTetrimino}
          color={nextBlock.color}
          xInit={nextBlock.xInit}
          zInit={nextBlock.zInit}
          typeid={nextBlock.typeid}
          top={true}
        />
      ),
      color: nextBlock.color,
      typeid: nextBlock.typeid,
    };
    setCurrentBlock(newBlock);
    const randomGroup = generateRandomGroup();
    const newNextBlock = {
      typeid: randomGroup.typeid,
      color: randomGroup.color,
      xInit: randomGroup.xInit,
      zInit: randomGroup.zInit,
    };
    setNextBlock(newNextBlock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

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
      clearInterval(fallInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGame, isPause, gridLayers]);

  // INFO: Movement logic
  const takeMaxPosCube = (currentTetrimino, type) => {
    if (type == 1) {
      let max = currentTetrimino.current.children[0].position.z;
      for (let i = 0; i < currentTetrimino.current.children.length; i++) {
        if (max < currentTetrimino.current.children[i].position.z) {
          max = currentTetrimino.current.children[i].position.z;
        }
      }
      return max;
    } else {
      let max = currentTetrimino.current.children[0].position.x;
      for (let i = 0; i < currentTetrimino.current.children.length; i++) {
        if (max < currentTetrimino.current.children[i].position.x) {
          max = currentTetrimino.current.children[i].position.x;
        }
      }
      return max;
    }
  };

  // take min position of cube in blocks
  const takeMinPosCube = (currentTetrimino, type) => {
    if (type == 1) {
      let min = currentTetrimino.current.children[0].position.z;
      for (let i = 0; i < currentTetrimino.current.children.length; i++) {
        if (min > currentTetrimino.current.children[i].position.z) {
          min = currentTetrimino.current.children[i].position.z;
        }
      }
      return min;
    } else {
      let min = currentTetrimino.current.children[0].position.x;
      for (let i = 0; i < currentTetrimino.current.children.length; i++) {
        if (min > currentTetrimino.current.children[i].position.x) {
          min = currentTetrimino.current.children[i].position.x;
        }
      }
      return min;
    }
  };
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
    switch (event.key) {
      case "a":
        if (
          takeMinPosCube(currentTetrimino, 2) +
            currentTetrimino.current.position.x -
            3 >=
          0
        ) {
          currentTetrimino.current.position.x -= 2;
        }
        break;
      case "d":
        if (
          takeMaxPosCube(currentTetrimino, 2) +
            currentTetrimino.current.position.x +
            1 <=
          10
        ) {
          currentTetrimino.current.position.x += 2;
        }
        break;
      case "w":
        if (
          takeMinPosCube(currentTetrimino, 1) +
            currentTetrimino.current.position.z -
            3 >=
          0
        ) {
          currentTetrimino.current.position.z -= 2;
        }
        break;
      case "s":
        if (
          takeMaxPosCube(currentTetrimino, 1) +
            currentTetrimino.current.position.z +
            1 <=
          10
        ) {
          currentTetrimino.current.position.z += 2;
        }
        break;
      case "q":
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
  }, []);

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
    let values = {...materialSettings};
    const gui = new GUI({ width: 300 });
    gui.add(values, 'roughness', 0, 1, 0.1).onFinishChange(value => setMaterialSettings({...materialSettings, roughness: value}));
    gui.add(values, 'metalness', 0, 1, 0.1).onFinishChange(value => setMaterialSettings({...materialSettings, metalness: value}));

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
          {isGame && !gameOver && currentBlock.block}

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
