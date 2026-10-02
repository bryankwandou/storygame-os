"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { InfiniteWorld } from "@/components/OpenWorld";
import { UltimateMaleCharacter } from "@/components/UltimateCharacter";
import { GameHUD, InventoryUI, QuestsUI, BuildingMenu } from "@/components/OpenWorldUI";
import { useOpenWorldStore } from "@/store/openWorldStore";
import * as THREE from "three";

function Player() {
  const { playerPosition, setPlayerPosition, currentMount } = useOpenWorldStore();
  const playerRef = useRef<THREE.Group>(null);
  const velocity = useRef<[number, number, number]>([0, 0, 0]);
  const speed = currentMount ? 0.3 : 0.15;
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          velocity.current[2] = -speed;
          break;
        case "s":
          velocity.current[2] = speed;
          break;
        case "a":
          velocity.current[0] = -speed;
          break;
        case "d":
          velocity.current[0] = speed;
          break;
        case " ":
          // Jump or interact
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "s":
          velocity.current[2] = 0;
          break;
        case "a":
        case "d":
          velocity.current[0] = 0;
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [speed]);
  
  useFrame(() => {
    if (playerRef.current) {
      playerRef.current.position.x += velocity.current[0];
      playerRef.current.position.z += velocity.current[2];
      
      // Update player position in store
      setPlayerPosition([
        playerRef.current.position.x,
        playerRef.current.position.y,
        playerRef.current.position.z,
      ]);
      
      // Rotate player to face movement direction
      if (velocity.current[0] !== 0 || velocity.current[2] !== 0) {
        const angle = Math.atan2(velocity.current[0], velocity.current[2]);
        playerRef.current.rotation.y = angle;
      }
    }
  });
  
  return (
    <group ref={playerRef} position={playerPosition}>
      <UltimateMaleCharacter position={[0, 0, 0]} scale={1} />
      {currentMount && (
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[1.5, 1, 2]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      )}
    </group>
  );
}

function CameraFollow() {
  const { playerPosition } = useOpenWorldStore();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame(() => {
    if (cameraRef.current) {
      // Smoothly follow player
      const targetX = playerPosition[0];
      const targetZ = playerPosition[2] + 15;
      const targetY = playerPosition[1] + 10;
      
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.05;
      
      cameraRef.current.lookAt(playerPosition[0], playerPosition[1], playerPosition[2]);
    }
  });
  
  return (
    <>
      <perspectiveCamera ref={cameraRef} position={[0, 10, 15]} fov={60} />
    </>
  );
}

export default function OpenWorldGame() {
  const { playerPosition } = useOpenWorldStore();
  const [showInventory, setShowInventory] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "i" || e.key === "I") setShowInventory(!showInventory);
      if (e.key === "q" || e.key === "Q") setShowQuests(!showQuests);
      if (e.key === "b" || e.key === "B") setShowBuildMenu(!showBuildMenu);
    };
    
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [showInventory, showQuests, showBuildMenu]);
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🌍</div>
          <div className="text-3xl font-bold mb-4">Generating Open World...</div>
          <div className="text-xl text-gray-400">Press WASD to move • I for Inventory • Q for Quests • B for Building</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas shadows className="bg-gray-900">
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
          <color attach="background" args={["#87CEEB"]} />
          <fog attach="fog" args={["#87CEEB", 50, 200]} />
          
          {/* Infinite World */}
          <InfiniteWorld playerPosition={playerPosition} />
          
          {/* Player */}
          <Player />
          
          {/* Camera */}
          <CameraFollow />
        </Suspense>
      </Canvas>
      
      {/* UI */}
      <GameHUD />
      <InventoryUI isOpen={showInventory} onClose={() => setShowInventory(false)} />
      <QuestsUI isOpen={showQuests} onClose={() => setShowQuests(false)} />
      <BuildingMenu isOpen={showBuildMenu} onClose={() => setShowBuildMenu(false)} />
      
      {/* Controls Help */}
      <div className="fixed bottom-4 left-4 bg-black/70 backdrop-blur-md rounded-lg p-4 text-white text-sm">
        <div className="font-bold mb-2">Controls</div>
        <div>WASD - Move</div>
        <div>I - Inventory</div>
        <div>Q - Quests</div>
        <div>B - Build Menu</div>
      </div>
      
      {/* Mini Map */}
      <div className="fixed top-20 right-4 w-48 h-48 bg-black/70 backdrop-blur-md rounded-lg overflow-hidden">
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-green-900 opacity-50" />
          <div
            className="absolute w-2 h-2 bg-blue-500 rounded-full"
            style={{
              left: `${50}%`,
              top: `${50}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
          <div className="absolute top-2 left-2 text-white text-xs font-bold">
            Mini Map
          </div>
        </div>
      </div>
    </div>
  );
}
