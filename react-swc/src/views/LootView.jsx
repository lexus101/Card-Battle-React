import React from "react";
import { observer } from "mobx-react";
import "./LootView.css";

export const LootView = observer(({ loot, onPick, onSkip }) => {
  return (
    <div className="lootOverlay">
      <div className="lootPanel">
        <div className="lootTitle">Choose a Reward</div>
        <div className="lootSubtitle">Pick 1 card to add to your deck</div>

        <div className="lootCards">
          {loot.map((card, i) => (
            <button
              key={i}
              className="lootCard"
              onClick={() => onPick(card)}
            >
              <img src={card.image} alt={card.name} className="lootArt" />
              <div className="lootName">{card.name}</div>
              <div className="lootDesc">{card.description || "No description"}</div>
            </button>
          ))}
        </div>

        <button className="lootSkip" onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  );
});
