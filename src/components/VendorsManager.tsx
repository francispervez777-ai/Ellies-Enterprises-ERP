import React, { useState } from 'react';
import { Search, Plus, ShoppingCart, Phone, Mail, FileText, CheckCircle, Trash2, X, Store, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Vendor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  category: string;
  totalPurchases: number;
  payable: number; // Positive means we owe them
  lastPurchaseDate: string;
  ntn?: string;
  gst?: string;
  po?: string;
  openingBalance?: number;
}

export default function VendorsManager() {
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'VND-001', name: 'James Clear', company: 'Atomic Warehouses', email: 'james@atomic.com', phone: '+1 (555) 033-4455', category: 'Raw Materials', totalPurchases: 14500, payable: 2200, lastPurchaseDate: '2026-06-28', ntn: '9703305-1', gst: '3840132000345', po: 'PO-2026-101', openingBalance: 1500 },
    { id: 'VND-002', name: 'Taylor Swift', company: 'Eras Logistical Corp', email: 'taylor@eras.com', phone: '+1 (555) 077-8899', category: 'Packaging', totalPurchases: 8100, payable: 0, lastPurchaseDate: '2026-06-15', ntn: '1234567-2', gst: '1234567890123', po: 'PO-2026-102', openingBalance: 0 },
    { id: 'VND-003', name: 'Bill Gates', company: 'Micro Devices Inc', email: 'bill@microdevices.com', phone: '+1 (555) 022-1133', category: 'Electronics', totalPurchases: 32000, payable: 5400, lastPurchaseDate: '2026-07-01', ntn: '7654321-3', gst: '9876543210987', po: 'PO-2026-103', openingBalance: 4000 },
    { id: 'VND-004', name: 'Elon Musk', company: 'Space Logistics', email: 'elon@spacelog.com', phone: '+1 (555) 099-0099', category: 'Hardware', totalPurchases: 4500, payable: 450, lastPurchaseDate: '2026-05-20', ntn: 'N/A', gst: 'N/A', po: 'N/A', openingBalance: 0 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [categories, setCategories] = useState<string[]>([
    'Raw Materials',
    'Packaging',
    'Electronics',
    'Hardware',
    'Services'
  ]);
  const [category, setCategory] = useState('Raw Materials');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [initialPurchases, setInitialPurchases] = useState('');
  const [initialPayable, setInitialPayable] = useState('');
  const [ntn, setNtn] = useState('');
  const [gst, setGst] = useState('');
  const [po, setPo] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');

  // CSV Import States
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [parsedVendors, setParsedVendors] = useState<Vendor[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);

  // CSV parsing logic that handles quoted commas
  const parseCSV = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [];
    let inQuotes = false;
    let currentValue = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentValue += '"';
          i++; // skip next double quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentValue.trim());
        currentValue = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(currentValue.trim());
        if (row.length > 0 && (row.length > 1 || row[0] !== '')) {
          lines.push(row);
        }
        row = [];
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    if (currentValue || row.length > 0) {
      row.push(currentValue.trim());
      lines.push(row);
    }
    return lines;
  };

  // CSV Exporter
  const handleExportCSV = () => {
    const headers = ['ID', 'Contact Name', 'Company Name', 'Email', 'Phone', 'Category', 'Total Purchases', 'Accounts Payable', 'Last Purchase Date', 'NTN', 'GST', 'Default PO #', 'Opening Balance'];
    const rows = vendors.map(v => [
      v.id,
      v.name,
      v.company,
      v.email,
      v.phone,
      v.category,
      v.totalPurchases,
      v.payable,
      v.lastPurchaseDate,
      v.ntn || 'N/A',
      v.gst || 'N/A',
      v.po || 'N/A',
      v.openingBalance || 0
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(value => {
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vendors_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Template Downloader
  const handleDownloadTemplate = () => {
    const headers = ['Contact Name', 'Company Name', 'Email', 'Phone', 'Category', 'Total Purchases', 'Opening Balance', 'NTN', 'GST', 'Default PO'];
    const sampleData = ['John Smith', 'Supply Tech', 'john@supplytech.com', '+1 (555) 012-7788', 'Raw Materials', '8000', '500', '9703305-1', '3840132000345', 'PO-2026-501'];
    
    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vendors_template.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV File Uploader & Parser
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const parsedRows = parseCSV(text);
        if (parsedRows.length < 2) {
          setImportError("CSV file must have at least a header row and one data row.");
          return;
        }

        const headers = parsedRows[0].map(h => h.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));
        
        const nameIdx = headers.findIndex(h => h.includes('contact') || h.includes('name'));
        const companyIdx = headers.findIndex(h => h.includes('company'));
        const emailIdx = headers.findIndex(h => h.includes('email'));
        const phoneIdx = headers.findIndex(h => h.includes('phone'));
        const categoryIdx = headers.findIndex(h => h.includes('category') || h.includes('type'));
        const purchasesIdx = headers.findIndex(h => h.includes('purchase') || h.includes('totalprocured'));
        const balanceIdx = headers.findIndex(h => h.includes('balance') || h.includes('opening') || h.includes('payable'));
        const ntnIdx = headers.findIndex(h => h.includes('ntn'));
        const gstIdx = headers.findIndex(h => h.includes('gst'));
        const poIdx = headers.findIndex(h => h.includes('po') || h.includes('purchaseorder'));

        if (nameIdx === -1 || companyIdx === -1) {
          setImportError("CSV must contain at least 'Contact Name' and 'Company Name' headers.");
          return;
        }

        const tempVendors: Vendor[] = [];
        const validationErrors: string[] = [];

        for (let i = 1; i < parsedRows.length; i++) {
          const row = parsedRows[i];
          if (row.length === 0 || (row.length === 1 && row[0] === '')) continue;

          // Check if row has enough data columns or is completely empty
          const nameVal = nameIdx < row.length ? row[nameIdx] : '';
          const companyVal = companyIdx < row.length ? row[companyIdx] : '';

          if (!nameVal && !companyVal) {
            continue; // Skip entirely empty row
          }

          if (!nameVal || !companyVal) {
            validationErrors.push(`Row ${i + 1}: Missing Contact Name or Company Name. Skipped.`);
            continue;
          }

          const emailVal = emailIdx !== -1 && emailIdx < row.length ? row[emailIdx] || 'n/a' : 'n/a';
          const phoneVal = phoneIdx !== -1 && phoneIdx < row.length ? row[phoneIdx] || 'n/a' : 'n/a';
          const categoryVal = categoryIdx !== -1 && categoryIdx < row.length ? row[categoryIdx] || 'Raw Materials' : 'Raw Materials';
          const purchasesVal = purchasesIdx !== -1 && purchasesIdx < row.length ? parseFloat(row[purchasesIdx]) || 0 : 0;
          const balanceVal = balanceIdx !== -1 && balanceIdx < row.length ? parseFloat(row[balanceIdx]) || 0 : 0;
          const ntnVal = ntnIdx !== -1 && ntnIdx < row.length ? row[ntnIdx] || 'N/A' : 'N/A';
          const gstVal = gstIdx !== -1 && gstIdx < row.length ? row[gstIdx] || 'N/A' : 'N/A';
          const poVal = poIdx !== -1 && poIdx < row.length ? row[poIdx] || 'N/A' : 'N/A';

          tempVendors.push({
            id: `VND-IMP-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            name: nameVal,
            company: companyVal,
            email: emailVal,
            phone: phoneVal,
            category: categoryVal,
            totalPurchases: purchasesVal,
            payable: balanceVal,
            lastPurchaseDate: new Date().toISOString().split('T')[0],
            ntn: ntnVal,
            gst: gstVal,
            po: poVal,
            openingBalance: balanceVal
          });
        }

        setParsedVendors(tempVendors);
        setImportWarnings(validationErrors);
        setImportError(null);
      } catch (err: any) {
        setImportError(`Failed to parse CSV: ${err.message}`);
      }
    };
    reader.readAsText(file);
    // Reset the input so uploading the same file triggers again if needed
    e.target.value = '';
  };

  // CSV Importer Confirmation
  const handleConfirmImport = () => {
    const nextIndex = vendors.length + 1;
    const finalized = parsedVendors.map((v, i) => ({
      ...v,
      id: `VND-00${nextIndex + i}`
    }));

    // Dynamically register any categories from imports that aren't already present
    const updatedCategories = [...categories];
    let categoriesChanged = false;
    finalized.forEach(v => {
      if (v.category && !updatedCategories.includes(v.category)) {
        updatedCategories.push(v.category);
        categoriesChanged = true;
      }
    });
    if (categoriesChanged) {
      setCategories(updatedCategories);
    }

    setVendors([...finalized, ...vendors]);
    setIsImportOpen(false);
    setParsedVendors([]);
    setImportWarnings([]);
    setImportError(null);
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) return;

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) return;

    if (isCustomCategory && !categories.includes(finalCategory)) {
      setCategories([...categories, finalCategory]);
    }

    const opBalance = parseFloat(openingBalance) || 0;
    const newVnd: Vendor = {
      id: `VND-00${vendors.length + 1}`,
      name,
      company,
      email: email || 'n/a',
      phone: phone || 'n/a',
      category: finalCategory,
      totalPurchases: parseFloat(initialPurchases) || 0,
      payable: opBalance,
      lastPurchaseDate: new Date().toISOString().split('T')[0],
      ntn: ntn || 'N/A',
      gst: gst || 'N/A',
      po: po || 'N/A',
      openingBalance: opBalance,
    };

    setVendors([newVnd, ...vendors]);
    setIsAddOpen(false);

    // Reset form
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setCategory('Raw Materials');
    setIsCustomCategory(false);
    setCustomCategory('');
    setInitialPurchases('');
    setInitialPayable('');
    setNtn('');
    setGst('');
    setPo('');
    setOpeningBalance('');
  };

  const handleDelete = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="vendors-manager-container">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Suppliers & Vendors Directory</h3>
          <p className="text-xs text-slate-400">Track raw materials supply pipelines, wholesale order aggregates, and outstanding payables</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 w-56"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
            title="Export to CSV"
          >
            <Download size={15} /> Export
          </button>

          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
            title="Bulk Import from CSV"
          >
            <Upload size={15} /> Import
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} /> Add Supplier
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Suppliers</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{vendors.length}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Accounts Payable</p>
          <p className="text-xl font-bold text-rose-600 mt-1">PKR {vendors.reduce((sum, v) => sum + v.payable, 0).toLocaleString()}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Procurement Value</p>
          <p className="text-xl font-bold text-slate-800 mt-1">PKR {vendors.reduce((sum, v) => sum + v.totalPurchases, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Supplier Profile</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Contact Details</th>
              <th className="py-3 px-3 text-right">Procured Amt</th>
              <th className="py-3 px-3 text-right">Accounts Payable</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <Store size={15} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{v.company}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{v.name} (Contact)</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {v.ntn && v.ntn !== 'N/A' && (
                            <span className="text-[9px] bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded-md font-mono font-semibold" title="NTN">
                              NTN: {v.ntn}
                            </span>
                          )}
                          {v.gst && v.gst !== 'N/A' && (
                            <span className="text-[9px] bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded-md font-mono font-semibold" title="GST">
                              GST: {v.gst}
                            </span>
                          )}
                          {v.po && v.po !== 'N/A' && (
                            <span className="text-[9px] bg-blue-50/60 text-blue-600 border border-blue-100/50 px-1.5 py-0.5 rounded-md font-mono font-semibold" title="Purchase Order #">
                              PO: {v.po}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-bold">
                      {v.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Mail size={12} className="text-slate-400" /> {v.email}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-400">
                        <Phone size={12} /> {v.phone}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">PKR {v.totalPurchases.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex flex-col items-end">
                      {v.payable > 0 ? (
                        <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                          PKR {v.payable.toLocaleString()}
                        </span>
                      ) : (
                        <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          Settled
                        </span>
                      )}
                      {v.openingBalance !== undefined && (
                        <span className="text-[9px] text-slate-400 mt-1">
                          Opening: PKR {v.openingBalance.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                      title="Remove Supplier"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  No suppliers found matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Supplier Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-slate-100 shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <ShoppingCart size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">New Supplier Profile</h4>
                    <p className="text-[10px] text-slate-400">Add vendor contact data and tracking parameters</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddVendor} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-medium text-slate-600">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Company / Supplier Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter vendor enterprise"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name of representative"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Supply Category *</label>
                  <select
                    value={isCustomCategory ? "custom" : category}
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setIsCustomCategory(true);
                        setCustomCategory('');
                      } else {
                        setIsCustomCategory(false);
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom" className="text-blue-600 font-semibold">+ Add Custom Category...</option>
                  </select>
                </div>

                {isCustomCategory && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5"
                  >
                    <label className="block text-slate-500 font-bold">New Category Name *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required={isCustomCategory}
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Chemical/Lubricants"
                        className="flex-1 bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-all text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCategory(false);
                          setCategory(categories[0] || 'Raw Materials');
                        }}
                        className="px-3.5 py-2 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold transition-all"
                      >
                        Choose Existing
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vendor@domain.com"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">National Tax Number (NTN)</label>
                    <input
                      type="text"
                      value={ntn}
                      onChange={(e) => setNtn(e.target.value)}
                      placeholder="e.g. 9703305-1"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">General Sales Tax (GST)</label>
                    <input
                      type="text"
                      value={gst}
                      onChange={(e) => setGst(e.target.value)}
                      placeholder="e.g. 3840132000345"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Default Purchase Order #</label>
                    <input
                      type="text"
                      value={po}
                      onChange={(e) => setPo(e.target.value)}
                      placeholder="e.g. PO-2026-101"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Opening Balance (PKR)</label>
                    <input
                      type="number"
                      value={openingBalance}
                      onChange={(e) => setOpeningBalance(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 pt-2">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Procured So Far (PKR)</label>
                    <input
                      type="number"
                      value={initialPurchases}
                      onChange={(e) => setInitialPurchases(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                </div>

                {/* Footer buttons */}
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
                    Create Supplier Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSV Import Modal */}
      <AnimatePresence>
        {isImportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Bulk Import Suppliers via CSV</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Upload a CSV file containing your suppliers/vendors list to import them in bulk.</p>
                </div>
                <button
                  onClick={() => {
                    setIsImportOpen(false);
                    setParsedVendors([]);
                    setImportWarnings([]);
                    setImportError(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-blue-50/40 border border-blue-100/60 p-4 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-blue-900">Need a starting point?</p>
                    <p className="text-[11px] text-blue-700/80 mt-0.5">Download our standardized CSV template with the expected header format.</p>
                  </div>
                  <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-lg transition-all active:scale-95"
                  >
                    <Download size={13} /> Download Template
                  </button>
                </div>

                {/* Upload Zone */}
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400/80 rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center relative bg-slate-50/50">
                  <Upload size={28} className="text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Choose CSV File</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Only .csv files are supported. Max size 5MB.</p>
                  
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>

                {/* Error Banner */}
                {importError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-xs font-semibold">
                    {importError}
                  </div>
                )}

                {/* Warnings Banner */}
                {importWarnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-100/80 p-3 rounded-xl max-h-24 overflow-y-auto">
                    <p className="text-[11px] font-bold text-amber-800 mb-1">Import Warnings:</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {importWarnings.map((w, idx) => (
                        <li key={idx} className="text-[10px] text-amber-700 font-mono">{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Parsed Preview Table */}
                {parsedVendors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700">Preview: {parsedVendors.length} Records Found</p>
                    <div className="border border-slate-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                            <th className="py-2 px-3">Contact Name</th>
                            <th className="py-2 px-3">Company Name</th>
                            <th className="py-2 px-3">Email</th>
                            <th className="py-2 px-3">Category</th>
                            <th className="py-2 px-3">NTN / GST</th>
                            <th className="py-2 px-3 text-right">Opening Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {parsedVendors.map((v, idx) => (
                            <tr key={idx} className="text-[11px] text-slate-600 hover:bg-slate-50">
                              <td className="py-2 px-3 font-semibold text-slate-800">{v.name}</td>
                              <td className="py-2 px-3">{v.company}</td>
                              <td className="py-2 px-3 font-mono">{v.email}</td>
                              <td className="py-2 px-3">
                                <span className="inline-block bg-slate-100 text-slate-700 rounded-md px-2 py-0.5 text-[9px] font-semibold font-mono">
                                  {v.category}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-mono">
                                {v.ntn !== 'N/A' ? `NTN: ${v.ntn}` : ''}
                                {v.ntn !== 'N/A' && v.gst !== 'N/A' ? ' | ' : ''}
                                {v.gst !== 'N/A' ? `GST: ${v.gst}` : ''}
                                {v.ntn === 'N/A' && v.gst === 'N/A' ? 'N/A' : ''}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-semibold">PKR {(v.openingBalance || 0).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportOpen(false);
                    setParsedVendors([]);
                    setImportWarnings([]);
                    setImportError(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/80 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={parsedVendors.length === 0}
                  onClick={handleConfirmImport}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  Confirm Bulk Import ({parsedVendors.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
