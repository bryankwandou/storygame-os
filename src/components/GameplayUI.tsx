"use client";

import { useState } from "react";

export function GameplayHUD() {
  const [showControls, setShowControls] = useState(true);
  
  return (
    <>
      {/* Top Left - Stats */}
      <div className="fixed top-4 left-4 bg-black/80 rounded-lg p-4 text-white">
        <div className="text-lg font-bold mb-2">Level 1</div>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>HP</span>
            <span>100/100</span>
          </div>
          <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 w-full" />
          </div>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>EXP</span>
            <span>0/100</span>
          </div>
          <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-0" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          <span>💰</span>
          <span className="font-bold">100</span>
        </div>
      </div>
      
      {/* Bottom - Controls */}
      {showControls && (
        <div className="fixed bottom-4 left-4 bg-black/80 rounded-lg p-4 text-white text-sm">
          <div className="font-bold mb-2">Controls</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>WASD - Move</div>
            <div>Shift - Run</div>
            <div>Space - Jump</div>
            <div>E - Attack</div>
            <div>F - Heavy Attack</div>
            <div>I - Inventory</div>
            <div>Q - Quests</div>
            <div>B - Build</div>
          </div>
        </div>
      )}
      
      {/* Quick Action Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-lg p-3">
        <div className="flex gap-2">
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-600">
            ⚔️
          </div>
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-600">
            🛡️
          </div>
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-600">
            🧪
          </div>
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-600">
            🍖
          </div>
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-600">
            🗺️
          </div>
        </div>
      </div>
      
      {/* Mini Map */}
      <div className="fixed top-20 right-4 w-48 h-48 bg-black/80 rounded-lg overflow-hidden border-2 border-gray-600">
        <div className="w-full h-full bg-green-900/50 relative">
          <div className="absolute top-2 left-2 text-white text-xs font-bold">Map</div>
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }} />
          {/* Enemy dots */}
          <div className="absolute w-2 h-2 bg-red-500 rounded-full" style={{ left: "30%", top: "40%" }} />
          <div className="absolute w-2 h-2 bg-red-500 rounded-full" style={{ left: "60%", top: "70%" }} />
          <div className="absolute w-2 h-2 bg-yellow-500 rounded-full" style={{ left: "80%", top: "30%" }} />
        </div>
      </div>
    </>
  );
}

export default GameplayHUD;
