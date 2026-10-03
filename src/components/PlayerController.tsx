"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { UltimateMaleCharacter } from "./UltimateCharacter";
import * as THREE from "three";

export function PlayerController() {
  const playerRef = useRef<THREE.Group>(null);
  const velocity = useRef({ x: 0, z: 0, y: 0 });
  const isRunning = useRef(false);
  const isJumping = useRef(false);
  const canJump = useRef(true);
  
  const speed = useRef(0.15);
  const runSpeed = 0.3;
  const walkSpeed = 0.15;
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW": velocity.current.z = -speed.current; break;
        case "KeyS": velocity.current.z = speed.current; break;
        case "KeyA": velocity.current.x = -speed.current; break;
        case "KeyD": velocity.current.x = speed.current; break;
        case "ShiftLeft": 
          isRunning.current = true;
          speed.current = runSpeed;
          break;
        case "Space":
          if (canJump.current && !isJumping.current) {
            velocity.current.y = 0.2;
            isJumping.current = true;
            canJump.current = false;
          }
          break;
        case "KeyE":
          // Attack / Interact
          break;
        case "KeyF":
          // Heavy attack
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "KeyS":
          velocity.current.z = 0;
          break;
        case "KeyA":
        case "KeyD":
          velocity.current.x = 0;
          break;
        case "ShiftLeft":
          isRunning.current = false;
          speed.current = walkSpeed;
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  
  useFrame((state, delta) => {
    if (!playerRef.current) return;
    
    // Apply movement
    playerRef.current.position.x += velocity.current.x;
    playerRef.current.position.z += velocity.current.z;
    
    // Gravity
    if (playerRef.current.position.y > 0 || velocity.current.y > 0) {
      velocity.current.y -= 0.01; // Gravity
      playerRef.current.position.y += velocity.current.y;
      
      if (playerRef.current.position.y <= 0) {
        playerRef.current.position.y = 0;
        velocity.current.y = 0;
        isJumping.current = false;
        canJump.current = true;
      }
    }
    
    // Rotate player to face movement direction
    if (velocity.current.x !== 0 || velocity.current.z !== 0) {
      const angle = Math.atan2(velocity.current.x, velocity.current.z);
      playerRef.current.rotation.y = angle;
    }
    
    // Update store
    useOpenWorldStore.getState().setPlayerPosition([
      playerRef.current.position.x,
      playerRef.current.position.y,
      playerRef.current.position.z,
    ]);
  });
  
  return (
    <group ref={playerRef} position={[0, 0, 0]}>
      <UltimateMaleCharacter 
        animation={isRunning.current ? "running" : "walking"} 
        scale={1} 
      />
    </group>
  );
}

export default PlayerController;
