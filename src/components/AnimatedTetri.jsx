import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react'
import { useGameStore } from '../store/store';
import { useHelper } from "@react-three/drei";
import { PointLightHelper } from "three";

const AnimatedTetri = ({position, children}) => {
  const tetriRef = useRef();
  const gameOver = useGameStore(state => state.gameOver);
  
  const pointRef = useRef(null);
  // useHelper(pointRef, PointLightHelper, 1, 'cyan');

  useFrame((state, delta) => {
    if (tetriRef.current && !gameOver) {
      tetriRef.current.rotation.y += delta;
    }
  });
  useEffect(() => {
    if (pointRef.current) {
      pointRef.current.position.set(3, 2, 8);
    }
  }, [])

  return (
    <>
      <pointLight intensity={300} castShadow color={"#fffff0"} ref={pointRef} />
      <group position={position} ref={tetriRef}>
        {children}
      </group>
    </>
  )
}

export default AnimatedTetri