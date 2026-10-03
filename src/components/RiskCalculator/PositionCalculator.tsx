import React, { useState } from 'react';
import { TradeSignal } from '../../types';
import { 
  Calculator, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Coins, 
  DollarSign, 
  PieChart, 
  Sliders,
  TrendingUp,
  Percent
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface PositionCalculatorProps {
  initialSignal?: TradeSignal | null;
}

export const PositionCalculator: React.FC<PositionCalculatorProps> = ({
  initialSignal
}) => {
  const [accountSize, setAccountSize] = useState<number>(50000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [entryPrice, setEntryPrice] = useState<number>(initialSignal?.entryPrice || 67250);
  const [stopLoss, setStopLoss] = useState<number>(initialSignal?.stopLoss || 66420);
  const [takeProfit, setTakeProfit] = useState<number>(initialSignal?.tp2 || 69400);

  // Quick Account Size presets
  const ACCOUNT_PRESETS = [10000, 25000, 50000, 100000, 200000];
  const RISK_PRESETS = [0.25, 0.5, 1.0, 2.0];

  // Mathematical computations
  const riskAmount = (accountSize * riskPercent) / 100;
  const priceDistance = Math.abs(entryPrice - stopLoss);
  const priceDistancePercent = entryPrice > 0 ? (priceDistance / entryPrice) * 100 : 0;
  
  // Position size in units
  const positionUnits = priceDistance > 0 ? riskAmount / priceDistance : 0;
  const positionValue = positionUnits * entryPrice;
  const leverageRequired = accountSize > 0 ? positionValue / accountSize : 0;

  // Potential profit calculations
  const rewardDistance = Math.abs(takeProfit - entryPrice);
  const potentialProfit = positionUnits * rewardDistance;
  const riskRewardRatio = priceDistance > 0 ? rewardDistance / priceDistance : 0;

  // Prop firm drawdown check (assuming standard 5% max daily DD)
  const maxDailyDrawdown = accountSize * 0.05;
  const riskOfDailyLimitPercent = maxDailyDrawdown > 0 ? (riskAmount / maxDailyDrawdown) * 100 : 0;

  const handleApplySignal = (sig: TradeSignal) => {
    soundManager.playClick();
    setEntryPrice(sig.entryPrice);
    setStopLoss(sig.stopLoss);
    setTakeProfit(sig.tp2);
  };

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center">
                <span>Prop Firm & Institutional Risk Calculator</span>
                <span className="ml-2.5 px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  SMC Position Engine
                </span>
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculate exact lot size, capital exposure, and risk-to-reward to protect drawdown on prop firm challenges.
          </p>
        </div>

        {initialSignal && (
          <button
            onClick={() => handleApplySignal(initialSignal)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center space-x-1 transition self-start"
          >
            <span>Sync with Active Signal ({initialSignal.pair})</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Account Balance */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Account Size / Capital ($)</label>
              <span className="text-xs font-mono font-bold text-cyan-400">${accountSize.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {ACCOUNT_PRESETS.map(preset => (
                <button
                  key={preset}
                  onClick={() => {
                    soundManager.playClick();
                    setAccountSize(preset);
                  }}
                  className={`py-1.5 text-xs font-mono rounded-lg transition ${
                    accountSize === preset
                      ? 'bg-cyan-500 text-dark-950 font-bold shadow-sm shadow-cyan-500/30'
                      : 'bg-dark-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ${preset / 1000}k
                </button>
              ))}
            </div>
            <input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(Math.max(100, Number(e.target.value)))}
              className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Risk Percentage */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Risk Percentage Per Trade (%)</label>
              <span className="text-xs font-mono font-bold text-rose-400">{riskPercent}% (${riskAmount.toLocaleString()})</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {RISK_PRESETS.map(preset => (
                <button
                  key={preset}
                  onClick={() => {
                    soundManager.playClick();
                    setRiskPercent(preset);
                  }}
                  className={`py-1.5 text-xs font-mono rounded-lg transition ${
                    riskPercent === preset
                      ? 'bg-rose-500 text-white font-bold shadow-sm shadow-rose-500/30'
                      : 'bg-dark-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.05"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full accent-rose-500 bg-slate-800 cursor-pointer"
            />
          </div>

          {/* Trade Execution Inputs */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Entry Price</label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1">Stop Loss</label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-rose-400 focus:outline-none focus:border-rose-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">Take Profit</label>
              <input
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(Number(e.target.value))}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>

        {/* Right Output Summary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-dark-950 rounded-2xl p-5 border border-slate-800 shadow-inner">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Calculated Output</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                100% Mathematically Exact
              </span>
            </div>

            {/* Position Size Card */}
            <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Recommended Position Units</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black font-mono text-white">
                  {positionUnits > 0 ? positionUnits.toFixed(positionUnits > 10 ? 2 : 4) : '0.00'}
                </span>
                <span className="text-xs text-slate-400 font-mono">Units / Contracts</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Total Notional Exposure: ${positionValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({leverageRequired.toFixed(2)}x Effective Leverage)
              </p>
            </div>

            {/* Risk vs Reward Metric */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-dark-900 border border-rose-500/20">
                <span className="text-[10px] text-rose-400/80 block">MAX DOLLAR RISK</span>
                <span className="text-base font-bold text-rose-400">-${riskAmount.toFixed(2)}</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">({priceDistancePercent.toFixed(2)}% SL distance)</span>
              </div>

              <div className="p-3 rounded-xl bg-dark-900 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400/80 block">PROJECTED PROFIT</span>
                <span className="text-base font-bold text-emerald-400">+${potentialProfit.toFixed(2)}</span>
                <span className="block text-[10px] text-emerald-400/70 mt-0.5 font-bold">1 : {riskRewardRatio.toFixed(2)} R:R</span>
              </div>
            </div>

            {/* Prop Firm Safety Badge */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">Prop Firm Challenge Guard</span>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  This trade consumes <strong className="text-cyan-300 font-mono">{riskOfDailyLimitPercent.toFixed(1)}%</strong> of your maximum standard 5% daily drawdown allowance.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Formula: Position = Risk $ / (Entry - SL)</span>
            <span className="text-emerald-400 font-mono font-medium">Verified SMC Risk Model</span>
          </div>
        </div>
      </div>
    </div>
  );
};
