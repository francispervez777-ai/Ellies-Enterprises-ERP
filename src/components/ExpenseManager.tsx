import React, { useState } from 'react';
import { Search, Plus, DollarSign, CheckCircle, Clock, Trash2, X, TrendingDown, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Expense {
  id: string;
  payee: string;
  category: 'Marketing' | 'Logistics' | 'Utilities' | 'Rent & Space' | 'Travel' | 'Hardware' | 'Office Supplies';
  amount: number;
  date: string;
  paymentMethod: 'Bank Transfer' | 'Cash Register' | 'Credit Card';
  status: 'Paid' | 'Pending';
}

export default function ExpenseManager() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 'EXP-401', payee: 'Google Ads Corp', category: 'Marketing', amount: 1200, date: '2026-07-02', paymentMethod: 'Credit Card', status: 'Paid' },
    { id: 'EXP-402', payee: 'State Electricity Board', category: 'Utilities', amount: 350, date: '2026-07-01', paymentMethod: 'Bank Transfer', status: 'Paid' },
    { id: 'EXP-403', payee: 'Manhattan Hub Offices', category: 'Rent & Space', amount: 4500, date: '2026-07-01', paymentMethod: 'Bank Transfer', status: 'Paid' },
    { id: 'EXP-404', payee: 'FedEx Express Courier', category: 'Logistics', amount: 180, date: '2026-06-28', paymentMethod: 'Cash Register', status: 'Paid' },
    { id: 'EXP-405', payee: 'AWS Cloud Hosting', category: 'Utilities', amount: 840, date: '2026-07-03', paymentMethod: 'Credit Card', status: 'Pending' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [payee, setPayee] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Utilities');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Expense['paymentMethod']>('Bank Transfer');
  const [status, setStatus] = useState<Expense['status']>('Paid');

  const filteredExpenses = expenses.filter(e => 
    e.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payee || !amount) return;

    const newExpense: Expense = {
      id: `EXP-40${expenses.length + 1}`,
      payee,
      category,
      amount: parseFloat(amount) || 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      status
    };

    setExpenses([newExpense, ...expenses]);
    setIsAddOpen(false);

    // Reset Form
    setPayee('');
    setCategory('Utilities');
    setAmount('');
    setPaymentMethod('Bank Transfer');
    setStatus('Paid');
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Marketing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Logistics': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Utilities': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Rent & Space': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Travel': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="expenses-manager">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Corporate Cash Outflows & Bills</h3>
          <p className="text-xs text-slate-400">Record administrative utilities, marketing campaigns, and minor cash disbursements</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 w-52"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} /> Log Expense
          </button>
        </div>
      </div>

      {/* KPI summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Month Outflow</p>
            <p className="text-xl font-bold text-slate-800 mt-1">PKR {totalExpense.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <TrendingDown size={18} />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unpaid / Awaiting Bills</p>
            <p className="text-xl font-bold text-amber-600 mt-1">
              PKR {expenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={18} />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Settled Records</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">
              {expenses.filter(e => e.status === 'Paid').length}
            </p>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={18} />
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Expense ID</th>
              <th className="py-3 px-3">Merchant / Payee</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Payment Method</th>
              <th className="py-3 px-3 text-right">Outflow Val</th>
              <th className="py-3 px-3 text-center">Settlement</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3.5 px-3 font-semibold font-mono text-slate-800 text-xs flex items-center gap-2">
                    <DollarSign size={14} className="text-slate-400" />
                    {exp.id}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 font-bold">{exp.payee}</td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getCategoryColor(exp.category)}`}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">{exp.paymentMethod}</td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">PKR {exp.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      exp.status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {exp.status === 'Pending' && (
                        <button
                          onClick={() => setExpenses(expenses.map(x => x.id === exp.id ? { ...x, status: 'Paid' } : x))}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Settle Bill"
                        >
                          <CheckCircle size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  No bills match the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Log Expense Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-slate-100 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">Log Cash Outflow</h4>
                    <p className="text-[10px] text-slate-400">Post billing ledger entries and payment options</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-medium text-slate-600">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Payee / Merchant Name *</label>
                  <input
                    type="text"
                    required
                    value={payee}
                    onChange={(e) => setPayee(e.target.value)}
                    placeholder="e.g. Amazon Cloud Web Services"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Expense Amount (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    >
                      <option value="Utilities">Utilities</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Rent & Space">Rent & Space</option>
                      <option value="Travel">Travel</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Office Supplies">Office Supplies</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Payment Channel</label>
                    <select
                      value={paymentMethod}
                      onChange={(e: any) => setPaymentMethod(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash Register">Cash Register</option>
                      <option value="Credit Card">Credit Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Initial Settlement</label>
                    <select
                      value={status}
                      onChange={(e: any) => setStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    >
                      <option value="Paid">Settled (Paid)</option>
                      <option value="Pending">Pending (Outstanding)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/80 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    Log Outflow Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
