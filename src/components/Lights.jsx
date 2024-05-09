// TODO ambient for global lighting, directional from above (blocks have shadows) to indicate hard drop positions
import { useHelper } from '@react-three/drei';
import React, { useEffect, useRef } from 'react'
import { DirectionalLightHelper } from "three";

const Lights = () => {
  const topLight = useRef(null);
  useHelper(topLight, DirectionalLightHelper, 1, 'cyan');
  useEffect(() => {
    if (topLight.current) {
      topLight.current.target.position.set(6, 0, 6);
      topLight.current.shadow.camera.left = -12;
      topLight.current.shadow.camera.bottom = -12;
      topLight.current.shadow.camera.top = 12;
      topLight.current.shadow.camera.right = 12;
    }
  }, [])


  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[6, 30, 6]}
        intensity={5}
        castShadow
        color={"#fffff0"}
        ref={topLight}
      />
    </>
  )
}

export default Lights