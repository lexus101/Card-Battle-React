import { makeAutoObservable } from "mobx";
import { getRandomLootChoices } from "../engine/generateLoot";

export class GameManager {
  constructor(player, enemies, restartCallback = null) {
    this.player = player;
    this.enemies = enemies;
    this.enemies_index = 0;

    this.turn = 1;
    this.energy = 3;
    this.maxEnergy = 3;
    this.cardsPerTurn = 5;
    this.playerTurn = true;

    this.lootOpen = false;
    this.pendingLoot = [];
    this.runComplete = false;
    this.runFailed = false;
    this.current_view = "chapter-view";
    this.currentLevelId = null;

    
    this.chapterProgress = {
    levels: {
    "darkened-grave": { status: "available" },
    "goblin-huts": { status: "available" },
    "monster-tunnel": { status: "available" },
    "secret-passage": { status: "available" },
    "dragon-den": { status: "locked" },
      }
    };

    this.restartCallback = restartCallback;


    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentEnemies() { return this.enemies[this.enemies_index] || [];}

  startBattle() { this.turn = 1; this.startPlayerTurn() }

  startPlayerTurn() {
    this.player.deck.discardHandAll();
    this.playerTurn = true;
    this.energy = this.maxEnergy;
    this.player.drawCard(this.cardsPerTurn);
    // this.updateGame();
  }

  playCard(target, card_idx) {
    if (!this.playerTurn) return;
    if (this.lootOpen || this.runComplete || this.runFailed) return;

    const card = this.player.deck.hand[card_idx];
    if (!card) return;

    const baseCost = card.energy_cost ?? 1;

    // 先记录这张牌打出前，玩家身上有没有旧的减费buff
    const hadReductionBeforePlay = this.player.costReductionCharges > 0;
    const reductionBeforePlay = hadReductionBeforePlay
      ? this.player.costReductionAmount
      : 0;

    const finalCost = Math.max(0, baseCost - reductionBeforePlay);

    if (this.energy < finalCost) return;

    this.energy -= finalCost;

    // 这里 Rush / 其他牌的效果才会结算
    this.player.playCard(target, card, card_idx);

    // 只消耗“这张牌打出前就已经存在”的减费次数
    if (hadReductionBeforePlay) {
      this.player.costReductionCharges -= 1;

      if (this.player.costReductionCharges <= 0) {
        this.player.costReductionCharges = 0;
        this.player.costReductionAmount = 0;
      }
    }

    this.updateGame();
  }

endTurn() {
  if (!this.playerTurn) return;
  if (this.lootOpen || this.runComplete || this.runFailed) return;

  this.playerTurn = false;

  if (this.player.deck?.discardHandAll) {
    this.player.deck.discardHandAll();
  }

  this.runEnemyTurn();
  this.updateGame();

  if (!this.player.alive) {
    this.runFailed = true;
    return;
  }

  // 先结算玩家回合末效果
  this.player.triggerBurnTick();
  this.player.triggerRegenerationEndTurn();
  this.player.decayShield();

  // 然后如果开 loot / complete，就停
  if (this.lootOpen || this.runComplete) return;

  this.turn += 1;
  this.startPlayerTurn();
}

runEnemyTurn() {
  this.currentEnemies.forEach((e) => {
    if (!e.alive) return;
    if (!e.intents || e.intents.length === 0) return;

    const matchTarget = {
      player: this.player,
      self: e,
    };

     // 敌人行动前触发decay shield
    if (e.alive) {
      e.decayShield();
    }
    


    e.intents.forEach((intent) => {
      const target = matchTarget[intent.target]
       if (!target) return;
      e.playCard(target, intent.card)
    })
    e.getNextIntent()
    
     // 敌人行动前触后regen
      if (e.alive) {
      e.triggerBurnTick();
      e.triggerRegenerationEndTurn();
      

    }
   
  //   let safety = 10; // 防止死循环
  //   let chainMode = false;

  //   while (e.alive && e.intents.length > 0 && safety > 0) {
  //     safety--;

  //     const intent = e.intents[0];
  //     if (!intent) break;

  //     // 先头是 1：正常放一招，然后结束
  //     if (!chainMode && intent.time === 1) {
  //       const target = matchTarget[intent.target];
  //       if (!target) break;

  //       e.playCard(target, intent.card);
  //       break;
  //     }

  //     // 先头是 0：进入连锁模式
  //     if (intent.time === 0) {
  //       chainMode = true;

  //       const target = matchTarget[intent.target];
  //       if (!target) break;

  //       e.playCard(target, intent.card);
  //       continue;
  //     }

  //     // 连锁模式中遇到 1：放掉并结束
  //     if (chainMode && intent.time === 1) {
  //       const target = matchTarget[intent.target];
  //       if (!target) break;

  //       e.playCard(target, intent.card);
  //       break;
  //     }

  //     // 遇到大于1：不放，只减1，然后结束
  //     if (intent.time > 1) {
  //       intent.time -= 1;
  //       break;
  //     }

  //     break;
  //   }
   });
}

  completeCurrentLevel() {
    if (!this.currentLevelId) return;

    const level = this.chapterProgress.levels[this.currentLevelId];
    if (!level) return;

    level.status = "completed";

    const allNormalCleared =
      this.chapterProgress.levels["darkened-grave"].status === "completed" &&
      this.chapterProgress.levels["goblin-huts"].status === "completed" &&
      this.chapterProgress.levels["monster-tunnel"].status === "completed";

    if (allNormalCleared) {
      this.chapterProgress.levels["dragon-den"].status = "available";
    }
  }

  updateGame() {
    const allEnemyDead =
    this.currentEnemies.length > 0 &&
    this.currentEnemies.every((e) => !e.alive);

    if (!allEnemyDead) return;

    // 无论是不是最后一波，先给 loot
    this.pendingLoot = getRandomLootChoices(this.enemies_index, 3);
    this.lootOpen = true;
  }

  claimLoot(card) {
     if (card) {
    this.player.deck.discardPile.push({ ...card });
    }

    this.pendingLoot = [];
    this.lootOpen = false;

    const isLastWave = this.enemies_index >= this.enemies.length - 1;
    if (isLastWave) {
      this.runComplete = true;
      return;
    }

    this.enemies_index += 1;
    this.startBattle();
  }

  skipLoot() {
    this.pendingLoot = [];
    this.lootOpen = false;

    const isLastWave = this.enemies_index >= this.enemies.length - 1;
    if (isLastWave) {
      this.runComplete = true;
      return;
    }

    this.enemies_index += 1;
    this.startBattle();
  }

  restartRun() {
    if (this.restartCallback) {
      this.restartCallback();
    }
  }

  nextLevel() {
    this.completeCurrentLevel();
    this.current_view = "chapter-view";
    this.runComplete = false;
    this.runFailed = false;
    this.lootOpen = false;
    this.pendingLoot = [];
    this.enemies_index = 0;
  }
}