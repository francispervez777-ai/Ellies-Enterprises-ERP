import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MonthlyData } from '../types';

interface SalesChartProps {
  data: MonthlyData[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState('6 Months');
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 260 });

  // Dynamically observe container resize to make SVG 100% responsive
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        // Keep standard height or scale slightly
        setDimensions({
          width: Math.max(width, 300),
          height: 260
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const maxValue = 7000;
  const paddingLeft = 35;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 35;

  const plotWidth = dimensions.width - paddingLeft - paddingRight;
  const plotHeight = dimensions.height - paddingTop - paddingBottom;

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index + 0.5) * (plotWidth / data.length);
    const targetY = plotHeight - (d.target / maxValue) * plotHeight + paddingTop;
    const salesY = plotHeight - (d.sales / maxValue) * plotHeight + paddingTop;
    const purchasesY = plotHeight - (d.purchases / maxValue) * plotHeight + paddingTop;

    return {
      month: d.month,
      x,
      targetY,
      salesY,
      purchasesY,
      targetVal: d.target,
      salesVal: d.sales,
      purchasesVal: d.purchases
    };
  });

  const gridLines = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="sales-chart-card">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Sales & Purchases</h3>
          <p className="text-xs text-slate-400">Target tracking and real-time sales comparison</p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg px-2.5 py-1.5 focus:outline-hidden cursor-pointer transition-colors"
          id="chart-timeframe-select"
        >
          <option value="6 Months">6 Months</option>
          <option value="12 Months">12 Months</option>
          <option value="3 Months">3 Months</option>
        </select>
      </div>

      {/* Legend Row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-5 h-2 bg-slate-50 border border-slate-200/50 rounded-sm" />
          <span>Sales Target</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-2 bg-linear-to-r from-blue-500 to-blue-400 rounded-sm" />
          <span>Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-2 bg-linear-to-r from-slate-600 to-slate-500 rounded-sm" />
          <span>Purchases</span>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div ref={containerRef} className="relative flex-1 min-h-[260px] select-none" id="sales-chart-canvas-container">
        <svg width={dimensions.width} height={dimensions.height} className="overflow-visible">
          <defs>
            {/* Gradients for bars */}
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <linearGradient id="purchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y Axis labels */}
          {gridLines.map((val) => {
            const y = plotHeight - (val / maxValue) * plotHeight + paddingTop;
            return (
              <g key={val} className="opacity-60">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={dimensions.width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth={1}
                  strokeDasharray={val === 0 ? "0" : "4 4"}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 font-mono text-[10px] font-medium"
                >
                  {val >= 1000 ? `${val / 1000}k` : val}
                </text>
              </g>
            );
          })}

          {/* Bar Groups */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            const barWidth = Math.min(plotWidth / data.length * 0.45, 42); // Target track width
            const innerBarWidth = Math.min(barWidth * 0.35, 14); // Inner bar width (Sales & Purchases)
            const gap = 3;

            // Target column geometry
            const targetHeight = plotHeight - (pt.targetVal / maxValue) * plotHeight;
            const targetY = pt.targetY;

            // Sales column geometry
            const salesHeight = plotHeight - (pt.salesVal / maxValue) * plotHeight;
            const salesY = pt.salesY;

            // Purchases column geometry
            const purchasesHeight = plotHeight - (pt.purchasesVal / maxValue) * plotHeight;
            const purchasesY = pt.purchasesY;

            return (
              <g
                key={pt.month}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* 1. Target track background capsule */}
                <rect
                  x={pt.x - barWidth / 2}
                  y={targetY}
                  width={barWidth}
                  height={targetHeight}
                  rx={6}
                  fill="#f8fafc"
                  stroke="#e2e8f0"
                  strokeWidth={1}
                  className="transition-all duration-200"
                  style={{
                    fill: isHovered ? '#f1f5f9' : '#f8fafc',
                    stroke: isHovered ? '#cbd5e1' : '#e2e8f0',
                  }}
                />

                {/* 2. Sales Bar (left) */}
                <motion.rect
                  x={pt.x - gap / 2 - innerBarWidth}
                  y={plotHeight + paddingTop} // Start from bottom for animation
                  width={innerBarWidth}
                  rx={4}
                  fill="url(#salesGrad)"
                  initial={{ y: plotHeight + paddingTop, height: 0 }}
                  animate={{ y: salesY, height: salesHeight }}
                  transition={{ type: "spring", stiffness: 60, delay: idx * 0.04 }}
                />

                {/* 3. Purchases Bar (right) */}
                <motion.rect
                  x={pt.x + gap / 2}
                  y={plotHeight + paddingTop} // Start from bottom for animation
                  width={innerBarWidth}
                  rx={4}
                  fill="url(#purchGrad)"
                  initial={{ y: plotHeight + paddingTop, height: 0 }}
                  animate={{ y: purchasesY, height: purchasesHeight }}
                  transition={{ type: "spring", stiffness: 60, delay: idx * 0.04 + 0.02 }}
                />

                {/* Month label at bottom */}
                <text
                  x={pt.x}
                  y={dimensions.height - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold transition-colors duration-200 ${
                    isHovered ? 'fill-slate-800 font-bold' : 'fill-slate-400'
                  }`}
                >
                  {pt.month}
                </text>

                {/* Invisible taller hover area to make hovering easier */}
                <rect
                  x={pt.x - barWidth / 2 - 4}
                  y={paddingTop}
                  width={barWidth + 8}
                  height={plotHeight}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip */}
        <AnimatePresence>
          {hoveredIdx !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: Math.min(
                  Math.max(points[hoveredIdx].x - 90, 10),
                  dimensions.width - 190
                ),
                top: Math.max(
                  Math.min(
                    points[hoveredIdx].salesY,
                    points[hoveredIdx].purchasesY
                  ) - 105,
                  10
                ),
              }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="absolute z-30 pointer-events-none bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs flex flex-col gap-1.5 w-44"
              id="chart-tooltip"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1 font-bold text-slate-300">
                <span>Month:</span>
                <span>{points[hoveredIdx].month}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" /> Target:
                </span>
                <span className="font-mono font-semibold">${points[hoveredIdx].targetVal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Sales:
                </span>
                <span className="font-mono font-semibold text-blue-400">${points[hoveredIdx].salesVal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" /> Purchases:
                </span>
                <span className="font-mono font-semibold text-slate-300">${points[hoveredIdx].purchasesVal.toLocaleString()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
