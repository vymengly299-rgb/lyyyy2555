import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Candle, 
  StructureAnnotation, 
  Timeframe, 
  TradeSignal, 
  AssetSummary 
} from '../../types';
import { 
  Maximize2, 
  Minimize2, 
  Layers, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Zap, 
  Crosshair,
  ShieldAlert,
  Activity
} from 'lucide-react';

interface TradingChartProps {
  asset: AssetSummary;
  candles: Candle[];
  structure: StructureAnnotation[];
  activeSignal?: TradeSignal;
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  onApplySignalToCalc?: (signal: TradeSignal) => void;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  asset,
  candles,
  structure,
  activeSignal,
  timeframe,
  onTimeframeChange,
  onApplySignalToCalc
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Overlay toggles
  const [showBOS, setShowBOS] = useState(true);
  const [showOB, setShowOB] = useState(true);
  const [showFVG, setShowFVG] = useState(true);
  const [showLiquidity, setShowLiquidity] = useState(true);
  const [showTargets, setShowTargets] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Crosshair & Interaction
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverCandle, setHoverCandle] = useState<Candle | null>(null);
  const [hoverPrice, setHoverPrice] = useState<number | null>(null);

  // Pan & Zoom state
  const [panOffset, setPanOffset] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);

  // Live ticking candle price
  const [liveCandlePrice, setLiveCandlePrice] = useState<number>(asset.price);
  const [priceFlash, setPriceFlash] = useState<'green' | 'red' | null>(null);

  // Simulate sub-second micro market ticks
  useEffect(() => {
    setLiveCandlePrice(asset.price);
    const interval = setInterval(() => {
      const deltaPercent = (Math.random() - 0.49) * 0.0008;
      setLiveCandlePrice(prev => {
        const nextPrice = Number((prev * (1 + deltaPercent)).toFixed(asset.basePriceDecimals));
        if (nextPrice > prev) {
          setPriceFlash('green');
        } else if (nextPrice < prev) {
          setPriceFlash('red');
        }
        setTimeout(() => setPriceFlash(null), 300);
        return nextPrice;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, [asset.price, asset.basePriceDecimals]);

  // Handle Canvas Drawing
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#080C17';
    ctx.fillRect(0, 0, width, height);

    if (candles.length === 0) return;

    // Layout configuration
    const paddingRight = 75; // Y-axis price label area
    const paddingBottom = 26; // X-axis time label area
    const chartWidth = width - paddingRight;
    const chartHeight = height - paddingBottom;
    const volumeHeight = showVolume ? chartHeight * 0.18 : 0;
    const priceAreaHeight = chartHeight - volumeHeight;

    // Viewport calculations based on zoom and pan
    const visibleCount = Math.max(15, Math.min(candles.length, Math.floor(45 / zoomLevel)));
    const maxOffset = Math.max(0, candles.length - visibleCount);
    const effectiveOffset = Math.max(0, Math.min(maxOffset, Math.floor(maxOffset - panOffset)));
    const visibleCandles = candles.slice(candles.length - visibleCount - effectiveOffset, candles.length - effectiveOffset);

    if (visibleCandles.length === 0) return;

    // Calculate Price Min & Max
    let minPrice = Math.min(...visibleCandles.map(c => c.low));
    let maxPrice = Math.max(...visibleCandles.map(c => c.high));

    // Incorporate signal targets into bounds if displayed
    if (showTargets && activeSignal) {
      minPrice = Math.min(minPrice, activeSignal.stopLoss * 0.999);
      maxPrice = Math.max(maxPrice, activeSignal.tp3 * 1.001);
    }

    const pricePadding = (maxPrice - minPrice) * 0.12 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    // Volume Min & Max
    const maxVolume = Math.max(...visibleCandles.map(c => c.volume), 1);

    // Helpers
    const getX = (index: number) => {
      const candleWidth = chartWidth / visibleCandles.length;
      return index * candleWidth + candleWidth / 2;
    };

    const getY = (price: number) => {
      return priceAreaHeight - ((price - minPrice) / priceRange) * priceAreaHeight;
    };

    const candleWidth = (chartWidth / visibleCandles.length) * 0.72;

    // 1. Draw Grid Lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';

    // Horizontal Price grid (6 lines)
    const gridStep = priceRange / 6;
    for (let i = 0; i <= 6; i++) {
      const priceVal = minPrice + gridStep * i;
      const y = getY(priceVal);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Price text on right margin
      ctx.fillStyle = '#64748B';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(priceVal.toFixed(asset.basePriceDecimals), chartWidth + 8, y + 3);
    }

    // Vertical Time grid
    const timeStep = Math.max(1, Math.floor(visibleCandles.length / 6));
    for (let i = 0; i < visibleCandles.length; i += timeStep) {
      const x = getX(i);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, chartHeight);
      ctx.stroke();

      // Time stamp
      const c = visibleCandles[i];
      const date = new Date(c.time * 1000);
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      ctx.fillStyle = '#64748B';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(timeStr, x, chartHeight + 16);
    }

    // 2. Draw Market Structure Overlays (Order Blocks, FVGs, Liquidity Sweeps)
    structure.forEach(ann => {
      // Find start & end index in visibleCandles
      const startCandleIndex = ann.startIndex - (candles.length - visibleCandles.length - effectiveOffset);
      const endCandleIndex = ann.endIndex - (candles.length - visibleCandles.length - effectiveOffset);

      const x1 = Math.max(0, getX(Math.max(0, startCandleIndex)));
      const x2 = Math.min(chartWidth, getX(Math.min(visibleCandles.length - 1, Math.max(startCandleIndex + 1, endCandleIndex))));

      // Order Block
      if (ann.type === 'ORDER_BLOCK' && showOB && ann.secondaryPrice) {
        const topY = getY(Math.max(ann.price, ann.secondaryPrice));
        const botY = getY(Math.min(ann.price, ann.secondaryPrice));
        const heightBox = Math.max(4, botY - topY);

        ctx.fillStyle = ann.sentiment === 'bullish' 
          ? 'rgba(16, 185, 129, 0.15)' 
          : 'rgba(244, 63, 94, 0.15)';
        ctx.fillRect(x1, topY, chartWidth - x1, heightBox);

        ctx.strokeStyle = ann.sentiment === 'bullish' ? '#10B981' : '#F43F5E';
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(x1, topY, chartWidth - x1, heightBox);
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = ann.sentiment === 'bullish' ? '#34D399' : '#FB7185';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(
          `OB [${ann.sentiment.toUpperCase()}] ${ann.mitigated ? 'MITIGATED' : 'FRESH'}`, 
          x1 + 6, 
          topY + 12
        );
      }

      // Fair Value Gap (FVG)
      if (ann.type === 'FVG' && showFVG && ann.secondaryPrice) {
        const topY = getY(Math.max(ann.price, ann.secondaryPrice));
        const botY = getY(Math.min(ann.price, ann.secondaryPrice));
        const heightBox = Math.max(3, botY - topY);

        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.fillRect(x1, topY, x2 - x1 + 40, heightBox);

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(x1, topY, x2 - x1 + 40, heightBox);
        ctx.setLineDash([]);

        ctx.fillStyle = '#FBBF24';
        ctx.font = '9px Inter, sans-serif';
        ctx.fillText('FVG Imbalance Zone', x1 + 4, topY - 3);
      }

      // Break of Structure (BOS)
      if (ann.type === 'BOS' && showBOS) {
        const y = getY(ann.price);
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(chartWidth, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Badge
        ctx.fillStyle = '#00F0FF';
        ctx.fillRect(x1 + 10, y - 10, 48, 14);
        ctx.fillStyle = '#080C17';
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BOS ➔', x1 + 34, y + 1);
      }

      // Change of Character (CHoCH)
      if (ann.type === 'CHoCH' && showBOS) {
        const y = getY(ann.price);
        ctx.strokeStyle = '#A855F7';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(chartWidth - 50, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Badge
        ctx.fillStyle = '#A855F7';
        ctx.fillRect(x1 + 10, y - 10, 56, 14);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CHoCH ⚡', x1 + 38, y + 1);
      }

      // Liquidity Sweep
      if (ann.type === 'LIQUIDITY_SWEEP' && showLiquidity) {
        const y = getY(ann.price);
        ctx.strokeStyle = '#EAB308';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1 - 10, y);
        ctx.lineTo(x2 + 20, y);
        ctx.stroke();

        ctx.fillStyle = '#EAB308';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('$$$ LIQUIDITY PURGE', x1, y + 14);
      }
    });

    // 3. Draw Volume Bars
    if (showVolume) {
      visibleCandles.forEach((c, idx) => {
        const x = getX(idx);
        const isUp = c.close >= c.open;
        const barHeight = (c.volume / maxVolume) * (volumeHeight - 10);
        const y = chartHeight - barHeight;

        ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.28)' : 'rgba(244, 63, 94, 0.28)';
        ctx.fillRect(x - candleWidth / 2, y, candleWidth, barHeight);
      });
    }

    // 4. Draw Candlesticks (Wick + Body)
    visibleCandles.forEach((c, idx) => {
      const isLastCandle = idx === visibleCandles.length - 1;
      const currentClose = isLastCandle ? liveCandlePrice : c.close;
      const currentHigh = isLastCandle ? Math.max(c.high, liveCandlePrice) : c.high;
      const currentLow = isLastCandle ? Math.min(c.low, liveCandlePrice) : c.low;

      const isUp = currentClose >= c.open;
      const color = isUp ? '#10B981' : '#F43F5E';
      const x = getX(idx);

      const highY = getY(currentHigh);
      const lowY = getY(currentLow);
      const openY = getY(c.open);
      const closeY = getY(currentClose);

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));

      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

      // If last candle, draw glowing pulse
      if (isLastCandle) {
        ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)';
        ctx.beginPath();
        ctx.arc(x, closeY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 5. Active Signal Target Overlay (Entry, Stop Loss, TP1, TP2, TP3)
    if (showTargets && activeSignal) {
      const entryY = getY(activeSignal.entryPrice);
      const slY = getY(activeSignal.stopLoss);
      const tp1Y = getY(activeSignal.tp1);
      const tp2Y = getY(activeSignal.tp2);
      const tp3Y = getY(activeSignal.tp3);

      // Stop Loss Shaded Zone
      const slTop = Math.min(entryY, slY);
      const slHeight = Math.abs(slY - entryY);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
      ctx.fillRect(0, slTop, chartWidth, slHeight);

      // Target Profit Shaded Zone
      const tpTop = Math.min(entryY, tp3Y);
      const tpHeight = Math.abs(tp3Y - entryY);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.fillRect(0, tpTop, chartWidth, tpHeight);

      // Lines helper
      const drawTargetLine = (y: number, label: string, price: number, color: string, isDashed = true) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        if (isDashed) ctx.setLineDash([5, 3]);
        else ctx.setLineDash([]);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chartWidth, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label box on left
        ctx.fillStyle = color;
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${label}: ${price.toFixed(asset.basePriceDecimals)}`, 12, y - 4);

        // Price on right axis
        ctx.fillRect(chartWidth + 1, y - 8, paddingRight - 2, 16);
        ctx.fillStyle = '#080C17';
        ctx.fillText(price.toFixed(asset.basePriceDecimals), chartWidth + 6, y + 4);
      };

      drawTargetLine(entryY, `ENTRY (${activeSignal.direction})`, activeSignal.entryPrice, '#00F0FF', false);
      drawTargetLine(slY, 'STOP LOSS', activeSignal.stopLoss, '#F43F5E', true);
      drawTargetLine(tp1Y, 'TP 1', activeSignal.tp1, '#10B981', true);
      drawTargetLine(tp2Y, 'TP 2', activeSignal.tp2, '#10B981', true);
      drawTargetLine(tp3Y, 'TP 3 (FINAL)', activeSignal.tp3, '#34D399', true);
    }

    // 6. Current Price Line with pulse
    const currentPriceY = getY(liveCandlePrice);
    ctx.strokeStyle = priceFlash === 'green' ? '#10B981' : priceFlash === 'red' ? '#F43F5E' : '#38BDF8';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(0, currentPriceY);
    ctx.lineTo(chartWidth, currentPriceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current Price Tag on right axis
    ctx.fillStyle = priceFlash === 'green' ? '#10B981' : priceFlash === 'red' ? '#F43F5E' : '#0284C7';
    ctx.fillRect(chartWidth + 1, currentPriceY - 10, paddingRight - 2, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(liveCandlePrice.toFixed(asset.basePriceDecimals), chartWidth + 6, currentPriceY + 4);

    // 7. Interactive Crosshair
    if (hoverPos && hoverPos.x < chartWidth && hoverPos.y < chartHeight) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(hoverPos.x, 0);
      ctx.lineTo(hoverPos.x, chartHeight);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, hoverPos.y);
      ctx.lineTo(chartWidth, hoverPos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Price at mouse cursor
      const calcPrice = minPrice + ((priceAreaHeight - hoverPos.y) / priceAreaHeight) * priceRange;
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(chartWidth + 1, hoverPos.y - 9, paddingRight - 2, 18);
      ctx.strokeStyle = '#64748B';
      ctx.strokeRect(chartWidth + 1, hoverPos.y - 9, paddingRight - 2, 18);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(calcPrice.toFixed(asset.basePriceDecimals), chartWidth + 6, hoverPos.y + 4);
    }
  }, [
    candles,
    structure,
    activeSignal,
    asset,
    liveCandlePrice,
    priceFlash,
    showBOS,
    showOB,
    showFVG,
    showLiquidity,
    showTargets,
    showVolume,
    panOffset,
    zoomLevel,
    hoverPos
  ]);

  // Handle Resize and Canvas redraw
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      drawChart();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawChart]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  // Mouse move for crosshair and tooltips
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDraggingRef.current) {
      const deltaX = x - dragStartXRef.current;
      const sensitivity = 0.25;
      setPanOffset(dragStartOffsetRef.current + deltaX * sensitivity);
      return;
    }

    setHoverPos({ x, y });

    // Find closest candle
    const paddingRight = 75;
    const chartWidth = rect.width - paddingRight;
    const visibleCount = Math.max(15, Math.min(candles.length, Math.floor(45 / zoomLevel)));
    const candleSlotWidth = chartWidth / visibleCount;
    const hoveredIdx = Math.floor(x / candleSlotWidth);

    const maxOffset = Math.max(0, candles.length - visibleCount);
    const effectiveOffset = Math.max(0, Math.min(maxOffset, Math.floor(maxOffset - panOffset)));
    const visibleCandles = candles.slice(candles.length - visibleCount - effectiveOffset, candles.length - effectiveOffset);

    if (hoveredIdx >= 0 && hoveredIdx < visibleCandles.length) {
      setHoverCandle(visibleCandles[hoveredIdx]);
    }

    // Calculate hover price
    const minPrice = Math.min(...visibleCandles.map(c => c.low));
    const maxPrice = Math.max(...visibleCandles.map(c => c.high));
    const priceRange = (maxPrice - minPrice) * 1.24 || 1;
    const priceAreaHeight = rect.height - 26 - (showVolume ? (rect.height - 26) * 0.18 : 0);
    const calcPrice = (maxPrice + (maxPrice - minPrice) * 0.12) - (y / priceAreaHeight) * priceRange;
    setHoverPrice(calcPrice);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = panOffset;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setHoverPos(null);
    setHoverCandle(null);
    setHoverPrice(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Zoom in
      setZoomLevel(prev => Math.min(2.5, prev * 1.15));
    } else {
      // Zoom out
      setZoomLevel(prev => Math.max(0.6, prev / 1.15));
    }
  };

  const resetView = () => {
    setPanOffset(0);
    setZoomLevel(1);
  };

  const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D'];

  return (
    <div className={`relative flex flex-col bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50' : 'h-[640px]'}`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-dark-850/90 backdrop-blur-md gap-3">
        {/* Asset Title & Live Ticker */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-white tracking-wide">{asset.symbol}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {asset.name}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          {/* Current Live Price with glowing badge */}
          <div className="flex items-center space-x-2">
            <span className={`font-mono text-base font-bold transition-colors duration-200 ${
              priceFlash === 'green' ? 'text-emerald-400' : priceFlash === 'red' ? 'text-rose-400' : 'text-slate-100'
            }`}>
              {liveCandlePrice.toFixed(asset.basePriceDecimals)}
            </span>
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md ${
              asset.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {asset.change24h >= 0 ? `+${asset.change24h}%` : `${asset.change24h}%`}
            </span>
          </div>

          {/* AI Structure Confluence Indicator */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="font-semibold">AI Confluence: {asset.aiScore}%</span>
            <span className="text-slate-400">({asset.structureBias})</span>
          </div>
        </div>

        {/* Center: Timeframe Selectors */}
        <div className="flex items-center bg-dark-950 p-0.5 rounded-lg border border-slate-800">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500 text-dark-950 shadow-sm shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right Tools: Structure Overlays Toggles */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-1 bg-dark-950/80 px-2 py-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setShowBOS(!showBOS)}
              title="Toggle BOS / CHoCH"
              className={`text-[11px] font-mono px-2 py-0.5 rounded transition ${
                showBOS ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              BOS
            </button>
            <button
              onClick={() => setShowOB(!showOB)}
              title="Toggle Order Blocks"
              className={`text-[11px] font-mono px-2 py-0.5 rounded transition ${
                showOB ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              OB
            </button>
            <button
              onClick={() => setShowFVG(!showFVG)}
              title="Toggle Fair Value Gaps"
              className={`text-[11px] font-mono px-2 py-0.5 rounded transition ${
                showFVG ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              FVG
            </button>
            <button
              onClick={() => setShowLiquidity(!showLiquidity)}
              title="Toggle Liquidity Pools"
              className={`text-[11px] font-mono px-2 py-0.5 rounded transition ${
                showLiquidity ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              $$$
            </button>
            <button
              onClick={() => setShowTargets(!showTargets)}
              title="Toggle Signal Targets"
              className={`text-[11px] font-mono px-2 py-0.5 rounded transition ${
                showTargets ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              Targets
            </button>
          </div>

          <button
            onClick={resetView}
            title="Reset View"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Candlestick OHLC Tooltip Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-1.5 bg-dark-900/90 border-b border-slate-800/40 text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center space-x-4">
          {hoverCandle ? (
            <>
              <div>O: <span className="text-slate-200">{hoverCandle.open.toFixed(asset.basePriceDecimals)}</span></div>
              <div>H: <span className="text-emerald-400">{hoverCandle.high.toFixed(asset.basePriceDecimals)}</span></div>
              <div>L: <span className="text-rose-400">{hoverCandle.low.toFixed(asset.basePriceDecimals)}</span></div>
              <div>C: <span className={hoverCandle.close >= hoverCandle.open ? 'text-emerald-400' : 'text-rose-400'}>{hoverCandle.close.toFixed(asset.basePriceDecimals)}</span></div>
              <div className="hidden sm:block">Vol: <span className="text-slate-300">{hoverCandle.volume.toLocaleString()}</span></div>
            </>
          ) : (
            <div className="flex items-center space-x-2 text-slate-400">
              <Crosshair className="w-3 h-3 text-cyan-400" />
              <span>Hover canvas to inspect OHLC & Structure points</span>
            </div>
          )}
        </div>

        {activeSignal && (
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400">Active Signal:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${activeSignal.direction === 'LONG' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
              {activeSignal.direction} ({activeSignal.patternLabel})
            </span>
            <span className="text-cyan-400 font-mono">R:R 1:{activeSignal.riskReward}</span>
            {onApplySignalToCalc && (
              <button
                onClick={() => onApplySignalToCalc(activeSignal)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded transition"
              >
                Calc Size
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Interactive Canvas Area */}
      <div 
        ref={containerRef} 
        className="relative flex-1 w-full h-full cursor-crosshair overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          className="absolute inset-0 block w-full h-full"
        />

        {/* Legend watermark */}
        <div className="absolute bottom-4 left-4 pointer-events-none flex items-center space-x-2 bg-dark-950/70 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-800/80 text-[10px] text-slate-400">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>StructAI Neural Engine • Real-time Smart Money Concepts</span>
        </div>
      </div>
    </div>
  );
};
