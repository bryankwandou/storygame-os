"use client";

import * as THREE from "three";

// Generate procedural normal maps for realistic surfaces
export function createProceduralNormalMap(
  type: "skin" | "fabric" | "leather" | "wood" | "metal" = "skin"
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Create noise pattern
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const idx = (i * size + j) * 4;
      
      let nx = 128;
      let ny = 128;
      let nz = 255;

      switch (type) {
        case "skin":
          // Subtle skin pores and bumps
          const skinNoise = Math.random() * 20 - 10;
          nx = 128 + skinNoise;
          ny = 128 + skinNoise;
          nz = 255;
          break;

        case "fabric":
          // Fabric weave pattern
          const weaveX = (j % 8 < 4 ? 1 : -1) * 10;
          const weaveY = (i % 8 < 4 ? 1 : -1) * 10;
          nx = 128 + weaveX;
          ny = 128 + weaveY;
          nz = 255;
          break;

        case "leather":
          // Leather grain
          const grain = Math.random() * 30 - 15;
          nx = 128 + grain;
          ny = 128 + grain;
          nz = 255;
          break;

        case "wood":
          // Wood grain lines
          const woodGrain = Math.sin(i * 0.1) * 20;
          nx = 128 + woodGrain;
          ny = 128;
          nz = 255;
          break;

        case "metal":
          // Subtle brushed metal
          const brushed = Math.sin(j * 0.5) * 5;
          nx = 128 + brushed;
          ny = 128;
          nz = 255;
          break;
      }

      data[idx] = Math.max(0, Math.min(255, nx));
      data[idx + 1] = Math.max(0, Math.min(255, ny));
      data[idx + 2] = Math.max(0, Math.min(255, nz));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Generate roughness map
export function createRoughnessMap(type: "skin" | "fabric" | "leather" = "skin"): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let i = 0; i < size * size; i++) {
    let value = 128;

    switch (type) {
      case "skin":
        value = 130 + Math.random() * 20;
        break;
      case "fabric":
        value = 200 + Math.random() * 30;
        break;
      case "leather":
        value = 70 + Math.random() * 20;
        break;
    }

    data[i * 4] = value;
    data[i * 4 + 1] = value;
    data[i * 4 + 2] = value;
    data[i * 4 + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Advanced material factory
export function createAdvancedMaterial(
  type: "skin" | "fabric" | "denim" | "leather" | "metal" | "wood",
  color: string
): THREE.MeshPhysicalMaterial {
  const normalMap = createProceduralNormalMap(type === "denim" ? "fabric" : type);
  const roughnessMap = createRoughnessMap(type === "denim" ? "fabric" : type);

  switch (type) {
    case "skin":
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.55,
        metalness: 0.0,
        clearcoat: 0.15,
        clearcoatRoughness: 0.4,
        sheen: 0.3,
        sheenRoughness: 0.4,
        sheenColor: new THREE.Color("#ffd4c4"),
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.3, 0.3),
        roughnessMap: roughnessMap,
        envMapIntensity: 0.8,
      });

    case "fabric":
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.85,
        metalness: 0.0,
        sheen: 0.2,
        sheenRoughness: 0.6,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.5, 0.5),
        roughnessMap: roughnessMap,
      });

    case "denim":
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.9,
        metalness: 0.0,
        sheen: 0.1,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: roughnessMap,
      });

    case "leather":
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.3,
        metalness: 0.0,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.6, 0.6),
        roughnessMap: roughnessMap,
      });

    case "metal":
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.1,
        metalness: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.2, 0.2),
      });

    case "wood":
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.7,
        metalness: 0.0,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.8, 0.8),
        roughnessMap: roughnessMap,
      });

    default:
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.5,
      });
  }
}

// Eye material with refraction
export function createEyeMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#ffffff"),
    roughness: 0.1,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    transmission: 0.6,
    thickness: 0.5,
    ior: 1.4,
    envMapIntensity: 1.5,
  });
}

// Iris material
export function createIrisMaterial(color: string = "#3d2314"): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.4,
    metalness: 0.1,
  });
}

export default createAdvancedMaterial;
