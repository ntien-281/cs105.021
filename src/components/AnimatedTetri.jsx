import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react'

const AnimatedTetri = ({position, children}) => {
  const tetriRef = useRef();
  useFrame((state, delta) => {
    if (tetriRef.current) {
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