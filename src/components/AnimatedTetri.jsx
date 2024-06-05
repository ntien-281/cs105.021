import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react'
import { useGameStore } from '../store/store';

const AnimatedTetri = ({position, children}) => {
  const tetriRef = useRef();
  const gameOver = useGameStore(state => state.gameOver);

  useFrame((state, delta) => {
    if (tetriRef.current && !gameOver) {
      tetriRef.current.rotation.y += delta;
    }
  });
  // useEffect(() => {
  //   tetriRef.current.rotation.x = 20;
  // })

  return (
    <group position={position} ref={tetriRef}>
      {children}
    </group>
  )
}

export default AnimatedTetri