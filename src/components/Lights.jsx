// TODO ambient for global lighting, directional from above (blocks have shadows) to indicate hard drop positions
import { useHelper } from '@react-three/drei';
import React, { useEffect, useRef } from 'react'
import { DirectionalLightHelper, PointLightHelper } from "three";

const Lights = () => {
  const topLight = useRef(null);
  const sideLightRef = useRef(null);
  
  useHelper(topLight, DirectionalLightHelper, 2, 'cyan');
  // useHelper(sideLightRef, DirectionalLightHelper, 1, 'cyan');
  
  useEffect(() => {
    if (topLight.current) {
      topLight.current.target.position.set(6, 0, 6);
      topLight.current.shadow.camera.left = -24;
      topLight.current.shadow.camera.bottom = -24;
      topLight.current.shadow.camera.top = 24;
      topLight.current.shadow.camera.right = 24;
    }
    if (sideLightRef.current) {
      sideLightRef.current.position.set(30, 14, 6);
      sideLightRef.current.target.position.set(0, 14, 6);
      sideLightRef.current.shadow.camera.left = -12;
      sideLightRef.current.shadow.camera.bottom = -12;
      sideLightRef.current.shadow.camera.top = 12;
      sideLightRef.current.shadow.camera.right = 12;
    }
  }, [])


  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[6, 30, 6]}
        intensity={10}
        castShadow
        color={"#fffff0"}
        ref={topLight}
      />
      <directionalLight 
        intensity={3}
        castShadow
        color={"#fffff0"}
        ref={sideLightRef}
      />
    </>
  )
}

export default Lights