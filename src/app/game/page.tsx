"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Sky } from "@react-three/drei";
import { InfiniteWorld } from "@/components/OpenWorld";
import { PlayerController } from "@/components/PlayerController";
import { CombatSystem } from "@/components/CombatSystem";
import { GameplayHUD } from "@/components/GameplayUI";
import { useOpenWorldStore } from "@/store/openWorldStore";
import * as THREE from "three";

export default function OpenWorldGameplay() {
  const { playerPosition } = useOpenWorldStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4 animate-spin">⚔️</div>
          <div className="text-3xl font-bold">Loading World...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas shadows camera={{ position: [0, 10, 15], fov: 60 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[100, 100, 50]}
            intensity={1}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
          />
          
          {/* Sky */}
          <Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0.6} />
          <color attach="background" args={["#87CEEB"]} />
          <fog attach="fog" args={["#87CEEB", 50, 300]} />
          
          {/* Infinite World */}
          <InfiniteWorld playerPosition={playerPosition} />
          
          {/* Player */}
          <PlayerController />
          
          {/* Combat System */}
          <CombatSystem />
        </Suspense>
      </Canvas>
      
      {/* UI */}
      <GameplayHUD />
    </div>
  );
}
