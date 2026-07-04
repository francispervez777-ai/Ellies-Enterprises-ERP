import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  LineChart, 
  FileSpreadsheet, 
  FileCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Printer, 
  Sparkles,
  Calendar,
  DollarSign,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart as ReLineChart, 
  Line 
} from 'recharts';

interface Transaction {
  id: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  type: 'sale' | 'expense';
  category: string;
  amount: number;
  description: string;
}

type DateFilterOption = 'Today' | 'This Week' | 'This Month' | 'This Year' | 'Custom';

// Pseudo-random but completely deterministic percentage helper
const getPercentChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
};

// Past range selector helper for comparison analytics
const getPreviousPeriodRange = (filter: DateFilterOption, startStr: string, endStr: string) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  
  if (filter === 'Today') {
    const prevDate = new Date(start);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevStr = prevDate.toISOString().split('T')[0];
    return { prevStart: prevStr, prevEnd: prevStr };
  } else if (filter === 'This Week') {
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - 7);
    const prevEnd = new Date(end);
    prevEnd.setDate(prevEnd.getDate() - 7);
    return {
      prevStart: prevStart.toISOString().split('T')[0],
      prevEnd: prevEnd.toISOString().split('T')[0]
    };
  } else if (filter === 'This Month') {
    const prevStart = new Date(start);
    prevStart.setMonth(prevStart.getMonth() - 1);
    const prevEnd = new Date(end);
    prevEnd.setMonth(prevEnd.getMonth() - 1);
    return {
      prevStart: prevStart.toISOString().split('T')[0],
      prevEnd: prevEnd.toISOString().split('T')[0]
    };
  } else if (filter === 'This Year') {
    const prevStart = new Date(start);
    prevStart.setFullYear(prevStart.getFullYear() - 1);
    const prevEnd = new Date(end);
    prevEnd.setFullYear(prevEnd.getFullYear() - 1);
    return {
      prevStart: prevStart.toISOString().split('T')[0],
      prevEnd: prevEnd.toISOString().split('T')[0]
    };
  } else {
    const durationMs = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - durationMs - 24 * 60 * 60 * 1000);
    const prevEnd = new Date(start.getTime() - 24 * 60 * 60 * 1000);
    return {
      prevStart: prevStart.toISOString().split('T')[0],
      prevEnd: prevEnd.toISOString().split('T')[0]
    };
  }
};

// Generates complete deterministic business transaction entries for 2026
const generateAllTransactions = (): Transaction[] => {
  const txs: Transaction[] = [];
  
  // 1. Explicit transactions matching active components (July 1-3, 2026)
  const explicitTxs: Transaction[] = [
    { id: 'TX-701', date: '2026-07-03', time: '14:20', type: 'sale', category: 'General Order', amount: 1850, description: 'Premium Toilet Cleaner Supply' },
    { id: 'TX-702', date: '2026-07-03', time: '11:15', type: 'expense', category: 'Utilities', amount: 840, description: 'AWS Cloud Hosting' },
    { id: 'TX-703', date: '2026-07-03', time: '09:30', type: 'sale', category: 'Disinfectant', amount: 950, description: 'Disinfectant Liquid Order' },
    { id: 'TX-704', date: '2026-07-03', time: '16:45', type: 'sale', category: 'Retail', amount: 120, description: 'Retail Hand Sanitizer Sale' },
    
    { id: 'TX-705', date: '2026-07-02', time: '10:00', type: 'sale', category: 'Floor Polishing', amount: 1350, description: 'Floor Polishing Liquid Order' },
    { id: 'TX-706', date: '2026-07-02', time: '13:15', type: 'expense', category: 'Marketing', amount: 1200, description: 'Google Ads Marketing' },
    { id: 'TX-707', date: '2026-07-02', time: '15:30', type: 'sale', category: 'General Order', amount: 1420, description: 'General Order Supply' },
    
    { id: 'TX-708', date: '2026-07-01', time: '09:00', type: 'expense', category: 'Rent & Space', amount: 4500, description: 'Manhattan Hub Rent' },
    { id: 'TX-709', date: '2026-07-01', time: '11:00', type: 'expense', category: 'Utilities', amount: 350, description: 'State Electricity Board' },
    { id: 'TX-710', date: '2026-07-01', time: '14:00', type: 'sale', category: 'Bulk Supply', amount: 2800, description: 'Bulk Cleaning Supplies Contract' },
  ];
  
  txs.push(...explicitTxs);
  
  // 2. Add future July transaction entries to complete target month sums of $32,400 sales / $15,100 expenses
  const remainingJulSales = 32400 - 8490; // 23910
  const remainingJulExpenses = 15100 - 6890; // 8210
  
  const julSalesCount = 6;
  const julExpCount = 4;
  const baseJulSale = Math.round(remainingJulSales / julSalesCount);
  const baseJulExp = Math.round(remainingJulExpenses / julExpCount);
  
  for (let i = 1; i <= julSalesCount; i++) {
    const day = 4 + i * 4;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    txs.push({
      id: `TX-7-S-${i}`,
      date: `2026-07-${dayStr}`,
      time: '11:30',
      type: 'sale',
      category: 'Bulk Supply',
      amount: i === julSalesCount ? remainingJulSales - baseJulSale * (julSalesCount - 1) : baseJulSale,
      description: `Monthly Clean-Goods Contract Delivery #${3100 + i}`
    });
  }
  
  for (let i = 1; i <= julExpCount; i++) {
    const day = 6 + i * 6;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    txs.push({
      id: `TX-7-E-${i}`,
      date: `2026-07-${dayStr}`,
      time: '14:15',
      type: 'expense',
      category: 'Logistics',
      amount: i === julExpCount ? remainingJulExpenses - baseJulExp * (julExpCount - 1) : baseJulExp,
      description: `Freight Forwarding & Courier Dispatch #${4150 + i}`
    });
  }

  // 3. Populate historic months (Jan - Jun 2026) deterministically to align with the original design parameters
  const monthTargets = [
    { month: 1, rev: 15400, exp: 8900 },
    { month: 2, rev: 18200, exp: 9500 },
    { month: 3, rev: 21000, exp: 10400 },
    { month: 4, rev: 17500, exp: 11100 },
    { month: 5, rev: 24600, exp: 12800 },
    { month: 6, rev: 29800, exp: 14500 },
  ];
  
  monthTargets.forEach(({ month, rev, exp }) => {
    const numSales = 8;
    const numExpenses = 6;
    
    const saleAmt = Math.round(rev / numSales);
    const expAmt = Math.round(exp / numExpenses);
    
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    
    for (let i = 1; i <= numSales; i++) {
      const day = ((i * 3) % 27) + 1;
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const hour = 9 + (i % 8);
      const min = (i * 15) % 60;
      const timeStr = `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}`;
      
      const categories = ['Bulk Supply', 'Disinfectant', 'Floor Polishing', 'Retail', 'Sanitizers'];
      const cat = categories[i % categories.length];
      
      txs.push({
        id: `TX-S-${month}-${i}`,
        date: `2026-${monthStr}-${dayStr}`,
        time: timeStr,
        type: 'sale',
        category: cat,
        amount: i === numSales ? rev - saleAmt * (numSales - 1) : saleAmt,
        description: `Breeze Corporate Order Supply Ref #${1000 + month * 20 + i}`
      });
    }
    
    for (let i = 1; i <= numExpenses; i++) {
      const day = ((i * 4) % 27) + 1;
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const hour = 10 + (i % 6);
      const min = (i * 12) % 60;
      const timeStr = `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}`;
      
      const categories = ['Marketing', 'Utilities', 'Logistics', 'Rent & Space', 'Office Supplies'];
      const cat = categories[i % categories.length];
      
      txs.push({
        id: `TX-E-${month}-${i}`,
        date: `2026-${monthStr}-${dayStr}`,
        time: timeStr,
        type: 'expense',
        category: cat,
        amount: i === numExpenses ? exp - expAmt * (numExpenses - 1) : expAmt,
        description: `Operations Outflow Settle Ref #${2000 + month * 15 + i}`
      });
    }
  });

  return txs;
};

// Distributes transactions into visual chart coordinates depending on period selection
const getChartData = (
  filter: DateFilterOption, 
  startStr: string, 
  endStr: string, 
  transactions: Transaction[]
) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  if (filter === 'Today' || diffDays <= 1) {
    const hours = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
    return hours.map(h => {
      const hHour = parseInt(h.split(':')[0]);
      
      const periodSales = transactions.filter(t => {
        if (t.type !== 'sale') return false;
        const txHour = parseInt(t.time.split(':')[0]);
        return txHour >= hHour && txHour < hHour + 2;
      }).reduce((sum, t) => sum + t.amount, 0);
      
      const periodExpenses = transactions.filter(t => {
        if (t.type !== 'expense') return false;
        const txHour = parseInt(t.time.split(':')[0]);
        return txHour >= hHour && txHour < hHour + 2;
      }).reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: h,
        revenue: periodSales,
        expenses: periodExpenses,
        netProfit: periodSales - periodExpenses
      };
    });
  }
  
  if (filter === 'This Week' || (diffDays > 1 && diffDays <= 8)) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dateList: string[] = [];
    const current = new Date(start);
    while (current <= end) {
      dateList.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return days.map((dayName, index) => {
      const dayIndexInWeek = index === 6 ? 0 : index + 1; // 1 for Mon, ..., 0 for Sun
      const matchingDates = dateList.filter(d => new Date(d).getDay() === dayIndexInWeek);
      
      const periodSales = transactions.filter(t => t.type === 'sale' && matchingDates.includes(t.date))
                                      .reduce((sum, t) => sum + t.amount, 0);
      const periodExpenses = transactions.filter(t => t.type === 'expense' && matchingDates.includes(t.date))
                                          .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: dayName,
        revenue: periodSales,
        expenses: periodExpenses,
        netProfit: periodSales - periodExpenses
      };
    });
  }
  
  if (filter === 'This Month' || (diffDays > 8 && diffDays <= 31)) {
    const weeks = [
      { name: 'Week 1', startDay: 1, endDay: 7 },
      { name: 'Week 2', startDay: 8, endDay: 14 },
      { name: 'Week 3', startDay: 15, endDay: 21 },
      { name: 'Week 4', startDay: 22, endDay: 28 },
      { name: 'Week 5', startDay: 29, endDay: 31 },
    ];
    
    return weeks.map(w => {
      const periodSales = transactions.filter(t => {
        if (t.type !== 'sale') return false;
        const txDay = parseInt(t.date.split('-')[2]);
        return txDay >= w.startDay && txDay <= w.endDay;
      }).reduce((sum, t) => sum + t.amount, 0);
      
      const periodExpenses = transactions.filter(t => {
        if (t.type !== 'expense') return false;
        const txDay = parseInt(t.date.split('-')[2]);
        return txDay >= w.startDay && txDay <= w.endDay;
      }).reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: w.name,
        revenue: periodSales,
        expenses: periodExpenses,
        netProfit: periodSales - periodExpenses
      };
    });
  }
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((mName, index) => {
    const monthNumberStr = (index + 1) < 10 ? `0${index + 1}` : `${index + 1}`;
    const periodSales = transactions.filter(t => t.type === 'sale' && t.date.split('-')[1] === monthNumberStr)
                                    .reduce((sum, t) => sum + t.amount, 0);
    const periodExpenses = transactions.filter(t => t.type === 'expense' && t.date.split('-')[1] === monthNumberStr)
                                        .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      month: mName,
      revenue: periodSales,
      expenses: periodExpenses,
      netProfit: periodSales - periodExpenses
    };
  });
};

export default function ReportsManager() {
  const [reportType, setReportType] = useState<'Profit' | 'Sales' | 'Expenses'>('Profit');
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 1. New Date range parameters
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('This Month');
  const [customStartDate, setCustomStartDate] = useState('2026-07-01');
  const [customEndDate, setCustomEndDate] = useState('2026-07-03');

  // 2. Local search & filter states for the ledger transactions
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<'All' | 'sale' | 'expense'>('All');

  // 3. Stably generate full analytical database
  const allTransactions = useMemo(() => generateAllTransactions(), []);

  // 4. Compute active date coordinates based on filters
  const { startDate, endDate } = useMemo(() => {
    switch (dateFilter) {
      case 'Today':
        return { startDate: '2026-07-03', endDate: '2026-07-03' };
      case 'This Week':
        return { startDate: '2026-06-29', endDate: '2026-07-05' };
      case 'This Month':
        return { startDate: '2026-07-01', endDate: '2026-07-31' };
      case 'This Year':
        return { startDate: '2026-01-01', endDate: '2026-12-31' };
      case 'Custom':
      default:
        return { startDate: customStartDate, endDate: customEndDate };
    }
  }, [dateFilter, customStartDate, customEndDate]);

  // Compute corresponding comparison period dates
  const { prevStartDate, prevEndDate } = useMemo(() => {
    const { prevStart, prevEnd } = getPreviousPeriodRange(dateFilter, startDate, endDate);
    return { prevStartDate: prevStart, prevEndDate: prevEnd };
  }, [dateFilter, startDate, endDate]);

  // Current scope transactions
  const currentTxs = useMemo(() => {
    return allTransactions.filter(t => t.date >= startDate && t.date <= endDate);
  }, [allTransactions, startDate, endDate]);

  // Past scope transactions for comparisons
  const prevTxs = useMemo(() => {
    if (dateFilter === 'This Year') {
      // Deterministically generate past year historical numbers (scaled down slightly by 15%)
      return allTransactions.map(t => {
        const parts = t.date.split('-');
        const year = parseInt(parts[0]) - 1;
        return {
          ...t,
          date: `${year}-${parts[1]}-${parts[2]}`,
          amount: Math.round(t.amount * 0.85)
        };
      }).filter(t => t.date >= prevStartDate && t.date <= prevEndDate);
    }
    return allTransactions.filter(t => t.date >= prevStartDate && t.date <= prevEndDate);
  }, [allTransactions, dateFilter, prevStartDate, prevEndDate]);

  // Calculate current scope totals
  const currentRevenue = useMemo(() => {
    return currentTxs.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0);
  }, [currentTxs]);

  const currentExpenses = useMemo(() => {
    return currentTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }, [currentTxs]);

  const currentProfit = currentRevenue - currentExpenses;

  // Calculate comparison scope totals
  const prevRevenue = useMemo(() => {
    return prevTxs.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0);
  }, [prevTxs]);

  const prevExpenses = useMemo(() => {
    return prevTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }, [prevTxs]);

  const prevProfit = prevRevenue - prevExpenses;

  // Derive final change metrics
  const revChange = useMemo(() => getPercentChange(currentRevenue, prevRevenue), [currentRevenue, prevRevenue]);
  const expChange = useMemo(() => getPercentChange(currentExpenses, prevExpenses), [currentExpenses, prevExpenses]);
  const profitChange = useMemo(() => getPercentChange(currentProfit, prevProfit), [currentProfit, prevProfit]);

  // Generate chart values coordinates
  const chartData = useMemo(() => {
    return getChartData(dateFilter, startDate, endDate, currentTxs);
  }, [dateFilter, startDate, endDate, currentTxs]);

  // Filtered list of transactions shown in lower audit table
  const filteredLedgerTxs = useMemo(() => {
    return currentTxs.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                            t.id.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                            t.category.toLowerCase().includes(ledgerSearch.toLowerCase());
      const matchesType = ledgerTypeFilter === 'All' || t.type === ledgerTypeFilter;
      return matchesSearch && matchesType;
    }).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  }, [currentTxs, ledgerSearch, ledgerTypeFilter]);

  const handleExport = (format: string) => {
    setIsExporting(true);
    setToastMsg(`Preparing ${format} structure for selected period...`);
    setTimeout(() => {
      setToastMsg(`Broadcasting download pipe...`);
      setTimeout(() => {
        setIsExporting(false);
        setToastMsg(`${format} successfully downloaded to system cache!`);
        setTimeout(() => setToastMsg(''), 3500);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full space-y-6" id="reports-manager">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Enterprise Analytics & Growth Statements</h3>
          <p className="text-xs text-slate-400">Generate cash flow reports, evaluate profit margins, and perform audits</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('PDF Format')}
            disabled={isExporting}
            className="flex items-center gap-1.5 text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            <Printer size={13} /> Export PDF
          </button>
          <button
            onClick={() => handleExport('CSV Spreadsheet')}
            disabled={isExporting}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <FileSpreadsheet size={13} /> Save CSV
          </button>
        </div>
      </div>

      {/* Date Range Selector Segment Control */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider mr-2">Range Scope:</span>
          {(['Today', 'This Week', 'This Month', 'This Year', 'Custom'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setDateFilter(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dateFilter === opt
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Custom date range fields */}
        <AnimatePresence>
          {dateFilter === 'Custom' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 text-xs text-slate-600"
            >
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1">
                <Calendar size={12} className="text-slate-400" />
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-transparent focus:outline-hidden font-bold text-slate-700 text-[11px]"
                />
              </div>
              <ArrowRight size={12} className="text-slate-400" />
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1">
                <Calendar size={12} className="text-slate-400" />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-transparent focus:outline-hidden font-bold text-slate-700 text-[11px]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border border-slate-800 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-400 animate-pulse" size={14} />
              <span>{toastMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Grid Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-medium text-slate-700">
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Gross Operating Revenue</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">PKR {currentRevenue.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 mt-2.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
              parseFloat(revChange) >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
            }`}>
              {parseFloat(revChange) >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {revChange}
            </span>
            <span className="text-[9px] text-slate-400 font-semibold">vs comparative period</span>
          </div>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Running Overheads</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">PKR {currentExpenses.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 mt-2.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
              parseFloat(expChange) <= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
            }`}>
              {parseFloat(expChange) >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {expChange}
            </span>
            <span className="text-[9px] text-slate-400 font-semibold">vs comparative period</span>
          </div>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Net Retained Profit Margin</p>
            <p className="text-2xl font-black text-blue-600 mt-1.5">PKR {currentProfit.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 mt-2.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
              currentProfit >= prevProfit ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
            }`}>
              {currentProfit >= prevProfit ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {profitChange}
            </span>
            <span className="text-[9px] text-slate-400 font-semibold">vs comparative period</span>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex items-center gap-1 border-b border-slate-100 pb-3">
        <button
          onClick={() => setReportType('Profit')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            reportType === 'Profit' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Profit Margin Analysis
        </button>
        <button
          onClick={() => setReportType('Sales')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            reportType === 'Sales' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Sales & Expenditures Group MoM
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full bg-slate-50/20 rounded-xl p-2 border border-dashed border-slate-100" id="reports-chart-container">
        {chartData.length > 0 && chartData.some(d => d.revenue > 0 || d.expenses > 0) ? (
          reportType === 'Profit' ? (
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#e2e8f0" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#e2e8f0" tickFormatter={(v) => `PKR ${v}`} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, borderColor: '#f1f5f9' }} formatter={(value: any) => [`PKR ${value.toLocaleString()}`, undefined]} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line type="monotone" dataKey="netProfit" name="Net Retained Profit (PKR)" stroke="#2563eb" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="revenue" name="Gross Revenue (PKR)" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 5" />
              </ReLineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#e2e8f0" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#e2e8f0" tickFormatter={(v) => `PKR ${v}`} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, borderColor: '#f1f5f9' }} formatter={(value: any) => [`PKR ${value.toLocaleString()}`, undefined]} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="revenue" name="Invoiced Sales (PKR)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenditures (PKR)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 text-xs">
            <Calendar size={24} className="mb-2 text-slate-300" />
            <span>No data points recorded for this range</span>
          </div>
        )}
      </div>

      {/* Audit Logs / Ledger List based on selected range */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Matching Transactions Ledger</h4>
            <p className="text-[10px] text-slate-400 font-medium">Auditing {filteredLedgerTxs.length} items that occurred within the selected range</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Ledger search field */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ledger entries..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-700 w-44"
              />
            </div>

            {/* Type Filter Select */}
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Filter size={11} className="text-slate-400" />
              <select
                value={ledgerTypeFilter}
                onChange={(e: any) => setLedgerTypeFilter(e.target.value)}
                className="bg-transparent focus:outline-hidden text-slate-700 font-semibold cursor-pointer"
              >
                <option value="All">All Flows</option>
                <option value="sale">Inflows (Sales)</option>
                <option value="expense">Outflows (Expenses)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto max-h-60 overflow-y-auto border border-slate-100 rounded-xl scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white z-10">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px] font-medium text-slate-600">
              {filteredLedgerTxs.length > 0 ? (
                filteredLedgerTxs.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-2 px-3 text-slate-400">
                      {t.date} <span className="text-[9px] text-slate-300 ml-1">{t.time}</span>
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-700">{t.id}</td>
                    <td className="py-2 px-3 text-slate-700 truncate max-w-xs font-semibold" title={t.description}>{t.description}</td>
                    <td className="py-2 px-3">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border bg-slate-50 border-slate-100 text-slate-500">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        t.type === 'sale' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {t.type === 'sale' ? 'Inflow' : 'Outflow'}
                      </span>
                    </td>
                    <td className={`py-2 px-3 text-right font-mono font-bold ${
                      t.type === 'sale' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {t.type === 'sale' ? '+' : '-'}PKR {t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No matching ledger entries found for this range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

