import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  BarChart2,
  Terminal,
  Layers
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeroSectionProps {
  onScrollToTerminal: () => void;
  onScrollToSignals: () => void;
  onOpenPricing: () => void;
  activeSignalsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToTerminal,
  onScrollToSignals,
  onOpenPricing,
  activeSignalsCount
}) => {
  return (
    <div className="relative pt-6 pb-12 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-dark-900/90 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-500/10 text-xs">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold text-cyan-300">StructAI Engine v4.2 Live</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 hidden sm:inline">Institutional Smart Money Order Flow & SMC Signals</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono font-bold">18ms</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Trade Signals Engineered from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              Institutional Market Structure
            </span>
          </h1>
          
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Deconstruct algorithmic liquidity. StructAI continuously calculates <strong className="text-white">Break of Structure (BOS)</strong>, <strong className="text-white">Order Blocks (OB)</strong>, and <strong className="text-white">Fair Value Gaps (FVG)</strong> to generate audited trade setups with 78.4% verified win rates.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => {
                soundManager.playClick();
                onScrollToTerminal();
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-dark-950 font-extrabold text-sm flex items-center space-x-2 shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Structure Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onScrollToSignals();
              }}
              className="px-5 py-3.5 rounded-xl bg-dark-900/90 hover:bg-dark-850 border border-slate-700/80 hover:border-cyan-500/40 text-slate-100 font-bold text-sm flex items-center space-x-2 shadow-lg transition-all"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Explore Active Signals ({activeSignalsCount})</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenPricing();
              }}
              className="px-4 py-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition"
            >
              Pricing & VIP
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800/80 backdrop-blur-sm text-center">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 block">78.4%</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5 block">Verified Signal Win Rate</span>
            <span className="text-[10px] text-slate-500 font-mono">1,248 Audited Setups</span>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800/80 backdrop-blur-sm text-center">
            <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400 block">1 : 2.85</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5 block">Average Risk-to-Reward</span>
            <span className="text-[10px] text-slate-500 font-mono">Asymmetric Upside</span>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800/80 backdrop-blur-sm text-center">
            <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-400 block">1,420+</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5 block">Prop Traders Funded</span>
            <span className="text-[10px] text-slate-500 font-mono">FTMO, Apex & Topstep</span>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800/80 backdrop-blur-sm text-center">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 block">&lt; 25ms</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5 block">Signal Dispatch Latency</span>
            <span className="text-[10px] text-slate-500 font-mono">Direct Webhook Push</span>
          </div>
        </div>
      </div>
    </div>
  );
};
