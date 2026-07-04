import React, { useState } from 'react';
import { Search, Plus, Package, Eye, Trash2, X, AlertTriangle, ArrowUpDown, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StockItem } from '../types';

interface InventoryManagerProps {
  stockItems: StockItem[];
  onRestock: (id: string, qty: number) => void;
}

export default function InventoryManager({ stockItems: initialStockItems, onRestock }: InventoryManagerProps) {
  const [items, setItems] = useState<StockItem[]>(initialStockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('pcs');

  // Local sync on parent updates (e.g. restocks)
  React.useEffect(() => {
    setItems(initialStockItems);
  }, [initialStockItems]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) return;

    const stockQty = parseInt(stock) || 0;
    const minQty = parseInt(minStock) || 10;
    const itemPrice = parseFloat(price) || 0;

    const newItem: StockItem = {
      id: `STK-${Math.floor(100 + Math.random() * 900)}`,
      name,
      sku: sku.toUpperCase(),
      category,
      stock: stockQty,
      minStock: minQty,
      price: itemPrice,
      status: stockQty === 0 ? 'Out of Stock' : stockQty <= minQty ? 'Low Stock' : 'In Stock',
      unit: unit || 'pcs'
    };

    setItems([newItem, ...items]);
    setIsAddOpen(false);

    // Reset Form
    setName('');
    setSku('');
    setCategory('Electronics');
    setStock('');
    setMinStock('');
    setPrice('');
    setUnit('pcs');
  };

  const handleRestockQty = (id: string, qty: number) => {
    onRestock(id, qty);
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = item.stock + qty;
        return {
          ...item,
          stock: newStock,
          status: newStock > item.minStock ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock'
        };
      }
      return item;
    }));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalValuation = items.reduce((sum, item) => sum + (item.stock * item.price), 0);
  const lowStockAlerts = items.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock').length;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="inventory-manager">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Warehouse & Inventory Management</h3>
          <p className="text-xs text-slate-400">Monitor stock keeping units (SKUs), trace threshold violations, and trigger replenishment pipelines</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search items or SKUs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 w-52"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} /> Add Stock Item
          </button>
        </div>
      </div>

      {/* KPI summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Valuation</p>
            <p className="text-xl font-bold text-slate-800 mt-1">PKR {totalValuation.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Layers size={18} />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active SKUs</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{items.length}</p>
          </div>
          <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
            <Package size={18} />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Replenishment Alerts</p>
            <p className={`text-xl font-bold mt-1 ${lowStockAlerts > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {lowStockAlerts}
            </p>
          </div>
          <div className={`p-2 rounded-xl ${lowStockAlerts > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
            <AlertTriangle size={18} />
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Item Name & SKU</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 text-right">Unit Price</th>
              <th className="py-3 px-3 text-center">Available Stock</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Manual Restock</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isCritical = item.status === 'Low Stock' || item.status === 'Out of Stock';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3.5 px-3">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold font-mono">SKU: {item.sku}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-semibold">PKR {item.price.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                      {item.stock} <span className="text-[10px] text-slate-400 font-sans font-medium">{item.unit || 'pcs'}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.status === 'In Stock' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : item.status === 'Low Stock' 
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleRestockQty(item.id, 10)}
                          className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-bold px-2 py-1 rounded transition-colors cursor-pointer"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleRestockQty(item.id, 50)}
                          className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-bold px-2 py-1 rounded transition-colors cursor-pointer"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  No stock items match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Stock Item Modal */}
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
                    <Package size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">Add New SKU to Inventory</h4>
                    <p className="text-[10px] text-slate-400">Provision unique stock records and thresholds</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-medium text-slate-600">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Item / Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lithium-Ion Battery Pack"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">SKU Code *</label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. LITH-90X"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Raw Materials">Raw Materials</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Stock Qty</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Min Threshold</label>
                    <input
                      type="number"
                      value={minStock}
                      onChange={(e) => setMinStock(e.target.value)}
                      placeholder="10"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Unit (e.g. bottle/pcs)</label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer text-xs"
                    >
                      <option value="pcs">Pieces (pcs)</option>
                      <option value="bottle">Bottle (bottle)</option>
                      <option value="units">Units (units)</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="liters">Liters (liters)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Unit Price (PKR)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
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
                    Add Stock Record
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
