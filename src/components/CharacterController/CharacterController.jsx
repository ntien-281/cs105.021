import { CapsuleCollider, RigidBody } from "@react-three/rapier"
import Knight2 from "../../loaders/HollowKnight/Knight2"
import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";

const MOVEMENT_SPEED = 0.5;
const MAX_VELOCITY = 7;

const CharacterController = () => {

  const fowardPressed = useKeyboardControls(state => state["foward"]);
  const backPressed = useKeyboardControls(state => state["back"]);
  const leftPressed = useKeyboardControls(state => state["left"]);
  const rightPressed = useKeyboardControls(state => state["right"]);

  const hitbox = useRef();
  const character = useRef();

  useFrame((state, delta) => {
    const impulse = { x: 0, y: 0, z: 0 };

    const linearVelocity = hitbox.current.linvel();
    let changeRotation = false;

    if (fowardPressed && linearVelocity.z > -MAX_VELOCITY) {
      impulse.z -= MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (backPressed && linearVelocity.z < MAX_VELOCITY) {
      impulse.z += MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (leftPressed && linearVelocity.x > -MAX_VELOCITY) {
      impulse.x -= MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (rightPressed && linearVelocity.x < MAX_VELOCITY) {
      impulse.x += MOVEMENT_SPEED;
      changeRotation = true;
    }

    hitbox.current.applyImpulse(impulse, true);
    if (changeRotation) {
      const angle = Math.atan2(linearVelocity.x, linearVelocity.z);
      character.current.rotation.y = angle;
    }
  })

  return (
    <RigidBody ref={hitbox} colliders={false} position={[0, 10, 0]} includeInvisible enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.8, 0.6]} position={[0, 1.3, 0]} />
      <group ref={character}>
        <Knight2 />
      </group>
    </RigidBody>
  )
}

export default CharacterController