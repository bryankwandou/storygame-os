"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";
import { Sky, ContactShadows } from "@react-three/drei";
import { UltimateMaleCharacter } from "@/components/UltimateCharacter";
import * as THREE from "three";

export default function BuildingGame() {
  const [playerPos, setPlayerPos] = useState([0, 0, 0]);
  const [buildings, setBuildings] = useState<{ id: string; x: number; y: number; z: number; type: string; color: string }[]>([]);
  const [selectedBlock, setSelectedBlock] = useState("wall");
  const playerRef = useRef<THREE.Group>(null);
  const velocity = useRef({ x: 0, z: 0 });
  
  const blockColors: Record<string, string> = {
    wall: "#8b7355",
    floor: "#deb887",
    door: "#6b4423",
    roof: "#a0522d",
    window: "#87ceeb",
    stairs: "#654321",
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w": velocity.current.z = -0.15; break;
        case "s": velocity.current.z = 0.15; break;
        case "a": velocity.current.x = -0.15; break;
        case "d": velocity.current.x = 0.15; break;
        case " ": velocity.current.y = 0.2; break;
        case "e": // Place building
          if (playerRef.current) {
            const { x, y, z } = playerRef.current.position;
            setBuildings((prev) => [
              ...prev,
              { 
                id: `b-${Date.now()}`, 
                x: Math.round(x), 
                y: 0, 
                z: Math.round(z), 
                type: selectedBlock,
                color: blockColors[selectedBlock]
              }
            ]);
          }
          break;
        case "r": // Remove last building
          setBuildings((prev) => prev.slice(0, -1));
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w": case "s": velocity.current.z = 0; break;
        case "a": case "d": velocity.current.x = 0; break;
        case " ": velocity.current.y = 0; break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedBlock]);
  
  useFrame((state) => {
    if (playerRef.current) {
      playerRef.current.position.x += velocity.current.x;
      playerRef.current.position.z += velocity.current.z;
      
      if (velocity.current.y > 0) {
        velocity.current.y -= 0.015;
        playerRef.current.position.y += velocity.current.y;
        if (playerRef.current.position.y <= 0) {
          playerRef.current.position.y = 0;
          velocity.current.y = 0;
        }
      }
      
      if (velocity.current.x !== 0 || velocity.current.z !== 0) {
        const angle = Math.atan2(velocity.current.x, velocity.current.z);
        playerRef.current.rotation.y = angle;
      }
      
      setPlayerPos([playerRef.current.position.x, playerRef.current.position.y, playerRef.current.position.z]);
    }
  });
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Canvas shadows camera={{ position: [0, 20, 20], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[100, 100, 50]} intensity={1} castShadow />
          <Sky sunPosition={[100, 20, 100]} />
          <color attach="background" args={["#87CEEB"]} />
          <fog attach="fog" args={["#87CEEB", 50, 200]} />
          
          <group>
            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[500, 500]} />
              <meshStandardMaterial color="#2d5016" roughness={1} />
            </mesh>
            
            {/* Player */}
            <group ref={playerRef} position={[0, 0, 0]}>
              <UltimateMaleCharacter position={[0, 0, 0]} scale={1} />
            </group>
            
            {/* Placed Buildings */}
            {buildings.map((b) => (
              <group key={b.id} position={[b.x, b.y, b.z]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[3, 3, 3]} />
                  <meshStandardMaterial color={b.color} roughness={0.8} />
                </mesh>
              </group>
            ))}
          </group>
          
          <ContactShadows opacity={0.5} scale={100} blur={3} far={20} />
        </Suspense>
      </Canvas>
      
      {/* HUD */}
      <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded">
        <h2 className="font-bold text-xl mb-2">🏗️ BUILD MODE</h2>
        <div className="mb-2 text-sm">Buildings: {buildings.length}</div>
      </div>
      
      {/* Controls */}
      <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded">
        <div className="font-bold mb-2">Controls</div>
        <div className="text-sm grid grid-cols-2 gap-x-6 gap-y-1">
          <div>WASD - Move</div>
          <div>Space - Jump</div>
          <div>E - Place Building</div>
          <div>R - Remove Last</div>
        </div>
      </div>
      
      {/* Block Selector */}
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded">
        <div className="font-bold mb-2 text-yellow-400">Select Block</div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(blockColors).map((block) => (
            <button
              key={block}
              onClick={() => setSelectedBlock(block)}
              className={`px-3 py-2 rounded text-sm ${selectedBlock === block ? "bg-green-600" : "bg-gray-600"}`}
            >
              {block.charAt(0).toUpperCase() + block.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Build Info */}
      <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded">
        <div className="font-bold mb-2">Place blocks around you</div>
        <div className="text-sm text-gray-300">
          Move near the ground and press E to place
        </div>
      </div>
    </div>
  );
}
