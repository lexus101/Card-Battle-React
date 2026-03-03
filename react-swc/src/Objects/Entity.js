import { LoopPattern } from "./mobLogic";
import { makeAutoObservable, makeObservable, observable, action } from "mobx";
import { EFFECT_ACTIONS } from "../engine/cardEffects";
import { CardLibrary } from "../engine/cardEffects";

export class Entity {
  constructor(name, health, image) {
    this.name = name;
    this.health = health;
    this.maxHealth = health;
    this.shield = 0;
    this.intents = [];
    this.alive = true;
    this.image = image

    makeObservable(this, {
      health: observable,
      shield: observable,
      intents: observable,
      alive: observable,
      takeDamage: action,
      addShield: action,
      checkAlive: action,
    });

  }
  takeDamage(amount) {
    if (this.shield >= amount){
     this.shield -= amount;
    } else{
     amount -= this.shield;
     this.shield = 0;
     this.health -= amount;
    }
  }
  modifyHealth(amount) {this.health = Math.min(this.health + amount, this.maxHealth) }
  addShield(amount) {this.shield += amount; }
  checkAlive() {if (this.health <= 0){this.alive = false;}}
  playCard(target, card){
    card.effects.forEach(effect => {
        const effect_action = EFFECT_ACTIONS[effect.type];
        if (effect_action) {
            if (effect.target == "target"){ effect_action(target, effect.value); }
            else { effect_action(this, effect.value); }
        }
    });        
  }
}



export class Player extends Entity{
    constructor(name, health, image, deck) {
        super(name, health, image);
        this.deck = new Deck(deck);
        
        makeObservable(this, {
            deck: observable,
            playCard: action,
            drawCard: action
        });
        this.drawCard(4);
    }
    addGameManager(gameManager){ this.gameManager = gameManager; }
    playCard(target, card, idx) {
        super.playCard(target, card);
        this.deck.hand.splice(idx, 1);
        this.intents.splice(0, 1);
    }
    drawCard(n){ for (let i = 0; i<n; i++) this.deck.drawCard() }

}
class Deck {
  constructor(initDeck){
    initDeck = initDeck.map(c => CardLibrary[c])
    this.hand = [];
    this.drawn = initDeck;
    this.discard = [];
    this.allCards = initDeck;
    makeAutoObservable(this);
  }

  drawCard(){
    let newCardIdx = Math.floor(Math.random()*this.drawn.length)
    this.hand.push(this.drawn[newCardIdx])
  }
}



export class Enemy extends Entity {
    constructor(name, health, image){
        super(name, health, image);
        makeObservable(this, {
            playCard: action,
            initializeIntents: action,
            consumeIntent: action
        });
    }

    initializeIntents(possibleMoves) {
        this.intentGenerator = new LoopPattern(possibleMoves);
        makeObservable(this, {intentGenerator: observable})
        let lastTime = 0;
        // Pre-fill the window with 3 items
        for(let i = 0; i < 3; i++) {
            const intent = this.intentGenerator.generateNext(lastTime);
            this.intents.push(intent);
            lastTime = intent.time;
        }
    }
    consumeIntent() {
        this.intents.shift(); // Remove the used one
        
        // Generate a new one to keep the window at 3
        const lastIntent = this.intents[this.intents.length - 1];
        const newIntent = this.intentGenerator.generateNext(lastIntent.time);
        this.intents.push(newIntent);
    }
    playCard(target, card){
        super.playCard(target, CardLibrary[card]);
        this.consumeIntent()
    }


}