import { Tag, Receipt, Send, Landmark, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';
import { KPI } from '../types';

interface MetricCardsProps {
  kpis: KPI[];
}

export default function MetricCards({ kpis }: MetricCardsProps) {
  const getIconAndStyle = (type: string) => {
    switch (type) {
      case 'sales':
        return {
          icon: Tag,
          iconBg: 'bg-blue-50 text-blue-600 border border-blue-100/50',
          gradientLine: 'from-blue-500 to-cyan-500'
        };
      case 'expense':
        return {
          icon: Receipt,
          iconBg: 'bg-slate-100 text-slate-700 border border-slate-200/50',
          gradientLine: 'from-slate-500 to-slate-600'
        };
      case 'sent':
        return {
          icon: Send,
          iconBg: 'bg-sky-50 text-sky-600 border border-sky-100/50',
          gradientLine: 'from-sky-500 to-blue-500'
        };
      case 'received':
        return {
          icon: Landmark,
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100/50',
          gradientLine: 'from-emerald-500 to-teal-500'
        };
      default:
        return {
          icon: Tag,
          iconBg: 'bg-slate-100 text-slate-600 border border-slate-200/50',
          gradientLine: 'from-slate-500 to-slate-500'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6" id="kpi-cards-grid">
      {kpis.map((kpi, idx) => {
        const { icon: Icon, iconBg, gradientLine } = getIconAndStyle(kpi.type);
        const isUp = kpi.change.startsWith('+');

        return (
          <motion.div
            key={kpi.id}
            id={`kpi-card-${kpi.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -3 }}
            className={`relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between h-40 transition-shadow hover:shadow-md`}
          >
            {/* Top row of card */}
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${iconBg} transition-transform shadow-xs`}>
                <Icon size={20} strokeWidth={2.2} />
              </div>
            </div>

            {/* Bottom row of card */}
            <div className="flex items-center gap-2 pt-2">
              <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                isUp 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' 
                  : 'bg-rose-50 text-rose-600 border border-rose-100/50'
              }`}>
                {isUp ? <ArrowUpRight size={13} strokeWidth={2.5} /> : <ArrowDownRight size={13} strokeWidth={2.5} />}
                {kpi.change.replace('+', '')}
              </span>
              <span className="text-xs font-medium text-slate-400">Than Last Month</span>
            </div>

            {/* Subtle top decorative progress-like accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradientLine} opacity-80`} />
          </motion.div>
        );
      })}
    </div>
  );
}
