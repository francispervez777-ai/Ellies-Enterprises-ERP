import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DeviceShare } from '../types';

interface DevicesChartProps {
  shares: DeviceShare[];
}

export default function DevicesChart({ shares }: DevicesChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Helper to translate percentages into starting and ending polar coordinates (clockwise from top)
  const getCoordinatesForPercent = (percent: number) => {
    const angle = 2 * Math.PI * (percent - 0.25); // -0.25 rotates to start at 12 o'clock
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return [x, y];
  };

  const cx = 100;
  const cy = 100;
  const r = 75; // Outer radius
  const innerR = 46; // Inner radius for donut hole

  let accumulatedPercent = 0;

  const slices = shares.map((slice, idx) => {
    const startPercent = accumulatedPercent;
    accumulatedPercent += slice.percentage / 100;
    const endPercent = accumulatedPercent;

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);

    const x1 = cx + startX * r;
    const y1 = cy + startY * r;
    const x2 = cx + endX * r;
    const y2 = cy + endY * r;

    // Inner coordinates for the donut gap
    const [innerStartX, innerStartY] = getCoordinatesForPercent(startPercent);
    const [innerEndX, innerEndY] = getCoordinatesForPercent(endPercent);

    const ix1 = cx + innerStartX * innerR;
    const iy1 = cy + innerStartY * innerR;
    const ix2 = cx + innerEndX * innerR;
    const iy2 = cy + innerEndY * innerR;

    const largeArcFlag = slice.percentage > 50 ? 1 : 0;

    // Create a precise donut slice path:
    // Move to outer start -> Arc to outer end -> Line to inner end -> Arc back to inner start -> Close
    const pathData = `
      M ${x1} ${y1}
      A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${ix2} ${iy2}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${ix1} ${iy1}
      Z
    `;

    // Calculate middle angle for hover pop-out translation
    const middlePercent = (startPercent + endPercent) / 2;
    const angle = 2 * Math.PI * (middlePercent - 0.25);
    const dx = Math.cos(angle) * 4;
    const dy = Math.sin(angle) * 4;

    return {
      ...slice,
      pathData,
      dx,
      dy,
      idx
    };
  });

  const totalHits = shares.reduce((sum, s) => sum + s.count, 0);
  const activeIdx = hoveredIdx !== null ? hoveredIdx : selectedIdx;
  const activeSlice = activeIdx !== null ? shares[activeIdx] : null;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full justify-between" id="devices-chart-card">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight">Devices</h3>
        <p className="text-xs text-slate-400">Share breakdown by active operating environment</p>
      </div>

      {/* Interactive Donut Core */}
      <div className="flex flex-col items-center justify-center py-6 relative" id="devices-donut-container">
        <svg 
          viewBox="0 0 200 200" 
          width="180" 
          height="180" 
          className="overflow-visible select-none drop-shadow-xs"
        >
          {slices.map((slice) => {
            const isHovered = hoveredIdx === slice.idx;
            const isSelected = selectedIdx === slice.idx;
            const isAnyActive = hoveredIdx !== null || selectedIdx !== null;
            const isThisActive = isHovered || isSelected;

            return (
              <g
                key={slice.name}
                onMouseEnter={() => setHoveredIdx(slice.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setSelectedIdx(selectedIdx === slice.idx ? null : slice.idx)}
                className="cursor-pointer group"
              >
                <motion.path
                  d={slice.pathData}
                  fill={slice.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  animate={{
                    x: isThisActive ? slice.dx : 0,
                    y: isThisActive ? slice.dy : 0,
                    opacity: isAnyActive && !isThisActive ? 0.45 : 1,
                    scale: isThisActive ? 1.02 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </g>
            );
          })}

          {/* Central Donut Hole label */}
          <circle cx={cx} cy={cy} r={innerR - 1} fill="#ffffff" />
        </svg>

        {/* Central dynamic info layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-10">
          <AnimatePresence mode="wait">
            {activeSlice ? (
              <motion.div
                key={activeSlice.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="text-center"
              >
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {activeSlice.name}
                </p>
                <p className="text-xl font-extrabold text-slate-800 tracking-tight">
                  {activeSlice.percentage}%
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {activeSlice.count.toLocaleString()} sessions
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Sessions
                </p>
                <p className="text-xl font-extrabold text-slate-800 tracking-tight">
                  {totalHits.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Global traffic
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Horizontal Legend Layout */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 border-t border-slate-100 pt-4" id="devices-legend">
        {shares.map((share, idx) => {
          const isSelected = selectedIdx === idx;
          const isHovered = hoveredIdx === idx;
          const isActive = isSelected || isHovered;

          return (
            <button
              key={share.name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
              className={`flex flex-col items-center p-1.5 rounded-xl transition-all duration-150 ${
                isActive ? 'bg-slate-50 ring-1 ring-slate-100 shadow-2xs' : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: share.color }}
                />
                <span className="text-[11px] font-bold text-slate-700 truncate max-w-[50px] sm:max-w-none">
                  {share.name}
                </span>
              </div>
              <span className="text-[10px] font-semibold font-mono text-slate-400">
                {share.percentage}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
