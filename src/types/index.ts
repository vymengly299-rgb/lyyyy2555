export type MarketType = 'crypto' | 'forex' | 'indices' | 'commodities';
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D';
export type SignalDirection = 'LONG' | 'SHORT';
export type SignalStatus = 'ACTIVE' | 'PENDING' | 'TP1_HIT' | 'TP2_HIT' | 'TP3_HIT' | 'SL_HIT' | 'CLOSED_PROFIT';
export type StructurePattern = 
  | 'BOS_BULLISH' 
  | 'BOS_BEARISH' 
  | 'CHOCH_REVERSAL' 
  | 'ORDER_BLOCK_RETEST' 
  | 'FVG_IMBALANCE_FILL' 
  | 'LIQUIDITY_SWEEP' 
  | 'PREMIUM_DISCOUNT_DISCOUNT';

export interface Candle {
  time: number; // timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StructureAnnotation {
  id: string;
  type: 'BOS' | 'CHoCH' | 'ORDER_BLOCK' | 'FVG' | 'LIQUIDITY_SWEEP';
  label: string;
  price: number;
  secondaryPrice?: number; // for zones like OB or FVG
  startIndex: number;
  endIndex: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timeframe: string;
  mitigated?: boolean;
}

export interface TradeSignal {
  id: string;
  pair: string;
  name: string;
  market: MarketType;
  direction: SignalDirection;
  timeframe: Timeframe;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  tp3: number;
  riskReward: number; // e.g. 3.4
  confidence: number; // 0 - 100%
  status: SignalStatus;
  pattern: StructurePattern;
  patternLabel: string;
  timestamp: number;
  confluenceFactors: string[];
  notes: string;
  pnlPercentage: number;
  volume24h?: string;
}

export interface AssetSummary {
  symbol: string;
  name: string;
  market: MarketType;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: string;
  structureBias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  aiScore: number;
  activeSignalsCount: number;
  basePriceDecimals: number;
}

export interface HeatmapItem {
  symbol: string;
  market: MarketType;
  name: string;
  price: number;
  change24h: number;
  m15Bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  h1Bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  h4Bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  d1Bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confluenceScore: number; // 0 - 100
  dominantPattern: string;
}

export interface ClosedTrade {
  id: string;
  symbol: string;
  direction: SignalDirection;
  timeframe: Timeframe;
  entryPrice: number;
  exitPrice: number;
  profitRatio: number; // e.g. +3.2R
  profitPercent: number;
  result: 'WIN' | 'LOSS';
  date: string;
  pattern: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  relatedSignal?: Partial<TradeSignal>;
  suggestedAction?: {
    type: 'LOAD_CHART' | 'VIEW_SIGNAL' | 'APPLY_CALCULATOR';
    symbol?: string;
    signalId?: string;
  };
}
