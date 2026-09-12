import { create } from 'zustand';

export interface DialogueChoice {
  id: string;
  text: string;
  nextSceneId: string;
}

export interface DialogueLine {
  id: string;
  character: string;
  text: string;
  choices?: DialogueChoice[];
  nextDialogueId?: string;
}

export interface GameScene {
  id: string;
  name: string;
  environment: 'forest' | 'city' | 'interior' | 'exterior';
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  dialogues: DialogueLine[];
  backgroundMusic?: string;
}

interface GameState {
  currentSceneId: string;
  currentDialogueIndex: number;
  isDialogueActive: boolean;
  playerPosition: [number, number, number];
  gameProgress: number;
  visitedScenes: string[];
  
  // Actions
  setCurrentScene: (sceneId: string) => void;
  advanceDialogue: () => void;
  selectChoice: (choice: DialogueChoice) => void;
  setPlayerPosition: (position: [number, number, number]) => void;
  startDialogue: () => void;
  endDialogue: () => void;
}

// Game Story Data
export const GAME_SCENES: Record<string, GameScene> = {
  'intro_forest': {
    id: 'intro_forest',
    name: 'The Forgotten Path',
    environment: 'forest',
    timeOfDay: 'dusk',
    dialogues: [
      {
        id: 'intro_1',
        character: 'Narrator',
        text: 'The autumn wind carries whispers of forgotten memories through the ancient forest...',
      },
      {
        id: 'intro_2',
        character: 'You',
        text: '(looking around) Where... where am I? How did I get here?',
      },
      {
        id: 'intro_3',
        character: 'Mysterious Voice',
        text: 'You\'ve returned... just as the prophecy foretold.',
      },
      {
        id: 'intro_4',
        character: 'You',
        text: 'Who are you? What prophecy?',
        choices: [
          { id: 'choice_1', text: 'Please, tell me what\'s happening.', nextSceneId: 'forest_reveal' },
          { id: 'choice_2', text: 'I don\'t have time for riddles. Show yourself!', nextSceneId: 'forest_confrontation' },
        ]
      }
    ],
    backgroundMusic: 'ambient_forest'
  },
  'forest_reveal': {
    id: 'forest_reveal',
    name: 'The Revelation',
    environment: 'forest',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'reveal_1',
        character: 'Elena',
        text: '(A woman emerges from the shadows, her eyes reflecting ancient starlight)',
      },
      {
        id: 'reveal_2',
        character: 'Elena',
        text: 'I am Elena, keeper of the Memory Gates. Long ago, you made a sacrifice to save someone you loved.',
      },
      {
        id: 'reveal_3',
        character: 'You',
        text: 'I... I don\'t remember. Who did I save?',
      },
      {
        id: 'reveal_4',
        character: 'Elena',
        text: 'That is for you to discover. Follow the path of echoes, and you will find the truth...',
        nextDialogueId: 'reveal_5'
      },
      {
        id: 'reveal_5',
        character: 'Elena',
        text: 'But be warned - some memories are better left buried. The choice is yours.',
        choices: [
          { id: 'choice_3', text: 'I will find the truth, no matter what.', nextSceneId: 'city_arrival' },
          { id: 'choice_4', text: 'Maybe some things should stay forgotten...', nextSceneId: 'forest_retreat' },
        ]
      }
    ]
  },
  'forest_confrontation': {
    id: 'forest_confrontation',
    name: 'The Confrontation',
    environment: 'forest',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'conf_1',
        character: 'Elena',
        text: '(steps forward, illuminated by moonlight) Patience, lost one. Anger will only cloud your memories further.',
      },
      {
        id: 'conf_2',
        character: 'You',
        text: 'My memories? What do you know about my memories?',
      },
      {
        id: 'conf_3',
        character: 'Elena',
        text: 'Everything. But understanding comes only to those who seek with their heart, not their fury.',
        choices: [
          { id: 'choice_5', text: '...You\'re right. Please, help me understand.', nextSceneId: 'forest_reveal' },
          { id: 'choice_6', text: 'I\'ll find my own way.', nextSceneId: 'forest_retreat' },
        ]
      }
    ]
  },
  'forest_retreat': {
    id: 'forest_retreat',
    name: 'The Retreat',
    environment: 'forest',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'retreat_1',
        character: 'Elena',
        text: '(nods slowly) Perhaps you are right. But know this - the memories will find you, whether you seek them or not.',
      },
      {
        id: 'retreat_2',
        character: 'Narrator',
        text: 'As Elena fades into the darkness, you feel a strange pull toward the distant city lights...',
        choices: [
          { id: 'choice_7', text: 'Follow the lights to the city', nextSceneId: 'city_arrival' },
        ]
      }
    ]
  },
  'city_arrival': {
    id: 'city_arrival',
    name: 'City of Echoes',
    environment: 'city',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'city_1',
        character: 'Narrator',
        text: 'The city rises before you like a memory from a dream - familiar, yet distant.',
      },
      {
        id: 'city_2',
        character: 'You',
        text: 'This place... I know these streets. But how?',
      },
      {
        id: 'city_3',
        character: 'Street Vendor',
        text: 'Hey, you alright? You look like you\'ve seen a ghost.',
        choices: [
          { id: 'choice_8', text: 'I\'m fine. Just... remembering things.', nextSceneId: 'city_explore' },
          { id: 'choice_9', text: 'Actually, can you help me? I\'m looking for someone.', nextSceneId: 'city_help' },
        ]
      }
    ]
  },
  'city_explore': {
    id: 'city_explore',
    name: 'Streets of Memory',
    environment: 'city',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'explore_1',
        character: 'Street Vendor',
        text: 'Memories, huh? That\'s funny. This city has a way of bringing them back.',
      },
      {
        id: 'explore_2',
        character: 'You',
        text: 'What do you mean?',
      },
      {
        id: 'explore_3',
        character: 'Street Vendor',
        text: 'They say on nights like this, when the fog rolls in, you can see glimpses of the past. Lives that were lived here.',
        nextDialogueId: 'explore_4'
      },
      {
        id: 'explore_4',
        character: 'Street Vendor',
        text: 'There\'s an old apartment on Willow Street. 4B. Sometimes, people see lights there... even though it\'s been empty for years.',
        choices: [
          { id: 'choice_10', text: 'I\'ll check it out.', nextSceneId: 'apartment_entrance' },
          { id: 'choice_11', text: 'Thank you for the warning. I should go.', nextSceneId: 'city_night_walk' },
        ]
      }
    ]
  },
  'city_help': {
    id: 'city_help',
    name: 'Seeking Answers',
    environment: 'city',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'help_1',
        character: 'Street Vendor',
        text: 'Looking for someone? In this city? That\'s like searching for a memory in fog.',
      },
      {
        id: 'help_2',
        character: 'You',
        text: 'I don\'t even know who I\'m looking for. I just... feel like I need to find something. Someone.',
      },
      {
        id: 'help_3',
        character: 'Street Vendor',
        text: '(studies you closely) You know what? You remind me of someone. There was a person who lived in that old apartment on Willow Street. Always searching for something.',
        choices: [
          { id: 'choice_12', text: 'Tell me more about this person.', nextSceneId: 'city_explore' },
          { id: 'choice_13', text: 'I should go there. Now.', nextSceneId: 'apartment_entrance' },
        ]
      }
    ]
  },
  'apartment_entrance': {
    id: 'apartment_entrance',
    name: 'The Old Apartment',
    environment: 'interior',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'apt_1',
        character: 'Narrator',
        text: 'The building stands before you, weathered by time and forgotten by most. But something draws you to apartment 4B.',
      },
      {
        id: 'apt_2',
        character: 'You',
        text: '(climbing the stairs) Each step feels like a memory returning...',
      },
      {
        id: 'apt_3',
        character: 'Narrator',
        text: 'As you reach the door, you see light seeping from underneath. Someone - or something - is inside.',
        choices: [
          { id: 'choice_14', text: 'Knock on the door', nextSceneId: 'apartment_meeting' },
          { id: 'choice_15', text: 'Open the door slowly', nextSceneId: 'apartment_discovery' },
        ]
      }
    ]
  },
  'city_night_walk': {
    id: 'city_night_walk',
    name: 'Night Walk',
    environment: 'city',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'walk_1',
        character: 'Narrator',
        text: 'You wander through the empty streets, each corner revealing fragments of forgotten moments.',
      },
      {
        id: 'walk_2',
        character: 'You',
        text: '(A vision flashes before you - a woman laughing, a child playing, a promise made)',
      },
      {
        id: 'walk_3',
        character: 'Narrator',
        text: 'The visions lead you inexorably toward an old apartment building on Willow Street.',
        choices: [
          { id: 'choice_16', text: 'Enter the building', nextSceneId: 'apartment_entrance' },
        ]
      }
    ]
  },
  'apartment_meeting': {
    id: 'apartment_meeting',
    name: 'The Encounter',
    environment: 'interior',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'meet_1',
        character: 'Voice Inside',
        text: 'The door is open. It\'s been waiting for you.',
      },
      {
        id: 'meet_2',
        character: 'You',
        text: '(pushes open the door) Who are you? Why does this place feel so familiar?',
      },
      {
        id: 'meet_3',
        character: 'Old Woman',
        text: '(sitting by the window) Because you lived here. Long ago, before you chose to forget.',
        choices: [
          { id: 'choice_17', text: 'Tell me everything.', nextSceneId: 'final_revelation' },
          { id: 'choice_18', text: 'I\'m not ready for this.', nextSceneId: 'apartment_discovery' },
        ]
      }
    ]
  },
  'apartment_discovery': {
    id: 'apartment_discovery',
    name: 'The Discovery',
    environment: 'interior',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'disc_1',
        character: 'Narrator',
        text: 'The apartment is filled with photographs, letters, and objects from a life you cannot remember.',
      },
      {
        id: 'disc_2',
        character: 'You',
        text: '(picks up a photograph) This woman... this child... I know them.',
      },
      {
        id: 'disc_3',
        character: 'Old Woman',
        text: '(appears behind you) Your wife. Your daughter. They\'re the reason you chose to forget.',
        choices: [
          { id: 'choice_19', text: 'What happened to them?', nextSceneId: 'final_revelation' },
        ]
      }
    ]
  },
  'final_revelation': {
    id: 'final_revelation',
    name: 'The Truth',
    environment: 'interior',
    timeOfDay: 'dawn',
    dialogues: [
      {
        id: 'final_1',
        character: 'Old Woman',
        text: 'Five years ago, there was an accident. You survived. They did not.',
      },
      {
        id: 'final_2',
        character: 'You',
        text: '(tears streaming) I remember now... I was driving. The rain. The headlights...',
      },
      {
        id: 'final_3',
        character: 'Old Woman',
        text: 'The guilt was too much. You made a choice to forget, to escape the pain. But memories have a way of returning.',
      },
      {
        id: 'final_4',
        character: 'Elena',
        text: '(appearing in the doorway) And now you must choose again. Do you keep the memories, painful as they are? Or do you let them fade once more?',
        choices: [
          { id: 'choice_20', text: 'I choose to remember. They deserve that much.', nextSceneId: 'ending_acceptance' },
          { id: 'choice_21', text: 'I can\'t do this. Let me forget again.', nextSceneId: 'ending_forget' },
        ]
      }
    ]
  },
  'ending_acceptance': {
    id: 'ending_acceptance',
    name: 'Acceptance',
    environment: 'exterior',
    timeOfDay: 'dawn',
    dialogues: [
      {
        id: 'accept_1',
        character: 'Elena',
        text: 'A wise choice. Memory is the bridge between past and future. Without it, we are lost.',
      },
      {
        id: 'accept_2',
        character: 'Narrator',
        text: 'As the sun rises, you feel the weight of your memories - but also their warmth. The pain is there, but so is the love.',
      },
      {
        id: 'accept_3',
        character: 'You',
        text: 'Thank you. For giving me back what I lost. I think... I think I can finally move forward now.',
      },
      {
        id: 'accept_4',
        character: 'Narrator',
        text: 'THE END - You have chosen the path of remembrance. Sometimes the hardest truths are the ones that set us free.',
        choices: [
          { id: 'choice_22', text: 'Play Again', nextSceneId: 'intro_forest' },
        ]
      }
    ]
  },
  'ending_forget': {
    id: 'ending_forget',
    name: 'Oblivion',
    environment: 'exterior',
    timeOfDay: 'night',
    dialogues: [
      {
        id: 'forget_1',
        character: 'Elena',
        text: '(nods slowly) As you wish. The gates of memory will close once more.',
      },
      {
        id: 'forget_2',
        character: 'Narrator',
        text: 'The world begins to fade. Faces blur, voices grow distant. You feel yourself drifting away from the truth.',
      },
      {
        id: 'forget_3',
        character: 'Old Woman',
        text: '(whispering) Perhaps next time, you will be ready.',
      },
      {
        id: 'forget_4',
        character: 'Narrator',
        text: 'THE END - You have chosen the path of oblivion. But remember: some doors, once closed, can never be opened again... or can they?',
        choices: [
          { id: 'choice_23', text: 'Try Again', nextSceneId: 'intro_forest' },
        ]
      }
    ]
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  currentSceneId: 'intro_forest',
  currentDialogueIndex: 0,
  isDialogueActive: true,
  playerPosition: [0, 0, 5],
  gameProgress: 0,
  visitedScenes: [],

  setCurrentScene: (sceneId) => {
    const { visitedScenes } = get();
    set({
      currentSceneId: sceneId,
      currentDialogueIndex: 0,
      isDialogueActive: true,
      visitedScenes: visitedScenes.includes(sceneId) ? visitedScenes : [...visitedScenes, sceneId]
    });
  },

  advanceDialogue: () => {
    const { currentSceneId, currentDialogueIndex } = get();
    const scene = GAME_SCENES[currentSceneId];
    if (!scene) return;

    const currentDialogue = scene.dialogues[currentDialogueIndex];
    
    if (currentDialogue.choices) {
      // Wait for choice - don't advance automatically
      return;
    }

    if (currentDialogueIndex < scene.dialogues.length - 1) {
      // Check if there's a nextDialogueId
      if (currentDialogue.nextDialogueId) {
        const nextIndex = scene.dialogues.findIndex(d => d.id === currentDialogue.nextDialogueId);
        if (nextIndex !== -1) {
          set({ currentDialogueIndex: nextIndex });
          return;
        }
      }
      set({ currentDialogueIndex: currentDialogueIndex + 1 });
    } else {
      set({ isDialogueActive: false });
    }
  },

  selectChoice: (choice) => {
    set({ isDialogueActive: false });
    setTimeout(() => {
      get().setCurrentScene(choice.nextSceneId);
    }, 500);
  },

  setPlayerPosition: (position) => set({ playerPosition: position }),

  startDialogue: () => set({ isDialogueActive: true, currentDialogueIndex: 0 }),

  endDialogue: () => set({ isDialogueActive: false }),
}));
