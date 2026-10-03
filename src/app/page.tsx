"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            ECHOES OF MEMORY
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Open World Adventure Game
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Explore an infinite procedurally generated world. Fight enemies, complete quests, 
            build your own structures, and uncover the mysteries of this vast land.
          </p>
        </div>
        
        {/* Game Modes */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Story Mode */}
          <Link href="/story" className="group">
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-700/50 rounded-2xl p-8 border border-purple-500/30 hover:border-purple-400 transition-all hover:scale-105">
              <div className="text-5xl mb-4">📖</div>
              <h2 className="text-3xl font-bold mb-3">Story Mode</h2>
              <p className="text-gray-300 mb-4">
                Experience the cinematic story of a man searching for lost memories. 
                Make choices that shape your destiny.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 12 unique scenes</li>
                <li>• Multiple endings</li>
                <li>• Branching narrative</li>
                <li>• Cinematic experience</li>
              </ul>
            </div>
          </Link>
          
          {/* Open World */}
          <Link href="/game" className="group">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400 transition-all hover:scale-105">
              <div className="text-5xl mb-4">🌍</div>
              <h2 className="text-3xl font-bold mb-3">Open World</h2>
              <p className="text-gray-300 mb-4">
                Explore an infinite world with combat, quests, and building. 
                Genshin Impact meets Minecraft.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Infinite procedural world</li>
                <li>• Combat system</li>
                <li>• Quest & inventory</li>
                <li>• Build structures</li>
              </ul>
            </div>
          </Link>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-16">
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">⚔️</div>
            <div className="font-bold mb-1">Combat</div>
            <div className="text-sm text-gray-400">Fight enemies in real-time</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <div className="font-bold mb-1">Explore</div>
            <div className="text-sm text-gray-400">Infinite procedural world</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🏗️</div>
            <div className="font-bold mb-1">Build</div>
            <div className="text-sm text-gray-400">Create your own structures</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">📜</div>
            <div className="font-bold mb-1">Quests</div>
            <div className="text-sm text-gray-400">Complete objectives</div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Link href="/game">
            <button className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xl font-bold hover:scale-105 transition-transform">
              🎮 Play Now - Free
            </button>
          </Link>
          <p className="text-gray-500 mt-4 text-sm">No download required • Play in browser</p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Built with Next.js, Three.js, and React Three Fiber</p>
          <p className="mt-2 text-sm">Echoes of Memory © 2026</p>
        </div>
      </footer>
    </main>
  );
}
