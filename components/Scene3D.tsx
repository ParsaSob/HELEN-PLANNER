"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Drift() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.015;
    group.current.position.y = Math.sin(t * 0.12) * 0.25;
  });
  return (
    <group ref={group}>
      <Sparkles count={200} scale={[16, 9, 12]} size={3} speed={0.2} color="#E8B979" opacity={0.6} />
      <Sparkles count={100} scale={[12, 7, 10]} size={5} speed={0.1} color="#6E9878" opacity={0.4} />
      <Sparkles count={40} scale={[8, 5, 6]} size={7} speed={0.08} color="#C9A15D" opacity={0.3} />
    </group>
  );
}

function LightRays() {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(3, 8, 8, 1, true);
    return geo;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={[-2, 3, -3]}
      rotation={[0.3, 0, 0.2]}
    >
      <meshBasicMaterial
        color="#E8B979"
        transparent
        opacity={0.04}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#0c1712"]} />
        <fog attach="fog" args={["#0c1712", 5, 16]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 2]} intensity={1.0} color="#E8B979" />
        <pointLight position={[-3, 2, -2]} intensity={0.5} color="#6E9878" />
        <Environment preset="forest" />
        <Drift />
        <LightRays />
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.3} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
