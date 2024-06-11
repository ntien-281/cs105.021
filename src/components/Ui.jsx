// TODO UI overlay, bên trái là incoming block(các block này có animation), bên phải là hướng dẫn điều khiển + navigation + ...
import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/store";
import { Canvas } from "@react-three/fiber";
import Tetrimino from "./Tetrimino";
import AnimatedTetri from "./AnimatedTetri";
import { groupsOfBlocks } from "../utils/block";

const Ui = () => {
  const score = useGameStore((state) => state.score);
  const nextBlock = useGameStore((state) => state.nextBlock);
  const gameOver = useGameStore((state) => state.gameOver);
  const resetGame = useGameStore((state) => state.resetGame);
  const setTextureUrl = useGameStore((state) => state.setTextureUrl);

  const [blocks, setBlocks] = useState([])

  // INFO: Texture loader:
  const createImageUrl = (buffer, type) => {
    const blob = new Blob([buffer], { type })
    const urlCreator = window.URL || window.webkitURL
    const imageUrl = urlCreator.createObjectURL(blob)
    console.log(imageUrl)
    return imageUrl
  }
  const getTextureFile = async (e) => {
    const file = e.target.files[0]
    const { type } = file
    const buffer = await file.arrayBuffer()
    const imageUrl = createImageUrl(buffer, type)
    setTextureUrl(imageUrl)
  }

  const handleResetInput = (event) => {
    if (gameOver) {
      resetGame();
    }
  };
  useEffect(() => {
    window.addEventListener("mouseup", handleResetInput);
    return () => {
      window.removeEventListener("mouseup", handleResetInput);
    };
  });

  useEffect(() => {
    setBlocks(groupsOfBlocks[nextBlock.typeid]?.coords);
  }, [nextBlock])

  return (
    // Left UI: incoming blocks with animation
    <>
      {gameOver ? <div className="overlay">Game over</div> : <></>}
      <div className="incoming-display">
        <strong>Khối tiếp:</strong>

        {nextBlock.typeid !== null ? (
          <Canvas
            camera={{ fov: 60, near: 0.1, far: 1000, position: [10, 10, 12] }}
          >
            <AnimatedTetri position={[0, 2, 0]}>
              <Tetrimino
                controlRef={null}
                color={nextBlock.color}
                blocks={blocks}
              />
            </AnimatedTetri>
            <directionalLight
              position={[6, 30, 6]}
              intensity={5}
              castShadow
              color={"#fffff0"}
            />
            {/* <Plane
              args={[12, 12]}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[2 / 2, 0, 2 / 2]}
              receiveShadow
            ></Plane> */}
          </Canvas>
        ) : (
          <></>
        )}
      </div>
      <div className="score">
        <strong>Điểm: {score}</strong>
      </div>
      {/* Right UI */}
      <div className="instructions-label">
        <div className="texture-input">
          <label className="texture-input-btn">
            Tải texture
            <input type="file" onChange={(e) => getTextureFile(e)} />
          </label>
        </div>
        <ul>
          <li>
            <strong>Camera: </strong> <span>Kéo thả chuột</span>
          </li>
          <li>
            <strong>Di chuyển</strong>
            <ul>
              <li>
                <strong>X:</strong> W, A
              </li>
              <li>
                <strong>Z:</strong> S, D
              </li>
            </ul>
          </li>
          <li>
            <strong>Xoay:</strong>
            <ul>
              <li>
                <strong>X:</strong> Q
              </li>
              <li>
                <strong>Y:</strong> E
              </li>
              <li>
                <strong>Z:</strong> R
              </li>
            </ul>
          </li>
          <li>
            <strong>Thả:</strong> <span>Space</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Ui;
