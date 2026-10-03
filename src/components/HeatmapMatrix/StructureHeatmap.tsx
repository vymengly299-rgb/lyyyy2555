import React, { useState } from 'react';
import { HeatmapItem } from '../../types';
import { 
  Grid, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowUpRight, 
  Layers, 
  Activity, 
  Sparkles,
  BarChart2
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface StructureHeatmapProps {
  items: HeatmapItem[];
  onSelectSymbol: (symbol: string) => void;
}

export const StructureHeatmap: React.FC<StructureHeatmapProps> = ({
  items,
  onSelectSymbol
}) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredItems = items.filter(item => {
    if (filter === 'ALL') return true;
    return item.market === filter.toLowerCase();
  });

  const bullishCount = items.filter(i => i.h1Bias === 'BULLISH').length;
  const bullishPercent = Math.round((bullishCount / items.length) * 100);

  const renderBiasPill = (bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL') => {
    if (bias === 'BULLISH') {
      return (
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <TrendingUp className="w-2.5 h-2.5 mr-1" />
          BULL
        </span>
      );
    }
    if (bias === 'BEARISH') {
      return (
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <TrendingDown className="w-2.5 h-2.5 mr-1" />
          BEAR
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Minus className="w-2.5 h-2.5 mr-1" />
        RANGE
      </span>
    );
  };

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center">
              <span>Multi-Timeframe Structure Heatmap</span>
              <span className="ml-2.5 px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                MTF Matrix
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time alignment of 15m, 1h, 4h, and Daily Break of Structure across global institutional markets.
          </p>
        </div>

        {/* Global Market Confluence Gauge */}
        <div className="flex items-center space-x-4 bg-dark-950 p-2.5 rounded-xl border border-slate-800">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block font-mono">GLOBAL STRUCTURAL BIAS</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-cyan-400" />
              {bullishPercent}% Bullish Confluence (Risk-On)
            </span>
          </div>

          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${bullishPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 my-4">
        {['ALL', 'CRYPTO', 'FOREX', 'INDICES', 'COMMODITIES'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              soundManager.playClick();
              setFilter(tab);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filter === tab
                ? 'bg-cyan-500 text-dark-950 font-bold shadow-sm shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white bg-dark-950 border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Asset</th>
              <th className="py-3 px-3">Price / 24h</th>
              <th className="py-3 px-3 text-center">15M BOS</th>
              <th className="py-3 px-3 text-center">1H Structure</th>
              <th className="py-3 px-3 text-center">4H Trend</th>
              <th className="py-3 px-3 text-center">1D Bias</th>
              <th className="py-3 px-3">Dominant Pattern</th>
              <th className="py-3 px-3 text-right">Confluence</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredItems.map(item => (
              <tr 
                key={item.symbol}
                className="hover:bg-dark-850/70 transition-colors group"
              >
                {/* Symbol */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs">{item.symbol}</span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">({item.name})</span>
                  </div>
                </td>

                {/* Price & 24h */}
                <td className="py-3.5 px-3 font-mono">
                  <span className="text-slate-200 block font-semibold">{item.price.toLocaleString()}</span>
                  <span className={`text-[10px] ${item.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.change24h >= 0 ? `+${item.change24h}%` : `${item.change24h}%`}
                  </span>
                </td>

                {/* 15m */}
                <td className="py-3.5 px-3 text-center font-mono">
                  {renderBiasPill(item.m15Bias)}
                </td>

                {/* 1h */}
                <td className="py-3.5 px-3 text-center font-mono">
                  {renderBiasPill(item.h1Bias)}
                </td>

                {/* 4h */}
                <td className="py-3.5 px-3 text-center font-mono">
                  {renderBiasPill(item.h4Bias)}
                </td>

                {/* 1D */}
                <td className="py-3.5 px-3 text-center font-mono">
                  {renderBiasPill(item.d1Bias)}
                </td>

                {/* Dominant Pattern */}
                <td className="py-3.5 px-3">
                  <span className="text-slate-300 text-xs font-medium bg-dark-950 px-2.5 py-1 rounded-md border border-slate-800/80">
                    {item.dominantPattern}
                  </span>
                </td>

                {/* Confluence */}
                <td className="py-3.5 px-3 text-right">
                  <span className="font-mono font-bold text-cyan-400 text-xs">
                    {item.confluenceScore}%
                  </span>
                </td>

                {/* Action button */}
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onSelectSymbol(item.symbol);
                    }}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-semibold border border-cyan-500/30 text-[11px] transition"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
