import React, { useState } from 'react';
import { Search, Users, Eye, ArrowLeftRight, Landmark, ArrowUpRight, ArrowDownLeft, X, NotebookPen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Party {
  id: string;
  name: string;
  type: 'Customer' | 'Vendor';
  company: string;
  phone: string;
  outstanding: number; // Positive is receivable (Customer owes us), Negative is payable (We owe Vendor)
  transactions: {
    id: string;
    date: string;
    desc: string;
    debit: number;
    credit: number;
    balance: number;
  }[];
}

export default function PartyLedgerManager() {
  const [parties, setParties] = useState<Party[]>([
    {
      id: 'PTY-001',
      name: 'Harry Styles',
      type: 'Customer',
      company: 'Golden Guitars Ltd',
      phone: '+1 (555) 014-9988',
      outstanding: 1250,
      transactions: [
        { id: 'TX-1001', date: '2026-06-15', desc: 'Opening Balance', debit: 0, credit: 0, balance: 0 },
        { id: 'TX-1002', date: '2026-06-20', desc: 'Invoice #INV-001 Raised', debit: 2500, credit: 0, balance: 2500 },
        { id: 'TX-1003', date: '2026-06-28', desc: 'Wire Payment received', debit: 0, credit: 1250, balance: 1250 },
      ]
    },
    {
      id: 'PTY-002',
      name: 'James Clear',
      type: 'Vendor',
      company: 'Atomic Warehouses',
      phone: '+1 (555) 033-4455',
      outstanding: -2200,
      transactions: [
        { id: 'TX-2001', date: '2026-06-10', desc: 'Opening Balance', debit: 0, credit: 0, balance: 0 },
        { id: 'TX-2002', date: '2026-06-25', desc: 'Purchase Order #PO-901 Raised', debit: 0, credit: 4200, balance: -4200 },
        { id: 'TX-2003', date: '2026-06-30', desc: 'Bank transfer payment', debit: 2000, credit: 0, balance: -2200 },
      ]
    },
    {
      id: 'PTY-003',
      name: 'Zayn Malik',
      type: 'Customer',
      company: 'Pillowtalk Styles',
      phone: '+1 (555) 012-3456',
      outstanding: 350,
      transactions: [
        { id: 'TX-3001', date: '2026-06-01', desc: 'Opening Balance', debit: 0, credit: 0, balance: 0 },
        { id: 'TX-3002', date: '2026-06-15', desc: 'Invoice #INV-003 Raised', debit: 1200, credit: 0, balance: 1200 },
        { id: 'TX-3003', date: '2026-06-20', desc: 'Payment receipt', debit: 0, credit: 850, balance: 350 },
      ]
    },
    {
      id: 'PTY-004',
      name: 'Bill Gates',
      type: 'Vendor',
      company: 'Micro Devices Inc',
      phone: '+1 (555) 022-1133',
      outstanding: -5400,
      transactions: [
        { id: 'TX-4001', date: '2026-06-15', desc: 'Opening Balance', debit: 0, credit: 0, balance: 0 },
        { id: 'TX-4002', date: '2026-06-20', desc: 'Component Delivery Bill Recv', debit: 0, credit: 8400, balance: -8400 },
        { id: 'TX-4003', date: '2026-06-25', desc: 'Settle partial payment', debit: 3000, credit: 0, balance: -5400 },
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);

  const filteredParties = parties.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReceivable = parties.filter(p => p.outstanding > 0).reduce((sum, p) => sum + p.outstanding, 0);
  const totalPayable = Math.abs(parties.filter(p => p.outstanding < 0).reduce((sum, p) => sum + p.outstanding, 0));

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="party-ledger-manager">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Party Ledger / Entity Statements</h3>
          <p className="text-xs text-slate-400">Drill down into transaction statement logs for individual suppliers and active customers</p>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search business entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 w-56"
          />
        </div>
      </div>

      {/* KPI summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 font-medium text-slate-700">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Debts Outstanding (Receivable)</p>
            <p className="text-xl font-bold text-slate-800 mt-1">PKR {totalReceivable.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Dues Outstanding (Payable)</p>
            <p className="text-xl font-bold text-rose-600 mt-1">PKR {totalPayable.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <ArrowDownLeft size={18} />
          </div>
        </div>
      </div>

      {/* Parties List Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[550px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Party Name</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Company Reference</th>
              <th className="py-3 px-3 text-right">Outstanding balance</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            {filteredParties.map((pty) => (
              <tr key={pty.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-slate-100 text-slate-600 flex items-center justify-center rounded-lg font-bold">
                      {pty.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{pty.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{pty.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                    pty.type === 'Customer' 
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {pty.type}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-500 font-bold">{pty.company}</td>
                <td className="py-3.5 px-3 text-right font-mono font-bold">
                  {pty.outstanding > 0 ? (
                    <span className="text-emerald-600" title="Receivable">
                      +PKR {pty.outstanding.toLocaleString()}
                    </span>
                  ) : pty.outstanding < 0 ? (
                    <span className="text-rose-600" title="Payable">
                      -PKR {Math.abs(pty.outstanding).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-slate-400">Balanced</span>
                  )}
                </td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => setSelectedParty(pty)}
                    className="flex items-center gap-1.5 ml-auto text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/60 cursor-pointer"
                  >
                    <Eye size={12} /> View Statement
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drill-down Statement Modal */}
      <AnimatePresence>
        {selectedParty && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden border border-slate-100 shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{selectedParty.company} Statements</h4>
                    <p className="text-[10px] text-slate-400">Statement of Account logs for {selectedParty.name} ({selectedParty.type})</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedParty(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs font-medium text-slate-600">
                {/* Party Metadata overview */}
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Contact Representative</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedParty.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Phone Number</span>
                    <p className="font-semibold text-slate-600 mt-0.5">{selectedParty.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Closing Balance</span>
                    <p className={`font-mono font-extrabold text-sm mt-0.5 ${selectedParty.outstanding >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {selectedParty.outstanding >= 0 ? '+' : '-'}PKR {Math.abs(selectedParty.outstanding).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Ledger entries table */}
                <div>
                  <h5 className="font-bold text-slate-700 mb-2">Ledger Statement Transactions</h5>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-2">Date</th>
                        <th className="py-2">Log Ref / Description</th>
                        <th className="py-2 text-right">Debit (Dr)</th>
                        <th className="py-2 text-right">Credit (Cr)</th>
                        <th className="py-2 text-right">Running Net</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-600 font-mono">
                      {selectedParty.transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/20">
                          <td className="py-2 text-slate-400">{tx.date}</td>
                          <td className="py-2 font-sans font-bold text-slate-700">{tx.desc}</td>
                          <td className="py-2 text-right text-emerald-600">{tx.debit > 0 ? `+PKR ${tx.debit.toLocaleString()}` : '-'}</td>
                          <td className="py-2 text-right text-rose-600">{tx.credit > 0 ? `-PKR ${tx.credit.toLocaleString()}` : '-'}</td>
                          <td className="py-2 text-right font-extrabold text-slate-800">PKR {tx.balance.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button
                  onClick={() => setSelectedParty(null)}
                  className="text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl cursor-pointer"
                >
                  Close Statement View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
