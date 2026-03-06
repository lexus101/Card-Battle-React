import { makeAutoObservable } from "mobx";
import { CardLibrary } from "../engine/cardEffects";

function getLootChoicesForWave(waveIndex) {
  // starter version: customize later
  const lootPools = [
    ["STRIKE", "DEFEND", "PATCH_UP"],
    ["Fireball", "Water Flow", "Thunderbolt"],
    ["Ice Spell", "Growth", "Fire Wall"],
  ];

  const ids = lootPools[waveIndex] || ["Strike", "Defend", "Patch up"];

  return ids
    .map((id) => CardLibrary[id])
    .filter(Boolean)
    .map((card) => ({ ...card }));
}

export class GameManager {
  constructor(player, enemies, restartCallback = null) {
    this.time = 0;
    this.player = player;
    this.enemies = enemies;
    this.enemies_index = 0;

    this.lootOpen = false;
    this.pendingLoot = [];
    this.runComplete = false;
    this.runFailed = false;

    this.restartCallback = restartCallback;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentEnemies() {
    return this.enemies[this.enemies_index] || [];
  }

  progressTime(t) {
    if (this.lootOpen || this.runComplete || this.runFailed) return;

    for (let i = 0; i < t + 1; i++) {
      if (i !== 0) this.time += 1;

      this.runIntents();
      this.updateGame();

      if (this.lootOpen || this.runComplete || this.runFailed) break;
    }
  }

  runIntents() {
    const pi = this.player.intents?.[0];
    if (pi && pi.time <= this.time) {
      this.player.playCard(pi.target, this.player.deck.hand[pi.card_idx], pi.card_idx);
      this.player.intents.shift();
    }

    this.currentEnemies.forEach((enemy) => {
      if (!enemy.alive) return;

      const ei = enemy.intents?.[0];
      const matchTarget = {
        player: this.player,
        self: enemy,
      };

      if (ei && ei.time <= this.time) {
        enemy.playCard(matchTarget[ei.target], ei.card);
        enemy.intents.shift();
      }
    });
  }

  updateGame() {
    this.player.checkAlive();
    this.currentEnemies.forEach((e) => e.checkAlive());

    if (!this.player.alive) {
      this.runFailed = true;
      return;
    }

    const allEnemyDead =
      this.currentEnemies.length > 0 &&
      this.currentEnemies.every((e) => !e.alive);

    if (!allEnemyDead) return;

    this.time = 0;

    const isLastWave = this.enemies_index >= this.enemies.length - 1;

    if (isLastWave) {
      this.runComplete = true;
      return;
    }

    this.pendingLoot = getLootChoicesForWave(this.enemies_index);
    this.lootOpen = true;
  }

  claimLoot(card) {
    if (!card) return;

    // add reward to discard pile
    this.player.deck.discardPile.push({ ...card });

    this.pendingLoot = [];
    this.lootOpen = false;
    this.enemies_index += 1;
  }

  skipLoot() {
    this.pendingLoot = [];
    this.lootOpen = false;
    this.enemies_index += 1;
  }

  intentAction(target, card_idx) {
    if (this.lootOpen || this.runComplete || this.runFailed) return;

    const card = this.player.deck.hand[card_idx];
    if (!card) return;

    this.player.intents.push({
      time: this.time + card.time_cost,
      target,
      card_idx,
    });

    this.progressTime(card.time_cost);
  }

  drawCard(n) {
    if (this.lootOpen || this.runComplete || this.runFailed) return;
    this.player.drawCard(n);
    this.progressTime(1);
  }

  restartRun() {
    if (this.restartCallback) {
      this.restartCallback();
    }
  }
}