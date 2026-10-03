import React, { useState } from 'react';
import { MarketType, SignalDirection, TradeSignal } from '../../types';
import { 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Copy, 
  Check, 
  ChevronRight, 
  PlusCircle, 
  Sparkles, 
  Crosshair, 
  SlidersHorizontal,
  Flame,
  Shield,
  Clock
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface SignalFeedProps {
  signals: TradeSignal[];
  onSelectSignal: (signal: TradeSignal) => void;
  onOpenDetailModal: (signal: TradeSignal) => void;
  onApplyToCalculator: (signal: TradeSignal) => void;
  onSimulateNewSignal: () => void;
}

export const SignalFeed: React.FC<SignalFeedProps> = ({
  signals,
  onSelectSignal,
  onOpenDetailModal,
  onApplyToCalculator,
  onSimulateNewSignal
}) => {
  const [marketFilter, setMarketFilter] = useState<string>('ALL');
  const [directionFilter, setDirectionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSignals = signals.filter(sig => {
    if (marketFilter !== 'ALL' && sig.market !== marketFilter.toLowerCase()) return false;
    if (directionFilter !== 'ALL' && sig.direction !== directionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return sig.pair.toLowerCase().includes(q) || 
             sig.name.toLowerCase().includes(q) || 
             sig.patternLabel.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCopy = (sig: TradeSignal, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    const text = `🎯 [STRUCT AI SIGNAL] ${sig.pair} ${sig.direction}
Pattern: ${sig.patternLabel}
Entry: ${sig.entryPrice}
Stop Loss: ${sig.stopLoss}
TP1: ${sig.tp1} | TP2: ${sig.tp2} | TP3: ${sig.tp3}
Risk:Reward: 1:${sig.riskReward} | AI Score: ${sig.confidence}%`;
    navigator.clipboard.writeText(text);
    setCopiedId(sig.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Feed Control Bar */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center">
                <span>AI Trade Signals & Scanner</span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5" />
                  Live Scanner
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time Break of Structure & Order Block signals filtered by institutional neural models.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                soundManager.playSignalBullish();
                onSimulateNewSignal();
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-dark-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all duration-200"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Next AI Signal</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {/* Market Filter */}
            <div className="flex items-center bg-dark-950 rounded-xl p-1 border border-slate-800 text-xs font-medium">
              {['ALL', 'CRYPTO', 'FOREX', 'INDICES', 'COMMODITIES'].map(item => (
                <button
                  key={item}
                  onClick={() => {
                    soundManager.playClick();
                    setMarketFilter(item);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    marketFilter === item
                      ? 'bg-cyan-500 text-dark-950 font-bold shadow-sm shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Direction Filter */}
            <div className="flex items-center bg-dark-950 rounded-xl p-1 border border-slate-800 text-xs font-medium">
              {['ALL', 'LONG', 'SHORT'].map(dir => (
                <button
                  key={dir}
                  onClick={() => {
                    soundManager.playClick();
                    setDirectionFilter(dir);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    directionFilter === dir
                      ? dir === 'LONG' 
                        ? 'bg-emerald-500 text-dark-950 font-bold shadow-sm shadow-emerald-500/30'
                        : dir === 'SHORT'
                        ? 'bg-rose-500 text-white font-bold shadow-sm shadow-rose-500/30'
                        : 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker, pattern..."
              className="w-full bg-dark-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono transition"
            />
          </div>
        </div>
      </div>

      {/* Signal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSignals.map(sig => {
          const isLong = sig.direction === 'LONG';
          const pnlPos = sig.pnlPercentage >= 0;

          return (
            <div
              key={sig.id}
              onClick={() => onSelectSignal(sig)}
              className="group relative bg-dark-900 hover:bg-dark-850 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isLong ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isLong ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-base text-white tracking-wide">{sig.pair}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isLong ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {sig.direction}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {sig.timeframe}
                        </span>
                      </div>
                      <p className="text-xs text-cyan-300/90 font-medium mt-0.5 flex items-center">
                        <Zap className="w-3 h-3 mr-1 text-cyan-400" />
                        {sig.patternLabel}
                      </p>
                    </div>
                  </div>

                  {/* AI Confidence Pill */}
                  <div className="text-right">
                    <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-dark-950 border border-slate-800 text-[11px] font-mono font-bold text-cyan-400">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{sig.confidence}%</span>
                    </div>
                    <span className="block text-[9px] text-slate-500 mt-0.5">AI Confidence</span>
                  </div>
                </div>

                {/* Price Matrix Grid */}
                <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-dark-950/80 border border-slate-800/80 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">ENTRY</span>
                    <span className="text-slate-200 font-semibold">{sig.entryPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-400/80 block">STOP LOSS</span>
                    <span className="text-rose-400 font-semibold">{sig.stopLoss}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400/80 block">TP1 / TP3</span>
                    <span className="text-emerald-400 font-semibold">{sig.tp1}</span>
                  </div>
                </div>

                {/* R:R and Confluences */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-[11px] text-slate-400">Risk:Reward</span>
                    <span className="text-cyan-400 font-bold font-mono">1 : {sig.riskReward}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-[11px] text-slate-400">Live PnL:</span>
                    <span className={`font-mono font-bold ${pnlPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {pnlPos ? `+${sig.pnlPercentage}%` : `${sig.pnlPercentage}%`}
                    </span>
                  </div>
                </div>

                {/* Confluence Pill Highlights */}
                <div className="space-y-1 mb-3">
                  {sig.confluenceFactors.slice(0, 2).map((conf, idx) => (
                    <div key={idx} className="flex items-center text-[11px] text-slate-300">
                      <Check className="w-3 h-3 text-cyan-400 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{conf}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => handleCopy(sig, e)}
                  title="Copy Setup"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                >
                  {copiedId === sig.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    onApplyToCalculator(sig);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-dark-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition"
                >
                  Position Size
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    onOpenDetailModal(sig);
                  }}
                  className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
                >
                  <span>Trade Blueprint</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
