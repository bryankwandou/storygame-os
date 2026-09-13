"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky, Cloud, useTexture, useEnvironment, Environment } from "@react-three/drei";
import * as THREE from "three";

// Realistic forest environment with PBR materials
export function RealisticForest({ timeOfDay = "dusk" }: { timeOfDay?: string }) {
  const groundRef = useRef<THREE.Mesh>(null);
  
  const lighting = useMemo(() => {
    switch (timeOfDay) {
      case "dawn":
        return { sunPosition: [10, 2, -10], intensity: 0.6, ambient: 0.4, skyColor: "#ff9966" };
      case "day":
        return { sunPosition: [10, 20, -10], intensity: 1.2, ambient: 0.8, skyColor: "#87CEEB" };
      case "dusk":
        return { sunPosition: [10, 3, 10], intensity: 0.7, ambient: 0.5, skyColor: "#ff6b35" };
      case "night":
        return { sunPosition: [10, -5, -10], intensity: 0.1, ambient: 0.2, skyColor: "#0a0a1a" };
      default:
        return { sunPosition: [10, 10, -10], intensity: 1.0, ambient: 0.6, skyColor: "#87CEEB" };
    }
  }, [timeOfDay]);

  const trees = useMemo(() => {
    const treeArray = [];
    for (let i = 0; i < 150; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      const scale = 0.8 + Math.random() * 0.7;
      const rotation = Math.random() * Math.PI * 2;
      const trunkHeight = 2.5 + Math.random() * 2;
      const foliageRadius = 1.5 + Math.random() * 1;
      treeArray.push({ x, z, scale, rotation, trunkHeight, foliageRadius });
    }
    return treeArray;
  }, []);

  return (
    <group>
      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={lighting.sunPosition as [number, number, number]}
        inclination={0.6}
        azimuth={0.25}
        rayleigh={timeOfDay === "night" ? 0 : 0.5}
      />
      
      {/* Clouds */}
      {timeOfDay !== "night" && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <Cloud
              key={i}
              position={[(Math.random() - 0.5) * 100, 20 + Math.random() * 10, (Math.random() - 0.5) * 100]}
              speed={0.2}
              opacity={0.5}
              segments={20}
            />
          ))}
        </group>
      )}
      
      {/* Fog */}
      <fog attach="fog" args={[timeOfDay === "night" ? "#0a0a1a" : "#b8c6db", 10, 100]} />
      
      {/* Lighting */}
      <ambientLight intensity={lighting.ambient} />
      <directionalLight
        position={lighting.sunPosition as [number, number, number]}
        intensity={lighting.intensity}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      {timeOfDay === "night" && (
        <pointLight position={[0, 3, 5]} intensity={0.5} color="#ffeedd" distance={20} />
      )}
      
      {/* Ground with realistic texture */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 100, 100]} />
        <meshStandardMaterial
          color="#2d5016"
          roughness={1}
          metalness={0}
          displacementScale={0.3}
        />
      </mesh>
      
      {/* Fallen leaves and debris */}
      {Array.from({ length: 500 }).map((_, i) => (
        <mesh
          key={`leaf-${i}`}
          position={[
            (Math.random() - 0.5) * 60,
            0.01,
            (Math.random() - 0.5) * 60,
          ]}
          rotation={[Math.random() * Math.PI, 0, Math.random() * Math.PI]}
        >
          <circleGeometry args={[0.05 + Math.random() * 0.1, 6]} />
          <meshStandardMaterial
            color={["#8B4513", "#D2691E", "#CD853F", "#A0522D"][Math.floor(Math.random() * 4)]}
            roughness={0.9}
          />
        </mesh>
      ))}
      
      {/* Trees with realistic geometry */}
      {trees.map((tree, i) => (
        <group
          key={`tree-${i}`}
          position={[tree.x, 0, tree.z]}
          rotation={[0, tree.rotation, 0]}
          scale={tree.scale}
        >
          {/* Tree trunk with bark texture */}
          <mesh position={[0, tree.trunkHeight / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.35, tree.trunkHeight, 12]} />
            <meshStandardMaterial
              color="#4a3728"
              roughness={0.95}
              metalness={0}
            />
          </mesh>
          
          {/* Foliage layers for depth */}
          <mesh position={[0, tree.trunkHeight + tree.foliageRadius * 0.8, 0]} castShadow receiveShadow>
            <coneGeometry args={[tree.foliageRadius, tree.foliageRadius * 2.5, 8]} />
            <meshStandardMaterial
              color="#1a4d1a"
              roughness={0.85}
              metalness={0}
            />
          </mesh>
          <mesh position={[0, tree.trunkHeight + tree.foliageRadius * 1.5, 0]} castShadow receiveShadow>
            <coneGeometry args={[tree.foliageRadius * 0.7, tree.foliageRadius * 2, 8]} />
            <meshStandardMaterial
              color="#2d5a2d"
              roughness={0.85}
            />
          </mesh>
          <mesh position={[0, tree.trunkHeight + tree.foliageRadius * 2, 0]} castShadow receiveShadow>
            <coneGeometry args={[tree.foliageRadius * 0.5, tree.foliageRadius * 1.5, 8]} />
            <meshStandardMaterial
              color="#3d6b3d"
              roughness={0.85}
            />
          </mesh>
        </group>
      ))}
      
      {/* Rocks */}
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh
          key={`rock-${i}`}
          position={[
            (Math.random() - 0.5) * 60,
            0.2 + Math.random() * 0.3,
            (Math.random() - 0.5) * 60,
          ]}
          rotation={[Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.3 + Math.random() * 0.5, 0]} />
          <meshStandardMaterial
            color="#4a4a4a"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Realistic city environment
export function RealisticCity({ timeOfDay = "night" }: { timeOfDay?: string }) {
  const buildings = useMemo(() => {
    const buildingArray = [];
    for (let i = 0; i < 80; i++) {
      const x = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 120;
      const height = 8 + Math.random() * 40;
      const width = 4 + Math.random() * 8;
      const depth = 4 + Math.random() * 8;
      buildingArray.push({ x, z, height, width, depth });
    }
    return buildingArray;
  }, []);

  const isNight = timeOfDay === "night" || timeOfDay === "dusk";

  return (
    <group>
      {/* Dark urban sky */}
      <color attach="background" args={[isNight ? "#0a0a1a" : "#4a6fa5"]} />
      <fog attach="fog" args={[isNight ? "#0a0a1a" : "#4a6fa5", 5, 150]} />
      
      {/* Lighting */}
      <ambientLight intensity={isNight ? 0.15 : 0.6} />
      <directionalLight
        position={[10, 20, -10]}
        intensity={isNight ? 0.3 : 1.0}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />
      
      {/* Street lights */}
      {Array.from({ length: 30 }).map((_, i) => (
        <group key={`streetlight-${i}`} position={[(i % 5) * 15 - 30, 0, Math.floor(i / 5) * 15 - 30]}>
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.08, 8, 8]} />
            <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
          </mesh>
          <pointLight position={[0, 4, 0]} intensity={isNight ? 2 : 0.5} color="#ffd700" distance={15} />
        </group>
      ))}
      
      {/* Roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      
      {/* Road markings */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`marking-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[i * 10 - 95, 0.02, 0]}>
          <planeGeometry args={[5, 0.3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      
      {/* Buildings with windows */}
      {buildings.map((building, i) => (
        <group key={`building-${i}`} position={[building.x, 0, building.z]}>
          {/* Building structure */}
          <mesh position={[0, building.height / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[building.width, building.height, building.depth]} />
            <meshStandardMaterial
              color="#2c3e50"
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>
          
          {/* Windows with lights */}
          {Array.from({ length: Math.floor(building.height / 4) }).map((_, j) =>
            Array.from({ length: Math.floor(building.width / 2) }).map((_, k) => (
              <mesh
                key={`window-${i}-${j}-${k}`}
                position={[
                  k * 2 - building.width / 2 + 1,
                  j * 4 + 2,
                  building.depth / 2 + 0.01,
                ]}
              >
                <planeGeometry args={[1.5, 2]} />
                <meshStandardMaterial
                  color={isNight && Math.random() > 0.6 ? "#ffd700" : "#1a1a2e"}
                  emissive={isNight && Math.random() > 0.6 ? "#ffd700" : "#000000"}
                  emissiveIntensity={isNight ? 0.8 : 0}
                />
              </mesh>
            ))
          )}
        </group>
      ))}
      
      {/* Vehicles (static for now) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`car-${i}`}
          position={[(Math.random() - 0.5) * 80, 0.5, (Math.random() - 0.5) * 80]}
          rotation={[0, Math.random() * Math.PI, 0]}
          castShadow
        >
          <boxGeometry args={[2, 0.8, 4]} />
          <meshStandardMaterial
            color={["#e74c3c", "#3498db", "#2ecc71", "#f39c12"][Math.floor(Math.random() * 4)]}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// Realistic interior environment
export function RealisticInterior() {
  return (
    <group>
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 1, 30]} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Main room light */}
      <pointLight position={[0, 4, 0]} intensity={50} color="#ffd700" distance={15} />
      
      {/* Floor with wood texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#5a3d2b"
          roughness={0.6}
          metalness={0}
        />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 3, -10]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#d4c5b9" roughness={0.9} />
      </mesh>
      <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#d4c5b9" roughness={0.9} />
      </mesh>
      <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#d4c5b9" roughness={0.9} />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.95} />
      </mesh>
      
      {/* Furniture */}
      {/* Table */}
      <mesh position={[0, 0.4, -5]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.08, 1.5]} />
        <meshStandardMaterial color="#6b4423" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[-1.2, 0.2, -5]} castShadow>
        <boxGeometry args={[0.1, 0.4, 1.5]} />
        <meshStandardMaterial color="#6b4423" roughness={0.7} />
      </mesh>
      <mesh position={[1.2, 0.2, -5]} castShadow>
        <boxGeometry args={[0.1, 0.4, 1.5]} />
        <meshStandardMaterial color="#6b4423" roughness={0.7} />
      </mesh>
      
      {/* Chairs */}
      {[-2, 2].map((x, i) => (
        <group key={`chair-${i}`} position={[x, 0, -5]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[0.4, 0.05, 0.4]} />
            <meshStandardMaterial color="#6b4423" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.5, -0.15]} castShadow>
            <boxGeometry args={[0.4, 0.5, 0.05]} />
            <meshStandardMaterial color="#6b4423" roughness={0.7} />
          </mesh>
        </group>
      ))}
      
      {/* Lamp */}
      <mesh position={[0, 5.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Photographs on wall */}
      {[-3, -1, 1, 3].map((x, i) => (
        <group key={`photo-${i}`} position={[x, 2.5, -9.95]}>
          <mesh>
            <planeGeometry args={[0.8, 1]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.7, 0.9]} />
            <meshStandardMaterial color={["#4a4a4a", "#5a5a5a", "#6a6a6a", "#7a7a7a"][i]} />
          </mesh>
        </group>
      ))}
      
      {/* Bookshelf */}
      <group position={[-9, 0, -5]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 3, 0.3]} />
          <meshStandardMaterial color="#6b4423" roughness={0.7} />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`book-${i}`} position={[0, 0.3 + i * 0.5, 0.2]} castShadow>
            <boxGeometry args={[0.6, 0.3, 0.08]} />
            <meshStandardMaterial
              color={["#c0392b", "#2980b9", "#27ae60", "#f39c12", "#8e44ad"][i]}
              roughness={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default RealisticForest;
