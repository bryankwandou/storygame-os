"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOpenWorldStore } from "@/store/openWorldStore";

export function CombatSystem() {
  const { enemies, playerPosition } = useOpenWorldStore();
  
  useFrame(() => {
    enemies.forEach((enemy: any) => {
      const dx = playerPosition[0] - enemy.x;
      const dz = playerPosition[2] - enemy.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < 20 && distance > 2) {
        enemy.x += (dx / distance) * 0.05;
        enemy.z += (dz / distance) * 0.05;
      }
    });
  });
  
  return null;
}

export function Enemy({ enemy }: { enemy: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = enemy.x;
      meshRef.current.position.z = enemy.z;
      meshRef.current.position.y = 1 + Math.sin(Date.now() * 0.005) * 0.2;
    }
  });
  
  const healthPercent = enemy.health / enemy.maxHealth;
  
  return (
    <group>
      <mesh ref={meshRef} position={[enemy.x, 1, enemy.z]} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      
      <mesh position={[enemy.x, 2.8, enemy.z]}>
        <planeGeometry args={[1.2, 0.15]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      <mesh position={[enemy.x - (1 - healthPercent) * 0.5, 2.8, enemy.z]}>
        <planeGeometry args={[healthPercent, 0.1]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  );
}

export function usePlayerCombat() {
  const { equippedWeapon } = useOpenWorldStore();
  
  const attack = (targetEnemyId: string) => {
    const damage = equippedWeapon ? 15 : 10;
    return damage;
  };
  
  const heavyAttack = (targetEnemyId: string) => {
    const damage = equippedWeapon ? 30 : 20;
    return damage;
  };
  
  return { attack, heavyAttack };
}
