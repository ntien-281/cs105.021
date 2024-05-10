import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import React from "react";

const CameraController = () => {
  return (
    <>
      <OrbitControls />
      <PerspectiveCamera />
    </>
  );
};

export default CameraController;
