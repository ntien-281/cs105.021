import React from 'react';
import { Canvas } from "@react-three/fiber";
import { RoundedBox } from '@react-three/drei';

const box_size = 2; 

// Function to generate a random position within a given range
const getRandomPosition = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Define four groups of blocks
const groupsOfBlocks = [
  [
    [1, 1, 1],
    [1, 1, 1 + box_size],
    [1,1 + box_size,1],
    [1 + box_size,1,1]
  ],
  [
    [1,1,1],
    [1+box_size,1+box_size,1],
    [1,1 + box_size,1],
    [1 + box_size,1,1]
  ],
  [
    [1,1,1],
    [1,1,1 + box_size],
    [1,1 + box_size,1],
    [1,1,1+2*box_size]
  ],
  [
    [1,1,1],
    [1,1,1 + box_size],
    [1,1 + box_size,1+box_size],
    [1,1,1+2*box_size]
  ],
  [
    [1,1,1],
    [1,1,1 + box_size],
    [1,1 - box_size,1+box_size],
    [1,1,1+2*box_size],
    [1,1-2*box_size,1+box_size]
  ]
];

// Function to generate a random group of RoundedBox elements
const generateRandomGroup = () => {
  const randomIndex = Math.floor(Math.random() * groupsOfBlocks.length);
  const group = groupsOfBlocks[randomIndex];

  return group.map((position, index) => (
    <RoundedBox
      key={index}
      args={[box_size, box_size, box_size]}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color="#00ff00" />
    </RoundedBox>
  ));
};

// Component to render the canvas and random group
const Block = () => {
  const randomGroup = generateRandomGroup();

  return (
      <group>{randomGroup}</group>
  );
};

export default Block;
