import { create } from 'zustand';

interface NPC {
  id: string;
  x: number;
  z: number;
  type: string;
  name: string;
  dialogue: string;
  health?: number;
  level?: number;
}

interface Enemy {
  id: string;
  x: number;
  z: number;
  type: string;
  level: number;
  health: number;
  maxHealth: number;
  damage: number;
}

interface Animal {
  id: string;
  x: number;
  z: number;
  type: string;
  mountable: boolean;
}

interface InventoryItem {
  id: string;
  name: string;
  type: "weapon" | "armor" | "consumable" | "material" | "quest";
  quantity: number;
  icon: string;
  description: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  completed: boolean;
  rewards: { gold: number; items: string[] };
}

interface WorldState {
  // Player
  playerPosition: [number, number, number];
  playerHealth: number;
  playerMaxHealth: number;
  playerLevel: number;
  playerExperience: number;
  playerGold: number;
  
  // Inventory
  inventory: InventoryItem[];
  backpackCapacity: number;
  
  // Equipment
  equippedWeapon: InventoryItem | null;
  equippedArmor: InventoryItem | null;
  
  // World
  worldSize: number;
  currentBiome: string;
  
  // NPCs
  npcs: NPC[];
  
  // Enemies
  enemies: Enemy[];
  
  // Animals
  animals: Animal[];
  
  // Quests
  activeQuests: Quest[];
  completedQuests: string[];
  
  // Buildings (Minecraft-style)
  placedBuildings: { id: string; type: string; x: number; y: number; z: number }[];
  
  // Mount
  currentMount: Animal | null;
  
  // Actions
  setPlayerPosition: (position: [number, number, number]) => void;
  takeDamage: (damage: number) => void;
  heal: (amount: number) => void;
  addExperience: (amount: number) => void;
  addGold: (amount: number) => void;
  
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string, quantity: number) => void;
  equipWeapon: (item: InventoryItem) => void;
  equipArmor: (item: InventoryItem) => void;
  
  attackEnemy: (enemyId: string, damage: number) => void;
  killEnemy: (enemyId: string) => void;
  
  mountAnimal: (animalId: string) => void;
  dismount: () => void;
  
  placeBuilding: (type: string, x: number, y: number, z: number) => void;
  removeBuilding: (buildingId: string) => void;
  
  acceptQuest: (quest: Quest) => void;
  completeQuest: (questId: string) => void;
  
  interactWithNPC: (npcId: string) => void;
}

export const useOpenWorldStore = create<WorldState>((set, get) => ({
  // Initial player state
  playerPosition: [0, 2, 0],
  playerHealth: 100,
  playerMaxHealth: 100,
  playerLevel: 1,
  playerExperience: 0,
  playerGold: 100,
  
  // Inventory
  inventory: [
    {
      id: "sword-1",
      name: "Iron Sword",
      type: "weapon",
      quantity: 1,
      icon: "sword",
      description: "A basic iron sword. Damage: 15",
    },
    {
      id: "armor-1",
      name: "Leather Armor",
      type: "armor",
      quantity: 1,
      icon: "armor",
      description: "Basic leather armor. Defense: 10",
    },
    {
      id: "potion-1",
      name: "Health Potion",
      type: "consumable",
      quantity: 5,
      icon: "potion",
      description: "Restores 50 health points.",
    },
    {
      id: "wood-1",
      name: "Wood",
      type: "material",
      quantity: 20,
      icon: "wood",
      description: "Basic building material.",
    },
    {
      id: "stone-1",
      name: "Stone",
      type: "material",
      quantity: 15,
      icon: "stone",
      description: "Sturdy building material.",
    },
  ],
  backpackCapacity: 50,
  
  // Equipment
  equippedWeapon: null,
  equippedArmor: null,
  
  // World
  worldSize: 10000,
  currentBiome: "forest",
  
  // NPCs (will be generated procedurally)
  npcs: [],
  
  // Enemies (will be generated procedurally)
  enemies: [],
  
  // Animals (will be generated procedurally)
  animals: [],
  
  // Quests
  activeQuests: [
    {
      id: "quest-1",
      title: "The Beginning",
      description: "Explore the world and find the ancient village.",
      objectives: ["Find the village", "Talk to the elder", "Defeat 3 enemies"],
      completed: false,
      rewards: { gold: 100, items: ["Rare Sword"] },
    },
    {
      id: "quest-2",
      title: "Hunter's Path",
      description: "Hunt wild animals for food and materials.",
      objectives: ["Hunt 5 animals", "Collect 10 pieces of meat"],
      completed: false,
      rewards: { gold: 50, items: ["Hunter's Bow"] },
    },
  ],
  completedQuests: [],
  
  // Buildings
  placedBuildings: [],
  
  // Mount
  currentMount: null,
  
  // Actions
  setPlayerPosition: (position) => set({ playerPosition: position }),
  
  takeDamage: (damage) => set((state) => ({
    playerHealth: Math.max(0, state.playerHealth - damage),
  })),
  
  heal: (amount) => set((state) => ({
    playerHealth: Math.min(state.playerMaxHealth, state.playerHealth + amount),
  })),
  
  addExperience: (amount) => set((state) => {
    const newExp = state.playerExperience + amount;
    const expNeeded = state.playerLevel * 100;
    
    if (newExp >= expNeeded) {
      return {
        playerExperience: newExp - expNeeded,
        playerLevel: state.playerLevel + 1,
        playerMaxHealth: state.playerMaxHealth + 10,
        playerHealth: state.playerMaxHealth + 10,
      };
    }
    
    return { playerExperience: newExp };
  }),
  
  addGold: (amount) => set((state) => ({
    playerGold: state.playerGold + amount,
  })),
  
  addToInventory: (item) => set((state) => {
    const existingItem = state.inventory.find((i) => i.id === item.id);
    
    if (existingItem && item.type !== "weapon" && item.type !== "armor") {
      return {
        inventory: state.inventory.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      };
    }
    
    return { inventory: [...state.inventory, item] };
  }),
  
  removeFromInventory: (itemId, quantity) => set((state) => ({
    inventory: state.inventory
      .map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
      )
      .filter((i) => i.quantity > 0),
  })),
  
  equipWeapon: (item) => set({ equippedWeapon: item }),
  
  equipArmor: (item) => set({ equippedArmor: item }),
  
  attackEnemy: (enemyId, damage) => set((state) => ({
    enemies: state.enemies.map((e) =>
      e.id === enemyId ? { ...e, health: Math.max(0, e.health - damage) } : e
    ),
  })),
  
  killEnemy: (enemyId) => set((state) => {
    const enemy = state.enemies.find((e) => e.id === enemyId);
    if (!enemy) return state;
    
    return {
      enemies: state.enemies.filter((e) => e.id !== enemyId),
      playerGold: state.playerGold + enemy.level * 10,
      playerExperience: state.playerExperience + enemy.level * 25,
    };
  }),
  
  mountAnimal: (animalId) => set((state) => {
    const animal = state.animals.find((a) => a.id === animalId);
    if (!animal || !animal.mountable) return state;
    
    return { currentMount: animal };
  }),
  
  dismount: () => set({ currentMount: null }),
  
  placeBuilding: (type, x, y, z) => set((state) => ({
    placedBuildings: [
      ...state.placedBuildings,
      { id: `building-${Date.now()}`, type, x, y, z },
    ],
  })),
  
  removeBuilding: (buildingId) => set((state) => ({
    placedBuildings: state.placedBuildings.filter((b) => b.id !== buildingId),
  })),
  
  acceptQuest: (quest) => set((state) => ({
    activeQuests: [...state.activeQuests, quest],
  })),
  
  completeQuest: (questId) => set((state) => {
    const quest = state.activeQuests.find((q) => q.id === questId);
    if (!quest) return state;
    
    return {
      activeQuests: state.activeQuests.filter((q) => q.id !== questId),
      completedQuests: [...state.completedQuests, questId],
      playerGold: state.playerGold + quest.rewards.gold,
    };
  }),
  
  interactWithNPC: (npcId) => {
    const npc = get().npcs.find((n) => n.id === npcId);
    if (npc) {
      console.log(`NPC ${npc.name} says: ${npc.dialogue}`);
    }
  },
}));
