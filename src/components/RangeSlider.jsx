import { TOTAL_COMBOS } from '../utils/poker';

function RangeSlider({ value, onChange, comboCount }) {
  return (
    <div className="mt-3 px-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400 font-medium">Opening Range</span>
        <span className="text-xs font-bold text-violet-400">
          {value}% ({comboCount}/{TOTAL_COMBOS} combos)
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export default RangeSlider;
