// data/cardLibrary.js
import cards from "../data/cards.json"
export const CardLibrary = cards


export const EFFECT_ACTIONS = {
  DAMAGE: (target, value) => target.takeDamage(value),
  HEAL: (target, value) => target.modifyHealth(value), // Or addHeal
  SHIELD: (target, value) => target.addShield(value),
  DRAW: (target, value) => target.drawCard(value),
  APPLY_BURN: (target, value) => target.onFire += value,
  APPLY_WET: (target, value) => target.onWet += value,
  APPLY_ELEC: (target, value) => target.onElec += value,
  DAMAGE_FIRE: (target, value) => target.takeDamage(value, 'fire'),
  DAMAGE_WATER: (target, value) => target.takeDamage(value, 'water'),
  DAMAGE_ELEC: (target, value) => target.takeDamage(value, 'elec'),
  FREEZE: (target, value) => target.isFrozen = true,
  CHARGE: (target, value) => target.charge += value,
};