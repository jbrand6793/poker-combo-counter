import { useMemo } from 'react';
import { buildMatrix } from '../utils/poker';

const TYPE_COLORS = {
  pair: {
    selected: 'bg-emerald-600/80 border-emerald-400/50 text-white',
    unselected: 'bg-emerald-950/30 border-emerald-900/30 text-emerald-800',
  },
  suited: {
    selected: 'bg-blue-600/80 border-blue-400/50 text-white',
    unselected: 'bg-blue-950/30 border-blue-900/30 text-blue-800',
  },
  offsuit: {
    selected: 'bg-red-600/70 border-red-400/50 text-white',
    unselected: 'bg-red-950/30 border-red-900/30 text-red-800',
  },
};

function RangeMatrix({ selectedHands, onToggleHand }) {
  const matrix = useMemo(() => buildMatrix(), []);

  return (
    <div className="w-full sm:w-auto overflow-x-auto">
      <div
        className="grid gap-[1px] min-w-[325px] sm:min-w-0"
        style={{ gridTemplateColumns: 'repeat(13, 1fr)' }}
      >
        {matrix.flat().map(({ label, type }) => {
          const isSelected = selectedHands.has(label);
          const colors = TYPE_COLORS[type];

          return (
            <button
              key={label}
              onClick={() => onToggleHand(label)}
              className={`
                aspect-square sm:w-[42px] sm:h-[38px] sm:aspect-auto text-[9px] sm:text-[11px] font-semibold rounded-sm border
                transition-all duration-100 cursor-pointer
                hover:brightness-125 active:brightness-150
                ${isSelected ? colors.selected : colors.unselected}
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RangeMatrix;
