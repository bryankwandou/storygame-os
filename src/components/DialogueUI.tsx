"use client";

import { useGameStore, GAME_SCENES } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";

export default function DialogueUI() {
  const { currentSceneId, currentDialogueIndex, selectChoice, advanceDialogue } = useGameStore();
  const scene = GAME_SCENES[currentSceneId];

  if (!scene) return null;

  const currentDialogue = scene.dialogues[currentDialogueIndex];

  if (!currentDialogue) return null;

  return (
    <div className="game-ui">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDialogue.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="dialogue-box">
            <div className="dialogue-name">{currentDialogue.character}</div>
            <div className="dialogue-text">{currentDialogue.text}</div>
          </div>

          {currentDialogue.choices && currentDialogue.choices.length > 0 ? (
            <motion.div
              className="choice-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentDialogue.choices.map((choice, index) => (
                <motion.button
                  key={choice.id}
                  className="choice-button"
                  onClick={() => selectChoice(choice)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {index + 1}. {choice.text}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <div className="choice-container" style={{ alignItems: "center" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}
              >
                Press SPACE or ENTER to continue...
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Scene indicator */}
      <motion.div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "rgba(255,255,255,0.7)",
          fontSize: "12px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{scene.name}</div>
        <div style={{ opacity: 0.6 }}>
          {scene.environment.toUpperCase()} • {scene.timeOfDay.toUpperCase()}
        </div>
      </motion.div>
    </div>
  );
}
