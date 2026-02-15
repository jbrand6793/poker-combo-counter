export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
export const SUITS = ['s', 'h', 'd', 'c'];
export const SUIT_SYMBOLS = { s: '♠', h: '♥', d: '♦', c: '♣' };
export const SUIT_COLORS = { s: '#a0aec0', h: '#ef4444', d: '#3b82f6', c: '#22c55e' };

export const RANK_VALUE = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10,
  '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2,
};

export function buildDeck() {
  const deck = [];
  for (const r of RANKS) {
    for (const s of SUITS) {
      deck.push(r + s);
    }
  }
  return deck;
}

export function buildMatrix() {
  const matrix = [];
  for (let i = 0; i < 13; i++) {
    const row = [];
    for (let j = 0; j < 13; j++) {
      if (i === j) {
        row.push({ label: RANKS[i] + RANKS[j], type: 'pair' });
      } else if (i < j) {
        row.push({ label: RANKS[i] + RANKS[j] + 's', type: 'suited' });
      } else {
        row.push({ label: RANKS[j] + RANKS[i] + 'o', type: 'offsuit' });
      }
    }
    matrix.push(row);
  }
  return matrix;
}

const HAND_RANKINGS = [
  'AA', 'KK', 'QQ', 'AKs', 'JJ', 'AQs', 'KQs', 'AJs', 'AKo', 'TT',
  'ATs', 'KJs', 'QJs', 'JTs', '99', 'AQo', 'A9s', 'KTs', 'QTs', 'T9s',
  '88', 'A8s', 'KQo', 'K9s', 'J9s', 'T8s', 'A7s', 'A5s', 'A6s', '98s',
  '77', 'A4s', 'AJo', 'Q9s', 'A3s', 'K8s', 'J8s', 'A2s', '87s', '97s',
  '66', 'KJo', 'T7s', 'QJo', 'ATo', 'K7s', 'Q8s', '76s', '86s', '55',
  'JTo', 'K6s', 'KTo', 'J7s', '65s', 'QTo', 'A9o', '96s', '75s', '54s',
  '44', 'T6s', 'K5s', 'K4s', 'Q7s', '85s', 'T9o', '64s', 'J9o', '33',
  'K3s', 'Q6s', 'K2s', 'J6s', '53s', 'T8o', '98o', '74s', '22', 'Q5s',
  'Q4s', '43s', 'J5s', 'Q3s', '63s', 'T5s', '84s', 'Q2s', 'J4s', '87o',
  '97o', 'J3s', '52s', 'J2s', 'T4s', '73s', '42s', '76o', 'T3s', '86o',
  '65o', 'T2s', '95s', '93s', '62s', '32s', '54o', '94s', '92s', '83s',
  '82s', '75o', 'A8o', 'K9o', '96o', 'J8o', 'Q9o', 'A7o', 'A6o', 'A5o',
  'A4o', 'A3o', 'A2o', 'K8o', 'K7o', 'K6o', 'K5o', 'K4o', 'K3o', 'K2o',
  'Q8o', 'Q7o', 'Q6o', 'Q5o', 'Q4o', 'Q3o', 'Q2o', 'J7o', 'J6o', 'J5o',
  'J4o', 'J3o', 'J2o', 'T7o', 'T6o', 'T5o', 'T4o', 'T3o', 'T2o',
  '85o', '84o', '83o', '82o', '95o', '94o', '93o', '92o',
  '74o', '73o', '72o', '64o', '63o', '62o', '53o', '52o',
  '43o', '42o', '32o',
];

export const TOTAL_COMBOS = 1326;

export function comboCountForHand(handLabel) {
  if (handLabel.endsWith('s')) return 4;
  if (handLabel.endsWith('o')) return 12;
  return 6;
}

export function getHandsForPercentage(percentage) {
  const targetCombos = Math.round((percentage / 100) * TOTAL_COMBOS);
  let runningCombos = 0;
  const selected = [];
  for (const hand of HAND_RANKINGS) {
    if (runningCombos >= targetCombos) break;
    selected.push(hand);
    runningCombos += comboCountForHand(hand);
  }
  return new Set(selected);
}

export function getComboCountForRange(selectedHands) {
  let count = 0;
  for (const hand of selectedHands) {
    count += comboCountForHand(hand);
  }
  return count;
}

export function getTotalHandCount() {
  return HAND_RANKINGS.length;
}

export function getSpecificCombos(handLabel) {
  const type = handLabel.endsWith('s') ? 'suited' : handLabel.endsWith('o') ? 'offsuit' : 'pair';
  const r1 = handLabel[0];
  const r2 = handLabel[1];
  const combos = [];

  if (type === 'pair') {
    for (let i = 0; i < SUITS.length; i++) {
      for (let j = i + 1; j < SUITS.length; j++) {
        combos.push([r1 + SUITS[i], r2 + SUITS[j]]);
      }
    }
  } else if (type === 'suited') {
    for (const s of SUITS) {
      combos.push([r1 + s, r2 + s]);
    }
  } else {
    for (const s1 of SUITS) {
      for (const s2 of SUITS) {
        if (s1 !== s2) {
          combos.push([r1 + s1, r2 + s2]);
        }
      }
    }
  }
  return combos;
}

export function getAvailableCombos(handLabel, deadCards) {
  const allCombos = getSpecificCombos(handLabel);
  const dead = new Set(deadCards.filter(Boolean));
  return allCombos.filter(([c1, c2]) => !dead.has(c1) && !dead.has(c2));
}

// Check for flush draw: 4 cards of same suit among hole+board
function checkFlushDraw(holeCards, boardCards) {
  const allCards = [...holeCards, ...boardCards];
  const suitCounts = {};
  for (const c of allCards) {
    const s = c[1];
    suitCounts[s] = (suitCounts[s] || 0) + 1;
  }
  // Need exactly 4 to same suit (5 = made flush, handled before this)
  // And at least one hole card contributes
  for (const [suit, count] of Object.entries(suitCounts)) {
    if (count === 4 && holeCards.some(c => c[1] === suit)) {
      return true;
    }
  }
  return false;
}

// Check for straight draw (OESD or gutshot) among hole+board
function checkStraightDraw(holeCards, boardCards) {
  const allCards = [...holeCards, ...boardCards];
  const allRanks = allCards.map(c => RANK_VALUE[c[0]]);
  const holeRanks = new Set(holeCards.map(c => RANK_VALUE[c[0]]));
  const unique = [...new Set(allRanks)];
  // Add ace-low
  if (unique.includes(14)) unique.push(1);
  unique.sort((a, b) => a - b);

  // Check all windows of 5 consecutive values
  for (let i = 0; i <= unique.length - 4; i++) {
    const window = [];
    let end = i;
    while (end < unique.length && unique[end] - unique[i] < 5) {
      window.push(unique[end]);
      end++;
    }
    // 4 out of 5 consecutive = straight draw
    if (window.length === 4) {
      const lo = unique[i];
      const hi = lo + 4;
      const missing = [];
      for (let v = lo; v <= hi; v++) {
        if (!window.includes(v)) missing.push(v);
      }
      if (missing.length === 1) {
        // Make sure at least one hole card is part of the draw
        const holeContributes = window.some(r => holeRanks.has(r) || (r === 1 && holeRanks.has(14)));
        if (holeContributes) return true;
      }
    }
  }
  return false;
}

export function evaluateHandOnBoard(holeCards, boardCards) {
  const allCards = [...holeCards, ...boardCards];
  if (allCards.length < 5) return null;

  const ranks = allCards.map(c => RANK_VALUE[c[0]]);
  const suits = allCards.map(c => c[1]);

  const rankCounts = {};
  const suitCounts = {};
  for (let i = 0; i < allCards.length; i++) {
    const r = ranks[i];
    const s = suits[i];
    rankCounts[r] = (rankCounts[r] || 0) + 1;
    suitCounts[s] = (suitCounts[s] || 0) + 1;
  }

  const holeRanks = holeCards.map(c => RANK_VALUE[c[0]]);
  const boardRanks = boardCards.map(c => RANK_VALUE[c[0]]);

  const hasFlush = Object.values(suitCounts).some(c => c >= 5);
  const hasStraight = checkStraight(ranks);

  // Quads
  if (Object.entries(rankCounts).find(([, c]) => c === 4)) return 'Quads';

  // Full House
  const trips = Object.entries(rankCounts).filter(([, c]) => c >= 3).map(([r]) => +r);
  const pairs = Object.entries(rankCounts).filter(([, c]) => c >= 2).map(([r]) => +r);
  if (trips.length > 0 && pairs.length >= 2) return 'Full House';

  // Flush
  if (hasFlush) return 'Flush';

  // Straight
  if (hasStraight) return 'Straight';

  // Set
  if (trips.length > 0) {
    const tripRank = trips[0];
    const holeHasPair = holeRanks[0] === holeRanks[1] && holeRanks[0] === tripRank;
    if (holeHasPair) return 'Set';
    const holeTripContrib = holeRanks.filter(r => r === tripRank).length;
    const boardTripContrib = boardRanks.filter(r => r === tripRank).length;
    if (holeTripContrib >= 1 && boardTripContrib >= 2) return 'Trips';
    return 'Trips';
  }

  // Two Pair
  const pairRanks = Object.entries(rankCounts).filter(([, c]) => c === 2).map(([r]) => +r);
  if (pairRanks.length >= 2) return 'Two Pair';

  // One Pair
  if (pairRanks.length === 1) {
    const pairRank = pairRanks[0];
    const heroPairContrib = holeRanks.filter(r => r === pairRank).length;

    if (heroPairContrib === 2) {
      const sortedBoard = [...boardRanks].sort((a, b) => b - a);
      if (pairRank > sortedBoard[0]) return 'Overpair';
      return 'Underpair';
    }

    if (heroPairContrib === 1) {
      const sortedBoard = [...boardRanks].sort((a, b) => b - a);
      if (pairRank === sortedBoard[0]) return 'Top Pair';
      if (pairRank === sortedBoard[1]) return 'Middle Pair';
      return 'Bottom Pair';
    }

    return 'Board Pair';
  }

  // Draws (only for unpaired hands)
  const hasFlushDraw = checkFlushDraw(holeCards, boardCards);
  const hasStraightDraw = checkStraightDraw(holeCards, boardCards);
  if (hasFlushDraw) return 'Flush Draw';
  if (hasStraightDraw) return 'Straight Draw';

  return 'High Card';
}

function checkStraight(ranks) {
  const unique = [...new Set(ranks)].sort((a, b) => a - b);
  if (unique.includes(14)) {
    unique.unshift(1);
  }
  let consecutive = 1;
  for (let i = 1; i < unique.length; i++) {
    if (unique[i] === unique[i - 1] + 1) {
      consecutive++;
      if (consecutive >= 5) return true;
    } else {
      consecutive = 1;
    }
  }
  return false;
}

export function classifyVillainCombos(selectedRange, heroCards, boardCards) {
  const deadCards = [...heroCards, ...boardCards].filter(Boolean);
  const categories = {
    'Quads': [],
    'Full House': [],
    'Flush': [],
    'Straight': [],
    'Set': [],
    'Trips': [],
    'Two Pair': [],
    'Overpair': [],
    'Top Pair': [],
    'Middle Pair': [],
    'Bottom Pair': [],
    'Underpair': [],
    'Board Pair': [],
    'Flush Draw': [],
    'Straight Draw': [],
    'High Card': [],
  };

  if (boardCards.filter(Boolean).length < 3) return categories;

  for (const handLabel of selectedRange) {
    const availableCombos = getAvailableCombos(handLabel, deadCards);
    for (const combo of availableCombos) {
      const category = evaluateHandOnBoard(combo, boardCards.filter(Boolean));
      if (category && categories[category] !== undefined) {
        categories[category].push({ hand: handLabel, combo });
      }
    }
  }

  return categories;
}

// Category strength ranking (higher = stronger)
// Draws are below made hands but above pure high card
export const CATEGORY_RANK = {
  'Quads': 15,
  'Full House': 14,
  'Flush': 13,
  'Straight': 12,
  'Set': 11,
  'Trips': 10,
  'Two Pair': 9,
  'Overpair': 8,
  'Top Pair': 7,
  'Middle Pair': 6,
  'Bottom Pair': 5,
  'Underpair': 4,
  'Board Pair': 3,
  'Flush Draw': 2,
  'Straight Draw': 1,
  'High Card': 0,
};

export function randomCard(deadCards) {
  const deck = buildDeck();
  const dead = new Set(deadCards.filter(Boolean));
  const available = deck.filter(c => !dead.has(c));
  return available[Math.floor(Math.random() * available.length)];
}
