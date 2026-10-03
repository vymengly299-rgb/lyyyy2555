import React, { useState } from 'react';
import { TradeSignal } from '../../types';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Copy, 
  Check, 
  Zap, 
  ShieldCheck, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  Send,
  Sliders,
  DollarSign
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface SignalDetailModalProps {
  signal: TradeSignal | null;
  onClose: () => void;
  onApplyToCalculator: (signal: TradeSignal) => void;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({
  signal,
  onClose,
  onApplyToCalculator
}) => {
  const [copied, setCopied] = useState(false);
  const [webhookSent, setWebhookSent] = useState(false);

  if (!signal) return null;

  const isLong = signal.direction === 'LONG';

  const copyFullBlueprint = () => {
    soundManager.playClick();
    const text = `=============================
STRUCT AI INSTITUTIONAL SIGNAL
=============================
Asset: ${signal.pair} (${signal.name})
Direction: ${signal.direction}
Pattern: ${signal.patternLabel}
Timeframe: ${signal.timeframe}
AI Confluence Score: ${signal.confidence}%
Risk/Reward Ratio: 1:${signal.riskReward}

[EXECUTION LEVELS]
Entry Limit: ${signal.entryPrice}
Stop Loss: ${signal.stopLoss}
Take Profit 1: ${signal.tp1} (Take 40% & Move SL to Breakeven)
Take Profit 2: ${signal.tp2} (Take 35%)
Take Profit 3: ${signal.tp3} (Runner 25%)

[SMART MONEY REASONING]
${signal.confluenceFactors.map(f => `• ${f}`).join('\n')}

Notes: ${signal.notes}
=============================`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateWebhookSend = () => {
    soundManager.playClick();
    setWebhookSent(true);
    setTimeout(() => setWebhookSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-dark-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
              isLong ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}>
              {isLong ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-white">{signal.pair}</h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isLong ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {signal.direction}
                </span>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                  {signal.timeframe}
                </span>
              </div>
              <p className="text-xs text-cyan-400 font-medium mt-1 flex items-center">
                <Zap className="w-3.5 h-3.5 mr-1" />
                {signal.patternLabel}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Confidence & Metrics Banner */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="bg-dark-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">AI Confluence</span>
            <span className="text-lg font-mono font-bold text-cyan-400">{signal.confidence}%</span>
          </div>
          <div className="bg-dark-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Risk : Reward</span>
            <span className="text-lg font-mono font-bold text-emerald-400">1 : {signal.riskReward}</span>
          </div>
          <div className="bg-dark-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target 3 Potential</span>
            <span className="text-lg font-mono font-bold text-indigo-400">
              +{((Math.abs(signal.tp3 - signal.entryPrice) / signal.entryPrice) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Execution Levels Table */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Execution Matrix</h4>
          <div className="bg-dark-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between p-3 border-b border-slate-800/80 bg-slate-900/40">
              <span className="text-slate-300 font-sans font-medium">Entry Price</span>
              <span className="text-cyan-400 font-bold text-sm">{signal.entryPrice}</span>
            </div>
            <div className="flex items-center justify-between p-3 border-b border-slate-800/80">
              <div>
                <span className="text-rose-400 font-sans font-medium block">Stop Loss (Invalidation)</span>
                <span className="text-[10px] text-slate-500 font-sans">Below institutional order block</span>
              </div>
              <span className="text-rose-400 font-bold text-sm">{signal.stopLoss}</span>
            </div>
            <div className="flex items-center justify-between p-3 border-b border-slate-800/80 bg-emerald-950/10">
              <div>
                <span className="text-emerald-400 font-sans font-medium block">Take Profit 1</span>
                <span className="text-[10px] text-slate-400 font-sans">Secure 40% & Move SL to Breakeven</span>
              </div>
              <span className="text-emerald-400 font-bold text-sm">{signal.tp1}</span>
            </div>
            <div className="flex items-center justify-between p-3 border-b border-slate-800/80 bg-emerald-950/15">
              <div>
                <span className="text-emerald-400 font-sans font-medium block">Take Profit 2</span>
                <span className="text-[10px] text-slate-400 font-sans">Secure 35% at key liquidity pool</span>
              </div>
              <span className="text-emerald-400 font-bold text-sm">{signal.tp2}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-950/25">
              <div>
                <span className="text-emerald-300 font-sans font-bold block">Take Profit 3 (Runner Target)</span>
                <span className="text-[10px] text-slate-400 font-sans">Weekly structural expansion level</span>
              </div>
              <span className="text-emerald-300 font-bold text-sm">{signal.tp3}</span>
            </div>
          </div>
        </div>

        {/* Confluence Checkpoints */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Smart Money Confluence Checklist</h4>
          <div className="space-y-1.5 bg-dark-950/60 p-3 rounded-xl border border-slate-800">
            {signal.confluenceFactors.map((factor, index) => (
              <div key={index} className="flex items-start text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Notes */}
        <div className="mb-6 p-3 rounded-xl bg-slate-800/40 border border-slate-700 text-xs text-slate-300">
          <span className="font-semibold text-white block mb-0.5">Execution Rule:</span>
          {signal.notes}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onApplyToCalculator(signal);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-dark-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Calculate Lot & Risk</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={simulateWebhookSend}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold rounded-xl transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{webhookSent ? 'Dispatched to MT5 / Bybit!' : 'Test Webhook Push'}</span>
            </button>

            <button
              onClick={copyFullBlueprint}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-dark-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Full Blueprint'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
