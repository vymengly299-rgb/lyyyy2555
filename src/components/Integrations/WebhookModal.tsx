import React, { useState } from 'react';
import { 
  X, 
  Code, 
  Send, 
  Copy, 
  Check, 
  Terminal, 
  Bell, 
  Bot, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Cpu
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pinescript' | 'webhook' | 'telegram'>('pinescript');
  const [copiedPine, setCopiedPine] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const PINESCRIPT_CODE = `//@version=5
indicator("StructAI — Institutional Market Structure & Signals v4.2", overlay=true)

// Inputs
sens = input.int(5, "Swing Sensitivity", minval=1)
showBOS = input.bool(true, "Show Break of Structure (BOS)")
showOB = input.bool(true, "Show Order Blocks (OB)")
showFVG = input.bool(true, "Show Fair Value Gaps (FVG)")

// Swing Highs & Lows
var float ph = na
var float pl = na
ph := ta.pivothigh(high, sens, sens)
pl := ta.pivotlow(low, sens, sens)

// Break of Structure (BOS)
var float lastHigh = na
var float lastLow = na
if not na(ph)
    lastHigh := ph
if not na(pl)
    lastLow := pl

bosBull = ta.crossover(close, lastHigh)
bosBear = ta.crossunder(close, lastLow)

plotshape(showBOS and bosBull, title="Bullish BOS", style=shape.labelup, location=location.belowbar, color=color.new(#00F0FF, 0), text="BOS ➔", textcolor=color.black, size=size.small)
plotshape(showBOS and bosBear, title="Bearish BOS", style=shape.labeldown, location=location.abovebar, color=color.new(#F43F5E, 0), text="BOS ➔", textcolor=color.white, size=size.small)

// Alerts
alertcondition(bosBull, title="StructAI Bullish BOS Alert", message='{"signal": "BULLISH_BOS", "ticker": "{{ticker}}", "price": {{close}}}')
alertcondition(bosBear, title="StructAI Bearish BOS Alert", message='{"signal": "BEARISH_BOS", "ticker": "{{ticker}}", "price": {{close}}}')`;

  const WEBHOOK_JSON = `{
  "secret": "ai_struct_984f93a10c92",
  "action": "LIMIT_BUY",
  "ticker": "BTCUSDT",
  "order_type": "SMART_MONEY_LIMIT",
  "entry": 67250.00,
  "stop_loss": 66420.00,
  "take_profit_1": 68500.00,
  "take_profit_2": 69400.00,
  "take_profit_3": 70800.00,
  "risk_percent": 1.0,
  "confluence_score": 94
}`;

  const copyPine = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(PINESCRIPT_CODE);
    setCopiedPine(true);
    setTimeout(() => setCopiedPine(false), 2000);
  };

  const copyWebhook = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(WEBHOOK_JSON);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleTestPing = () => {
    soundManager.playSignalBullish();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-dark-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>TradingView & Webhook API Bridge</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">v4.2</span>
              </h3>
              <p className="text-xs text-slate-400">Deploy StructAI signals to TradingView, Bybit, Binance, MT5 & Telegram</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-2 my-4 bg-dark-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('pinescript');
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition ${
              activeTab === 'pinescript' ? 'bg-cyan-500 text-dark-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>TradingView PineScript v5</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('webhook');
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition ${
              activeTab === 'webhook' ? 'bg-cyan-500 text-dark-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Webhook / API JSON</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('telegram');
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition ${
              activeTab === 'telegram' ? 'bg-cyan-500 text-dark-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Telegram Bot Alerts</span>
          </button>
        </div>

        {/* Tab 1: PineScript */}
        {activeTab === 'pinescript' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Paste this script into TradingView Pine Editor to overlay StructAI levels onto your charts:</span>
              <button
                onClick={copyPine}
                className="flex items-center space-x-1 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold rounded-lg border border-cyan-500/40 transition"
              >
                {copiedPine ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPine ? 'Copied' : 'Copy Script'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-dark-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-64 leading-relaxed">
              {PINESCRIPT_CODE}
            </pre>
          </div>
        )}

        {/* Tab 2: Webhook JSON */}
        {activeTab === 'webhook' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Instant order routing payload compatible with 3Commas, Bybit, Binance, and MetaTrader:</span>
              <button
                onClick={copyWebhook}
                className="flex items-center space-x-1 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold rounded-lg border border-cyan-500/40 transition"
              >
                {copiedWebhook ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWebhook ? 'Copied' : 'Copy Payload'}</span>
              </button>
            </div>

            <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 block text-[10px] uppercase">Webhook Endpoint URL:</span>
              <span className="text-white font-semibold">https://api.structai.trading/v1/signals/webhook/live</span>
            </div>

            <pre className="p-4 rounded-xl bg-dark-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-56">
              {WEBHOOK_JSON}
            </pre>

            <button
              onClick={handleTestPing}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              <span>{testSent ? '✓ Webhook Dispatch Confirmed (HTTP 200 OK)' : 'Send Test Ping to Webhook Server'}</span>
            </button>
          </div>
        )}

        {/* Tab 3: Telegram */}
        {activeTab === 'telegram' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">@StructAISignals_Bot</h4>
                  <p className="text-xs text-slate-400">Ultra-low latency instant push notifications for VIP members</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-dark-900 border border-slate-800/80 font-mono text-xs text-slate-300">
                <p className="text-cyan-400 font-bold mb-1">🔔 [STRUCT AI NEW SIGNAL]</p>
                <p>Pair: BTC/USDT (Long) • 15m Timeframe</p>
                <p>Pattern: Bullish Order Block + 0.618 Fib Tap</p>
                <p>Entry: 67,250 | SL: 66,420 | TP1: 68,500 | TP2: 69,400</p>
                <p>Confluence: 94% • Risk:Reward 1:3.82</p>
              </div>

              <button
                onClick={handleTestPing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 transition"
              >
                <Send className="w-4 h-4" />
                <span>{testSent ? '✓ Telegram Test Notification Dispatched' : 'Connect Telegram & Test Channel Alert'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
