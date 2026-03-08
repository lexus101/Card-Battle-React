import { Enemy } from "../Objects/Entity";
import { LoopPattern, RandomPattern } from "../Objects/mobLogic";

const response = await fetch('./Data/enemies.json')
export const EnemyRegistry = await response.json()

const matchPatternType = {
  "Loop": LoopPattern,
  "Random": RandomPattern
}
export function createEnemy(type) {
  const data = EnemyRegistry[type];
  if (!data) throw new Error(`Enemy type ${type} not found!`);
  const pattern_type = matchPatternType[data.pattern_type ? data.pattern_type : "Loop"]
  // Return a new instance using the data
  const enemy = new Enemy(data.name, data.hp, data.image);
  enemy.initializeIntents(data.pattern, pattern_type);
  return enemy
}