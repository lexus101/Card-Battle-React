import { create } from 'zustand';
import { Enemy, Player } from '../Objects/Entity';
import { GameManager } from '../Objects/GameManager';
import { CardLibrary } from '../engine/cardEffects';

// Define your cards with "Effect" strings or logic keys

const player = new Player('player', 100, [
  CardLibrary.BASIC_ATTACK, 
  CardLibrary.BASIC_ATTACK, 
  CardLibrary.SHIELD,
  CardLibrary.VAMPIRE
])
const e2 = new Enemy('e1', 10)
e2.initializeIntents([
    {'card':CardLibrary.BASIC_ATTACK, 'target':player, 'time': 2},
    {'card':CardLibrary.SHIELD, 'target':e2, 'time': 3}, 
  ]
)

const enemies = [[e2]]

export const useGameStore = create((set) => ({
  // --- STATE ---
  player: player,
  enemies: enemies,
  gameManager: new GameManager(player, enemies),
}));