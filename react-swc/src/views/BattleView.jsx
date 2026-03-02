import React from 'react';
import { useState } from 'react';
import { useGameStore } from '../store/useBattleStore.js'; // Adjust path
import './BattleView.css';
import { observer } from "mobx-react"

<<<<<<< Updated upstream
// Enemy unit subcomponent (now only contains the card, no intents)
const EnemyUnit = ({ onPress, enemy }) => {
  // Calculate health percentage (assuming maxHealth exists, fallback to 100)
  const healthPercent = (enemy.health / (enemy.maxHealth || 100)) * 100;

=======
const EnemyUnit = observer(({ onPress, enemy }) => {
>>>>>>> Stashed changes
  return (
    <div onClick={onPress} className='enemyCard'>
      <img src={enemy.image} alt="Enemy" className='enemyImg' />
      <div className='statsOverlay'>
        {/* Health Bar */}
        <div className="stat-bar health-bar">
          <div 
            className="bar-fill" 
            style={{ width: `${healthPercent}%` }}
          ></div>
          <span className="bar-text">{enemy.health} / {enemy.maxHealth || 100}</span>
        </div>
        {/* Shield (optional, can also be a bar) */}
        <p>Shield: {enemy.shield || 0}</p>
      </div>
<<<<<<< Updated upstream
    </div>
  );
};

export const BattleView = () => {
  const player = useGameStore(s => s.entities.player);
  const enemies = useGameStore(s => s.entities.enemies[0]); // Assuming array of enemies
  const playerDrawCard = useGameStore(s => s.playerDrawCard);
  const playerUsedCard = useGameStore(s => s.playerUsedCard);
  const playCard = useGameStore(s => s.playCard);
  const player2 = useGameStore(s => s.player);
=======
      
      {/* Bookmark Intent Icons */}
      <div className='intentBar'>
        {enemy.intents.slice(0, 3).map((move, i) => (
          <div key={i} className='bookmark' title={move.card.name}>
            {move.round}
          </div>
        ))}
      </div>
    </div>
  );
});
>>>>>>> Stashed changes

export const BattleView = observer(() => {
  const player = useGameStore(s => s.player);
  const enemies = useGameStore(s => s.enemies[0]);
  const [selectedCardIdx, setSelectedCardIdx] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(1); // Example turn state

  const handleTargetSelect = (target) => {
<<<<<<< Updated upstream
    if (selectedCardIdx !== null) {
      playCard(player, target, selectedCardIdx);
      playerUsedCard();
      setSelectedCardIdx(null);
    }
  };

  // Placeholder synergy value (replace with actual store data)
  const synergy = 3;
=======
    if (selectedCardIdx !== null) { player.playCard(target, selectedCardIdx); }
  };

  const playerDrawCard = () => { player.drawCard(2) }


>>>>>>> Stashed changes

  return (
    <div className='battleContainer'>
      {/* Top Bar: Synergy (left) and Turn (center) */}
      <div className='top-bar'>
        <div className='synergy'>
          <span className='synergy-icon'>⚡</span>
          <span className='synergy-value'>Synergy: {synergy}</span>
        </div>
        <div className='turn-indicator'>Turn {currentTurn}</div>
        <div className='top-right-placeholder'>{/* optional right element */}
            <button className='clickable setting'>Setting</button>
            </div>
        
      </div>

      {/* Enemies Row - each enemy now in a wrapper with intents on side */}
      <div className='enemy-row-wrapper'>
        {enemies.map((enemy, idx) => (
<<<<<<< Updated upstream
          <div key={idx} className='enemy-wrapper'>
            <EnemyUnit onPress={() => handleTargetSelect(['enemies', idx])} enemy={enemy} />
            {/* Intents moved outside card, to the side */}
            <div className='enemy-intents'>
              {enemy.intents.slice(0, 3).map((move, i) => (
                <div key={i} className='intent-icon' title={move.description}>
                  {move.icon}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    {/* Bottom Layout */}
<div className='footerRow'>
  {/* Left Section: Deck above, then Player + Refresh side by side */}
  <div className='player-area'>
    <button className='clickable deck-button'>Deck</button>
    <div className='player-row'>
      <div onClick={() => handleTargetSelect(['player', 0])} className='playerSection'>
        <img src={player.image} alt="Player" className='playerImg' />
        <div className='statsOverlay'>
          <div className="stat-bar health-bar">
            <div className="bar-fill" style={{ width: `${(player.health / 100) * 100}%` }}></div>
            <span className="bar-text">{player.health} / 100</span>
=======
          <EnemyUnit onPress={() => handleTargetSelect(enemy)} key={idx} enemy={enemy} />
        ))}
      </div>

      {/* Bottom Layout */}
      <div className='footerRow'>
        {/* Player Section */}
        <div onClick={() => handleTargetSelect(['player', 0])} className='playerSection'>
          <img src={player.image} alt="Player" className='playerImg' />
          <div className='statsOverlay'>
            <p>Health: {player.health}</p>
            <p>Shield: {player.shield}</p>
>>>>>>> Stashed changes
          </div>
          <p>Shield: {player.shield}</p>
        </div>
      </div>
      <button onClick={playerDrawCard} className='clickable refresh-button'>Refresh Hand</button>
    </div>
  </div>

  {/* Hand Section */}
<div className='handRow'>
  {player.deck.hand.map((card, idx) => (
    <button
      key={idx}
      onClick={() => setSelectedCardIdx(idx)}
      className={`card ${idx === selectedCardIdx ? 'selectedCard' : ''}`}
    >
      <div className='card-header'>{card.name}</div>
      <div className='card-image'>
        <img src={card.image || 'default-card.jpg'} alt={card.name} />
      </div>
      <div className='card-description'>{card.description || 'No description'}</div>
      <div className='card-traits-left'>
        {card.traits?.slice(0, 2).map((trait, i) => (
          <span key={i} className='trait-icon' title={trait.name}>{trait.icon}</span>
        ))}
      </div>
      <div className='card-traits-right'>
        {card.traits?.slice(2, 4).map((trait, i) => (
          <span key={i} className='trait-icon' title={trait.name}>{trait.icon}</span>
        ))}
      </div>
    </button>
  ))}
</div>

  {/* Right Section: Draw Card button only */}
  <div className='draw-area'>
    <button onClick={playerDrawCard} className='clickable draw-button'>Draw Card</button>
  </div>
</div>
    </div>
  );
});