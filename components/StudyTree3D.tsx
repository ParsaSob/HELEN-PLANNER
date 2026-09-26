"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sparkles, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Tree({ growthProgress, stageKey }: { growthProgress: number; stageKey: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.15;
    group.current.position.y = Math.sin(t * 0.5) * 0.05;
  });

  const trunkHeight = useMemo(() => {
    if (stageKey === "seed") return 0.05;
    if (stageKey === "sprout") return 0.2;
    if (stageKey === "sapling") return 0.5;
    if (stageKey === "tree") return 0.8;
    return 1.1;
  }, [stageKey]);

  const trunkRadius = useMemo(() => {
    if (stageKey === "seed") return 0.02;
    if (stageKey === "sprout") return 0.03;
    if (stageKey === "sapling") return 0.05;
    if (stageKey === "tree") return 0.07;
    return 0.09;
  }, [stageKey]);

  const crownScale = useMemo(() => {
    if (stageKey === "seed") return 0;
    if (stageKey === "sprout") return 0.15;
    if (stageKey === "sapling") return 0.4;
    if (stageKey === "tree") return 0.7;
    return 1.0;
  }, [stageKey]);

  const crownColor = useMemo(() => {
    const c = new THREE.Color("#3F5C41");
    const target = new THREE.Color("#6E9878");
    return c.lerp(target, growthProgress / 100).getStyle();
  }, [growthProgress]);

  const hasCrown = stageKey !== "seed";

  return (
    <group ref={group}>
      {/* Ground mound */}
      <mesh position={[0, -0.55, 0]} scale={[1, 0.15, 1]}>
        <sphereGeometry args={[0.5, 32, 16]} />
        <meshStandardMaterial color="#3a3020" roughness={0.9} metalness={0} />
      </mesh>

      {/* Seed (visible only at seed stage) */}
      {stageKey === "seed" && (
        <mesh position={[0, -0.42, 0]} scale={0.08}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial color="#C9A15D" roughness={0.4} metalness={0.3} emissive="#C9A15D" emissiveIntensity={0.2} />
        </mesh>
      )}

      {/* Trunk */}
      <mesh position={[0, -0.55 + trunkHeight / 2, 0]}>
        <cylinderGeometry args={[trunkRadius * 0.7, trunkRadius, trunkHeight, 12]} />
        <meshStandardMaterial color="#5A4A3C" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Crown — multiple spheres for organic look */}
      {hasCrown && (
        <group position={[0, -0.55 + trunkHeight, 0]} scale={crownScale}>
          <mesh position={[0, 0.25, 0]}>
            <icosahedronGeometry args={[0.35, 3]} />
            <meshStandardMaterial
              color={crownColor}
              roughness={0.6}
              metalness={0.1}
              emissive={crownColor}
              emissiveIntensity={0.15}
              flatShading
            />
          </mesh>
          <mesh position={[0.2, 0.15, 0.1]} scale={0.7}>
            <icosahedronGeometry args={[0.3, 3]} />
            <meshStandardMaterial color={crownColor} roughness={0.6} flatShading emissive={crownColor} emissiveIntensity={0.12} />
          </mesh>
          <mesh position={[-0.18, 0.12, -0.08]} scale={0.65}>
            <icosahedronGeometry args={[0.3, 3]} />
            <meshStandardMaterial color={crownColor} roughness={0.6} flatShading emissive={crownColor} emissiveIntensity={0.12} />
          </mesh>
          <mesh position={[0.05, 0.42, -0.05]} scale={0.55}>
            <icosahedronGeometry args={[0.28, 3]} />
            <meshStandardMaterial color={crownColor} roughness={0.6} flatShading emissive={crownColor} emissiveIntensity={0.12} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function StudyTree3D({
  growthProgress,
  stageKey,
}: {
  growthProgress: number;
  stageKey: string;
}) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0.5, 3], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.45} />
        <pointLight position={[2, 3, 2]} intensity={20} color="#E8B979" />
        <pointLight position={[-2, 1, -1]} intensity={10} color="#6E9878" />
        <Environment preset="forest" />
        <Tree growthProgress={growthProgress} stageKey={stageKey} />
        <Sparkles count={30} scale={3} size={2} speed={0.3} color="#E8B979" opacity={0.6} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2.1} />
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
