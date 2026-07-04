import { useState } from 'react';
import { Package, ArrowUpRight, Plus, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StockItem } from '../types';

interface StockHistoryProps {
  stockItems: StockItem[];
  onRestock: (id: string, qty: number) => void;
}

export default function StockHistory({ stockItems, onRestock }: StockHistoryProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Low Stock'>('All');

  const getStatusBadge = (status: StockItem['status']) => {
    switch (status) {
      case 'In Stock':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Low Stock':
        return 'text-amber-600 bg-amber-50 border-amber-100 animate-pulse';
      case 'Out of Stock':
        return 'text-rose-600 bg-rose-50 border-rose-100';
      default:
        return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getStockPercentage = (item: StockItem) => {
    // Arbitrary base capacity for progress bars
    const maxCapacity = 150;
    return Math.min((item.stock / maxCapacity) * 100, 100);
  };

  const getStockColorClass = (status: StockItem['status']) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-500';
      case 'Low Stock':
        return 'bg-amber-500';
      case 'Out of Stock':
        return 'bg-rose-400';
      default:
        return 'bg-slate-400';
    }
  };

  const filteredItems = activeTab === 'All' 
    ? stockItems 
    : stockItems.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock');

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full justify-between" id="stock-history-card">
      {/* Header Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Stock History</h3>
            <p className="text-xs text-slate-400">Inventory thresholds & active stock-keeping units</p>
          </div>
          <div className="flex gap-1 bg-slate-50 p-1 rounded-xl" id="stock-tabs">
            <button
              onClick={() => setActiveTab('All')}
              className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'All' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('Low Stock')}
              className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'Low Stock' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-400 hover:text-rose-600'
              }`}
            >
              Alerts
            </button>
          </div>
        </div>

        {/* Highlight Stats Banner */}
        <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4 flex items-center justify-between" id="stock-summary-banner">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Sales Items</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-slate-800 tracking-tight font-mono">210</span>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 gap-0.5">
                <ArrowUpRight size={12} strokeWidth={2.5} />
                20%
              </span>
            </div>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={18} />
          </div>
        </div>
      </div>

      {/* List items */}
      <div className="flex-1 overflow-y-auto max-h-[240px] pr-1 space-y-3.5 my-5" id="stock-items-list">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => {
            const pct = getStockPercentage(item);
            const colorClass = getStockColorClass(item.status);

            return (
              <motion.div
                key={item.id}
                layoutId={`stock-item-${item.id}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5 p-1 rounded-lg group"
              >
                {/* Info and action */}
                <div className="flex items-start justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate leading-tight group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      SKU: <span className="font-mono text-slate-500 font-bold">{item.sku}</span> • {item.category}
                    </p>
                  </div>
                  
                  {/* Restock action */}
                  <button
                    onClick={() => onRestock(item.id, 10)}
                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Restock (+10 units)"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Progress bar and quantity */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${colorClass}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-mono font-bold text-slate-700 min-w-[32px] text-right">
                      {item.stock} <span className="text-[9px] text-slate-400 font-semibold font-sans">{item.unit || 'pcs'}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Safety Compliance Footnote */}
      <div className="flex items-center gap-2 text-[10px] text-slate-400 border-t border-slate-100 pt-3" id="stock-footnote">
        <ShieldCheck size={12} className="text-blue-500 flex-shrink-0" />
        <span>Self-auditing system synced with main shipping register.</span>
      </div>
    </div>
  );
}
