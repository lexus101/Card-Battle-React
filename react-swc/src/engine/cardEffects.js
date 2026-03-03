// data/cardLibrary.js
export const CardLibrary = {
  BASIC_ATTACK: {
    id: 'BASIC_ATTACK',
    name: "Basic Attack",
    time_cost: 1,
    effects: [{ type: 'DAMAGE', value: 3, target: 'target' }]
  },
  SHIELD: {
    id: 'BASIC_SHIELD',
    name: "Basic Shield",
    time_cost: 2,
    effects: [{ type: 'SHIELD', value: 6, target: 'target' }]
  },
  VAMPIRE: {
    id: 'VAMPIRE',
    name: "Vampire",
    time_cost: 2,
    effects: [
      { type: 'DAMAGE', value: 1, target: 'target' },
      { type: 'HEAL', value: 1, target: 'self' }
    ]
  }
};


export const EFFECT_ACTIONS = {
  DAMAGE: (target, value) => target.takeDamage(value),
  HEAL: (target, value) => target.takeDamage(-value), // Or addHeal
  SHIELD: (target, value) => target.addShield(value)
};