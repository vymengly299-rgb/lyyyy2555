import React, { useState } from 'react';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Sparkles, 
  Menu, 
  X, 
  Code, 
  ShieldCheck, 
  Bell,
  Terminal
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWebhookModal: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  userTier: string;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenWebhookModal,
  activeSection,
  onNavigate,
  userTier
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'signals', label: 'AI Signals' },
    { id: 'terminal', label: 'Structure Terminal' },
    { id: 'copilot', label: 'AI Copilot' },
    { id: 'heatmap', label: 'MTF Heatmap' },
    { id: 'calculator', label: 'Risk Calc' },
    { id: 'backtest', label: 'Verified Win-Rates' },
    { id: 'pricing', label: 'VIP Membership' },
  ];

  const handleNavClick = (id: string) => {
    soundManager.playClick();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-dark-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('hero')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-dark-950 font-black" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-black tracking-wider text-white">STRUCT</span>
                <span className="text-base font-black tracking-wider text-cyan-400">AI</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  v4.2
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase leading-none">
                Trade Signal Structure
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeSection === link.id
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Tools */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleSound();
              }}
              title={soundEnabled ? 'Mute Audio Alerts' : 'Unmute Audio Alerts'}
              className={`p-2 rounded-xl border text-xs font-medium transition ${
                soundEnabled
                  ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
                  : 'bg-dark-950 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* PineScript / Webhook button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenWebhookModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>PineScript & Webhook</span>
            </button>

            {/* Tier Badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{userTier} VIP</span>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="xl:hidden flex items-center space-x-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleSound();
              }}
              className="p-2 rounded-xl bg-dark-900 border border-slate-800 text-cyan-400 sm:hidden"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-dark-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenWebhookModal();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold flex items-center space-x-1.5"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>PineScript & Webhook</span>
            </button>
            <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-1 rounded bg-cyan-950 border border-cyan-800">
              {userTier} Active
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
