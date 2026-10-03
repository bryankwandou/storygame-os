"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Hero */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
          ECHOES OF MEMORY
        </h1>
        <p className="text-3xl text-gray-300 mb-8">Open World Adventure Game</p>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Explore infinite worlds, fight enemies, complete quests, and build your sanctuary.
        </p>
        
        {/* Buttons */}
        <div className="flex gap-6 justify-center mb-20">
          <Link href="/play" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-xl hover:scale-110 transition-transform">
            🎮 PLAY GAME
          </Link>
          <Link href="/openworld" className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl font-bold text-xl hover:scale-110 transition-transform">
            🌍 OPEN WORLD
          </Link>
        </div>
        
        {/* Features */}
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">⚔️</div>
            <div className="font-bold text-lg mb-2">Combat</div>
            <div className="text-sm text-gray-400">Fight enemies</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🏃</div>
            <div className="font-bold text-lg mb-2">Run</div>
            <div className="text-sm text-gray-400">Sprint across worlds</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🏗️</div>
            <div className="font-bold text-lg mb-2">Build</div>
            <div className="text-sm text-gray-400">Create structures</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🗺️</div>
            <div className="font-bold text-lg mb-2">Explore</div>
            <div className="text-sm text-gray-400">Infinite world</div>
          </div>
        </div>
      </div>
      
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500">
        <p>Built with Next.js + Three.js</p>
      </footer>
    </main>
  );
}
