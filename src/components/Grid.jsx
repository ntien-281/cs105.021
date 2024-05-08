// TODO Giao diện trò chơi chính, có state và xử lý state để handle gameplay

import React from 'react'

const Grid = ({size, divisions, color}) => {
  return (
    <group position={[0, 0, 0]}>
      <gridHelper
        args={[size, divisions, color]}
        position={[size / 2, 0, size / 2]} />
      <gridHelper
        args={[size, divisions, color]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
        position={[0, 3 * size / 2, size / 2]} />
      <gridHelper
        args={[size, divisions, color]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
        position={[0, size / 2, size / 2]} />
      <gridHelper
        args={[size, divisions, color]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[size / 2, 3 * size / 2, 0]} />
      <gridHelper
        args={[size, divisions, color]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[size / 2, size / 2, 0]} />
    </group>
  )
}

export default Grid