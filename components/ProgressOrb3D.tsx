"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, MeshDistortMaterial, Sparkles, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo } from "react";
import * as THREE from "three";

function ArcRing({
  percent,
  radius,
  color,
  thickness = 0.12,
}: {
  percent: number;
  radius: number;
  color: string;
  thickness?: number;
}) {
  const thetaLength = Math.max(0.001, (percent / 100) * Math.PI * 2);
  return (
    <mesh rotation-x={Math.PI / 2}>
      <ringGeometry args={[radius - thickness, radius, 64, 1, -Math.PI / 2, thetaLength]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function CoreOrb({ percent }: { percent: number }) {
  const color = useMemo(() => {
    const c1 = new THREE.Color("#3F5C41");
    const c2 = new THREE.Color("#C9A15D");
    return c1.lerp(c2, percent / 100).getStyle();
  }, [percent]);
  return (
    <mesh>
      <icosahedronGeometry args={[0.62, 4]} />
      <MeshDistortMaterial
        color={color}
        distort={0.45}
        speed={2.2}
        roughness={0.15}
        metalness={0.4}
        emissive={color}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

export default function ProgressOrb3D({
  taskPercent,
  hoursPercent,
}: {
  taskPercent: number;
  hoursPercent: number;
}) {
  return (
    <div className="w-[150px] h-[150px] shrink-0">
      <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={30} color="#E8B979" />
        <Environment preset="forest" />
        <CoreOrb percent={taskPercent} />
        <ArcRing percent={taskPercent} radius={0.95} color="#C9A15D" />
        <ArcRing percent={hoursPercent} radius={0.78} color="#6E9878" thickness={0.08} />
        <Sparkles count={40} scale={2.6} size={2} speed={0.4} color="#E8B979" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.4} />
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
