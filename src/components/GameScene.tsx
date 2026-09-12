"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import {
  Environment,
  Stars,
  Float,
  Text3D,
  Center,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import { useGameStore, GAME_SCENES } from "@/store/gameStore";
import DialogueUI from "./DialogueUI";
import * as THREE from "three";

function SceneEnvironment() {
  const { currentSceneId } = useGameStore();
  const scene = GAME_SCENES[currentSceneId];

  if (!scene) return null;

  const getEnvironmentSettings = () => {
    switch (scene.environment) {
      case "forest":
        return {
          skyColor: scene.timeOfDay === "night" ? "#0a0a1a" : "#87CEEB",
          groundColor: "#2d5016",
          fogColor: scene.timeOfDay === "night" ? "#0a0a1a" : "#4a6fa5",
          fogDensity: 0.02,
        };
      case "city":
        return {
          skyColor: "#1a1a2e",
          groundColor: "#2a2a2a",
          fogColor: "#16213e",
          fogDensity: 0.015,
        };
      case "interior":
        return {
          skyColor: "#1a1a1a",
          groundColor: "#2a2a2a",
          fogColor: "#0a0a0a",
          fogDensity: 0.01,
        };
      default:
        return {
          skyColor: "#87CEEB",
          groundColor: "#2d5016",
          fogColor: "#4a6fa5",
          fogDensity: 0.02,
        };
    }
  };

  const settings = getEnvironmentSettings();

  return (
    <>
      <color attach="background" args={[settings.skyColor]} />
      <fog attach="fog" args={[settings.fogColor, 1, 100]} />
      <ambientLight intensity={scene.timeOfDay === "night" ? 0.1 : 0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={scene.timeOfDay === "night" ? 0.3 : 1}
        castShadow
      />
      {scene.timeOfDay === "night" && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />}
    </>
  );
}

function ProceduralForest() {
  const trees = [];
  const treeCount = 100;

  for (let i = 0; i < treeCount; i++) {
    const x = (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 50;
    const scale = 0.8 + Math.random() * 0.6;
    const rotation = Math.random() * Math.PI * 2;

    trees.push(
      <group key={`tree-${i}`} position={[x, 0, z]} rotation={[0, rotation, 0]} scale={scale}>
        {/* Tree trunk */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 3, 8]} />
          <meshStandardMaterial color="#3d2817" roughness={0.9} />
        </mesh>
        {/* Tree foliage */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <coneGeometry args={[1.2, 3, 8]} />
          <meshStandardMaterial color="#1a4d1a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 4.5, 0]} castShadow>
          <coneGeometry args={[0.9, 2.5, 8]} />
          <meshStandardMaterial color="#2d5a2d" roughness={0.8} />
        </mesh>
      </group>
    );
  }

  return <>{trees}</>;
}

function ProceduralCity() {
  const buildings = [];
  const buildingCount = 50;

  for (let i = 0; i < buildingCount; i++) {
    const x = (Math.random() - 0.5) * 80;
    const z = (Math.random() - 0.5) * 80;
    const height = 5 + Math.random() * 20;
    const width = 2 + Math.random() * 4;
    const depth = 2 + Math.random() * 4;

    buildings.push(
      <group key={`building-${i}`} position={[x, 0, z]}>
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Windows */}
        {Array.from({ length: Math.floor(height / 3) }).map((_, j) =>
          Array.from({ length: Math.floor(width / 1.5) }).map((_, k) => (
            <mesh
              key={`window-${i}-${j}-${k}`}
              position={[k * 1.5 - width / 2 + 0.75, j * 3 + 2, depth / 2 + 0.01]}
            >
              <planeGeometry args={[0.8, 1.2]} />
              <meshStandardMaterial
                color={Math.random() > 0.7 ? "#ffd700" : "#0a0a1a"}
                emissive={Math.random() > 0.7 ? "#ffd700" : "#000000"}
                emissiveIntensity={0.5}
              />
            </mesh>
          ))
        )}
      </group>
    );
  }

  return <>{buildings}</>;
}

function ProceduralInterior() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 3, -10]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Furniture */}
      <mesh position={[0, 0.4, -5]} castShadow>
        <boxGeometry args={[4, 0.8, 1.5]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>

      {/* Lamp */}
      <pointLight position={[0, 3, -5]} intensity={2} color="#ffd700" distance={10} />
      <mesh position={[0, 3.5, -5]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Photographs on wall */}
      {[-3, -1, 1, 3].map((x, i) => (
        <mesh key={`photo-${i}`} position={[x, 2.5, -9.9]}>
          <planeGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      ))}
    </group>
  );
}

function Ground() {
  const { currentSceneId } = useGameStore();
  const scene = GAME_SCENES[currentSceneId];

  if (!scene) return null;

  const groundColor = scene.environment === "forest" ? "#2d5016" : "#2a2a2a";

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color={groundColor} roughness={1} />
    </mesh>
  );
}

function PlayerCharacter() {
  const meshRef = useRef<THREE.Mesh>(null);

  useGameStore.subscribe((state) => {
    if (meshRef.current) {
      meshRef.current.position.set(...state.playerPosition);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 1, 5]} castShadow>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color="#4a90e2" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Character glow */}
      <pointLight position={[0, 1, 5]} intensity={0.5} color="#4a90e2" distance={5} />
    </Float>
  );
}

function Particles() {
  const count = 500;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function GameScene() {
  const { currentSceneId, isDialogueActive } = useGameStore();
  const scene = GAME_SCENES[currentSceneId];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isDialogueActive) return;

      if (e.key === " " || e.key === "Enter") {
        useGameStore.getState().advanceDialogue();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isDialogueActive]);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 3, 10], fov: 60 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          <SceneEnvironment />
          <Ground />

          {scene?.environment === "forest" && <ProceduralForest />}
          {scene?.environment === "city" && <ProceduralCity />}
          {scene?.environment === "interior" && <ProceduralInterior />}

          <PlayerCharacter />
          <Particles />

          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
            />
            <Vignette darkness={0.5} offset={0.3} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {isDialogueActive && scene && <DialogueUI />}
      
      <div className="hint-text">
        Press SPACE or ENTER to advance dialogue
      </div>
    </>
  );
}
