"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Combat system
export function CombatSystem() {
  const { enemies, attackEnemy, killEnemy, playerPosition } = useCombatStore();
  
  useFrame(() => {
    enemies.forEach((enemy) => {
      // Enemy AI - chase player
      const dx = playerPosition[0] - enemy.x;
      const dz = playerPosition[2] - enemy.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < 20 && distance > 2) {
        // Move towards player
        enemy.x += (dx / distance) * 0.05;
        enemy.z += (dz / distance) * 0.05;
      }
    });
  });
  
  return null;
}

// Enemy component
export function Enemy({ enemy }: { enemy: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = enemy.x;
      meshRef.current.position.z = enemy.z;
      
      // Floating animation
      meshRef.current.position.y = 1 + Math.sin(Date.now() * 0.005) * 0.2;
    }
  });
  
  return (
    <group>
      <mesh ref={meshRef} position={[enemy.x, 1, enemy.z]} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      
      {/* Health bar */}
      <mesh position={[enemy.x, 2.5, enemy.z]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  );
}

// Player combat abilities
export function usePlayerCombat() {
  const { attackEnemy, equippedWeapon } = useOpenWorldStore();
  
  const attack = (targetEnemyId: string) => {
    const damage = equippedWeapon ? 15 : 10; // Base damage
    attackEnemy(targetEnemyId, damage);
  };
  
  const heavyAttack = (targetEnemyId: string) => {
    const damage = equippedWeapon ? 30 : 20;
    attackEnemy(targetEnemyId, damage);
  };
  
  return { attack, heavyAttack };
}

// Combat store
export const useCombatStore = create((set, get) => ({
  enemies: [],
  combatMode: false,
  
  spawnEnemy: (x, z, type) => set((state) => ({
    enemies: [...state.enemies, {
      id: `enemy-${Date.now()}`,
      x,
      z,
      type,
      health: 100,
      maxHealth: 100,
      level: 1,
      damage: 10,
    }]
  })),
  
  removeEnemy: (id) => set((state) => ({
    enemies: state.enemies.filter(e => e.id !== id)
  })),
}));

export default CombatSystem;
