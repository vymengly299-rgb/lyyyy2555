import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Star,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audio';

interface PricingSectionProps {
  onPlanSelected: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onPlanSelected }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activePlan, setActivePlan] = useState<string>('PRO');

  const handleSelectPlan = (name: string) => {
    soundManager.playSignalBullish();
    setActivePlan(name);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onPlanSelected(name);
  };

  const FAQS = [
    {
      q: "How does StructAI identify Market Structure and Order Blocks?",
      a: "Our neural transformer models process raw tick-by-tick order book depth and volumetric transaction logs to identify Break of Structure (BOS), Change of Character (CHoCH), Order Blocks (OB), and Fair Value Gaps (FVG) in sub-second intervals before retail charts render them."
    },
    {
      q: "Can I use StructAI trade signals for Prop Firm evaluations (FTMO, FundedNext, Apex)?",
      a: "Yes! Over 1,420 funded traders use StructAI specifically because our signals come with strict invalidation levels, multi-take-profit milestones, and our built-in Prop Firm Risk Calculator guarantees you never exceed daily drawdown limits."
    },
    {
      q: "Are webhooks supported for automated execution on Bybit, Binance, and MetaTrader?",
      a: "Yes. Pro and Institutional tiers provide instant Webhook endpoints that push structured JSON orders to 3Commas, TradingView alerts, Bybit, Binance Futures, and MT4/MT5 via our bridge."
    },
    {
      q: "Do I get access to the TradingView PineScript indicator?",
      a: "Yes! All Pro and Institutional subscriptions include complete access to our proprietary PineScript v5 indicator script so you can overlay all institutional levels directly on your TradingView charts."
    }
  ];

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Institutional Tier Membership</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Transparent, High-Edge Plans
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Unlock real-time sub-second signals, institutional market structure overlays, and automated webhook routing.
        </p>

        {/* Billing Switch */}
        <div className="mt-6 inline-flex items-center bg-dark-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              soundManager.playClick();
              setBillingCycle('monthly');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              billingCycle === 'monthly' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setBillingCycle('annual');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              billingCycle === 'annual' ? 'bg-cyan-500 text-dark-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual (Save 25%)</span>
            <span className="text-[10px] bg-dark-950 text-cyan-300 px-1.5 py-0.2 rounded font-mono">PROMO</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Tier 1: Explorer */}
        <div className="bg-dark-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Explorer</h3>
              <span className="text-xs text-slate-400 font-mono">Free Tier</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">For aspiring traders learning Smart Money Concepts.</p>

            <div className="mt-4 mb-6">
              <span className="text-3xl font-extrabold text-white font-mono">$0</span>
              <span className="text-xs text-slate-400 ml-1">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center"><Check className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" /> Daily Top 3 AI Signals (1h+ Timeframes)</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" /> Interactive Structure Chart Terminal</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" /> Prop Firm Risk Calculator</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" /> Community Telegram Access</li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('EXPLORER')}
            className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
          >
            {activePlan === 'EXPLORER' ? '✓ Currently Active' : 'Get Started Free'}
          </button>
        </div>

        {/* Tier 2: Pro Trader (Most Popular) */}
        <div className="bg-dark-950 border-2 border-cyan-500/80 rounded-2xl p-6 flex flex-col justify-between relative shadow-2xl shadow-cyan-500/10 scale-[1.02]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-dark-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
            Most Popular • Prop Trader Choice
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center">
                <span>Pro Trader</span>
                <Sparkles className="w-4 h-4 text-cyan-400 ml-1.5" />
              </h3>
              <span className="text-xs text-cyan-400 font-mono font-bold">VIP Access</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Full real-time signals across Crypto, Forex & Indices.</p>

            <div className="mt-4 mb-6">
              <span className="text-4xl font-extrabold text-white font-mono">
                {billingCycle === 'annual' ? '$36' : '$49'}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
              {billingCycle === 'annual' && (
                <span className="block text-[10px] text-cyan-400 mt-1 font-mono">Billed annually ($432/yr) • Save $156</span>
              )}
            </div>

            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-center"><Check className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0 font-bold" /> <strong>All Live Signals (5m, 15m, 1h, 4h)</strong></li>
              <li className="flex items-center"><Check className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" /> Full Order Block & Fair Value Gap Heatmap</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" /> Instant Telegram Push Alerts (&lt;25ms)</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" /> <strong>TradingView PineScript v5 Source Access</strong></li>
              <li className="flex items-center"><Check className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" /> Unlimited AI Strategy Copilot Queries</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" /> Webhook Integration for 3Commas & MT5</li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('PRO')}
            className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-dark-950 text-xs font-black shadow-lg shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
          >
            {activePlan === 'PRO' ? '✓ Pro Membership Active' : 'Upgrade to Pro Trader'}
          </button>
        </div>

        {/* Tier 3: Institutional */}
        <div className="bg-dark-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Institutional</h3>
              <span className="text-xs text-indigo-400 font-mono">Fund Manager</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">For prop firms, family offices, and high-frequency traders.</p>

            <div className="mt-4 mb-6">
              <span className="text-3xl font-extrabold text-white font-mono">
                {billingCycle === 'annual' ? '$119' : '$149'}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center"><Check className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" /> Sub-second REST & WebSocket Signal API</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" /> 1-Minute High-Frequency Microstructure Scalping</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" /> Dedicated Direct VPS Webhook Relay</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" /> Private Discord Desk & Strategy Advisory</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" /> Custom Neural Weight Fine-Tuning</li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('INSTITUTIONAL')}
            className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
          >
            {activePlan === 'INSTITUTIONAL' ? '✓ Institutional Active' : 'Deploy Institutional Access'}
          </button>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="mt-14 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-white text-center mb-6">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-dark-950 border border-slate-800 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
