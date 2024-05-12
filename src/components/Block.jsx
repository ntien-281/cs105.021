import React from 'react';
import PropTypes from 'prop-types';
import { Canvas } from '@react-three/fiber'

// Define the tetriminos blocks
const blocks = [
  {
    shape: [[1, 1], [1, 1]], // Square block
    color: 0xff0000 // Red
  },
  {
    shape: [[0, 1, 0], [1, 1, 1]], // L block
    color: 0x00ff00 // Green
  },
  {
    shape: [[0, 1, 1], [1, 1, 0]], // T block
    color: 0x0000ff // Blue
  },
  // Define other tetriminos blocks here...
];

// Function to return a random block
const getRandomBlock = () => {
  const randomIndex = Math.floor(Math.random() * blocks.length);
  return blocks[randomIndex];
};

// Component to render the block in React Three Fiber
const TetriminosBlock = ({ block }) => {
  return (
    <group>
      {block.shape.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          cell === 1 && <mesh key={`${rowIndex}-${colIndex}`} position={[colIndex, -rowIndex, 0]}>
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshStandardMaterial attach="material" color={block.color} />
          </mesh>
        ))
      ))}
    </group>
  );
};

TetriminosBlock.propTypes = {
  block: PropTypes.shape({
    shape: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    color: PropTypes.number.isRequired
  }).isRequired
};

// Component to render the canvas and tetriminos block
const getBlock = () => {
  const randomBlock = getRandomBlock();

  return (
    <Canvas>
      <TetriminosBlock block={randomBlock} />
    </Canvas>
  );
};

export default getBlock;
