"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Realistic human character component using procedural generation
export function RealisticCharacter({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  animation = "idle",
  scale = 1,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  animation?: string;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // Realistic skin material with subsurface scattering approximation
  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#e8beac"),
      roughness: 0.6,
      metalness: 0.0,
      emissive: new THREE.Color("#1a0f0a"),
      emissiveIntensity: 0.05,
    });
  }, []);

  // Clothing material
  const clothingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2c3e50"),
      roughness: 0.7,
      metalness: 0.1,
    });
  }, []);

  // Animation mixer
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Idle breathing animation
    if (animation === "idle") {
      const breathe = Math.sin(time * 2) * 0.01;
      groupRef.current.position.y = position[1] + breathe;
      
      // Subtle head movement
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
        headRef.current.rotation.x = Math.sin(time * 0.3) * 0.02;
      }
    }
    
    // Walking animation
    if (animation === "walking") {
      const walkCycle = Math.sin(time * 8);
      
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = walkCycle * 0.5;
        rightLegRef.current.rotation.x = -walkCycle * 0.5;
      }
      
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -walkCycle * 0.3;
        rightArmRef.current.rotation.x = walkCycle * 0.3;
      }
      
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(time * 8)) * 0.05;
    }
    
    // Talking animation
    if (animation === "talking") {
      if (headRef.current) {
        headRef.current.rotation.z = Math.sin(time * 3) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Body/Torso */}
      <mesh ref={bodyRef} position={[0, 1.2, 0]} castShadow receiveShadow material={clothingMaterial}>
        <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
      </mesh>
      
      {/* Head */}
      <group position={[0, 2.1, 0]}>
        <mesh ref={headRef} castShadow receiveShadow material={skinMaterial}>
          <sphereGeometry args={[0.2, 32, 32]} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.07, 0.03, 0.17]} material={new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.1 })}>
          <sphereGeometry args={[0.035, 16, 16]} />
        </mesh>
        <mesh position={[-0.07, 0.03, 0.17]} material={new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.1 })}>
          <sphereGeometry args={[0.035, 16, 16]} />
        </mesh>
        
        {/* Irises */}
        <mesh position={[0.07, 0.03, 0.195]} material={new THREE.MeshStandardMaterial({ color: "#4a3728" })}>
          <sphereGeometry args={[0.02, 12, 12]} />
        </mesh>
        <mesh position={[-0.07, 0.03, 0.195]} material={new THREE.MeshStandardMaterial({ color: "#4a3728" })}>
          <sphereGeometry args={[0.02, 12, 12]} />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[0.07, 0.03, 0.205]} material={new THREE.MeshStandardMaterial({ color: "#000000" })}>
          <sphereGeometry args={[0.01, 8, 8]} />
        </mesh>
        <mesh position={[-0.07, 0.03, 0.205]} material={new THREE.MeshStandardMaterial({ color: "#000000" })}>
          <sphereGeometry args={[0.01, 8, 8]} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, -0.02, 0.18]} material={skinMaterial}>
          <sphereGeometry args={[0.03, 8, 8]} />
        </mesh>
        
        {/* Mouth */}
        <mesh position={[0, -0.08, 0.16]} material={new THREE.MeshStandardMaterial({ color: "#c17f6e" })}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[0.2, 0.03, 0]} rotation={[0, 0, Math.PI / 6]} material={skinMaterial}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>
        <mesh position={[-0.2, 0.03, 0]} rotation={[0, 0, -Math.PI / 6]} material={skinMaterial}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.08, -0.02]} material={new THREE.MeshStandardMaterial({ color: "#2c1810", roughness: 0.9 })}>
          <sphereGeometry args={[0.22, 16, 16]} />
        </mesh>
      </group>
      
      {/* Neck */}
      <mesh position={[0, 1.85, 0]} material={skinMaterial} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 8]} />
      </mesh>
      
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.35, 1.4, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.2, 0]} material={clothingMaterial} castShadow>
          <capsuleGeometry args={[0.07, 0.3, 4, 8]} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, -0.55, 0]} material={skinMaterial} castShadow>
          <capsuleGeometry args={[0.055, 0.25, 4, 8]} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.8, 0]} material={skinMaterial} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.35, 1.4, 0]}>
        <mesh position={[0, -0.2, 0]} material={clothingMaterial} castShadow>
          <capsuleGeometry args={[0.07, 0.3, 4, 8]} />
        </mesh>
        <mesh position={[0, -0.55, 0]} material={skinMaterial} castShadow>
          <capsuleGeometry args={[0.055, 0.25, 4, 8]} />
        </mesh>
        <mesh position={[0, -0.8, 0]} material={skinMaterial} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
        </mesh>
      </group>
      
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.12, 0.6, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.3, 0]} material={clothingMaterial} castShadow>
          <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.8, 0]} material={clothingMaterial} castShadow>
          <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -1.05, 0.05]} material={new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.8 })} castShadow>
          <boxGeometry args={[0.1, 0.05, 0.2]} />
        </mesh>
      </group>
      
      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.12, 0.6, 0]}>
        <mesh position={[0, -0.3, 0]} material={clothingMaterial} castShadow>
          <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
        </mesh>
        <mesh position={[0, -0.8, 0]} material={clothingMaterial} castShadow>
          <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        </mesh>
        <mesh position={[0, -1.05, 0.05]} material={new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.8 })} castShadow>
          <boxGeometry args={[0.1, 0.05, 0.2]} />
        </mesh>
      </group>
    </group>
  );
}

// Female character variant
export function FemaleCharacter({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  animation = "idle",
  scale = 1,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  animation?: string;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#f5d6c6"),
      roughness: 0.5,
      metalness: 0.0,
    });
  }, []);
  
  const clothingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#8e44ad"),
      roughness: 0.6,
      metalness: 0.05,
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    if (animation === "idle") {
      const breathe = Math.sin(time * 2.5) * 0.008;
      groupRef.current.position.y = position[1] + breathe;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Body */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow material={clothingMaterial}>
        <capsuleGeometry args={[0.22, 0.7, 8, 16]} />
      </mesh>
      
      {/* Head */}
      <group position={[0, 2.0, 0]}>
        <mesh castShadow receiveShadow material={skinMaterial}>
          <sphereGeometry args={[0.18, 32, 32]} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.06, 0.03, 0.15]} material={new THREE.MeshStandardMaterial({ color: "#ffffff" })}>
          <sphereGeometry args={[0.03, 16, 16]} />
        </mesh>
        <mesh position={[-0.06, 0.03, 0.15]} material={new THREE.MeshStandardMaterial({ color: "#ffffff" })}>
          <sphereGeometry args={[0.03, 16, 16]} />
        </mesh>
        
        {/* Irises */}
        <mesh position={[0.06, 0.03, 0.17]} material={new THREE.MeshStandardMaterial({ color: "#3498db" })}>
          <sphereGeometry args={[0.018, 12, 12]} />
        </mesh>
        <mesh position={[-0.06, 0.03, 0.17]} material={new THREE.MeshStandardMaterial({ color: "#3498db" })}>
          <sphereGeometry args={[0.018, 12, 12]} />
        </mesh>
        
        {/* Long hair */}
        <mesh position={[0, 0, -0.05]} material={new THREE.MeshStandardMaterial({ color: "#4a2c2a", roughness: 0.95 })}>
          <sphereGeometry args={[0.22, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.15, -0.1]} material={new THREE.MeshStandardMaterial({ color: "#4a2c2a", roughness: 0.95 })}>
          <capsuleGeometry args={[0.15, 0.5, 8, 16]} />
        </mesh>
      </group>
      
      {/* Arms */}
      <group position={[-0.32, 1.35, 0]}>
        <mesh position={[0, -0.2, 0]} material={clothingMaterial} castShadow>
          <capsuleGeometry args={[0.06, 0.28, 4, 8]} />
        </mesh>
        <mesh position={[0, -0.55, 0]} material={skinMaterial} castShadow>
          <capsuleGeometry args={[0.045, 0.22, 4, 8]} />
        </mesh>
      </group>
      <group position={[0.32, 1.35, 0]}>
        <mesh position={[0, -0.2, 0]} material={clothingMaterial} castShadow>
          <capsuleGeometry args={[0.06, 0.28, 4, 8]} />
        </mesh>
        <mesh position={[0, -0.55, 0]} material={skinMaterial} castShadow>
          <capsuleGeometry args={[0.045, 0.22, 4, 8]} />
        </mesh>
      </group>
      
      {/* Legs */}
      <group position={[-0.1, 0.55, 0]}>
        <mesh position={[0, -0.3, 0]} material={clothingMaterial} castShadow>
          <capsuleGeometry args={[0.08, 0.38, 4, 8]} />
        </mesh>
        <mesh position={[0, -0.75, 0]} material={skinMaterial} castShadow>
          <capsuleGeometry args={[0.065, 0.3, 4, 8]} />
        </mesh>
      </group>
      <group position={[0.1, 0.55, 0]}>
        <mesh position={[0, -0.3, 0]} material={clothingMaterial} castShadow>
          <capsuleGeometry args={[0.08, 0.38, 4, 8]} />
        </mesh>
        <mesh position={[0, -0.75, 0]} material={skinMaterial} castShadow>
          <capsuleGeometry args={[0.065, 0.3, 4, 8]} />
        </mesh>
      </group>
    </group>
  );
}

export default RealisticCharacter;
