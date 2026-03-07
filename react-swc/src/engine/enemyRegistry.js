import { Enemy } from "../Objects/Entity";
const response = await fetch('./Data/enemies.json')
export const EnemyRegistry = await response.json()
console.log(EnemyRegistry)

export function createEnemy(type) {
  const data = EnemyRegistry[type];
  if (!data) throw new Error(`Enemy type ${type} not found!`);
  
  // Return a new instance using the data
  const enemy = new Enemy(data.name, data.hp, data.image);
  enemy.initializeIntents(data.pattern);
  return enemy
}