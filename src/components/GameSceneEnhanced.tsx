"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import {
  Environment,
  Stars,
  ContactShadows,
  Float,
  OrbitControls,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
  GodRays,
} from "@react-three/postprocessing";
import { useGameStore, GAME_SCENES } from "@/store/gameStore";
import DialogueUI from "./DialogueUI";
import { UltimateMaleCharacter, UltimateFemaleCharacter } from "./UltimateCharacter";
import { RealisticForest, RealisticCity, RealisticInterior } from "./RealisticEnvironment";
import * as THREE from "three";

function PlayerCharacter() {
  const { currentSceneId } = useGameStore();
  const scene = GAME_SCENES[currentSceneId];
  const meshRef = useRef<THREE.Group>(null);

  return (
    <UltimateMaleCharacter
      position={[0, 0, 8]}
      animation="idle"
      scale={1}
    />
  );
}

function NPCCharacters() {
  const { currentSceneId, currentDialogueIndex } = useGameStore();
  const scene = GAME_SCENES[currentSceneId];

  const npcs = [];
  
  if (currentSceneId === "forest_reveal" || currentSceneId === "forest_confrontation") {
    npcs.push(
      <UltimateFemaleCharacter
        key="elena"
        position={[0, 0, 3]}
        rotation={[0, Math.PI, 0]}
        animation="idle"
        scale={0.95}
      />
    );
  }
  
  if (currentSceneId === "city_arrival" || currentSceneId === "city_explore" || currentSceneId === "city_help") {
    npcs.push(
      <UltimateMaleCharacter
        key="vendor"
        position={[5, 0, 6]}
        rotation={[0, -Math.PI / 4, 0]}
        animation="talking"
        scale={0.9}
      />
    );
  }
  
  if (currentSceneId === "apartment_meeting" || currentSceneId === "apartment_discovery" || currentSceneId === "final_revelation") {
    npcs.push(
      <UltimateFemaleCharacter
        key="old-woman"
        position={[-3, 0, -5]}
        rotation={[0, Math.PI / 3, 0]}
        animation="idle"
        scale={0.85}
      />
    );
  }

  return <>{npcs}</>;
}

function SceneEnvironment() {
  const { currentSceneId } = useGameStore();
  const scene = GAME_SCENES[currentSceneId];

  if (!scene) return null;

  const getEnvironment = () => {
    switch (scene.environment) {
      case "forest":
        return <RealisticForest timeOfDay={scene.timeOfDay} />;
      case "city":
        return <RealisticCity timeOfDay={scene.timeOfDay} />;
      case "interior":
        return <RealisticInterior />;
      default:
        return <RealisticForest timeOfDay="day" />;
    }
  };

  return getEnvironment();
}

function CinematicCamera() {
  const { currentSceneId, currentDialogueIndex } = useGameStore();
  const scene = GAME_SCENES[currentSceneId];

  // Different camera angles for different scenes
  const getCameraPosition = () => {
    if (!scene) return [0, 3, 10];
    
    if (scene.dialogues[currentDialogueIndex]?.character === "Narrator") {
      return [0, 5, 15]; // Wide shot for narrator
    }
    
    return [0, 3, 10]; // Default medium shot
  };

  return (
    <OrbitControls
      target={[0, 1.5, 0]}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 6}
      maxDistance={20}
      minDistance={3}
      enablePan={false}
    />
  );
}

function AtmosphericParticles() {
  const { currentSceneId } = useGameStore();
  const scene = GAME_SCENES[currentSceneId];
  
  const count = scene?.environment === "forest" ? 1000 : 200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export default function GameSceneEnhanced() {
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
        camera={{ position: [0, 3, 10], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneEnvironment />
          <PlayerCharacter />
          <NPCCharacters />
          <AtmosphericParticles />
          <CinematicCamera />
          
          {/* Contact shadows for realism */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.5}
            scale={50}
            blur={2}
            far={10}
          />

          {/* Post-processing for cinematic look */}
          <EffectComposer>
            <DepthOfField
              focusDistance={0.01}
              focalLength={0.05}
              bokehScale={3}
            />
            <Bloom
              intensity={0.3}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.9}
            />
            <Vignette darkness={0.6} offset={0.3} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {isDialogueActive && scene && <DialogueUI />}

      <div className="hint-text">
        Press SPACE or ENTER to advance dialogue • Click to look around
      </div>
    </>
  );
}
