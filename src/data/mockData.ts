import { AssetSummary, Candle, ClosedTrade, HeatmapItem, StructureAnnotation, TradeSignal } from '../types';

export const INITIAL_ASSETS: AssetSummary[] = [
  {
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    market: 'crypto',
    price: 67840.50,
    change24h: 3.42,
    high24h: 68420.00,
    low24h: 65120.00,
    volume: '$38.4B',
    structureBias: 'BULLISH',
    aiScore: 94,
    activeSignalsCount: 3,
    basePriceDecimals: 2,
  },
  {
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    market: 'crypto',
    price: 2642.80,
    change24h: 2.15,
    high24h: 2690.00,
    low24h: 2570.50,
    volume: '$19.2B',
    structureBias: 'BULLISH',
    aiScore: 89,
    activeSignalsCount: 2,
    basePriceDecimals: 2,
  },
  {
    symbol: 'SOL/USDT',
    name: 'Solana',
    market: 'crypto',
    price: 158.45,
    change24h: 5.82,
    high24h: 161.20,
    low24h: 149.30,
    volume: '$5.8B',
    structureBias: 'BULLISH',
    aiScore: 96,
    activeSignalsCount: 2,
    basePriceDecimals: 2,
  },
  {
    symbol: 'XAU/USD',
    name: 'Gold Spot',
    market: 'commodities',
    price: 2658.20,
    change24h: 0.74,
    high24h: 2670.40,
    low24h: 2638.10,
    volume: '$64.1B',
    structureBias: 'BULLISH',
    aiScore: 91,
    activeSignalsCount: 1,
    basePriceDecimals: 2,
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    market: 'forex',
    price: 1.0892,
    change24h: -0.18,
    high24h: 1.0925,
    low24h: 1.0870,
    volume: '$120.5B',
    structureBias: 'BEARISH',
    aiScore: 84,
    activeSignalsCount: 2,
    basePriceDecimals: 4,
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound / USD',
    market: 'forex',
    price: 1.3045,
    change24h: 0.31,
    high24h: 1.3090,
    low24h: 1.2995,
    volume: '$84.2B',
    structureBias: 'BULLISH',
    aiScore: 87,
    activeSignalsCount: 1,
    basePriceDecimals: 4,
  },
  {
    symbol: 'NAS100',
    name: 'Nasdaq 100 Index',
    market: 'indices',
    price: 20280.40,
    change24h: 1.15,
    high24h: 20350.00,
    low24h: 20040.00,
    volume: '$48.3B',
    structureBias: 'BULLISH',
    aiScore: 92,
    activeSignalsCount: 2,
    basePriceDecimals: 1,
  },
  {
    symbol: 'US500',
    name: 'S&P 500 E-Mini',
    market: 'indices',
    price: 5760.80,
    change24h: 0.48,
    high24h: 5780.20,
    low24h: 5732.50,
    volume: '$72.1B',
    structureBias: 'BULLISH',
    aiScore: 88,
    activeSignalsCount: 1,
    basePriceDecimals: 1,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    market: 'indices',
    price: 134.80,
    change24h: 2.84,
    high24h: 136.50,
    low24h: 130.80,
    volume: '$14.2B',
    structureBias: 'BULLISH',
    aiScore: 95,
    activeSignalsCount: 1,
    basePriceDecimals: 2,
  }
];

export const INITIAL_SIGNALS: TradeSignal[] = [
  {
    id: 'sig-btc-01',
    pair: 'BTC/USDT',
    name: 'Bitcoin',
    market: 'crypto',
    direction: 'LONG',
    timeframe: '15m',
    entryPrice: 67250.00,
    currentPrice: 67840.50,
    stopLoss: 66420.00,
    tp1: 68500.00,
    tp2: 69400.00,
    tp3: 70800.00,
    riskReward: 3.82,
    confidence: 94,
    status: 'ACTIVE',
    pattern: 'ORDER_BLOCK_RETEST',
    patternLabel: '15m Bullish OB + FVG Retest',
    timestamp: Date.now() - 1000 * 60 * 42,
    pnlPercentage: 0.88,
    volume24h: '$38.4B',
    confluenceFactors: [
      'Swept London Session Sell-Side Liquidity (SSL) at $66,800',
      'Clean 15m Break of Structure (BOS) above previous swing high',
      'Tap & Rejection at 0.618 Fib Order Block Demand Zone',
      'Delta Cumulative Volume Divergence (+2,400 BTC)',
      'Funding Rate Normalized at neutral 0.004%'
    ],
    notes: 'Primary swing target remains weekly liquidity pool at $70,800. Take partials at TP1 and move stop to Breakeven.'
  },
  {
    id: 'sig-eth-01',
    pair: 'ETH/USDT',
    name: 'Ethereum',
    market: 'crypto',
    direction: 'LONG',
    timeframe: '1h',
    entryPrice: 2615.00,
    currentPrice: 2642.80,
    stopLoss: 2568.00,
    tp1: 2680.00,
    tp2: 2740.00,
    tp3: 2850.00,
    riskReward: 3.45,
    confidence: 89,
    status: 'ACTIVE',
    pattern: 'BOS_BULLISH',
    patternLabel: '1h CHoCH Shift into Bullish BOS',
    timestamp: Date.now() - 1000 * 60 * 115,
    pnlPercentage: 1.06,
    volume24h: '$19.2B',
    confluenceFactors: [
      'Change of Character (CHoCH) confirmed on 1h close',
      'Unmitigated Fair Value Gap filled with aggressive buying',
      'Institutional Smart Money accumulation volume spike',
      'Positive ETH/BTC cross pair breakout'
    ],
    notes: 'Trailing stop advised after TP1 tap at $2,680.'
  },
  {
    id: 'sig-sol-01',
    pair: 'SOL/USDT',
    name: 'Solana',
    market: 'crypto',
    direction: 'LONG',
    timeframe: '5m',
    entryPrice: 154.20,
    currentPrice: 158.45,
    stopLoss: 151.80,
    tp1: 159.50,
    tp2: 164.00,
    tp3: 172.00,
    riskReward: 4.25,
    confidence: 96,
    status: 'ACTIVE',
    pattern: 'LIQUIDITY_SWEEP',
    patternLabel: 'Asia Low Liquidity Purge & Expansion',
    timestamp: Date.now() - 1000 * 60 * 28,
    pnlPercentage: 2.76,
    volume24h: '$5.8B',
    confluenceFactors: [
      'Engine detected stop run below previous day low ($153.80)',
      'Instant V-shape recovery with multi-candle displacement',
      '5m Order Block established as new institutional floor',
      'Open interest surging +8.4% on long breakout'
    ],
    notes: 'Extremely aggressive momentum. Target 1 within reach.'
  },
  {
    id: 'sig-eur-01',
    pair: 'EUR/USD',
    name: 'Euro / US Dollar',
    market: 'forex',
    direction: 'SHORT',
    timeframe: '15m',
    entryPrice: 1.0915,
    currentPrice: 1.0892,
    stopLoss: 1.0938,
    tp1: 1.0875,
    tp2: 1.0840,
    tp3: 1.0790,
    riskReward: 3.12,
    confidence: 86,
    status: 'ACTIVE',
    pattern: 'BOS_BEARISH',
    patternLabel: 'Bearish BOS + Premium Zone Mitigation',
    timestamp: Date.now() - 1000 * 60 * 65,
    pnlPercentage: 0.21,
    volume24h: '$120.5B',
    confluenceFactors: [
      'Failed to breach 1.0935 daily supply order block',
      'Bearish Change of Character on European Session opening',
      'DXY (US Dollar Index) breaking bullish market structure',
      'Fair value gap resistance holding on second test'
    ],
    notes: 'USD strength dominating NY overlap session. Aim for 1.0840 discount pool.'
  },
  {
    id: 'sig-xau-01',
    pair: 'XAU/USD',
    name: 'Gold Spot',
    market: 'commodities',
    direction: 'LONG',
    timeframe: '1h',
    entryPrice: 2642.50,
    currentPrice: 2658.20,
    stopLoss: 2626.00,
    tp1: 2668.00,
    tp2: 2685.00,
    tp3: 2715.00,
    riskReward: 4.39,
    confidence: 93,
    status: 'ACTIVE',
    pattern: 'FVG_IMBALANCE_FILL',
    patternLabel: '1h FVG Liquidity Tap & Rebound',
    timestamp: Date.now() - 1000 * 60 * 180,
    pnlPercentage: 0.59,
    volume24h: '$64.1B',
    confluenceFactors: [
      'Imbalance between $2,638 and $2,644 fully cleared',
      'Macro safe haven inflow & geopolitical hedge bid',
      'Higher time frame (4h) structural trend intact with higher lows',
      'Bond yields pull back bolstering non-yielding bullion'
    ],
    notes: 'Approaching TP1 ($2,668). Consider securing 40% position size.'
  },
  {
    id: 'sig-nas-01',
    pair: 'NAS100',
    name: 'Nasdaq 100',
    market: 'indices',
    direction: 'LONG',
    timeframe: '5m',
    entryPrice: 20180.00,
    currentPrice: 20280.40,
    stopLoss: 20110.00,
    tp1: 20340.00,
    tp2: 20450.00,
    tp3: 20600.00,
    riskReward: 3.86,
    confidence: 92,
    status: 'ACTIVE',
    pattern: 'ORDER_BLOCK_RETEST',
    patternLabel: 'Opening Bell Demand Block Rebound',
    timestamp: Date.now() - 1000 * 60 * 35,
    pnlPercentage: 0.50,
    volume24h: '$48.3B',
    confluenceFactors: [
      'Cash market open created clear imbalance displacement',
      'Institutional buyers stepped in at 20,180 demand zone',
      'Semiconductor leadership (NVDA, TSM) driving index breadth',
      'Positive market breadth ratio 3.4 : 1 advancers'
    ],
    notes: 'Ride momentum up to all-time high resistance band.'
  },
  {
    id: 'sig-gbp-01',
    pair: 'GBP/USD',
    name: 'British Pound',
    market: 'forex',
    direction: 'LONG',
    timeframe: '15m',
    entryPrice: 1.3010,
    currentPrice: 1.3045,
    stopLoss: 1.2980,
    tp1: 1.3070,
    tp2: 1.3120,
    tp3: 1.3180,
    riskReward: 3.67,
    confidence: 88,
    status: 'ACTIVE',
    pattern: 'LIQUIDITY_SWEEP',
    patternLabel: 'London Fix Liquidity Sweep Long',
    timestamp: Date.now() - 1000 * 60 * 85,
    pnlPercentage: 0.27,
    volume24h: '$84.2B',
    confluenceFactors: [
      'Swept equal lows at 1.2995',
      'Immediate rejection with bullish candle engulfing',
      'UK macro data beat expectations'
    ],
    notes: 'Strong support zone respected. Target 1.3070.'
  },
  {
    id: 'sig-nvda-01',
    pair: 'NVDA',
    name: 'NVIDIA Corp',
    market: 'indices',
    direction: 'LONG',
    timeframe: '15m',
    entryPrice: 132.20,
    currentPrice: 134.80,
    stopLoss: 129.80,
    tp1: 136.50,
    tp2: 140.00,
    tp3: 145.00,
    riskReward: 3.25,
    confidence: 95,
    status: 'ACTIVE',
    pattern: 'BOS_BULLISH',
    patternLabel: 'Pre-Market High BOS Breakout',
    timestamp: Date.now() - 1000 * 60 * 50,
    pnlPercentage: 1.97,
    volume24h: '$14.2B',
    confluenceFactors: [
      'Clean break above $133 consolidation ceiling',
      'Heavy call option block buying detected on order flow',
      'Blackwell chip demand guidance expansion'
    ],
    notes: 'Leading tech momentum. TP1 within 1.5% distance.'
  }
];

export const HEATMAP_DATA: HeatmapItem[] = [
  { symbol: 'BTC/USDT', market: 'crypto', name: 'Bitcoin', price: 67840.50, change24h: 3.42, m15Bias: 'BULLISH', h1Bias: 'BULLISH', h4Bias: 'BULLISH', d1Bias: 'BULLISH', confluenceScore: 98, dominantPattern: 'Daily Bull Flag + 15m BOS' },
  { symbol: 'ETH/USDT', market: 'crypto', name: 'Ethereum', price: 2642.80, change24h: 2.15, m15Bias: 'BULLISH', h1Bias: 'BULLISH', h4Bias: 'NEUTRAL', d1Bias: 'BULLISH', confluenceScore: 88, dominantPattern: '1h Bullish Order Block' },
  { symbol: 'SOL/USDT', market: 'crypto', name: 'Solana', price: 158.45, change24h: 5.82, m15Bias: 'BULLISH', h1Bias: 'BULLISH', h4Bias: 'BULLISH', d1Bias: 'BULLISH', confluenceScore: 97, dominantPattern: 'Multi-Timeframe BOS Expansion' },
  { symbol: 'XAU/USD', market: 'commodities', name: 'Gold', price: 2658.20, change24h: 0.74, m15Bias: 'BULLISH', h1Bias: 'BULLISH', h4Bias: 'BULLISH', d1Bias: 'BULLISH', confluenceScore: 95, dominantPattern: 'All-Time High Consolidation' },
  { symbol: 'EUR/USD', market: 'forex', name: 'Euro', price: 1.0892, change24h: -0.18, m15Bias: 'BEARISH', h1Bias: 'BEARISH', h4Bias: 'BEARISH', d1Bias: 'NEUTRAL', confluenceScore: 84, dominantPattern: 'Bearish Order Flow Trend' },
  { symbol: 'GBP/USD', market: 'forex', name: 'British Pound', price: 1.3045, change24h: 0.31, m15Bias: 'BULLISH', h1Bias: 'BULLISH', h4Bias: 'NEUTRAL', d1Bias: 'BULLISH', confluenceScore: 86, dominantPattern: 'Demand Zone Hold' },
  { symbol: 'NAS100', market: 'indices', name: 'Nasdaq', price: 20280.40, change24h: 1.15, m15Bias: 'BULLISH', h1Bias: 'BULLISH', h4Bias: 'BULLISH', d1Bias: 'BULLISH', confluenceScore: 94, dominantPattern: 'Bullish Momentum Channel' },
  { symbol: 'US500', market: 'indices', name: 'S&P 500', price: 5760.80, change24h: 0.48, m15Bias: 'BULLISH', h1Bias: 'BULLISH', h4Bias: 'BULLISH', d1Bias: 'BULLISH', confluenceScore: 91, dominantPattern: 'Institutional Accumulation' },
  { symbol: 'USD/JPY', market: 'forex', name: 'USD/JPY', price: 148.90, change24h: 0.42, m15Bias: 'BULLISH', h1Bias: 'BULLISH', h4Bias: 'BULLISH', d1Bias: 'NEUTRAL', confluenceScore: 82, dominantPattern: 'Breakout above 148.50' },
  { symbol: 'WTI_OIL', market: 'commodities', name: 'Crude Oil', price: 74.20, change24h: -1.25, m15Bias: 'BEARISH', h1Bias: 'BEARISH', h4Bias: 'NEUTRAL', d1Bias: 'BEARISH', confluenceScore: 79, dominantPattern: 'Supply Block Rejection' },
];

export const CLOSED_TRADES: ClosedTrade[] = [
  { id: 'c-101', symbol: 'BTC/USDT', direction: 'LONG', timeframe: '15m', entryPrice: 65400, exitPrice: 67300, profitRatio: 3.8, profitPercent: 2.9, result: 'WIN', date: 'Oct 02, 2026', pattern: 'Order Block Retest' },
  { id: 'c-102', symbol: 'SOL/USDT', direction: 'LONG', timeframe: '5m', entryPrice: 147.2, exitPrice: 156.4, profitRatio: 4.6, profitPercent: 6.2, result: 'WIN', date: 'Oct 02, 2026', pattern: 'Asia Low Liquidity Sweep' },
  { id: 'c-103', symbol: 'XAU/USD', direction: 'LONG', timeframe: '1h', entryPrice: 2620, exitPrice: 2652, profitRatio: 3.5, profitPercent: 1.2, result: 'WIN', date: 'Oct 01, 2026', pattern: 'FVG Imbalance Fill' },
  { id: 'c-104', symbol: 'EUR/USD', direction: 'SHORT', timeframe: '15m', entryPrice: 1.0965, exitPrice: 1.0905, profitRatio: 2.9, profitPercent: 0.55, result: 'WIN', date: 'Oct 01, 2026', pattern: 'Bearish BOS Continuation' },
  { id: 'c-105', symbol: 'NAS100', direction: 'LONG', timeframe: '5m', entryPrice: 19950, exitPrice: 19890, profitRatio: -1.0, profitPercent: -0.3, result: 'LOSS', date: 'Sep 30, 2026', pattern: 'Failed FVG Bounce' },
  { id: 'c-106', symbol: 'ETH/USDT', direction: 'LONG', timeframe: '1h', entryPrice: 2540, exitPrice: 2630, profitRatio: 3.2, profitPercent: 3.54, result: 'WIN', date: 'Sep 30, 2026', pattern: 'Bullish CHoCH' },
  { id: 'c-107', symbol: 'GBP/USD', direction: 'SHORT', timeframe: '15m', entryPrice: 1.3120, exitPrice: 1.3050, profitRatio: 2.8, profitPercent: 0.53, result: 'WIN', date: 'Sep 29, 2026', pattern: 'Liquidity Purge' },
  { id: 'c-108', symbol: 'BTC/USDT', direction: 'SHORT', timeframe: '1h', entryPrice: 66800, exitPrice: 67100, profitRatio: -1.0, profitPercent: -0.45, result: 'LOSS', date: 'Sep 29, 2026', pattern: 'Premature CHoCH Short' },
  { id: 'c-109', symbol: 'NVDA', direction: 'LONG', timeframe: '15m', entryPrice: 126.50, exitPrice: 133.20, profitRatio: 4.1, profitPercent: 5.3, result: 'WIN', date: 'Sep 28, 2026', pattern: 'Demand Zone Hold' },
];

// Realistic Candlestick generator for any asset and timeframe
export function generateCandles(basePrice: number, count: number = 70, volatility: number = 0.003): { candles: Candle[], structure: StructureAnnotation[] } {
  const candles: Candle[] = [];
  const now = Math.floor(Date.now() / 1000);
  const intervalSeconds = 900; // 15m default
  let current = basePrice * (1 - volatility * 12);

  // We craft a realistic trend with clear market structure swing points:
  // Leg 1: Downtrend to create low and sell-side liquidity sweep
  // Leg 2: Aggressive bullish displacement with Fair Value Gap
  // Leg 3: Retest of Bullish Order Block
  // Leg 4: Break of Structure (BOS) upwards
  // Leg 5: Present consolidation near highs

  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * intervalSeconds;
    let delta = 0;

    if (i < 18) {
      // Gentle downward bias to form accumulation base
      delta = (Math.random() - 0.58) * volatility * basePrice;
    } else if (i === 18 || i === 19) {
      // Liquidity sweep wick down
      delta = -volatility * 2.2 * basePrice;
    } else if (i >= 20 && i <= 28) {
      // Aggressive impulse upwards (CHoCH)
      delta = (Math.random() * 0.9 + 0.3) * volatility * 1.8 * basePrice;
    } else if (i > 28 && i <= 36) {
      // Pullback into Order Block
      delta = (Math.random() - 0.65) * volatility * basePrice;
    } else if (i > 36 && i <= 52) {
      // Secondary impulse breaking structure (BOS)
      delta = (Math.random() * 0.8 + 0.2) * volatility * 1.5 * basePrice;
    } else {
      // Final leg upwards with micro pullbacks
      delta = (Math.random() - 0.42) * volatility * basePrice;
    }

    const open = current;
    let close = current + delta;
    if (close <= 0) close = open * 0.99;

    const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.8;
    const low = Math.min(open, close) - Math.random() * volatility * basePrice * 0.8;
    const volume = Math.floor(basePrice * (15 + Math.random() * 60) * (i >= 20 && i <= 24 ? 2.5 : 1));

    candles.push({
      time,
      open: Number(open.toFixed(basePrice < 5 ? 4 : 2)),
      high: Number(high.toFixed(basePrice < 5 ? 4 : 2)),
      low: Number(low.toFixed(basePrice < 5 ? 4 : 2)),
      close: Number(close.toFixed(basePrice < 5 ? 4 : 2)),
      volume
    });

    current = close;
  }

  // Adjust last candle close to match basePrice closely
  const last = candles[candles.length - 1];
  last.close = basePrice;
  last.high = Math.max(last.high, basePrice);
  last.low = Math.min(last.low, basePrice);

  // Compute structure markers
  const lowestWick = Math.min(...candles.slice(15, 23).map(c => c.low));
  const obLow = candles[20]?.low || lowestWick;
  const obHigh = candles[21]?.open || lowestWick * 1.008;
  const bosLevel = candles[14]?.high || basePrice * 0.99;
  const fvgBottom = candles[22]?.high || obHigh;
  const fvgTop = candles[24]?.low || obHigh * 1.012;

  const structure: StructureAnnotation[] = [
    {
      id: 'ann-sweep-1',
      type: 'LIQUIDITY_SWEEP',
      label: 'SSL Liquidity Purge',
      price: lowestWick,
      startIndex: 18,
      endIndex: 22,
      sentiment: 'bullish',
      timeframe: '15m'
    },
    {
      id: 'ann-ob-1',
      type: 'ORDER_BLOCK',
      label: 'Bullish Demand OB (0.618 Fib)',
      price: obHigh,
      secondaryPrice: obLow,
      startIndex: 20,
      endIndex: 38,
      sentiment: 'bullish',
      timeframe: '15m',
      mitigated: true
    },
    {
      id: 'ann-fvg-1',
      type: 'FVG',
      label: 'FVG Fair Value Gap',
      price: fvgTop,
      secondaryPrice: fvgBottom,
      startIndex: 22,
      endIndex: 34,
      sentiment: 'bullish',
      timeframe: '15m',
      mitigated: true
    },
    {
      id: 'ann-choch-1',
      type: 'CHoCH',
      label: 'CHoCH Change of Character',
      price: bosLevel * 0.995,
      startIndex: 23,
      endIndex: 27,
      sentiment: 'bullish',
      timeframe: '15m'
    },
    {
      id: 'ann-bos-1',
      type: 'BOS',
      label: 'BOS Break of Structure',
      price: bosLevel,
      startIndex: 37,
      endIndex: 45,
      sentiment: 'bullish',
      timeframe: '15m'
    }
  ];

  return { candles, structure };
}
