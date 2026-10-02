"use client";

import { useState } from "react";
import { useOpenWorldStore } from "@/store/openWorldStore";
import { motion, AnimatePresence } from "framer-motion";

export function GameHUD() {
  const { playerHealth, playerMaxHealth, playerLevel, playerExperience, playerGold } = useOpenWorldStore();
  
  const expNeeded = playerLevel * 100;
  const expPercent = (playerExperience / expNeeded) * 100;
  const healthPercent = (playerHealth / playerMaxHealth) * 100;

  return (
    <div className="fixed top-0 left-0 w-full p-4 pointer-events-none">
      <div className="flex justify-between items-start">
        {/* Player Stats */}
        <div className="bg-black/70 backdrop-blur-md rounded-lg p-4 pointer-events-auto" style={{ minWidth: "200px" }}>
          <div className="text-white font-bold mb-2">Level {playerLevel}</div>
          
          {/* Health Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>HP</span>
              <span>{playerHealth}/{playerMaxHealth}</span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>
          
          {/* Experience Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>EXP</span>
              <span>{playerExperience}/{expNeeded}</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
          
          {/* Gold */}
          <div className="flex items-center text-yellow-400">
            <span className="text-xl mr-2">💰</span>
            <span className="font-bold">{playerGold}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/70 backdrop-blur-md rounded-lg p-4 pointer-events-auto">
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              onClick={() => {/* Open inventory */}}
            >
              🎒 Inventory
            </button>
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
              onClick={() => {/* Open quests */}}
            >
              📜 Quests
            </button>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              onClick={() => {/* Open map */}}
            >
              🗺️ Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InventoryUI({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { inventory, equippedWeapon, equippedArmor, equipWeapon, equipArmor, removeFromInventory } = useOpenWorldStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">🎒 Inventory</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-3xl"
            >
              ✕
            </button>
          </div>

          {/* Equipment Slots */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3">Equipment</h3>
            <div className="flex gap-4">
              <div className="bg-gray-800 rounded-lg p-4 flex-1">
                <div className="text-gray-400 mb-2">Weapon</div>
                {equippedWeapon ? (
                  <div className="bg-blue-600/20 border border-blue-500 rounded p-3">
                    <div className="font-bold text-white">{equippedWeapon.name}</div>
                    <div className="text-sm text-gray-300">{equippedWeapon.description}</div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No weapon equipped</div>
                )}
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 flex-1">
                <div className="text-gray-400 mb-2">Armor</div>
                {equippedArmor ? (
                  <div className="bg-purple-600/20 border border-purple-500 rounded p-3">
                    <div className="font-bold text-white">{equippedArmor.name}</div>
                    <div className="text-sm text-gray-300">{equippedArmor.description}</div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No armor equipped</div>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Grid */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Items</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg p-3 cursor-pointer transition-colors"
                  onClick={() => {
                    if (item.type === "weapon") equipWeapon(item);
                    if (item.type === "armor") equipArmor(item);
                    if (item.type === "consumable") {
                      // Use consumable
                    }
                  }}
                >
                  <div className="text-3xl text-center mb-2">
                    {item.icon === "sword" && "⚔️"}
                    {item.icon === "armor" && "🛡️"}
                    {item.icon === "potion" && "🧪"}
                    {item.icon === "wood" && "🪵"}
                    {item.icon === "stone" && "🪨"}
                  </div>
                  <div className="text-white font-bold text-sm text-center">{item.name}</div>
                  {item.quantity > 1 && (
                    <div className="text-gray-400 text-xs text-center">x{item.quantity}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function QuestsUI({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { activeQuests, completedQuests, completeQuest } = useOpenWorldStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">📜 Quests</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-3xl"
            >
              ✕
            </button>
          </div>

          {/* Active Quests */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3">Active Quests</h3>
            {activeQuests.map((quest) => (
              <div key={quest.id} className="bg-gray-800 rounded-lg p-4 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-white">{quest.title}</h4>
                  <span className="text-yellow-400 text-sm">💰 {quest.rewards.gold} gold</span>
                </div>
                <p className="text-gray-300 mb-3">{quest.description}</p>
                <div className="space-y-1">
                  {quest.objectives.map((obj, i) => (
                    <div key={i} className="flex items-center text-gray-400">
                      <span className="mr-2">•</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Completed Quests */}
          {completedQuests.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Completed Quests</h3>
              <div className="text-gray-400">
                {completedQuests.length} quest(s) completed
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function BuildingMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { placeBuilding, inventory } = useOpenWorldStore();

  const buildingTypes = [
    { id: "wall", name: "Wall", cost: { wood: 5, stone: 2 } },
    { id: "floor", name: "Floor", cost: { wood: 3 } },
    { id: "door", name: "Door", cost: { wood: 5 } },
    { id: "roof", name: "Roof", cost: { wood: 10 } },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg p-4">
      <div className="flex gap-3">
        {buildingTypes.map((building) => (
          <button
            key={building.id}
            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            onClick={() => {
              placeBuilding(building.id, 0, 0, 0);
            }}
          >
            <div className="text-2xl mb-1">🏗️</div>
            <div className="text-sm">{building.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameHUD;
