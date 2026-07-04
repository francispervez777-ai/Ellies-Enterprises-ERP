import React, { useState } from 'react';
import { Search, Plus, ShoppingBag, CheckCircle, Clock, Trash2, X, Eye, FileText, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PurchaseOrder {
  id: string;
  vendor: string;
  date: string;
  deliveryDue: string;
  amount: number;
  status: 'Draft' | 'Ordered' | 'Received' | 'Overdue';
  itemsSummary: string;
}

export default function PurchaseOrdersManager() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    { id: 'PO-2026-901', vendor: 'Atomic Warehouses', date: '2026-06-28', deliveryDue: '2026-07-15', amount: 14500, status: 'Ordered', itemsSummary: 'Steel Sheets & Zinc Alloys' },
    { id: 'PO-2026-902', vendor: 'Eras Logistical Corp', date: '2026-06-15', deliveryDue: '2026-06-30', amount: 8100, status: 'Received', itemsSummary: 'Recycled Carton & Packing Grids' },
    { id: 'PO-2026-903', vendor: 'Micro Devices Inc', date: '2026-07-01', deliveryDue: '2026-07-20', amount: 32000, status: 'Draft', itemsSummary: 'Microcontrollers & TFT Modules' },
    { id: 'PO-2026-904', vendor: 'Space Logistics', date: '2026-05-10', deliveryDue: '2026-05-25', amount: 4500, status: 'Overdue', itemsSummary: 'Carbon Fiber Struts' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // Form states
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [deliveryDue, setDeliveryDue] = useState('');
  const [itemsSummary, setItemsSummary] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Ordered'>('Draft');

  const filteredPOs = purchaseOrders.filter(p => 
    p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.itemsSummary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !amount) return;

    const newPO: PurchaseOrder = {
      id: `PO-2026-90${purchaseOrders.length + 1}`,
      vendor,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount) || 0,
      deliveryDue: deliveryDue || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status,
      itemsSummary: itemsSummary || 'Standard supply order'
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setIsAddOpen(false);

    // Reset Form
    setVendor('');
    setAmount('');
    setDeliveryDue('');
    setItemsSummary('');
  };

  const handleDelete = (id: string) => {
    setPurchaseOrders(purchaseOrders.filter(p => p.id !== id));
  };

  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'Received': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Ordered': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Draft': return 'bg-slate-50 text-slate-700 border-slate-100';
      case 'Overdue': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="purchase-orders-manager">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Purchase Orders (B2B)</h3>
          <p className="text-xs text-slate-400">Issue official buy requests, coordinate raw-material intake, and record supplier fulfillment</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search purchase orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 w-52"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} /> Raise Order
          </button>
        </div>
      </div>

      {/* Grid summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Total Committed Outflow</p>
          <p className="text-lg font-bold text-slate-800 mt-1">${purchaseOrders.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Outstanding Orders</p>
          <p className="text-lg font-bold text-blue-600 mt-1">
            {purchaseOrders.filter(p => p.status === 'Ordered').length}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Fulfilled/Received</p>
          <p className="text-lg font-bold text-emerald-600 mt-1">
            {purchaseOrders.filter(p => p.status === 'Received').length}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Overdue Alerts</p>
          <p className="text-lg font-bold text-rose-600 mt-1">
            {purchaseOrders.filter(p => p.status === 'Overdue').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Order ID</th>
              <th className="py-3 px-3">Supplier / Vendor</th>
              <th className="py-3 px-3">Item Catalog Summary</th>
              <th className="py-3 px-3 text-right">Commitment Amt</th>
              <th className="py-3 px-3 text-center">Fulfillment Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            {filteredPOs.length > 0 ? (
              filteredPOs.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3.5 px-3 font-semibold font-mono text-slate-800 text-xs flex items-center gap-2">
                    <ShoppingBag size={14} className="text-slate-400" />
                    {p.id}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 font-bold">{p.vendor}</td>
                  <td className="py-3.5 px-3 text-slate-400 max-w-xs truncate" title={p.itemsSummary}>
                    {p.itemsSummary}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">PKR {p.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedPO(p)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye size={13} />
                      </button>
                      {p.status === 'Draft' && (
                        <button
                          onClick={() => setPurchaseOrders(purchaseOrders.map(x => x.id === p.id ? { ...x, status: 'Ordered' } : x))}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Place Order"
                        >
                          <Send size={13} />
                        </button>
                      )}
                      {p.status === 'Ordered' && (
                        <button
                          onClick={() => setPurchaseOrders(purchaseOrders.map(x => x.id === p.id ? { ...x, status: 'Received' } : x))}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Receive Inventory"
                        >
                          <CheckCircle size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Cancel Order"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  No purchase orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create PO Modal */}
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
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">New Purchase Order (B2B)</h4>
                    <p className="text-[10px] text-slate-400">Commit funds and order bulk raw materials</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddPO} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-medium text-slate-600">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Select Supplier *</label>
                  <input
                    type="text"
                    required
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Atomic Warehouses"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Order Amount (PKR) *</label>
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
                    <label className="block text-slate-400 font-bold mb-1">Delivery Due Date</label>
                    <input
                      type="date"
                      value={deliveryDue}
                      onChange={(e) => setDeliveryDue(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Order Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Ordered">Placed / Ordered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Bill of Materials / Items Summary *</label>
                  <textarea
                    required
                    value={itemsSummary}
                    onChange={(e) => setItemsSummary(e.target.value)}
                    placeholder="List general materials, item types, and quantities"
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 resize-none"
                  />
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
                    Generate B2B PO
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PO Details Modal */}
      <AnimatePresence>
        {selectedPO && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden border border-slate-100 shadow-2xl p-6 relative"
            >
              <button
                onClick={() => setSelectedPO(null)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-blue-500" size={18} />
                <h4 className="font-extrabold text-slate-800 text-sm">Purchase Order Specification</h4>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Order Reference</p>
                  <p className="font-bold text-slate-800 font-mono mt-0.5">{selectedPO.id}</p>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-semibold">Supplier:</span>
                  <span className="font-bold text-slate-800">{selectedPO.vendor}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-semibold">Date Raised:</span>
                  <span className="font-bold text-slate-700">{selectedPO.date}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-semibold">Delivery Target:</span>
                  <span className="font-bold text-rose-600">{selectedPO.deliveryDue}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-semibold">Financial Commitment:</span>
                  <span className="font-bold text-blue-600 font-mono">PKR {selectedPO.amount.toLocaleString()}</span>
                </div>
                <div className="pt-1">
                  <p className="text-slate-400 font-bold text-[10px] uppercase mb-1">Catalogued Materials</p>
                  <p className="text-slate-700 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    "{selectedPO.itemsSummary}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPO(null)}
                className="w-full text-center mt-5 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
