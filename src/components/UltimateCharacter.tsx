"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Ultra-realistic human character with proper anatomy and proportions
export function UltimateMaleCharacter({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animation = "idle",
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animation?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const skeletonRef = useRef<{
    head: THREE.Group;
    neck: THREE.Mesh;
    spine: THREE.Mesh;
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftForearm: THREE.Group;
    rightForearm: THREE.Group;
    leftHand: THREE.Mesh;
    rightHand: THREE.Mesh;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    leftCalf: THREE.Group;
    rightCalf: THREE.Group;
    leftFoot: THREE.Mesh;
    rightFoot: THREE.Mesh;
  }>({} as any);

  // Realistic skin material with subsurface scattering simulation
  const skinMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#d4a484"),
      roughness: 0.55,
      metalness: 0.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.4,
      sheen: 0.3,
      sheenRoughness: 0.4,
      sheenColor: new THREE.Color("#ffd4c4"),
      envMapIntensity: 0.8,
    });
    return mat;
  }, []);

  // High-quality clothing materials
  const fabricMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1a1a2e"),
      roughness: 0.85,
      metalness: 0.0,
      sheen: 0.2,
      sheenRoughness: 0.6,
    });
  }, []);

  const denimMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#2c3e50"),
      roughness: 0.9,
      metalness: 0.0,
      sheen: 0.1,
    });
  }, []);

  const leatherMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1a0f0a"),
      roughness: 0.3,
      metalness: 0.0,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    });
  }, []);

  // Animation system
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Breathing animation
    const breathe = Math.sin(time * 1.5) * 0.003;
    groupRef.current.position.y = position[1] + breathe;

    // Subtle weight shift
    const weightShift = Math.sin(time * 0.8) * 0.002;
    groupRef.current.rotation.z = weightShift;

    // Eye blink (every 3-5 seconds)
    if (skeletonRef.current.head) {
      const blinkCycle = time % 4;
      if (blinkCycle > 3.8 && blinkCycle < 4) {
        // Squint during blink
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* PELVIS / HIP */}
      <group position={[0, 1.0, 0]}>
        <mesh castShadow material={denimMaterial}>
          <boxGeometry args={[0.32, 0.18, 0.18]} />
        </mesh>

        {/* LEFT LEG */}
        <group ref={(el) => { if (el) skeletonRef.current.leftLeg = el; }} position={[-0.12, -0.1, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.22, 0]} castShadow material={denimMaterial}>
            <capsuleGeometry args={[0.09, 0.35, 8, 16]} />
          </mesh>
          {/* Knee */}
          <mesh position={[0, -0.42, 0.01]} castShadow material={skinMaterial}>
            <sphereGeometry args={[0.07, 12, 12]} />
          </mesh>
          {/* Calf */}
          <group ref={(el) => { if (el) skeletonRef.current.leftCalf = el; }} position={[0, -0.5, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow material={skinMaterial}>
              <capsuleGeometry args={[0.06, 0.28, 8, 16]} />
            </mesh>
            {/* Ankle */}
            <mesh position={[0, -0.38, 0]} castShadow material={skinMaterial}>
              <sphereGeometry args={[0.045, 8, 8]} />
            </mesh>
            {/* Foot */}
            <mesh ref={(el) => { if (el) skeletonRef.current.leftFoot = el; }} position={[0, -0.42, 0.06]} castShadow material={leatherMaterial}>
              <boxGeometry args={[0.09, 0.05, 0.2]} />
            </mesh>
          </group>
        </group>

        {/* RIGHT LEG */}
        <group ref={(el) => { if (el) skeletonRef.current.rightLeg = el; }} position={[0.12, -0.1, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow material={denimMaterial}>
            <capsuleGeometry args={[0.09, 0.35, 8, 16]} />
          </mesh>
          <mesh position={[0, -0.42, 0.01]} castShadow material={skinMaterial}>
            <sphereGeometry args={[0.07, 12, 12]} />
          </mesh>
          <group ref={(el) => { if (el) skeletonRef.current.rightCalf = el; }} position={[0, -0.5, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow material={skinMaterial}>
              <capsuleGeometry args={[0.06, 0.28, 8, 16]} />
            </mesh>
            <mesh position={[0, -0.38, 0]} castShadow material={skinMaterial}>
              <sphereGeometry args={[0.045, 8, 8]} />
            </mesh>
            <mesh ref={(el) => { if (el) skeletonRef.current.rightFoot = el; }} position={[0, -0.42, 0.06]} castShadow material={leatherMaterial}>
              <boxGeometry args={[0.09, 0.05, 0.2]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* SPINE / TORSO */}
      <mesh ref={(el) => { if (el) skeletonRef.current.spine = el; }} position={[0, 1.45, 0]} castShadow material={fabricMaterial}>
        <boxGeometry args={[0.38, 0.55, 0.2]} />
      </mesh>

      {/* CHEST */}
      <mesh position={[0, 1.75, 0.02]} castShadow material={fabricMaterial}>
        <boxGeometry args={[0.42, 0.32, 0.22]} />
      </mesh>

      {/* SHOULDERS */}
      <mesh position={[-0.25, 1.82, 0]} castShadow material={fabricMaterial}>
        <sphereGeometry args={[0.06, 8, 8]} />
      </mesh>
      <mesh position={[0.25, 1.82, 0]} castShadow material={fabricMaterial}>
        <sphereGeometry args={[0.06, 8, 8]} />
      </mesh>

      {/* NECK */}
      <mesh ref={(el) => { if (el) skeletonRef.current.neck = el; }} position={[0, 2.0, 0]} castShadow material={skinMaterial}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 12]} />
      </mesh>

      {/* HEAD */}
      <group ref={(el) => { if (el) skeletonRef.current.head = el; }} position={[0, 2.18, 0]}>
        {/* Skull */}
        <mesh castShadow material={skinMaterial}>
          <sphereGeometry args={[0.13, 24, 24]} />
        </mesh>
        
        {/* Face details */}
        <group position={[0, -0.02, 0.08]}>
          {/* Brow ridge */}
          <mesh position={[0, 0.05, 0.03]} material={skinMaterial}>
            <boxGeometry args={[0.16, 0.025, 0.03]} />
          </mesh>

          {/* Eyes */}
          <group position={[0, 0.02, 0.08]}>
            {/* Left eye */}
            <mesh position={[-0.04, 0, 0]} material={new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.1, clearcoat: 1.0 })}>
              <sphereGeometry args={[0.022, 16, 16]} />
            </mesh>
            <mesh position={[-0.04, 0, 0.015]} material={new THREE.MeshStandardMaterial({ color: "#3d2314" })}>
              <sphereGeometry args={[0.013, 12, 12]} />
            </mesh>
            <mesh position={[-0.04, 0, 0.022]} material={new THREE.MeshStandardMaterial({ color: "#000000" })}>
              <sphereGeometry args={[0.006, 8, 8]} />
            </mesh>
            
            {/* Right eye */}
            <mesh position={[0.04, 0, 0]} material={new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.1, clearcoat: 1.0 })}>
              <sphereGeometry args={[0.022, 16, 16]} />
            </mesh>
            <mesh position={[0.04, 0, 0.015]} material={new THREE.MeshStandardMaterial({ color: "#3d2314" })}>
              <sphereGeometry args={[0.013, 12, 12]} />
            </mesh>
            <mesh position={[0.04, 0, 0.022]} material={new THREE.MeshStandardMaterial({ color: "#000000" })}>
              <sphereGeometry args={[0.006, 8, 8]} />
            </mesh>

            {/* Eyebrows */}
            <mesh position={[-0.04, 0.03, 0.01]} material={new THREE.MeshStandardMaterial({ color: "#2a1a0f" })}>
              <boxGeometry args={[0.04, 0.006, 0.01]} />
            </mesh>
            <mesh position={[0.04, 0.03, 0.01]} material={new THREE.MeshStandardMaterial({ color: "#2a1a0f" })}>
              <boxGeometry args={[0.04, 0.006, 0.01]} />
            </mesh>
          </group>

          {/* Nose */}
          <mesh position={[0, -0.01, 0.1]} material={skinMaterial}>
            <boxGeometry args={[0.025, 0.04, 0.03]} />
          </mesh>

          {/* Nostrils */}
          <mesh position={[-0.01, -0.025, 0.11]} material={new THREE.MeshStandardMaterial({ color: "#1a0f0a" })}>
            <sphereGeometry args={[0.005, 6, 6]} />
          </mesh>
          <mesh position={[0.01, -0.025, 0.11]} material={new THREE.MeshStandardMaterial({ color: "#1a0f0a" })}>
            <sphereGeometry args={[0.005, 6, 6]} />
          </mesh>

          {/* Mouth */}
          <mesh position={[0, -0.045, 0.08]} material={new THREE.MeshPhysicalMaterial({ color: "#c17f6e", roughness: 0.4, clearcoat: 0.3 })}>
            <boxGeometry args={[0.05, 0.015, 0.015]} />
          </mesh>

          {/* Lips */}
          <mesh position={[0, -0.04, 0.09]} material={new THREE.MeshPhysicalMaterial({ color: "#c17f6e", roughness: 0.3 })}>
            <boxGeometry args={[0.06, 0.008, 0.012]} />
          </mesh>

          {/* Ears */}
          <mesh position={[-0.13, 0.02, 0]} rotation={[0, 0, -Math.PI / 12]} material={skinMaterial}>
            <boxGeometry args={[0.025, 0.045, 0.015]} />
          </mesh>
          <mesh position={[0.13, 0.02, 0]} rotation={[0, 0, Math.PI / 12]} material={skinMaterial}>
            <boxGeometry args={[0.025, 0.045, 0.015]} />
          </mesh>
        </group>

        {/* Hair */}
        <mesh position={[0, 0.05, -0.02]} material={new THREE.MeshStandardMaterial({ color: "#1a0f0a", roughness: 0.95 })}>
          <sphereGeometry args={[0.145, 20, 20]} />
        </mesh>
        <mesh position={[0, 0.08, -0.03]} material={new THREE.MeshStandardMaterial({ color: "#1a0f0a", roughness: 0.95 })}>
          <boxGeometry args={[0.26, 0.04, 0.18]} />
        </mesh>
      </group>

      {/* LEFT ARM */}
      <group ref={(el) => { if (el) skeletonRef.current.leftArm = el; }} position={[-0.28, 1.75, 0]}>
        {/* Shoulder */}
        <mesh material={fabricMaterial} castShadow>
          <sphereGeometry args={[0.055, 8, 8]} />
        </mesh>
        {/* Upper arm */}
        <mesh position={[0, -0.14, 0]} material={fabricMaterial} castShadow>
          <capsuleGeometry args={[0.045, 0.22, 8, 16]} />
        </mesh>
        {/* Elbow */}
        <mesh position={[0, -0.27, 0]} material={skinMaterial} castShadow>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>
        {/* Forearm */}
        <group ref={(el) => { if (el) skeletonRef.current.leftForearm = el; }} position={[0, -0.32, 0]}>
          <mesh position={[0, -0.12, 0]} material={skinMaterial} castShadow>
            <capsuleGeometry args={[0.035, 0.18, 8, 16]} />
          </mesh>
          {/* Wrist */}
          <mesh position={[0, -0.24, 0]} material={skinMaterial} castShadow>
            <sphereGeometry args={[0.028, 8, 8]} />
          </mesh>
          {/* Hand */}
          <mesh ref={(el) => { if (el) skeletonRef.current.leftHand = el; }} position={[0, -0.32, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.06, 0.08, 0.025]} />
          </mesh>
          {/* Fingers */}
          <group position={[0, -0.37, 0]}>
            {[0.018, 0.006, -0.006, -0.018].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]} material={skinMaterial}>
                <capsuleGeometry args={[0.006, 0.025, 4, 8]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* RIGHT ARM */}
      <group ref={(el) => { if (el) skeletonRef.current.rightArm = el; }} position={[0.28, 1.75, 0]}>
        <mesh material={fabricMaterial} castShadow>
          <sphereGeometry args={[0.055, 8, 8]} />
        </mesh>
        <mesh position={[0, -0.14, 0]} material={fabricMaterial} castShadow>
          <capsuleGeometry args={[0.045, 0.22, 8, 16]} />
        </mesh>
        <mesh position={[0, -0.27, 0]} material={skinMaterial} castShadow>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>
        <group ref={(el) => { if (el) skeletonRef.current.rightForearm = el; }} position={[0, -0.32, 0]}>
          <mesh position={[0, -0.12, 0]} material={skinMaterial} castShadow>
            <capsuleGeometry args={[0.035, 0.18, 8, 16]} />
          </mesh>
          <mesh position={[0, -0.24, 0]} material={skinMaterial} castShadow>
            <sphereGeometry args={[0.028, 8, 8]} />
          </mesh>
          <mesh ref={(el) => { if (el) skeletonRef.current.rightHand = el; }} position={[0, -0.32, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.06, 0.08, 0.025]} />
          </mesh>
          <group position={[0, -0.37, 0]}>
            {[0.018, 0.006, -0.006, -0.018].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]} material={skinMaterial}>
                <capsuleGeometry args={[0.006, 0.025, 4, 8]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

// Female variant with different proportions
export function UltimateFemaleCharacter({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animation = "idle",
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animation?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const skinMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f5d6c6"),
      roughness: 0.5,
      metalness: 0.0,
      clearcoat: 0.15,
      sheen: 0.4,
      sheenColor: new THREE.Color("#ffe4d9"),
    });
  }, []);

  const dressMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#6b2d5c"),
      roughness: 0.6,
      metalness: 0.0,
      sheen: 0.3,
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const breathe = Math.sin(state.clock.elapsedTime * 1.8) * 0.002;
    groupRef.current.position.y = position[1] + breathe;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Simplified but still anatomically correct female character */}
      <mesh position={[0, 1.0, 0]} castShadow material={dressMaterial}>
        <capsuleGeometry args={[0.22, 0.6, 12, 24]} />
      </mesh>

      <group position={[0, 2.0, 0]}>
        <mesh castShadow material={skinMaterial}>
          <sphereGeometry args={[0.12, 24, 24]} />
        </mesh>
        
        <group position={[0, -0.01, 0.08]}>
          <group position={[0, 0.02, 0.08]}>
            <mesh position={[-0.035, 0, 0]} material={new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.1 })}>
              <sphereGeometry args={[0.018, 16, 16]} />
            </mesh>
            <mesh position={[-0.035, 0, 0.012]} material={new THREE.MeshStandardMaterial({ color: "#3498db" })}>
              <sphereGeometry args={[0.011, 12, 12]} />
            </mesh>
            <mesh position={[0.035, 0, 0]} material={new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.1 })}>
              <sphereGeometry args={[0.018, 16, 16]} />
            </mesh>
            <mesh position={[0.035, 0, 0.012]} material={new THREE.MeshStandardMaterial({ color: "#3498db" })}>
              <sphereGeometry args={[0.011, 12, 12]} />
            </mesh>
          </group>
          
          <mesh position={[0, -0.035, 0.08]} material={new THREE.MeshPhysicalMaterial({ color: "#c17f6e" })}>
            <boxGeometry args={[0.04, 0.01, 0.01]} />
          </mesh>
        </group>

        <mesh position={[0, 0.05, -0.02]} material={new THREE.MeshStandardMaterial({ color: "#2c1810", roughness: 0.95 })}>
          <sphereGeometry args={[0.135, 20, 20]} />
        </mesh>
        <mesh position={[0, -0.15, 0]} material={new THREE.MeshStandardMaterial({ color: "#2c1810", roughness: 0.95 })}>
          <capsuleGeometry args={[0.12, 0.4, 8, 16]} />
        </mesh>
      </group>

      <group position={[-0.22, 1.6, 0]}>
        <mesh position={[0, -0.12, 0]} material={dressMaterial} castShadow>
          <capsuleGeometry args={[0.035, 0.2, 8, 16]} />
        </mesh>
        <mesh position={[0, -0.28, 0]} material={skinMaterial} castShadow>
          <capsuleGeometry args={[0.03, 0.16, 8, 16]} />
        </mesh>
      </group>
      <group position={[0.22, 1.6, 0]}>
        <mesh position={[0, -0.12, 0]} material={dressMaterial} castShadow>
          <capsuleGeometry args={[0.035, 0.2, 8, 16]} />
        </mesh>
        <mesh position={[0, -0.28, 0]} material={skinMaterial} castShadow>
          <capsuleGeometry args={[0.03, 0.16, 8, 16]} />
        </mesh>
      </group>

      <group position={[-0.09, 0.55, 0]}>
        <mesh position={[0, -0.18, 0]} material={skinMaterial} castShadow>
          <capsuleGeometry args={[0.06, 0.28, 8, 16]} />
        </mesh>
        <mesh position={[0, -0.45, 0.04]} material={new THREE.MeshStandardMaterial({ color: "#1a1a1a" })} castShadow>
          <boxGeometry args={[0.08, 0.04, 0.18]} />
        </mesh>
      </group>
      <group position={[0.09, 0.55, 0]}>
        <mesh position={[0, -0.18, 0]} material={skinMaterial} castShadow>
          <capsuleGeometry args={[0.06, 0.28, 8, 16]} />
        </mesh>
        <mesh position={[0, -0.45, 0.04]} material={new THREE.MeshStandardMaterial({ color: "#1a1a1a" })} castShadow>
          <boxGeometry args={[0.08, 0.04, 0.18]} />
        </mesh>
      </group>
    </group>
  );
}

export default UltimateMaleCharacter;
