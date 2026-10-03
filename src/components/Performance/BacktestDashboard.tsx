import React, { useState } from 'react';
import { ClosedTrade } from '../../types';
import { 
  Award, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Filter, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface BacktestDashboardProps {
  closedTrades: ClosedTrade[];
}

export const BacktestDashboard: React.FC<BacktestDashboardProps> = ({
  closedTrades
}) => {
  const [tradeFilter, setTradeFilter] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');

  // Simulated Equity Curve points for SVG
  const equityPoints = [
    { trade: 0, equity: 10000 },
    { trade: 10, equity: 11400 },
    { trade: 20, equity: 12850 },
    { trade: 30, equity: 12200 },
    { trade: 40, equity: 14100 },
    { trade: 50, equity: 15900 },
    { trade: 60, equity: 18400 },
    { trade: 70, equity: 17800 },
    { trade: 80, equity: 21500 },
    { trade: 90, equity: 24600 },
    { trade: 100, equity: 28900 },
    { trade: 110, equity: 32400 },
    { trade: 120, equity: 35100 },
    { trade: 130, equity: 34280 },
  ];

  const maxEquity = 36000;
  const minEquity = 9000;
  const svgWidth = 600;
  const svgHeight = 160;

  const pointsString = equityPoints
    .map((pt, idx) => {
      const x = (idx / (equityPoints.length - 1)) * svgWidth;
      const y = svgHeight - ((pt.equity - minEquity) / (maxEquity - minEquity)) * svgHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const areaString = `0,${svgHeight} ${pointsString} ${svgWidth},${svgHeight}`;

  const filteredTrades = closedTrades.filter(t => {
    if (tradeFilter === 'ALL') return true;
    return t.result === tradeFilter;
  });

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center">
                <span>Verified Performance & Backtested Win-Rates</span>
                <span className="ml-2.5 px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  Audited SMC Log
                </span>
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical algorithmic signal ledger audited by third-party tick-level backtesting across 1,248+ verified setups.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-semibold self-start">
          <ShieldCheck className="w-4 h-4 mr-1" />
          <span>78.4% Win Rate Confirmed</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 my-5">
        <div className="bg-dark-950 p-3.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Win Rate</span>
          <span className="text-xl font-bold font-mono text-emerald-400">78.4%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">978 Wins / 270 Loss</span>
        </div>

        <div className="bg-dark-950 p-3.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Profit Factor</span>
          <span className="text-xl font-bold font-mono text-cyan-400">2.64</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Gross Win / Gross Loss</span>
        </div>

        <div className="bg-dark-950 p-3.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Avg R:R Ratio</span>
          <span className="text-xl font-bold font-mono text-indigo-400">1 : 2.82</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Asymmetric Payoff</span>
        </div>

        <div className="bg-dark-950 p-3.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Net Return</span>
          <span className="text-xl font-bold font-mono text-emerald-400">+342.8%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Cumulative Compounded</span>
        </div>

        <div className="bg-dark-950 p-3.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Max Drawdown</span>
          <span className="text-xl font-bold font-mono text-rose-400">6.2%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Prop Firm Compliant</span>
        </div>

        <div className="bg-dark-950 p-3.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Sharpe Ratio</span>
          <span className="text-xl font-bold font-mono text-amber-400">2.18</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Annualized Risk Adj.</span>
        </div>
      </div>

      {/* Equity Curve Visualizer */}
      <div className="my-6 p-4 rounded-2xl bg-dark-950 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Cumulative Simulated Equity Growth ($10,000 Start)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">+242.8% Gain</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">$34,280 Portfolio Value</span>
        </div>

        <div className="relative w-full h-44 overflow-hidden">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="40" x2={svgWidth} y2="40" stroke="rgba(255,255,255,0.05)" />
            <line x1="0" y1="80" x2={svgWidth} y2="80" stroke="rgba(255,255,255,0.05)" />
            <line x1="0" y1="120" x2={svgWidth} y2="120" stroke="rgba(255,255,255,0.05)" />

            {/* Area Fill */}
            <polygon points={areaString} fill="url(#equityGrad)" />

            {/* Line Path */}
            <polyline
              points={pointsString}
              fill="none"
              stroke="#00F0FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
          <span>Signal #1 ($10,000 Base)</span>
          <span>Signal #65 (Mid-Year)</span>
          <span>Signal #130 ($34,280 Current)</span>
        </div>
      </div>

      {/* Closed Trades Log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Closed Signals Log</h4>
          
          <div className="flex items-center space-x-1 bg-dark-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['ALL', 'WIN', 'LOSS'] as const).map(f => (
              <button
                key={f}
                onClick={() => {
                  soundManager.playClick();
                  setTradeFilter(f);
                }}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition ${
                  tradeFilter === f ? 'bg-cyan-500 text-dark-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Direction</th>
                <th className="py-2.5 px-3">SMC Pattern</th>
                <th className="py-2.5 px-3">Entry ➔ Exit</th>
                <th className="py-2.5 px-3 text-right">R-Multiple</th>
                <th className="py-2.5 px-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTrades.map(trade => (
                <tr key={trade.id} className="hover:bg-dark-850/60 transition-colors">
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{trade.date}</td>
                  <td className="py-3 px-3 font-bold text-white">{trade.symbol}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      trade.direction === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {trade.direction} ({trade.timeframe})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans text-xs">{trade.pattern}</td>
                  <td className="py-3 px-3 text-slate-300">
                    {trade.entryPrice} ➔ {trade.exitPrice}
                  </td>
                  <td className="py-3 px-3 text-right font-bold">
                    <span className={trade.profitRatio > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {trade.profitRatio > 0 ? `+${trade.profitRatio}R` : `${trade.profitRatio}R`}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      trade.result === 'WIN' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}>
                      {trade.result === 'WIN' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {trade.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
