import React from "react";
import "./css/RunCompleteView.css";

export function RunCompleteView({ title = "Run Complete", buttonText = "Restart Run", onRestart }) {
  return (
    <div className="runOverlay">
      <div className="runPanel">
        <div className="runTitle">{title}</div>
        <button className="runRestartButton" onClick={onRestart}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}