import React from 'react';
import { useRapier, RigidBody } from '@react-three/rapier';
import { Box } from '@react-three/drei';
import { Vector3 } from 'three/src/Three.js';

// eslint-disable-next-line react/display-name
const BoxWithPhysics = React.forwardRef((props, ref) => {
  const { position, args } = props;
  const {rigidBody} = useRapier(() => ({
    type: 'Dynamic',
    args: [Math.random() * 5 + 1],
    position: position,
    shape: { type: 'Cuboid', halfExtents: new Vector3([args[0] / 2, args[1] / 2, args[2] / 2]) },
  }));

  return (
    <RigidBody ref={rigidBody} includeInvisible>
      <Box args={args} position={position} ref={ref}/>
      <meshStandardMaterial color="red" args={args} position={position} />
    </RigidBody>
  );
});

export default BoxWithPhysics