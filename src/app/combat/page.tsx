"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { Sky, ContactShadows } from "@react-three/drei";
import { UltimateMaleCharacter } from "@/components/UltimateCharacter";
import { UltimateFemaleCharacter } from "@/components/UltimateCharacter";
import * as THREE from "three";

function Enemy({ position, id, damage }: { position: [number, number, number]; id: string; damage: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const [health, setHealth] = useState(100);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHealth((h) => Math.max(0, h - damage));
    }, 1000);
    return () => clearInterval(interval);
  }, [damage]);
  
  const healthPercent = health / 100;
  
  return (
    <group>
      <mesh ref={ref} position={position} castShadow>
        <boxGeometry args={[1.2, 2.5, 1.2]} />
        <meshStandardMaterial color={health < 30 ? "#ff0000" : "#8b0000"} />
      </mesh>
      
      <mesh position={[position[0], position[1] + 3, position[2]]}>
        <planeGeometry args={[1.5, 0.2]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      <mesh position={[position[0] - (1 - healthPercent) * 0.75, position[1] + 3, position[2]]}>
        <planeGeometry args={[healthPercent * 1.5, 0.15]} />
        <meshBasicMaterial color={healthPercent > 0.5 ? "#00ff00" : healthPercent > 0.25 ? "#ffff00" : "#ff0000"} />
      </mesh>
    </group>
  );
}

export default function CombatGame() {
  const [playerPos, setPlayerPos] = useState([0, 0, 0]);
  const [enemies, setEnemies] = useState([
    { id: "1", x: 5, y: 1.25, z: 5, damage: 10 },
    { id: "2", x: -5, y: 1.25, z: -5, damage: 15 },
    { id: "3", x: 8, y: 1.25, z: 0, damage: 20 },
  ]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [score, setScore] = useState(0);
  const playerRef = useRef<THREE.Group>(null);
  const velocity = useRef({ x: 0, z: 0 });
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w": velocity.current.z = -0.2; break;
        case "s": velocity.current.z = 0.2; break;
        case "a": velocity.current.x = -0.2; break;
        case "d": velocity.current.x = 0.2; break;
        case " ": velocity.current.y = 0.25; break;
        case "f": setPlayerHealth((h) => Math.max(0, h - 10)); break;
        case "g": setScore((s) => s + 100); break;
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
  }, []);
  
  useFrame((state) => {
    if (playerRef.current) {
      playerRef.current.position.x += velocity.current.x;
      playerRef.current.position.z += velocity.current.z;
      
      if (velocity.current.y > 0) {
        velocity.current.y -= 0.02;
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
      <Canvas shadows camera={{ position: [0, 8, 12], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[100, 100, 50]} intensity={1} castShadow />
          <Sky sunPosition={[100, 20, 100]} />
          <color attach="background" args={["#87CEEB"]} />
          <fog attach="fog" args={["#87CEEB", 30, 150]} />
          
          <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[300, 300]} />
              <meshStandardMaterial color="#2d5016" roughness={1} />
            </mesh>
            
            <group ref={playerRef} position={[0, 0, 0]}>
              <UltimateMaleCharacter position={[0, 0, 0]} scale={1} />
            </group>
            
            {enemies.map((e) => (
              <Enemy key={e.id} id={e.id} position={[e.x, e.y, e.z]} damage={e.damage} />
            ))}
          </group>
          
          <ContactShadows opacity={0.5} scale={100} blur={3} far={20} />
        </Suspense>
      </Canvas>
      
      {/* HUD */}
      <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded border border-red-500">
        <h2 className="font-bold text-xl mb-2">⚔️ COMBAT ARENA</h2>
        <div className="mb-2">
          <div className="text-sm text-gray-400">Player Health</div>
          <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-600 to-green-500 transition-all" style={{ width: `${playerHealth}%` }} />
          </div>
          <div className="text-right mt-1 text-sm">{playerHealth}/100</div>
        </div>
        <div className="flex gap-4 text-lg">
          <div className="text-yellow-400">💰 Score: {score}</div>
          <div className="text-blue-400">Enemies: {enemies.length}</div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded">
        <div className="font-bold mb-2">Controls</div>
        <div className="text-sm grid grid-cols-2 gap-x-6 gap-y-1">
          <div>WASD - Move</div>
          <div>Space - Jump</div>
          <div>F - Take Damage</div>
          <div>G - Add Score</div>
          <div>1-3 - Attack Enemy</div>
        </div>
      </div>
      
      {/* Enemy Dmg */}
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded">
        <h3 className="font-bold mb-2 text-red-400">Enemy Attacks</h3>
        <div className="text-sm">Each enemy deals damage over time</div>
      </div>
      
      {/* Action Buttons */}
      <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded">
        <div className="flex flex-col gap-2">
          {enemies.map((e, i) => (
            <button
              key={e.id}
              onClick={() => setScore((s) => s + 50)}
              className="px-3 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              Attack Enemy {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
