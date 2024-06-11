import { Plane } from "@react-three/drei";
import React from "react";
import { DoubleSide } from "three";

const Grid = ({size, divisions, color}) => {
  return (
    <>
      {/* Grid */}
      <group position={[0, 0, 0]}>
        <gridHelper
          args={[size, divisions, color]}
          position={[size / 2, 0, size / 2]}
          receiveShadow
        />
        <Plane 
          args={[12, 12]}
          rotation={[-Math.PI / 2, 0 ,0]}
          position={[size / 2, 0, size / 2]}
          receiveShadow
        >
          <meshStandardMaterial shadowSide={DoubleSide} receiveShadow />
        </Plane>
        <gridHelper
          args={[size, divisions, color]}
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
          position={[0, 3 * size / 2, size / 2]} 
        />
        <gridHelper
          args={[size, divisions, color]}
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
          position={[0, size / 2, size / 2]} 
        />
        <gridHelper
          args={[size, divisions, color]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[size / 2, 3 * size / 2, 0]} 
        />
        <gridHelper
          args={[size, divisions, color]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[size / 2, size / 2, 0]} 
        />
      </group>
    </>
  )
}

export default Grid
