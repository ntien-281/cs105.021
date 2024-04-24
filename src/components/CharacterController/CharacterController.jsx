import { CapsuleCollider, RigidBody } from "@react-three/rapier"
import Knight2 from "../../loaders/HollowKnight/Knight2"
import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber";


const CharacterController = () => {

  const hitbox = useRef();

  return (
    <RigidBody ref={hitbox} colliders={false} position={[0, 20, 0]} includeInvisible>
      <CapsuleCollider args={[0.8, 0.6]} position={[0, 1.3, 0]} />
      <Knight2 />
    </RigidBody>
  )
}

export default CharacterController