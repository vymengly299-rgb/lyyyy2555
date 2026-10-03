import React, { useEffect } from 'react';
import { TradeSignal } from '../types';
import { Sparkles, TrendingUp, TrendingDown, X, ArrowRight, Zap } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NotificationToastProps {
  signal: TradeSignal | null;
  onClose: () => void;
  onOpenSignal: (signal: TradeSignal) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  signal,
  onClose,
  onOpenSignal
}) => {
  useEffect(() => {
    if (signal) {
      const timer = setTimeout(() => {
        onClose();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [signal, onClose]);

  if (!signal) return null;

  const isLong = signal.direction === 'LONG';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-dark-900/95 border-2 border-cyan-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-bounce-short">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
            isLong ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}>
            {isLong ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white tracking-wide">{signal.pair}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                isLong ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {signal.direction}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">
                {signal.confidence}% AI
              </span>
            </div>
            <p className="text-[11px] text-cyan-300 font-medium flex items-center mt-0.5">
              <Zap className="w-3 h-3 mr-1 text-cyan-400" />
              {signal.patternLabel}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white p-1 rounded transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-slate-500 text-[10px]">ENTRY: </span>
          <span className="text-white font-bold">{signal.entryPrice}</span>
        </div>
        <div>
          <span className="text-emerald-400/80 text-[10px]">TP: </span>
          <span className="text-emerald-400 font-bold">{signal.tp1}</span>
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenSignal(signal);
            onClose();
          }}
          className="flex items-center space-x-1 px-2.5 py-1 bg-cyan-500 text-dark-950 font-bold rounded-lg text-[11px] hover:bg-cyan-400 transition"
        >
          <span>View</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
