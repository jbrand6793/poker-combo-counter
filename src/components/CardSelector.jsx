import { useState } from 'react';
import { Shuffle, X, ChevronDown } from 'lucide-react';
import { RANKS, SUITS, SUIT_SYMBOLS, SUIT_COLORS } from '../utils/poker';

function CardPicker({ onSelect, deadCards, onClose }) {
  const dead = new Set(deadCards);

  return (
    <div className="absolute z-50 top-full mt-1 left-0 bg-[#1a1a2e] border border-slate-700/50 rounded-lg p-2 shadow-xl shadow-black/50">
      <div className="grid grid-cols-4 gap-0.5">
        {RANKS.map(r =>
          SUITS.map(s => {
            const card = r + s;
            const isDead = dead.has(card);
            return (
              <button
                key={card}
                disabled={isDead}
                onClick={() => { onSelect(card); onClose(); }}
                className={`
                  w-8 h-8 text-[10px] font-bold rounded flex items-center justify-center
                  transition-all cursor-pointer
                  ${isDead
                    ? 'bg-slate-800/50 text-slate-700 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-700 hover:scale-110'
                  }
                `}
                style={{ color: isDead ? undefined : SUIT_COLORS[s] }}
              >
                {r}{SUIT_SYMBOLS[s]}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function CardSlot({ card, onClick, disabled }) {
  if (card) {
    const rank = card[0];
    const suit = card[1];
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-12 h-16 bg-white rounded-lg flex flex-col items-center justify-center
                   shadow cursor-pointer hover:scale-105 transition-transform border border-slate-300"
      >
        <span className="text-base font-black leading-none" style={{ color: SUIT_COLORS[suit] }}>
          {rank}
        </span>
        <span className="text-base leading-none" style={{ color: SUIT_COLORS[suit] }}>
          {SUIT_SYMBOLS[suit]}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-12 h-16 rounded-lg flex items-center justify-center border-2 border-dashed
        transition-all cursor-pointer
        ${disabled
          ? 'border-slate-800 bg-slate-900/30 text-slate-700 cursor-not-allowed'
          : 'border-slate-600 bg-slate-800/50 text-slate-500 hover:border-violet-500 hover:text-violet-400'
        }
      `}
    >
      <ChevronDown size={12} />
    </button>
  );
}

function CardSelector({ label, cards, onSetCard, deadCards, onRandomize, onClear, isBoard, flopSet }) {
  const [pickerIndex, setPickerIndex] = useState(null);

  const handleSlotClick = (index) => {
    if (cards[index]) {
      onSetCard(index, null);
    } else {
      setPickerIndex(pickerIndex === index ? null : index);
    }
  };

  const handleSelect = (card) => {
    onSetCard(pickerIndex, card);
    setPickerIndex(null);
  };

  const isSlotDisabled = (index) => {
    if (!isBoard) return false;
    if (index <= 2) return false;
    if (index === 3) return !flopSet;
    if (index === 4) return !flopSet || !cards[3];
    return false;
  };

  return (
    <div className="bg-[#12121f] rounded-lg border border-slate-800/50 px-3 py-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-slate-300">{label}</h3>
        <div className="flex gap-1.5">
          <button
            onClick={onRandomize}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded
                       bg-violet-600/20 text-violet-400 hover:bg-violet-600/30 transition-colors cursor-pointer"
          >
            <Shuffle size={10} />
            {isBoard ? 'Random' : 'Random'}
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded
                       bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <X size={10} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 relative">
        {isBoard && (
          <>
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <CardSlot key={i} card={cards[i]} onClick={() => handleSlotClick(i)} disabled={false} />
              ))}
            </div>
            <div className="w-px bg-slate-700/50" />
            <CardSlot card={cards[3]} onClick={() => handleSlotClick(3)} disabled={isSlotDisabled(3)} />
            <div className="w-px bg-slate-700/50" />
            <CardSlot card={cards[4]} onClick={() => handleSlotClick(4)} disabled={isSlotDisabled(4)} />
          </>
        )}
        {!isBoard && cards.map((card, i) => (
          <CardSlot key={i} card={card} onClick={() => handleSlotClick(i)} disabled={false} />
        ))}

        {pickerIndex !== null && (
          <CardPicker
            onSelect={handleSelect}
            deadCards={deadCards}
            onClose={() => setPickerIndex(null)}
          />
        )}
      </div>
    </div>
  );
}

export default CardSelector;
