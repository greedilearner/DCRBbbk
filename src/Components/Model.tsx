import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Object3D } from "three/src/core/Object3D.js";
export default function Model({ scale = 10, position = [0, -1, -1] }) {
  const { scene } = useGLTF("/model.glb");

  const ref = useRef<Object3D | null>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y =
        Math.PI / 4 + Math.sin(state.clock.elapsedTime) * (Math.PI / 4);
    }
  });

  return (
    <primitive ref={ref} object={scene} scale={scale} position={position} />
  );
}
