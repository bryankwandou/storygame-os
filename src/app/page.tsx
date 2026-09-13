"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";

const GameScene = dynamic(() => import("@/components/GameSceneEnhanced"), {
  ssr: false,
});

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <h1 className="loading-title">Echoes of Memory</h1>
        <div className="loading-bar">
          <div
            className="loading-progress"
            style={{ width: `${Math.min(loadingProgress, 100)}%` }}
          />
        </div>
        <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.6)" }}>
          Loading memories...
        </p>
      </div>
    );
  }

  return (
    <main className="game-container">
      <Suspense
        fallback={
          <div className="loading-screen">
            <p style={{ color: "white" }}>Initializing...</p>
          </div>
        }
      >
        <GameScene />
      </Suspense>
    </main>
  );
}
