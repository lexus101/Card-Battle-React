import { create } from 'zustand';
import { Player,Enemy } from '../Objects/Entity';
import { GameManager } from '../Objects/GameManager';
import { createEnemy } from '../engine/enemyRegistry';

function buildBattleState(set) {
  const player = new Player('player', 20, null, [
    "STRIKE",
    "STRIKE",
    "QUICK_STRIKE",
    "DOUBLE_STRIKE",
    "HEAVY_STRIKE",
    "FIVEFOLD_STRIKE",
    "DEFEND",
    "RUSH",
    "PATCH_UP",
    "FOCUS",
    "CHARGE",
    "ICE_SHARD",
    "LIGHTNING_STRIKE",
    "WATER_FLOW",
    "FIREBALL"
  ]);

  const g1 = createEnemy('GOBLIN');
  const g2 = createEnemy('GOBLIN');

  const s1 = createEnemy('SKELETON');
  const s2 = createEnemy('SKELETON');
  const s3 = createEnemy('SKELETON');
  const s4 = createEnemy('SKELETON');
  const s5 = createEnemy('SKELETON');

  const s6 = createEnemy('SKELETON');
  const v1 = createEnemy('VAMPIRE_BAT');
  const s7 = createEnemy('SKELETON');

  const enemies = [
    [g1, g2],
    [s1, s2, s3, s4, s5],
    [s6, v1, s7],
  ];

  const restartBattle = () => {
    set(buildBattleState(set));
  };

  const gameManager = new GameManager(player, enemies, restartBattle);

  return {
    player,
    enemies,
    gameManager,
    restartBattle,
  };
}

export const useGameStore = create((set) => ({
  ...buildBattleState(set),
}));