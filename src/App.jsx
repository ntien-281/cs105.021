import { Canvas } from "@react-three/fiber";
import Grid from "./components/Grid";
import Ui from "./components/Ui";
import Header from "./components/Header";
import Lights from "./components/Lights";
import CameraController from "./components/CameraController";
import { useGameStore } from "./store/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateRandomGroup } from "./utils/block";
import Tetrimino from "./components/Tetrimino";
import GUI from "lil-gui";
import { groupsOfBlocks } from "./utils/block";
import FallenCubes from "./components/FallenCubes";

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
  const removeFullLayer = useGameStore((state) => state.removeFullLayer);
  const nextBlock = useGameStore((state) => state.nextBlock);
  const setNextBlock = useGameStore((state) => state.setNextBlock);
  const materialSettings = useGameStore((state) => state.materialSettings);
  const setMaterialSettings = useGameStore(
    (state) => state.setMaterialSettings
  );
  const score = useGameStore(state => state.score);
  const setScore = useGameStore(state => state.setScore);
  const currentTetrimino = useRef();
  const fallInterval = useRef();

  const [position, setPosition] = useState([0, 0, 0]); // Tetri position
  const [blocks, setBlocks] = useState([]); // Array of tetri's cubes' positions => for rotation (changing cubes position)
  const [isFullLayerAnimation, setIsFullLayerAnimation] = useState(false);
  const [fullIndexes, setFullIndexes] = useState([])

  //Sound effect
  const bgm = useRef(new Audio("/src/assets/BGM.mp3"));
  useEffect(() => {
    if (gameOver) {
      const audio = new Audio("/src/assets/gameOver.mp3");
      audio.play();
    }
  }, [gameOver]);
  const PosSound = () => {
    const moveSound = new Audio("/src/assets/change.mp3");
    moveSound.play();
  };
  const gridImpact = useCallback(
    (blockPos, tetriPos) => {
      const blockX = blockPos[0] + tetriPos[0];
      const blockY = blockPos[1] + tetriPos[1];
      const blockZ = blockPos[2] + tetriPos[2];

      const llIndex = (blockY - 1) / 2;
      if (llIndex < 0 || llIndex >= gridLayers.length) {
        return false;
      }
      // console.log(gridLayers);
      const lowerLayer = gridLayers[llIndex];
      // console.log("curr layer: ", llIndex, lowerLayer);
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


  const onAnimationComplete = (fullI) => {
    fullI.forEach((i) => {
      console.log("removing full");
      removeFullLayer(i);
    });
  };

  const handleFullLayers = async () => {
    // TODO: animation here
    let fullI = [];
    for (let i = 0; i < gridLayers.length; i++) {
      if (gridLayers[i].length === 36) {
        fullI = [...fullI, i];
      }
    }
    if (fullI.length > 0) {
      setIsFullLayerAnimation(true);
      setFullIndexes(fullI);
      setScore(score + 10);
      // fullI.forEach(i => {
      //   console.log("removing full");
      //   removeFullLayer(i);
      // }); => this is handled in onAnimationComplete
    }
    // setFullIndexes([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

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
      const audio = new Audio("/src/assets/gameOver.mp3");
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
    // console.log("generating new block");
    setPosition([nextBlock.xInit, 24, nextBlock.zInit]);
    const newBlock = {
      color: nextBlock.color,
      typeid: nextBlock.typeid,
    };
    setBlocks(groupsOfBlocks[newBlock.typeid].coords);
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
      bgm.current.pause();
      clearInterval(fallInterval);
      bgm.current.pause();
    } else if (isPause) {
      bgm.current.pause();
    } else {
      bgm.current.loop = true;
      bgm.current.volume = 0.3;
      bgm.current.play();
    }
    if (isGame && !isPause && !gameOver) {
      fallInterval.current = setInterval(() => {
        const [x, y, z] = position;
        setPosition([x, y - 2, z]);
        const currTetri = currentTetrimino.current;
        // console.log("falling");
        // INFO: Check if any block in tetrimino touches the floor
        // or another block in grid layers
        for (let i = 0; i < currTetri.children.length; i++) {
          let currChildPos = [
            currTetri.children[i].position.x,
            currTetri.children[i].position.y,
            currTetri.children[i].position.z,
          ];
          let fallenLayer = (position[1] + currChildPos[1] - 1) / 2;
          // console.log(fallenLayer);
          if (fallenLayer == 0 || gridImpact(currChildPos, [x, y - 2, z])) {
            currTetri.children.forEach((child) => {
              let fallenLayer = (position[1] + child.position.y - 1) / 2;
              if (fallenLayer >= 0) {
                const block = {
                  position: [
                    child.position.x + position[0],
                    child.position.z + position[2],
                  ],
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
  }, [isGame, isPause, gridLayers, currentBlock, nextBlock, position, blocks]);

  // INFO: Movement logic

  const isValidPosition = (newBlocks) => {
    for (let { x, y, z } of newBlocks) {
      if (
        x < 0 ||
        x >= 12 ||
        z < 0 ||
        z >= 12 ||
        y < 0 ||
        y >= 28 ||
        gridImpact([x - position[0], y - position[1], z - position[2]], position)
      ) {
        return false;
      }
    }

    return true;
  };
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
  }
  const hardDrop = () => {
    if (gameOver || !position || !blocks || isPause) return;

    let breaker = true;
    let [x, y, z] = position;
    while (breaker) {
      const newY = y - 2;
      const predictedBlocksPosition = blocks.map(block => ({ x: block[0] + x, y: block[1] + newY, z: block[2] + z }));
      if (!isValidPosition(predictedBlocksPosition)) {
        breaker = false;
        break;
      }
      y = newY;
    }
    return [x, y, z];
  }

  const handleKeyDown = (event) => {
    if (!currentTetrimino.current || isPause || !isGame || gameOver) return;
    event.preventDefault();
    let [x, y, z] = position;
    let newBlocks = blocks;
    switch (event.key) {
      case "a":
        x -= 2;
        PosSound();
        break;
      case "d":
        x += 2;
        PosSound();
        break;
      case "w":
        z -= 2;
        PosSound();
        break;
      case "s":
        z += 2;
        PosSound();
        break;
      case "q":
        newBlocks = blocks.map((block) => [block[0], block[2], -block[1]]);
        break;
      case "e":
        newBlocks = blocks.map((block) => [block[2], block[1], block[0]]);
        break;
      case "r":
        newBlocks = blocks.map((block) => [block[1], -block[0], block[2]]);

        break;
      case " ":
        [x, y, z] = hardDrop();
        break;
      default:
        break;
    }
    const newBlocksPosition = newBlocks.map((block) => ({
      x: block[0] + x,
      y: block[1] + y,
      z: block[2] + z,
    }));
    if (isValidPosition(newBlocksPosition)) {
      // console.log("set new position");
      setPosition([x, y, z]);
      PosSound();
      setBlocks(newBlocks);
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
          {isGame && !gameOver && (
            <Tetrimino
              controlRef={currentTetrimino}
              color={currentBlock.color}
              position={position}
              blocks={blocks}
            />
          )}
          <Grid color={color} divisions={divisions} size={size} />
          {/* Fallen blocks */}
          <FallenCubes
            gridLayers={gridLayers}
            isFullLayerAnimation={isFullLayerAnimation}
            setIsAnimating={setIsFullLayerAnimation}
            fullIndexes={fullIndexes}
            handleAnimationComplete={onAnimationComplete}
          />
        </Canvas>
      </div>
      <Ui />
    </>
  );
}

export default App;
