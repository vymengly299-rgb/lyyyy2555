import React from 'react';
import { AssetSummary } from '../types';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface TickerBarProps {
  assets: AssetSummary[];
  onSelectAsset: (symbol: string) => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({ assets, onSelectAsset }) => {
  return (
    <div className="w-full bg-dark-950 border-b border-slate-800/80 overflow-hidden py-1.5 select-none">
      <div className="flex items-center space-x-6 animate-none overflow-x-auto scrollbar-none px-4">
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30 whitespace-nowrap flex-shrink-0">
          <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>LIVE SMC ENGINE</span>
        </div>

        {assets.map((asset) => (
          <div
            key={asset.symbol}
            onClick={() => onSelectAsset(asset.symbol)}
            className="flex items-center space-x-2 text-xs font-mono cursor-pointer hover:bg-slate-800/50 px-2 py-0.5 rounded transition flex-shrink-0"
          >
            <span className="font-bold text-slate-200">{asset.symbol}</span>
            <span className="text-slate-100 font-medium">
              {asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.basePriceDecimals })}
            </span>
            <span
              className={`inline-flex items-center text-[10px] font-semibold ${
                asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {asset.change24h >= 0 ? (
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
              )}
              {asset.change24h >= 0 ? `+${asset.change24h}%` : `${asset.change24h}%`}
            </span>
            <span className="text-slate-600 text-[10px]">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
