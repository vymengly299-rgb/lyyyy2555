import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  AssetSummary, 
  Candle, 
  ClosedTrade, 
  HeatmapItem, 
  StructureAnnotation, 
  Timeframe, 
  TradeSignal 
} from './types';
import { 
  INITIAL_ASSETS, 
  INITIAL_SIGNALS, 
  HEATMAP_DATA, 
  CLOSED_TRADES, 
  generateCandles 
} from './data/mockData';
import { soundManager } from './utils/audio';

// Components
import { Header } from './components/Header';
import { TickerBar } from './components/TickerBar';
import { HeroSection } from './components/HeroSection';
import { TradingChart } from './components/ChartTerminal/TradingChart';
import { StructureInspector } from './components/ChartTerminal/StructureInspector';
import { SignalFeed } from './components/SignalScanner/SignalFeed';
import { SignalDetailModal } from './components/SignalScanner/SignalDetailModal';
import { CopilotChat } from './components/AICopilot/CopilotChat';
import { StructureHeatmap } from './components/HeatmapMatrix/StructureHeatmap';
import { PositionCalculator } from './components/RiskCalculator/PositionCalculator';
import { BacktestDashboard } from './components/Performance/BacktestDashboard';
import { PricingSection } from './components/Pricing/PricingSection';
import { WebhookModal } from './components/Integrations/WebhookModal';
import { NotificationToast } from './components/NotificationToast';
import { Footer } from './components/Footer';

export function App() {
  // Global State
  const [assets, setAssets] = useState<AssetSummary[]>(INITIAL_ASSETS);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USDT');
  const [timeframe, setTimeframe] = useState<Timeframe>('15m');
  const [signals, setSignals] = useState<TradeSignal[]>(INITIAL_SIGNALS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [userTier, setUserTier] = useState<string>('PRO');
  const [activeSection, setActiveSection] = useState<string>('signals');

  // Modals & Toasts
  const [detailModalSignal, setDetailModalSignal] = useState<TradeSignal | null>(null);
  const [webhookModalOpen, setWebhookModalOpen] = useState<boolean>(false);
  const [toastSignal, setToastSignal] = useState<TradeSignal | null>(null);

  // Calculator target signal
  const [calculatorSignal, setCalculatorSignal] = useState<TradeSignal | null>(null);

  // Section Refs for smooth scrolling
  const terminalRef = useRef<HTMLDivElement>(null);
  const signalsRef = useRef<HTMLDivElement>(null);
  const copilotRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const backtestRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  // Current Asset
  const currentAsset = useMemo(() => {
    return assets.find(a => a.symbol === selectedSymbol) || assets[0];
  }, [assets, selectedSymbol]);

  // Current Signal for the selected asset
  const activeSignalForAsset = useMemo(() => {
    return signals.find(s => s.pair === selectedSymbol);
  }, [signals, selectedSymbol]);

  // Generate Candlestick Data & Market Structure Annotations for the current asset
  const { candles, structure } = useMemo(() => {
    return generateCandles(currentAsset.price, 75, currentAsset.market === 'forex' ? 0.0006 : 0.0035);
  }, [currentAsset.symbol, currentAsset.price, currentAsset.market]);

  // Sound sync
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
  };

  // Live asset price tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(a => {
        const changePercent = (Math.random() - 0.49) * 0.0012;
        const newPrice = Number((a.price * (1 + changePercent)).toFixed(a.basePriceDecimals));
        return {
          ...a,
          price: newPrice
        };
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Periodic automatic simulated signal popup every 45s (if user is browsing)
  useEffect(() => {
    const timer = setTimeout(() => {
      const randomSig = signals[Math.floor(Math.random() * signals.length)];
      setToastSignal(randomSig);
      if (soundEnabled) {
        soundManager.playSignalBullish();
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [signals, soundEnabled]);

  // Handler to simulate new signal on demand
  const handleSimulateNewSignal = () => {
    const newId = `sig-dyn-${Date.now()}`;
    const possibleAssets = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XAU/USD', 'EUR/USD', 'NAS100'];
    const chosenAsset = possibleAssets[Math.floor(Math.random() * possibleAssets.length)];
    const assetMeta = assets.find(a => a.symbol === chosenAsset) || assets[0];
    const isLong = Math.random() > 0.35;

    const baseP = assetMeta.price;
    const slDist = baseP * 0.012;
    const entry = baseP;
    const sl = isLong ? entry - slDist : entry + slDist;
    const tp1 = isLong ? entry + slDist * 1.8 : entry - slDist * 1.8;
    const tp2 = isLong ? entry + slDist * 3.2 : entry - slDist * 3.2;
    const tp3 = isLong ? entry + slDist * 4.8 : entry - slDist * 4.8;

    const newSig: TradeSignal = {
      id: newId,
      pair: chosenAsset,
      name: assetMeta.name,
      market: assetMeta.market,
      direction: isLong ? 'LONG' : 'SHORT',
      timeframe: '15m',
      entryPrice: Number(entry.toFixed(assetMeta.basePriceDecimals)),
      currentPrice: Number(entry.toFixed(assetMeta.basePriceDecimals)),
      stopLoss: Number(sl.toFixed(assetMeta.basePriceDecimals)),
      tp1: Number(tp1.toFixed(assetMeta.basePriceDecimals)),
      tp2: Number(tp2.toFixed(assetMeta.basePriceDecimals)),
      tp3: Number(tp3.toFixed(assetMeta.basePriceDecimals)),
      riskReward: Number(((tp2 - entry) / slDist).toFixed(2)),
      confidence: Math.floor(Math.random() * 8 + 91),
      status: 'ACTIVE',
      pattern: 'ORDER_BLOCK_RETEST',
      patternLabel: isLong ? 'Fresh 15m Demand Block Retest' : 'Supply Zone Mitigation Short',
      timestamp: Date.now(),
      pnlPercentage: 0.15,
      confluenceFactors: [
        'Break of Structure (BOS) validated on 15m frame',
        'Institutional volume delta surge (+3,100 volume units)',
        'Unmitigated Fair Value Gap filled with aggressive displacement'
      ],
      notes: 'Take 40% partials at TP1 and adjust stop loss to breakeven.'
    };

    setSignals(prev => [newSig, ...prev]);
    setSelectedSymbol(chosenAsset);
    setToastSignal(newSig);
    if (soundEnabled) {
      if (isLong) soundManager.playSignalBullish();
      else soundManager.playSignalBearish();
    }
  };

  // Scroll navigation helper
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const mapping: Record<string, React.RefObject<HTMLDivElement | null>> = {
      hero: { current: null },
      signals: signalsRef,
      terminal: terminalRef,
      copilot: copilotRef,
      heatmap: heatmapRef,
      calculator: calculatorRef,
      backtest: backtestRef,
      pricing: pricingRef,
    };

    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const ref = mapping[sectionId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectSignal = (sig: TradeSignal) => {
    setSelectedSymbol(sig.pair);
    soundManager.playClick();
    if (terminalRef.current) {
      terminalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleApplyToCalculator = (sig: TradeSignal) => {
    setCalculatorSignal(sig);
    soundManager.playClick();
    if (calculatorRef.current) {
      calculatorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Global Live Ticker Bar */}
      <TickerBar 
        assets={assets} 
        onSelectAsset={(sym) => {
          setSelectedSymbol(sym);
          handleNavigate('terminal');
        }} 
      />

      {/* 2. Top Navigation Bar */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenWebhookModal={() => setWebhookModalOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        userTier={userTier}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-4">
        {/* 3. Hero Section */}
        <section id="hero">
          <HeroSection
            onScrollToTerminal={() => handleNavigate('terminal')}
            onScrollToSignals={() => handleNavigate('signals')}
            onOpenPricing={() => handleNavigate('pricing')}
            activeSignalsCount={signals.length}
          />
        </section>

        {/* 4. Interactive Market Structure Chart Terminal & Inspector */}
        <section id="terminal" ref={terminalRef} className="pt-4 scroll-mt-20">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center">
                <span>AI Structure Terminal</span>
                <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Sub-Second Canvas Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing real-time Break of Structure (BOS), Order Blocks (OB), Fair Value Gaps (FVG) and Liquidity Purges.
              </p>
            </div>

            {/* Quick Asset Switcher */}
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
              {assets.slice(0, 6).map(a => (
                <button
                  key={a.symbol}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedSymbol(a.symbol);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition ${
                    selectedSymbol === a.symbol
                      ? 'bg-cyan-500 text-dark-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'bg-dark-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {a.symbol}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Chart Area (8 cols) */}
            <div className="lg:col-span-8">
              <TradingChart
                asset={currentAsset}
                candles={candles}
                structure={structure}
                activeSignal={activeSignalForAsset}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                onApplySignalToCalc={handleApplyToCalculator}
              />
            </div>

            {/* Structure Inspector Sidebar (4 cols) */}
            <div className="lg:col-span-4">
              <StructureInspector
                asset={currentAsset}
                structure={structure}
                activeSignal={activeSignalForAsset}
                onOpenSignalModal={setDetailModalSignal}
                onOpenWebhookModal={() => setWebhookModalOpen(true)}
              />
            </div>
          </div>
        </section>

        {/* 5. Live AI Signal Scanner & Feed */}
        <section id="signals" ref={signalsRef} className="pt-4 scroll-mt-20">
          <SignalFeed
            signals={signals}
            onSelectSignal={handleSelectSignal}
            onOpenDetailModal={setDetailModalSignal}
            onApplyToCalculator={handleApplyToCalculator}
            onSimulateNewSignal={handleSimulateNewSignal}
          />
        </section>

        {/* 6. AI Strategy Copilot */}
        <section id="copilot" ref={copilotRef} className="pt-4 scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white tracking-tight">AI Strategy Copilot</h2>
            <p className="text-xs text-slate-400 mt-1">
              Ask natural language questions to deconstruct market structure, filter setups, and uncover institutional bias.
            </p>
          </div>
          <CopilotChat
            onLoadAsset={(sym) => {
              setSelectedSymbol(sym);
              handleNavigate('terminal');
            }}
            onOpenSignal={setDetailModalSignal}
            availableSignals={signals}
          />
        </section>

        {/* 7. Multi-Timeframe Structure Heatmap */}
        <section id="heatmap" ref={heatmapRef} className="pt-4 scroll-mt-20">
          <StructureHeatmap
            items={HEATMAP_DATA}
            onSelectSymbol={(sym) => {
              setSelectedSymbol(sym);
              handleNavigate('terminal');
            }}
          />
        </section>

        {/* 8. Prop Firm & Risk Management Calculator */}
        <section id="calculator" ref={calculatorRef} className="pt-4 scroll-mt-20">
          <PositionCalculator
            initialSignal={calculatorSignal || activeSignalForAsset}
          />
        </section>

        {/* 9. Verified Backtest Dashboard */}
        <section id="backtest" ref={backtestRef} className="pt-4 scroll-mt-20">
          <BacktestDashboard
            closedTrades={CLOSED_TRADES}
          />
        </section>

        {/* 10. Pricing & VIP Membership */}
        <section id="pricing" ref={pricingRef} className="pt-4 scroll-mt-20">
          <PricingSection
            onPlanSelected={(plan) => setUserTier(plan)}
          />
        </section>
      </main>

      {/* 11. Footer */}
      <Footer />

      {/* Modals & Floating Overlays */}
      <SignalDetailModal
        signal={detailModalSignal}
        onClose={() => setDetailModalSignal(null)}
        onApplyToCalculator={handleApplyToCalculator}
      />

      <WebhookModal
        isOpen={webhookModalOpen}
        onClose={() => setWebhookModalOpen(false)}
      />

      <NotificationToast
        signal={toastSignal}
        onClose={() => setToastSignal(null)}
        onOpenSignal={setDetailModalSignal}
      />
    </div>
  );
}

export default App;
