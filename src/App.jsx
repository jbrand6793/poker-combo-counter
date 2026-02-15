import { useState, useMemo, useCallback } from 'react';
import RangeMatrix from './components/RangeMatrix';
import RangeSlider from './components/RangeSlider';
import CardSelector from './components/CardSelector';
import ResultDashboard from './components/ResultDashboard';
import { getHandsForPercentage, getComboCountForRange, classifyVillainCombos, evaluateHandOnBoard, randomCard } from './utils/poker';

function App() {
  const [selectedHands, setSelectedHands] = useState(() => getHandsForPercentage(15));
  const [sliderValue, setSliderValue] = useState(15);
  const [heroCards, setHeroCards] = useState([null, null]);
  const [boardCards, setBoardCards] = useState([null, null, null, null, null]);

  const deadCards = useMemo(() =>
    [...heroCards, ...boardCards].filter(Boolean),
    [heroCards, boardCards]
  );

  const handleSliderChange = useCallback((value) => {
    setSliderValue(value);
    setSelectedHands(getHandsForPercentage(value));
  }, []);

  const toggleHand = useCallback((handLabel) => {
    setSelectedHands(prev => {
      const next = new Set(prev);
      if (next.has(handLabel)) {
        next.delete(handLabel);
      } else {
        next.add(handLabel);
      }
      return next;
    });
  }, []);

  const setHeroCard = useCallback((index, card) => {
    setHeroCards(prev => {
      const next = [...prev];
      next[index] = card;
      return next;
    });
  }, []);

  const setBoardCard = useCallback((index, card) => {
    setBoardCards(prev => {
      const next = [...prev];
      next[index] = card;
      return next;
    });
  }, []);

  const randomizeHero = useCallback(() => {
    const c1 = randomCard(boardCards.filter(Boolean));
    const c2 = randomCard([...boardCards.filter(Boolean), c1]);
    setHeroCards([c1, c2]);
  }, [boardCards]);

  const randomizeFlop = useCallback(() => {
    const dead = [...heroCards.filter(Boolean)];
    const c1 = randomCard(dead);
    dead.push(c1);
    const c2 = randomCard(dead);
    dead.push(c2);
    const c3 = randomCard(dead);
    setBoardCards(prev => [c1, c2, c3, prev[3], prev[4]]);
  }, [heroCards]);

  const clearBoard = useCallback(() => {
    setBoardCards([null, null, null, null, null]);
  }, []);

  const clearHero = useCallback(() => {
    setHeroCards([null, null]);
  }, []);

  const flopSet = boardCards[0] && boardCards[1] && boardCards[2];

  const rangeComboCount = useMemo(() =>
    getComboCountForRange(selectedHands),
    [selectedHands]
  );

  const comboResults = useMemo(() => {
    return classifyVillainCombos(selectedHands, heroCards, boardCards);
  }, [selectedHands, heroCards, boardCards]);

  const heroCategory = useMemo(() => {
    const validHero = heroCards.filter(Boolean);
    const validBoard = boardCards.filter(Boolean);
    if (validHero.length === 2 && validBoard.length >= 3) {
      return evaluateHandOnBoard(validHero, validBoard);
    }
    return null;
  }, [heroCards, boardCards]);

  return (
    <div className="h-screen bg-[#0a0a0f] p-3 flex flex-col overflow-hidden">
      <header className="text-center mb-2">
        <h1 className="text-lg font-bold text-white tracking-tight leading-none">
          David Brand's Poker Room
        </h1>
        <p className="text-[10px] text-slate-500">Poker Range & Combo Visualizer</p>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 flex-1 min-h-0 w-full">
        {/* Left: Range Matrix + Slider + Card Inputs */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          <RangeMatrix
            selectedHands={selectedHands}
            onToggleHand={toggleHand}
          />
          <RangeSlider
            value={sliderValue}
            onChange={handleSliderChange}
            comboCount={rangeComboCount}
          />
          <div className="flex gap-2">
            <CardSelector
              label="Hero Hand"
              cards={heroCards}
              onSetCard={setHeroCard}
              deadCards={deadCards}
              onRandomize={randomizeHero}
              onClear={clearHero}
            />
            <CardSelector
              label="Board"
              cards={boardCards}
              onSetCard={setBoardCard}
              deadCards={deadCards}
              onRandomize={randomizeFlop}
              onClear={clearBoard}
              isBoard={true}
              flopSet={flopSet}
            />
          </div>
        </div>

        {/* Right: Results */}
        <div className="min-w-0 min-h-0 w-80">
          <ResultDashboard results={comboResults} flopSet={flopSet} heroCategory={heroCategory} />
        </div>
      </div>
    </div>
  );
}

export default App;
