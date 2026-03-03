// data/cardLibrary.js
export const CardLibrary = {
  STRIKE: {
    id: 'STRIKE',
    name: "Strike",
    description:"Deal 5 dmg to target.",
    image: "/Strike.png",
    time_cost: 1,
    effects: [
      { type: 'DAMAGE', value: 5, target: 'target' }
    ]
  },
  DEFEND: {
    id: 'DEFEND',
    name: "Defend",
    description:"Gain 8 Shield.",
    image: "/Defend.png",
    time_cost: 1,
    effects: [
      { type: 'SHIELD', value: 8, target: 'target' }
    ]
  },
  PATCH_UP: {
    id: 'PATCH_UP',
    name: "Patch Up",
    description:"Heal 4 hp for target.",
    image: "/Patch Up.png",
    time_cost: 1,
    effects: [
      { type: 'HEAL', value: 4, target: 'target' }
    ]
  },
  QUICK_STEP: {
    id: 'QUICK_STEP',
    name: "Quick Step",
    description:"Gain 3 Shield. Then Draw 1.",
    image: "/Quick Step.png",
    time_cost: 0,
    effects: [
      { type: 'SHIELD', value: 3, target: 'target' },
      { type: 'DRAW', value: 1, target: 'self' }
    ]
  },
  FOCUS: {
    id: 'FOCUS',
    name: "Focus",
    description:"Draw 2.",
    image: "/Focus.png",
    time_cost: 0,
    effects: [
      { type: 'DRAW', value: 2, target: 'self' }
    ]
  }

};


export const EFFECT_ACTIONS = {
  DAMAGE: (target, value) => target.takeDamage(value),
  HEAL: (target, value) => target.takeDamage(-value), // Or addHeal
  SHIELD: (target, value) => target.addShield(value),
  DRAW: (target, value) => target.drawCard(value)
};