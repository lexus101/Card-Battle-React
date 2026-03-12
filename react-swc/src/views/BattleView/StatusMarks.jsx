import { observer } from "mobx-react";

// Shows the status of units and their stacks
function getStatusList(unit) {
  const regenStacks = unit.stack.regeneration?.length ?? 0;
  const regenHeal = regenStacks * 5;
  const regenTurns = regenStacks > 0 ? Math.max(...unit.regeneration) : 0;

  return [
    unit.stack.burn > 0 && {
      key: "fire",
      icon: "🔥",
      label: "",
      value: `${unit.stack.burn} (${Math.floor(unit.stack.burn / 2)})`,
    },

    unit.stack.flow > 0 && {
      key: "wet",
      icon: "💧",
      label: "Wet",
      value: unit.stack.flow,
    },
    unit.stack.charge > 0 && {
      key: "charge",
      icon: "✨",
      label: "Charge",
      value: unit.stack.charge,
    },

    unit.stack.freeze && {
      key: "frozen",
      icon: "❄️",
      label: "Frozen",
      value: "",
    },

    unit.stack.shield > 0 && {
      key: "shield",
      icon: "🛡️",
      label: "",
      value: unit.stack.fortify > 0
      ? `${unit.stack.shield}`
      : `${unit.stack.shield} (${Math.floor(unit.stack.shield/2)})`
    },

    unit.stack.fortify > 0 && {
      key: "fortify",
      icon: "🧱",
      label: "Fortify",
      value: unit.stack.fortify,
    },

    regenStacks > 0 && {
      key: "regen",
      icon: "💚",
      label: "Regen",
      value: `+${regenHeal} (${regenTurns}t)`,
    },
    
  ].filter(Boolean);
}

export const StatusMarks = observer(({ unit, className = "" }) => {
  const statuses = getStatusList(unit);
  if (statuses.length === 0) return null;

  return (
    <div className={`statusMarks ${className}`}>
      {statuses.map((s) => (
        <div key={s.key} className={`statusMark statusMark--${s.key}`} title={s.label}>
          <span className="statusMark__icon">{s.icon}</span>
          <span className="statusMark__text">
            {s.label} {s.value !== "" && s.value}
          </span>
        </div>
      ))}
    </div>
  );
});