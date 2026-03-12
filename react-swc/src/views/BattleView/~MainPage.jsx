import './css/BattleView.css';

import { useState } from 'react';
import { observer } from "mobx-react"

import { useGameStore } from '../../store/useBattleStore.js'; // Adjust path
import { LootView } from "./LootView.jsx";
import { RunCompleteView } from "./RunCompleteView.jsx";
import { EnemyUnit } from './EnemyUnit.jsx';
import { PlayerUnit } from './PlayerUnit.jsx';
import { HandCardView } from './HandCardView.jsx';




export const BattleView = observer(() => {
  const gameManager = useGameStore(s => s.gameManager);
  const player = gameManager.player
  const enemies = gameManager.enemies
  const current_enemies = enemies[gameManager.enemies_index] || [];
  const [selectedCard, setSelectedCard] = useState({"card":null, "idx":null});
  const [selectedTargets, setSelectedTargets] = useState({"targets":[], "idx":[]});

  

  const handleTargetSelect = (target, idx) => {
    if (selectedCard.card !== null) {
      setSelectedTargets((prev) => {
        const existingIndex = prev.idx.indexOf(idx);

        // If already selected, remove it
        if (existingIndex >= 0) {
          return {
            targets: prev.targets.filter((_, i) => i !== existingIndex),
            idx: prev.idx.filter((_, i) => i !== existingIndex),
          };
        }

        // Otherwise, add it
        let newTargets = [...prev.targets, target];
        let newTargetsIdx = [...prev.idx, idx];

        // Enforce max target limit
        if (newTargets.length > selectedCard.card.targets + player.stack.multiselect) {
          newTargets.shift();
          newTargetsIdx.shift();
        }
        // gameManager.playCard(target, selectedCardIdx);
        // setSelectedCardIdx(null);

        return { targets: newTargets, idx: newTargetsIdx };
      });
    }
  };

  const handleCardSelect = (card, idx) => {
    if (selectedCard.idx != idx){ 
      setSelectedCard({"card": card, "idx": idx}) 
      setSelectedTargets({"targets":[], "idx":[]})
    }
    else {
       setSelectedCard({"card":null, "idx": null})
       setSelectedTargets({"targets":[], "idx":[]})
    }
  }

  const handlePlayCard = () => {
    gameManager.playCard(selectedTargets.targets, selectedCard.idx);
    setSelectedCard({"card":null, "idx": null});
    setSelectedTargets({"targets":[], "idx":[]})
  }

  // Placeholder synergy value (replace with actual store data)
  const synergy = 3;




  return (
    <div
      className='battleContainer'
      // onClick={() => setSelectedCardIdx(null)}
    >
      {/* Top Bar: Synergy (left) and Turn (center) */}
      <div className='top-bar'>
        <div className='synergy'>
          <span className='synergy-icon'>⚡</span>
          <span className='synergy-value'>Synergy: {synergy}</span>
        </div>
        <div className='turn-indicator'> Turn {gameManager.turn} </div>
        <div className='top-right-placeholder'>{/* optional right element */}
            <button className='clickable setting'>Setting</button>
            </div>
        
      </div>

      {/* Enemies Row - each enemy now in a wrapper with intents on side */}
      <div className='enemy-row-wrapper'>
        {current_enemies.map((enemy, idx) => (
          <EnemyUnit key={idx + 1} onPress={() => handleTargetSelect(enemy, idx + 1)} enemy={enemy} enemy_idx={idx+1} selectedTargets={selectedTargets} />
        ))}
      </div>

      {/* Bottom Layout */}
      <div className='footerRow'>
          {/* Left Section: Deck above, then Player + Refresh side by side */}
          <PlayerUnit onPress={() => handleTargetSelect(player, 0)} player={player} selectedTargets={selectedTargets}></PlayerUnit>

          {/* Hand Section */}
          <button onClick={handlePlayCard} className="clickable refresh-button"> Play Card </button>
          <div className='handRow'>
            {player.deck.hand.map((card, idx) => (
              <HandCardView key={idx} onPress={() => handleCardSelect(card, idx)} player={player} card={card} card_idx={idx} selectedCard={selectedCard}></HandCardView>
            ))}
          </div>
          <button onClick={gameManager.endTurn} className="clickable refresh-button"> End Turn</button>
      </div>

      {/*  Game State Managing */}
      {gameManager.lootOpen && ( <LootView loot={gameManager.pendingLoot} onPick={(card)=>gameManager.claimLoot(card)} onSkip={()=>gameManager.skipLoot()} />)}
      {gameManager.runComplete && ( <RunCompleteView title="Run Complete" buttonText="Next Level" onRestart={() => gameManager.nextLevel()} />)}
      {gameManager.runFailed && ( <RunCompleteView title="You Died" buttonText="Try Again" onRestart={() => gameManager.restartRun()}/>)}
  </div>
  );
});