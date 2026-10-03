import React, { useState } from 'react';
import { CopilotMessage, TradeSignal } from '../../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Terminal,
  HelpCircle
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CopilotChatProps {
  onLoadAsset: (symbol: string) => void;
  onOpenSignal: (signal: TradeSignal) => void;
  availableSignals: TradeSignal[];
}

const INITIAL_MESSAGES: CopilotMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: `👋 Welcome to StructAI Market Intelligence Copilot v4.2.

I continuously parse order book depth, Fair Value Gaps (FVG), Order Blocks (OB), and Liquidity Sweeps across Crypto, Forex, and Indices.

Try asking me:
• "Find the highest R:R bullish setup on Crypto right now"
• "Scan for unmitigated Fair Value Gaps on Gold (XAU/USD)"
• "What is the structural confluence on Bitcoin?"
• "Give me a low-risk setup with 1% risk"`,
    timestamp: Date.now() - 1000 * 60 * 5,
  }
];

const PRESET_QUERIES = [
  "Find highest R:R setup on Crypto",
  "Scan unmitigated FVG on Gold",
  "Show 15m Bullish BOS on BTC",
  "EUR/USD order flow breakdown"
];

export const CopilotChat: React.FC<CopilotChatProps> = ({
  onLoadAsset,
  onOpenSignal,
  availableSignals
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    soundManager.playClick();
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI smart contextual processing
    setTimeout(() => {
      soundManager.playSignalBullish();
      setIsTyping(false);

      const q = query.toLowerCase();
      let replyText = '';
      let targetSymbol: string | undefined = undefined;
      let relatedSig: TradeSignal | undefined = undefined;

      if (q.includes('btc') || q.includes('bitcoin')) {
        targetSymbol = 'BTC/USDT';
        relatedSig = availableSignals.find(s => s.pair === 'BTC/USDT');
        replyText = `🧠 **Bitcoin (BTC/USDT) Institutional Structure Analysis:**

• **Macro Bias:** Bullish (94% AI Confluence).
• **Liquidity Sweeps:** London Session swept Sell-Side Liquidity (SSL) at $66,800.
• **Order Block:** Fresh Bullish OB identified at $67,250 with strong absorption volume.
• **Break of Structure:** Confirmed 15m BOS above $67,600.
• **Recommended Action:** Long towards $68,500 (TP1) and $70,800 (Weekly Pool). Invalidation below $66,420.`;
      } else if (q.includes('gold') || q.includes('xau')) {
        targetSymbol = 'XAU/USD';
        relatedSig = availableSignals.find(s => s.pair === 'XAU/USD');
        replyText = `🥇 **Gold Spot (XAU/USD) Imbalance Analysis:**

• **Pattern:** 1h Fair Value Gap (FVG) Tap & Rebound.
• **Price Action:** Imbalance between $2,638 and $2,644 was filled precisely before institutional displacement.
• **Target:** Liquidity expansion pool at $2,668 (TP1) and $2,715 (TP3).
• **Risk/Reward:** 1 : 4.39. Bullish structure remains intact above $2,626.`;
      } else if (q.includes('eur') || q.includes('forex')) {
        targetSymbol = 'EUR/USD';
        relatedSig = availableSignals.find(s => s.pair === 'EUR/USD');
        replyText = `💱 **Forex Market Structure (EUR/USD):**

• **Bias:** Bearish (86% Confluence).
• **Order Flow:** Sellers defended the 1.0915 supply block during European session.
• **CHoCH Shift:** Lower highs confirmed on 15m timeframe.
• **Execution:** Short with target at 1.0875 and 1.0840 discount liquidity pool.`;
      } else if (q.includes('highest') || q.includes('crypto') || q.includes('best') || q.includes('r:r')) {
        targetSymbol = 'SOL/USDT';
        relatedSig = availableSignals.find(s => s.pair === 'SOL/USDT');
        replyText = `⚡ **Top High-Confluence AI Setup:** **SOL/USDT (Long)**

• **Pattern:** Asia Low Liquidity Purge & Expansion.
• **AI Confluence:** **96% Confidence** (Highest in active scan).
• **Risk : Reward:** **1 : 4.25**.
• **Entry:** $154.20 | **SL:** $151.80 | **TP1:** $159.50 | **TP3:** $172.00.
• **Reasoning:** Clean stop run below Asia session low followed by aggressive buying delta displacement.`;
      } else {
        targetSymbol = 'BTC/USDT';
        relatedSig = availableSignals[0];
        replyText = `📊 **Multi-Asset Structure Scan Complete:**

The StructAI Neural Engine evaluated 14 active markets across 5m, 15m, and 1h intervals:
• **Crypto Index:** 78% Bullish confluence led by BTC & SOL.
• **Equities (NAS100 / US500):** Bullish demand blocks held at market open.
• **Forex:** USD strength suppressing EUR/USD into discount demand.

Would you like to examine the active BTC/USDT setup or inspect the multi-timeframe heatmap?`;
      }

      const aiMsg: CopilotMessage = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: Date.now(),
        suggestedAction: targetSymbol ? {
          type: 'LOAD_CHART',
          symbol: targetSymbol,
          signalId: relatedSig?.id
        } : undefined
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 700);
  };

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl flex flex-col h-[600px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-dark-850 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-dark-950 font-bold shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-dark-950" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>StructAI Strategy Copilot</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                GPT-4o + SMC Model
              </span>
            </h3>
            <p className="text-xs text-slate-400">Natural language trading strategy & market structure reasoning</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono text-emerald-400">Online • Latency 14ms</span>
        </div>
      </div>

      {/* Preset Query Bubbles */}
      <div className="px-4 py-2.5 bg-dark-950/60 border-b border-slate-800/80 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Suggested:</span>
        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(preset)}
            className="text-xs bg-dark-850 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 px-3 py-1 rounded-full whitespace-nowrap transition-all duration-150 flex items-center space-x-1"
          >
            <span>{preset}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-cyan-500 text-dark-950 font-medium shadow-md shadow-cyan-500/20' 
                : 'bg-dark-950 border border-slate-800 text-slate-200'
            }`}>
              <div className="whitespace-pre-line font-sans">
                {msg.text}
              </div>

              {msg.suggestedAction && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (msg.suggestedAction?.symbol) {
                        soundManager.playClick();
                        onLoadAsset(msg.suggestedAction.symbol);
                      }
                    }}
                    className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold border border-cyan-500/40 transition"
                  >
                    <span>Load {msg.suggestedAction.symbol} on Chart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-dark-950 p-3 rounded-2xl border border-slate-800 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-400 ml-2 font-mono">Synthesizing Order Book Structure...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-dark-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Copilot about order blocks, BOS setups, or specific assets..."
              className="w-full bg-dark-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-dark-950 transition font-bold shadow-md shadow-cyan-500/20 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
