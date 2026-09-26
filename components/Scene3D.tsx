"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";

function Drift() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.02;
    group.current.position.y = Math.sin(t * 0.15) * 0.3;
  });
  return (
    <group ref={group}>
      <Sparkles count={180} scale={[14, 8, 10]} size={3} speed={0.25} color="#E8B979" opacity={0.7} />
      <Sparkles count={80} scale={[10, 6, 8]} size={5} speed={0.15} color="#6E9878" opacity={0.5} />
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.6]}>
        <color attach="background" args={["#0e1912"]} />
        <fog attach="fog" args={["#0e1912", 6, 18]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 2]} intensity={1.1} color="#E8B979" />
        <Environment preset="forest" />
        <Drift />
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
