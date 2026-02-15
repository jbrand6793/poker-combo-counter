import { useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { CATEGORY_RANK } from '../utils/poker';

const CATEGORY_COLORS = {
  'Quads': 'text-yellow-400 bg-yellow-400/10',
  'Full House': 'text-orange-400 bg-orange-400/10',
  'Flush': 'text-blue-400 bg-blue-400/10',
  'Straight': 'text-cyan-400 bg-cyan-400/10',
  'Set': 'text-emerald-400 bg-emerald-400/10',
  'Trips': 'text-green-400 bg-green-400/10',
  'Two Pair': 'text-violet-400 bg-violet-400/10',
  'Overpair': 'text-pink-400 bg-pink-400/10',
  'Top Pair': 'text-rose-400 bg-rose-400/10',
  'Middle Pair': 'text-amber-400 bg-amber-400/10',
  'Bottom Pair': 'text-lime-400 bg-lime-400/10',
  'Underpair': 'text-teal-400 bg-teal-400/10',
  'Board Pair': 'text-slate-400 bg-slate-400/10',
  'High Card': 'text-slate-500 bg-slate-500/10',
};

const CATEGORIES = [
  'Quads', 'Full House', 'Flush', 'Straight', 'Set', 'Trips',
  'Two Pair', 'Overpair', 'Top Pair', 'Middle Pair', 'Bottom Pair',
  'Underpair', 'Board Pair', 'High Card',
];

function ResultDashboard({ results, flopSet, heroCategory }) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (cat) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const totalCombos = CATEGORIES.reduce((sum, cat) => sum + (results[cat]?.length || 0), 0);

  const heroRank = heroCategory ? CATEGORY_RANK[heroCategory] : null;

  // Cumulative combos that beat hero (all categories strictly stronger)
  const beatsHeroTotal = useMemo(() => {
    if (heroRank === null) return null;
    let count = 0;
    for (const cat of CATEGORIES) {
      if (CATEGORY_RANK[cat] > heroRank) {
        count += (results[cat]?.length || 0);
      }
    }
    return count;
  }, [results, heroRank]);

  return (
    <div className="bg-[#12121f] rounded-xl border border-slate-800/50 p-3 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-slate-300">
          Villain Combos
          {flopSet && (
            <span className="ml-1.5 text-xs font-normal text-slate-500">
              ({totalCombos} total)
            </span>
          )}
        </h3>
      </div>

      {heroCategory && flopSet && (
        <div className="mb-2 px-2 py-1.5 rounded bg-slate-800/40 border border-slate-700/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Hero: <span className={`font-semibold ${CATEGORY_COLORS[heroCategory]?.split(' ')[0] || 'text-white'}`}>{heroCategory}</span>
            </span>
            {beatsHeroTotal !== null && (
              <span className="text-xs font-bold text-red-400">
                {beatsHeroTotal} combo{beatsHeroTotal !== 1 ? 's' : ''} beat hero
                {totalCombos > 0 && (
                  <span className="text-red-400/60 font-normal ml-1">
                    ({((beatsHeroTotal / totalCombos) * 100).toFixed(1)}%)
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      )}

      {!flopSet ? (
        <p className="text-sm text-slate-600 text-center py-6">
          Set the flop to see combo counts
        </p>
      ) : (
        <div className="space-y-0 overflow-y-auto flex-1 min-h-0">
          {CATEGORIES.map(cat => {
            const combos = results[cat] || [];
            const isExpanded = expanded[cat];
            const colorClass = CATEGORY_COLORS[cat];
            const pct = totalCombos > 0 ? ((combos.length / totalCombos) * 100).toFixed(1) : '0.0';
            const beatsHero = heroRank !== null && CATEGORY_RANK[cat] > heroRank;
            const isHeroRow = heroCategory === cat;

            return (
              <div key={cat}>
                <button
                  onClick={() => combos.length > 0 && toggleExpand(cat)}
                  className={`
                    w-full flex items-center justify-between px-2 py-1.5 rounded
                    transition-all
                    ${combos.length > 0 ? 'cursor-pointer hover:bg-slate-800/50' : 'cursor-default'}
                    ${isExpanded ? 'bg-slate-800/30' : ''}
                    ${isHeroRow ? 'ring-1 ring-violet-500/40' : ''}
                  `}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {combos.length > 0 ? (
                      <ChevronRight
                        size={10}
                        className={`text-slate-600 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    ) : (
                      <div className="w-2.5 flex-shrink-0" />
                    )}
                    {beatsHero && combos.length > 0 && (
                      <span className="text-[9px] text-red-500 flex-shrink-0">!</span>
                    )}
                    <span className={`text-sm font-medium truncate ${colorClass.split(' ')[0]}`}>
                      {cat}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
                      {combos.length}
                    </span>
                    <span className="text-xs text-slate-500 w-12 text-right">
                      {pct}%
                    </span>
                  </div>
                </button>

                {isExpanded && combos.length > 0 && (
                  <div className="ml-5 mt-0.5 mb-1 flex flex-wrap gap-0.5">
                    {combos.map(({ combo }, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-slate-800/60 text-slate-400 px-1.5 py-0.5 rounded"
                      >
                        {combo[0]}{combo[1]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ResultDashboard;
