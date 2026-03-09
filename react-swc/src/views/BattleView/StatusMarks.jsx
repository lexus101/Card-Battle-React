import { observer } from "mobx-react";

// Shows the status of units and their stacks
function getStatusList(unit) {
  const regenStacks = unit.regeneration?.length ?? 0;
  const regenHeal = regenStacks * 5;
  const regenTurns = regenStacks > 0 ? Math.max(...unit.regeneration) : 0;

  return [
    unit.onFire > 0 && {
      key: "fire",
      icon: "🔥",
      label: "",
      value: `${unit.onFire} (${Math.floor(unit.onFire / 2)})`,
    },

    unit.onWet > 0 && {
      key: "wet",
      icon: "💧",
      label: "Wet",
      value: unit.onWet,
    },

    unit.onElec > 0 && {
      key: "elec",
      icon: "⚡",
      label: "Elec",
      value: unit.onElec,
    },

    unit.charge > 0 && {
      key: "charge",
      icon: "✨",
      label: "Charge",
      value: unit.charge,
    },

    unit.isFrozen && {
      key: "frozen",
      icon: "❄️",
      label: "Frozen",
      value: "",
    },

    unit.shield > 0 && {
      key: "shield",
      icon: "🛡️",
      label: "",
      value: unit.fortify > 0
      ? `${unit.shield}`
      : `${unit.shield} (${Math.floor(unit.shield/2)})`
    },

    unit.fortify > 0 && {
      key: "fortify",
      icon: "🧱",
      label: "Fortify",
      value: unit.fortify,
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