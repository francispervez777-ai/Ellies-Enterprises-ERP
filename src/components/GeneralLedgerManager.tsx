import React, { useState } from 'react';
import { BookOpen, Plus, Search, CheckCircle2, AlertCircle, FileText, Landmark, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Account {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
}

export default function GeneralLedgerManager() {
  const [accounts, setAccounts] = useState<Account[]>([
    { code: '1010', name: 'Cash at Bank', type: 'Asset', debit: 45000, credit: 15400 },
    { code: '1200', name: 'Accounts Receivable', type: 'Asset', debit: 12400, credit: 8000 },
    { code: '1400', name: 'Product Stock Inventory', type: 'Asset', debit: 18500, credit: 0 },
    { code: '2100', name: 'Accounts Payable', type: 'Liability', debit: 4500, credit: 12000 },
    { code: '3000', name: 'Shareholders Equity Capital', type: 'Equity', debit: 0, credit: 30000 },
    { code: '4100', name: 'Product Sales Revenue', type: 'Revenue', debit: 0, credit: 32000 },
    { code: '5100', name: 'Direct Administrative Expenses', type: 'Expense', debit: 7200, credit: 0 },
    { code: '5200', name: 'Logistics Costs & Fuel', type: 'Expense', debit: 800, credit: 0 },
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    { id: 'JE-101', date: '2026-07-01', description: 'Initial stock deployment', debitAccount: '1400', creditAccount: '2100', amount: 4500 },
    { id: 'JE-102', date: '2026-07-02', description: 'Product sales receipt', debitAccount: '1010', creditAccount: '4100', amount: 3200 },
    { id: 'JE-103', date: '2026-07-02', description: 'Office rental payout', debitAccount: '5100', creditAccount: '1010', amount: 1500 },
    { id: 'JE-104', date: '2026-07-03', description: 'Supplier accounts payable settle', debitAccount: '2100', creditAccount: '1010', amount: 2000 },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [description, setDescription] = useState('');
  const [debitAccount, setDebitAccount] = useState('1010');
  const [creditAccount, setCreditAccount] = useState('2100');
  const [amount, setAmount] = useState('');

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    acc.code.includes(searchTerm)
  );

  const handlePostEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entryAmt = parseFloat(amount);
    if (!description || !entryAmt || debitAccount === creditAccount) return;

    // Post Double Entry to Accounts
    setAccounts(prevAccounts => 
      prevAccounts.map(acc => {
        if (acc.code === debitAccount) {
          return { ...acc, debit: acc.debit + entryAmt };
        }
        if (acc.code === creditAccount) {
          return { ...acc, credit: acc.credit + entryAmt };
        }
        return acc;
      })
    );

    // Save Journal Log
    const newEntry: JournalEntry = {
      id: `JE-${100 + journalEntries.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      description,
      debitAccount,
      creditAccount,
      amount: entryAmt
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setIsAddOpen(false);

    // Reset Form
    setDescription('');
    setAmount('');
  };

  const totalDebits = accounts.reduce((sum, a) => sum + a.debit, 0);
  const totalCredits = accounts.reduce((sum, a) => sum + a.credit, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="general-ledger-view-container">
      {/* Chart of Accounts Panel */}
      <div className="xl:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Chart of Accounts (COA)</h3>
            <p className="text-xs text-slate-400">Review real-time financial balances categorised by account classifications</p>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 w-44"
            />
          </div>
        </div>

        {/* Ledger Balance Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Ledger Debits</p>
              <p className="text-xl font-bold text-slate-800 mt-1">PKR {totalDebits.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-slate-200/50 text-slate-600 rounded-xl">
              <Landmark size={18} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Ledger Credits</p>
              <p className="text-xl font-bold text-slate-800 mt-1">PKR {totalCredits.toLocaleString()}</p>
            </div>
            <div className={`p-2 rounded-xl ${isBalanced ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>

        {/* Account Codes List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-2">Account Code</th>
                <th className="py-2.5 px-2">Account Title</th>
                <th className="py-2.5 px-2">Classification</th>
                <th className="py-2.5 px-2 text-right">Debit Bal</th>
                <th className="py-2.5 px-2 text-right">Credit Bal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {filteredAccounts.map((acc) => {
                const netBalance = acc.debit - acc.credit;
                return (
                  <tr key={acc.code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-slate-800">{acc.code}</td>
                    <td className="py-3 px-2 font-bold text-slate-700">{acc.name}</td>
                    <td className="py-3 px-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                        acc.type === 'Asset' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        acc.type === 'Liability' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        acc.type === 'Equity' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        acc.type === 'Revenue' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {acc.type}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600">PKR {acc.debit.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600">PKR {acc.credit.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Double Entry Posting & Journal Logs */}
      <div className="space-y-6">
        {/* Posting Form */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-blue-500" />
            <h4 className="font-extrabold text-slate-800 text-sm">Post Double-Entry Journal</h4>
          </div>

          <form onSubmit={handlePostEntry} className="space-y-4 text-xs font-medium text-slate-600">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Transaction Description *</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Settle logistics invoice"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Debit Account (Dr) *</label>
                <select
                  value={debitAccount}
                  onChange={(e) => setDebitAccount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer font-mono"
                >
                  {accounts.map(a => (
                    <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Credit Account (Cr) *</label>
                <select
                  value={creditAccount}
                  onChange={(e) => setCreditAccount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer font-mono"
                >
                  {accounts.map(a => (
                    <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Amount (PKR) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
              />
            </div>

            {debitAccount === creditAccount && (
              <p className="text-[10px] text-rose-600 flex items-center gap-1.5 font-semibold">
                <AlertCircle size={12} /> Debit and credit accounts must differ.
              </p>
            )}

            <button
              type="submit"
              disabled={debitAccount === creditAccount}
              className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Commit Entry to Ledger
            </button>
          </form>
        </div>

        {/* Recent Journal Logs */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col max-h-[350px]">
          <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-3">Double-Entry Journal Log</h4>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {journalEntries.map(je => {
              const drAcc = accounts.find(a => a.code === je.debitAccount);
              const crAcc = accounts.find(a => a.code === je.creditAccount);

              return (
                <div key={je.id} className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-slate-400 font-bold">{je.id} • {je.date}</span>
                    <span className="font-mono font-bold text-slate-800">PKR {je.amount.toLocaleString()}</span>
                  </div>
                  <p className="font-bold text-slate-700 truncate">{je.description}</p>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 font-mono">
                    <div>Dr: <strong className="text-blue-600">{drAcc?.name || je.debitAccount}</strong></div>
                    <div>Cr: <strong className="text-purple-600">{crAcc?.name || je.creditAccount}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
