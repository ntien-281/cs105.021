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
  // const clearSound = () => {
  //   const clear = new Audio('/src/assets/clear.mp3');
  //   clear.play();
  // };
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
    if (gameOver) {
      const audio = new Audio('/src/assets/gameOver.mp3');
      audio.play();
    }
  }, [gameOver]);  

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
  const checkCollision = (curTetri,gridLayers,position,difX,difZ) => {
    const curChildren = curTetri.current.children;
    let check = 0;
    const Y =  1 + position[1];
    const layerIndex = (Y - 1) / 2;
    const curLayer = gridLayers[layerIndex];
    for (let i = 0; i < curLayer.length; i++) {
      let x = curLayer[i].position[0];
      let z = curLayer[i].position[1];
      for (let i = 0;i < curChildren.length;i++) {
        let childPos = curChildren[i].position
        let blockY = childPos.y + position[1];
        if (blockY == Y) {
          let blockX = childPos.x + position[0];
          let blockZ = childPos.z + position[2];
          if (blockX + difX == x && blockZ +difZ == z)
            check = 1;
        }
      }
    }
    const aboveLayer = gridLayers[layerIndex + 1];
    for (let i = 0; i < aboveLayer.length; i++) {
      let x_above = aboveLayer[i].position[0];
      let z_above = aboveLayer[i].position[1];
      for (let i = 0; i < curChildren.length;i++) {
        let childPos = curChildren[i].position
        let blockY = childPos.y + position[1];
        if (blockY == Y + 2) {
          let blockX = childPos.x + position[0];
          let blockZ = childPos.z + position[2];
          if (blockX + difX == x_above && blockZ + difZ == z_above)
            check = 1;
        }
      }
    }
    return check;
  }
  const PosSound = () => {
    const moveSound = new Audio('/src/assets/change.mp3');
    moveSound.play();
  };
  const handleKeyDown = (event) => {
    if (!currentTetrimino.current) return;
    event.preventDefault();
    event.stopPropagation();
    const curTetri = currentTetrimino;
    const curPos = curTetri.current.position;
    switch (event.key) {
      case "a":
        if (takeMinPosCube(currentTetrimino, 2).x + position[0] - 3 >= 0 && checkCollision(curTetri,gridLayers,position,-2,0) == 0) {
          const [x, y, z] = position;
          setPosition([x - 2, y, z]);
          PosSound();
        }
        break;
      case "d":
        if (takeMaxPosCube(currentTetrimino, 2).x + position[0] + 1 <= 10 && checkCollision(curTetri,gridLayers,position,2,0) == 0) {
          const [x, y, z] = position;
          setPosition([x + 2, y, z]);
          PosSound();
        }
        break;
      case "w":
        if (takeMinPosCube(currentTetrimino, 1).z + position[2] - 3 >= 0 && checkCollision(curTetri,gridLayers,position,0,-2) == 0) {
          const [x, y, z] = position;
          setPosition([x, y, z - 2]);
          PosSound();
        }
        break;
      case "s":
        if (
          takeMaxPosCube(currentTetrimino, 1).z + position[2] + 1 <= 10 && checkCollision(curTetri,gridLayers,position,0,2) == 0) {
          const [x, y, z] = position;
          setPosition([x, y, z + 2]);
          PosSound();
        }
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
