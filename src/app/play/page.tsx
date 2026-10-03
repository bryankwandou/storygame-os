"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { Sky, Stars, ContactShadows } from "@react-three/drei";
import { UltimateMaleCharacter } from "@/components/UltimateCharacter";
import * as THREE from "three";

// Simple enemy
function SimpleEnemy({ position, id }: { position: [number, number, number]; id: string }) {
  const ref = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={ref} position={position} castShadow>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#ff0000" />
    </mesh>
  );
}

export default function PlayGame() {
  const [playerPos, setPlayerPos] = useState([0, 0, 0]);
  const [enemies, setEnemies] = useState([
    { id: "1", x: 5, y: 1, z: 5 },
    { id: "2", x: -5, y: 1, z: -5 },
  ]);
  const playerRef = useRef<THREE.Group>(null);
  const velocity = useRef({ x: 0, z: 0 });
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w": velocity.current.z = -0.15; break;
        case "s": velocity.current.z = 0.15; break;
        case "a": velocity.current.x = -0.15; break;
        case "d": velocity.current.x = 0.15; break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w": case "s": velocity.current.z = 0; break;
        case "a": case "d": velocity.current.x = 0; break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.x += velocity.current.x;
      playerRef.current.position.z += velocity.current.z;
      
      if (velocity.current.x !== 0 || velocity.current.z !== 0) {
        const angle = Math.atan2(velocity.current.x, velocity.current.z);
        playerRef.current.rotation.y = angle;
      }
      
      setPlayerPos([
        playerRef.current.position.x,
        playerRef.current.position.y,
        playerRef.current.position.z,
      ]);
    }
  });
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Canvas shadows camera={{ position: [0, 10, 15], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[100, 100, 50]} intensity={1} castShadow />
          <Sky sunPosition={[100, 20, 100]} />
          <color attach="background" args={["#87CEEB"]} />
          <fog attach="fog" args={["#87CEEB", 50, 200]} />
          
          <group>
            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[200, 200]} />
              <meshStandardMaterial color="#2d5016" roughness={1} />
            </mesh>
            
            {/* Player */}
            <group ref={playerRef} position={[0, 0, 0]}>
              <UltimateMaleCharacter position={[0, 0, 0]} scale={1} />
            </group>
            
            {/* Enemies */}
            {enemies.map((e) => (
              <SimpleEnemy key={e.id} id={e.id} position={[e.x, e.y, e.z]} />
            ))}
          </group>
          
          <ContactShadows opacity={0.5} scale={50} blur={2} far={10} />
        </Suspense>
      </Canvas>
      
      {/* HUD */}
      <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded">
        <h2 className="font-bold text-xl mb-2">⚔️ GAMEPLAY MODE</h2>
        <p>WASD = Move</p>
        <p>Press keys to move character</p>
        <p>Player: {Math.round(playerPos[0])}, {Math.round(playerPos[2])}</p>
      </div>
      
      <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded">
        <h3 className="font-bold">Enemies</h3>
        <p>Total: {enemies.length}</p>
        <p>Level: 1-3</p>
      </div>
      
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded">
        <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">
          Attack!
        </button>
      </div>
    </div>
  );
}
