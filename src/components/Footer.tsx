import React from 'react';
import { Cpu, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-950 border-t border-slate-800/80 text-slate-400 text-xs py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-wider">
                STRUCT<span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Institutional Trade Signal & Market Structure Intelligence. Transforming Smart Money Concepts into mathematical precision for crypto, forex, and equities.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 14 Neural Models Synced (18ms)</span>
            </div>
          </div>

          {/* Market Structure Terminology */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">SMC Core Mechanics</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-cyan-400 transition cursor-pointer">Break of Structure (BOS) Engine</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">Change of Character (CHoCH) Shifts</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">Order Block (OB) Identification</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">Fair Value Gap (FVG) Imbalance Detection</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">Sell-Side & Buy-Side Liquidity Purges</li>
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Integrations & API</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-cyan-400 transition cursor-pointer">TradingView PineScript v5 Generator</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">Bybit & Binance Futures Webhooks</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">MetaTrader 4 / MetaTrader 5 Bridge</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">Prop Firm Challenge Optimization (FTMO)</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">REST & WebSocket Market Stream</li>
            </ul>
          </div>

          {/* Community & Alerts */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">VIP Desks</h4>
            <p className="text-xs text-slate-400 mb-3">
              Join 18,400+ algorithmic and prop traders in our private Telegram & Discord feeds.
            </p>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.open('https://t.me', '_blank')}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram VIP</span>
              </button>
              <button 
                onClick={() => window.open('https://tradingview.com', '_blank')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                TradingView
              </button>
            </div>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
          <p className="mb-2">
            <strong className="text-slate-400">Institutional Risk Disclosure:</strong> Trading foreign exchange, cryptocurrencies, indices, and commodities on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade signals from StructAI, you should carefully consider your investment objectives, level of experience, and risk appetite. Past backtested performance is not necessarily indicative of future results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[10px] pt-3">
            <span>© 2026 StructAI Intelligence Platform. All rights reserved.</span>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0 font-mono">
              <span>Security: SOC2 Type II Certified</span>
              <span>•</span>
              <span>Encrypted API Tokens</span>
              <span>•</span>
              <span>Version 4.2.8-prod</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
