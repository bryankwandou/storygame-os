"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// World chunk system for infinite procedural world
const CHUNK_SIZE = 100;
const RENDER_DISTANCE = 3;
const WORLD_SEED = 12345;

// Simplex noise for terrain generation
function noise2D(x: number, z: number, seed: number): number {
  const X = Math.floor(x) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  z -= Math.floor(z);
  const u = fade(x);
  const v = fade(z);
  const A = (seed + X) % 256;
  const B = (seed + X + 1) % 256;
  return lerp(v, 
    lerp(u, grad(seed, X, Z), grad(seed, B, Z)), 
    lerp(u, grad(seed, X, Z + 1), grad(seed, B, Z + 1))
  );
}

function fade(t: number): number { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(t: number, a: number, b: number): number { return a + t * (b - a); }
function grad(hash: number, x: number, z: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : z;
  const v = h < 4 ? z : h === 12 || h === 14 ? x : 0;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

// Generate terrain height
function getTerrainHeight(x: number, z: number): number {
  const scale = 0.01;
  const height = noise2D(x * scale, z * scale, WORLD_SEED) * 20;
  const detail = noise2D(x * scale * 5, z * scale * 5, WORLD_SEED + 100) * 5;
  return height + detail;
}

// Biome system
type Biome = "forest" | "desert" | "snow" | "plains" | "mountains" | "swamp";

function getBiome(x: number, z: number): Biome {
  const temperature = noise2D(x * 0.005, z * 0.005, WORLD_SEED + 1000);
  const moisture = noise2D(x * 0.005, z * 0.005, WORLD_SEED + 2000);
  
  if (temperature > 0.5) {
    return moisture > 0 ? "desert" : "plains";
  } else if (temperature < -0.5) {
    return "snow";
  } else {
    if (moisture > 0.3) return "swamp";
    if (moisture < -0.3) return "mountains";
    return "forest";
  }
}

// Generate world chunk
export function WorldChunk({ chunkX, chunkZ }: { chunkX: number; chunkZ: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, 50, 50);
    const positions = geo.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i] + chunkX * CHUNK_SIZE;
      const z = positions[i + 1] + chunkZ * CHUNK_SIZE;
      positions[i + 2] = getTerrainHeight(x, z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [chunkX, chunkZ]);

  const material = useMemo(() => {
    const biome = getBiome(chunkX * CHUNK_SIZE, chunkZ * CHUNK_SIZE);
    let color = "#2d5016"; // forest default
    
    switch (biome) {
      case "desert": color = "#c2b280"; break;
      case "snow": color = "#ffffff"; break;
      case "plains": color = "#7cba3d"; break;
      case "mountains": color = "#6b6b6b"; break;
      case "swamp": color = "#4a5d23"; break;
    }
    
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.9,
      metalness: 0,
      flatShading: false,
    });
  }, [chunkX, chunkZ]);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[chunkX * CHUNK_SIZE, 0, chunkZ * CHUNK_SIZE]}
      material={material}
      receiveShadow
    />
  );
}

// Generate trees, rocks, buildings
export function WorldObjects({ chunkX, chunkZ }: { chunkX: number; chunkZ: number }) {
  const objects = useMemo(() => {
    const objs = [];
    const biome = getBiome(chunkX * CHUNK_SIZE, chunkZ * CHUNK_SIZE);
    
    // Trees
    const treeCount = biome === "forest" ? 30 : biome === "plains" ? 10 : biome === "swamp" ? 20 : 0;
    for (let i = 0; i < treeCount; i++) {
      const x = (Math.random() - 0.5) * CHUNK_SIZE + chunkX * CHUNK_SIZE;
      const z = (Math.random() - 0.5) * CHUNK_SIZE + chunkZ * CHUNK_SIZE;
      const y = getTerrainHeight(x, z);
      const height = 5 + Math.random() * 10;
      const scale = 0.8 + Math.random() * 0.5;
      
      objs.push({ type: "tree", x, y, z, height, scale, biome });
    }
    
    // Rocks
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * CHUNK_SIZE + chunkX * CHUNK_SIZE;
      const z = (Math.random() - 0.5) * CHUNK_SIZE + chunkZ * CHUNK_SIZE;
      const y = getTerrainHeight(x, z);
      
      objs.push({ type: "rock", x, y, z });
    }
    
    // Buildings (rare)
    if (Math.random() > 0.8) {
      const x = (Math.random() - 0.5) * CHUNK_SIZE * 0.5 + chunkX * CHUNK_SIZE;
      const z = (Math.random() - 0.5) * CHUNK_SIZE * 0.5 + chunkZ * CHUNK_SIZE;
      const y = getTerrainHeight(x, z);
      
      objs.push({ type: "building", x, y, z });
    }
    
    return objs;
  }, [chunkX, chunkZ]);

  return (
    <group>
      {objects.map((obj, i) => {
        if (obj.type === "tree") {
          const treeColor = obj.biome === "snow" ? "#1a3d1a" : obj.biome === "desert" ? "#8b7355" : "#2d5a2d";
          return (
            <group key={i} position={[obj.x, obj.y, obj.z]} scale={obj.scale}>
              <mesh position={[0, obj.height! / 2, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.5, obj.height! * 0.3, 8]} />
                <meshStandardMaterial color="#4a3728" roughness={0.9} />
              </mesh>
              <mesh position={[0, obj.height! * 0.6, 0]} castShadow>
                <coneGeometry args={[obj.height! * 0.4, obj.height! * 0.7, 8]} />
                <meshStandardMaterial color={treeColor} roughness={0.8} />
              </mesh>
            </group>
          );
        }
        
        if (obj.type === "rock") {
          return (
            <mesh key={i} position={[obj.x, obj.y + 0.5, obj.z]} castShadow>
              <dodecahedronGeometry args={[1 + Math.random(), 0]} />
              <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
            </mesh>
          );
        }
        
        if (obj.type === "building") {
          return (
            <group key={i} position={[obj.x, obj.y, obj.z]}>
              <mesh position={[0, 5, 0]} castShadow receiveShadow>
                <boxGeometry args={[10, 10, 10]} />
                <meshStandardMaterial color="#8b7355" roughness={0.7} />
              </mesh>
              <mesh position={[0, 10.5, 0]} castShadow>
                <coneGeometry args={[7, 3, 4]} />
                <meshStandardMaterial color="#5a3d2b" roughness={0.8} />
              </mesh>
            </group>
          );
        }
        
        return null;
      })}
    </group>
  );
}

// Infinite world manager
export function InfiniteWorld({ playerPosition }: { playerPosition: [number, number, number] }) {
  const [chunks, setChunks] = useState<{ x: number; z: number }[]>([]);

  useEffect(() => {
    const playerChunkX = Math.floor(playerPosition[0] / CHUNK_SIZE);
    const playerChunkZ = Math.floor(playerPosition[2] / CHUNK_SIZE);
    
    const newChunks = [];
    for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
      for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {
        newChunks.push({ x: playerChunkX + x, z: playerChunkZ + z });
      }
    }
    
    setChunks(newChunks);
  }, [playerPosition]);

  return (
    <group>
      {chunks.map((chunk, i) => (
        <group key={`${chunk.x}-${chunk.z}`}>
          <WorldChunk chunkX={chunk.x} chunkZ={chunk.z} />
          <WorldObjects chunkX={chunk.x} chunkZ={chunk.z} />
        </group>
      ))}
    </group>
  );
}

// NPC Generator
export function generateNPCs(count: number, worldSize: number) {
  const npcs = [];
  
  for (let i = 0; i < count; i++) {
    npcs.push({
      id: `npc-${i}`,
      x: (Math.random() - 0.5) * worldSize,
      z: (Math.random() - 0.5) * worldSize,
      type: ["villager", "merchant", "guard", "bandit", "traveler"][Math.floor(Math.random() * 5)],
      name: `NPC ${i}`,
      dialogue: [
        "Hello, traveler!",
        "The weather is nice today.",
        "Have you seen the ancient ruins?",
        "Beware of bandits in the forest.",
      ][Math.floor(Math.random() * 4)],
    });
  }
  
  return npcs;
}

// Enemy Generator
export function generateEnemies(count: number, worldSize: number) {
  const enemies = [];
  
  for (let i = 0; i < count; i++) {
    enemies.push({
      id: `enemy-${i}`,
      x: (Math.random() - 0.5) * worldSize,
      z: (Math.random() - 0.5) * worldSize,
      type: ["bandit", "wolf", "goblin", "skeleton"][Math.floor(Math.random() * 4)],
      level: Math.floor(Math.random() * 10) + 1,
      health: 100,
      damage: 10 + Math.floor(Math.random() * 20),
    });
  }
  
  return enemies;
}

// Animal Generator
export function generateAnimals(count: number, worldSize: number) {
  const animals = [];
  
  for (let i = 0; i < count; i++) {
    animals.push({
      id: `animal-${i}`,
      x: (Math.random() - 0.5) * worldSize,
      z: (Math.random() - 0.5) * worldSize,
      type: ["horse", "deer", "rabbit", "bear", "boar"][Math.floor(Math.random() * 5)],
      mountable: Math.random() > 0.7,
    });
  }
  
  return animals;
}

export default InfiniteWorld;
