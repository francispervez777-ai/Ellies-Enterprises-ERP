import React, { useState } from 'react';
import { Search, Plus, User, Phone, Mail, FileText, CheckCircle, Trash2, X, MapPin, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Customer } from '../types';

interface CustomersManagerProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export default function CustomersManager({ customers, setCustomers }: CustomersManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New form state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [initialInvoiced, setInitialInvoiced] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [ntn, setNtn] = useState('');
  const [gst, setGst] = useState('');
  const [po, setPo] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');

  // CSV Import States
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [parsedCustomers, setParsedCustomers] = useState<Customer[]>([]);
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
    const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Address', 'Total Orders', 'Total Invoiced', 'Current Balance', 'NTN', 'GST', 'Default PO #', 'Opening Balance'];
    const rows = customers.map(c => [
      c.id,
      c.name,
      c.company,
      c.email,
      c.phone,
      c.address,
      c.totalOrders,
      c.totalInvoiced,
      c.balance,
      c.ntn || 'N/A',
      c.gst || 'N/A',
      c.po || 'N/A',
      c.openingBalance || 0
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
    link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Template Downloader
  const handleDownloadTemplate = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Address', 'Total Orders', 'Total Invoiced', 'Opening Balance', 'NTN', 'GST', 'Default PO'];
    const sampleData = ['Jane Doe', 'Acme Corp', 'jane@acme.com', '+1 (555) 019-9900', '123 Main St, CA', '5', '1250', '250', '9703305-1', '3840132000345', 'PO-2026-901'];
    
    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_template.csv`);
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
        
        const nameIdx = headers.findIndex(h => h.includes('name'));
        const companyIdx = headers.findIndex(h => h.includes('company'));
        const emailIdx = headers.findIndex(h => h.includes('email'));
        const phoneIdx = headers.findIndex(h => h.includes('phone'));
        const addressIdx = headers.findIndex(h => h.includes('address'));
        const ordersIdx = headers.findIndex(h => h.includes('order') || h.includes('qty'));
        const invoicedIdx = headers.findIndex(h => h.includes('invoice') || h.includes('billing'));
        const balanceIdx = headers.findIndex(h => h.includes('balance') || h.includes('opening') || h.includes('debt'));
        const ntnIdx = headers.findIndex(h => h.includes('ntn'));
        const gstIdx = headers.findIndex(h => h.includes('gst'));
        const poIdx = headers.findIndex(h => h.includes('po') || h.includes('purchaseorder'));

        if (nameIdx === -1 || companyIdx === -1) {
          setImportError("CSV must contain at least 'Name' and 'Company' headers.");
          return;
        }

        const tempCustomers: Customer[] = [];
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
            validationErrors.push(`Row ${i + 1}: Missing Name or Company. Skipped.`);
            continue;
          }

          const emailVal = emailIdx !== -1 && emailIdx < row.length ? row[emailIdx] || 'n/a' : 'n/a';
          const phoneVal = phoneIdx !== -1 && phoneIdx < row.length ? row[phoneIdx] || 'n/a' : 'n/a';
          const addressVal = addressIdx !== -1 && addressIdx < row.length ? row[addressIdx] || 'n/a' : 'n/a';
          const ordersVal = ordersIdx !== -1 && ordersIdx < row.length ? parseInt(row[ordersIdx]) || 0 : 0;
          const invoicedVal = invoicedIdx !== -1 && invoicedIdx < row.length ? parseFloat(row[invoicedIdx]) || 0 : 0;
          const balanceVal = balanceIdx !== -1 && balanceIdx < row.length ? parseFloat(row[balanceIdx]) || 0 : 0;
          const ntnVal = ntnIdx !== -1 && ntnIdx < row.length ? row[ntnIdx] || 'N/A' : 'N/A';
          const gstVal = gstIdx !== -1 && gstIdx < row.length ? row[gstIdx] || 'N/A' : 'N/A';
          const poVal = poIdx !== -1 && poIdx < row.length ? row[poIdx] || 'N/A' : 'N/A';

          tempCustomers.push({
            id: `CUST-IMP-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            name: nameVal,
            company: companyVal,
            email: emailVal,
            phone: phoneVal,
            address: addressVal,
            totalOrders: ordersVal,
            totalInvoiced: invoicedVal,
            balance: balanceVal,
            ntn: ntnVal,
            gst: gstVal,
            po: poVal,
            openingBalance: balanceVal
          });
        }

        setParsedCustomers(tempCustomers);
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
    const nextIndex = customers.length + 1;
    const finalized = parsedCustomers.map((c, i) => ({
      ...c,
      id: `CUST-00${nextIndex + i}`
    }));
    setCustomers([...finalized, ...customers]);
    setIsImportOpen(false);
    setParsedCustomers([]);
    setImportWarnings([]);
    setImportError(null);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) return;

    const opBalance = parseFloat(openingBalance) || 0;
    const newCust: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name,
      company,
      email: email || 'n/a',
      phone: phone || 'n/a',
      address: address || 'n/a',
      totalOrders: 0,
      totalInvoiced: parseFloat(initialInvoiced) || 0,
      balance: opBalance,
      ntn: ntn || 'N/A',
      gst: gst || 'N/A',
      po: po || 'N/A',
      openingBalance: opBalance,
    };

    setCustomers([newCust, ...customers]);
    setIsAddOpen(false);
    
    // Reset form
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setAddress('');
    setInitialInvoiced('');
    setInitialBalance('');
    setNtn('');
    setGst('');
    setPo('');
    setOpeningBalance('');
  };

  const handleDelete = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="customers-manager-container">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Customers Directory</h3>
          <p className="text-xs text-slate-400">Manage client contact metrics, outstanding receivables, and purchase frequency</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
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
            <Plus size={15} /> Add Customer
          </button>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Active Clients</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{customers.length}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Receivables</p>
          <p className="text-xl font-bold text-slate-800 mt-1">PKR {customers.reduce((sum, c) => sum + c.balance, 0).toLocaleString()}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Billing</p>
          <p className="text-xl font-bold text-blue-600 mt-1">PKR {customers.reduce((sum, c) => sum + c.totalInvoiced, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Client Profile</th>
              <th className="py-3 px-3">Contact Details</th>
              <th className="py-3 px-3 text-center">Orders</th>
              <th className="py-3 px-3 text-right">Invoiced</th>
              <th className="py-3 px-3 text-right">Receivables</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {cust.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{cust.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">{cust.company}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {cust.ntn && cust.ntn !== 'N/A' && (
                            <span className="text-[9px] bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded-md font-mono font-semibold" title="NTN">
                              NTN: {cust.ntn}
                            </span>
                          )}
                          {cust.gst && cust.gst !== 'N/A' && (
                            <span className="text-[9px] bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded-md font-mono font-semibold" title="GST">
                              GST: {cust.gst}
                            </span>
                          )}
                          {cust.po && cust.po !== 'N/A' && (
                            <span className="text-[9px] bg-blue-50/60 text-blue-600 border border-blue-100/50 px-1.5 py-0.5 rounded-md font-mono font-semibold" title="Purchase Order #">
                              PO: {cust.po}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Mail size={12} className="text-slate-400" /> {cust.email}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-400">
                        <Phone size={12} /> {cust.phone}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700">{cust.totalOrders}</td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">PKR {cust.totalInvoiced.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex flex-col items-end">
                      {cust.balance > 0 ? (
                        <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          PKR {cust.balance.toLocaleString()}
                        </span>
                      ) : (
                        <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          Clear
                        </span>
                      )}
                      {cust.openingBalance !== undefined && (
                        <span className="text-[9px] text-slate-400 mt-1">
                          Opening: PKR {cust.openingBalance.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleDelete(cust.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                      title="Remove Customer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  No customers found matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
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
                    <User size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">New Customer Profile</h4>
                    <p className="text-[10px] text-slate-400">Add client details and financial parameters</p>
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
              <form onSubmit={handleAddCustomer} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-medium text-slate-600">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@domain.com"
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

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Billing Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Physical location"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
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
                      placeholder="e.g. PO-2026-001"
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
                    <label className="block text-slate-400 font-bold mb-1">Initial Billing / Historic Invoiced (PKR)</label>
                    <input
                      type="number"
                      value={initialInvoiced}
                      onChange={(e) => setInitialInvoiced(e.target.value)}
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
                    Create Client Profile
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
                  <h4 className="font-extrabold text-slate-800 text-sm">Bulk Import Customers via CSV</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Upload a CSV file containing your customer list to import them in bulk.</p>
                </div>
                <button
                  onClick={() => {
                    setIsImportOpen(false);
                    setParsedCustomers([]);
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
                {parsedCustomers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700">Preview: {parsedCustomers.length} Records Found</p>
                    <div className="border border-slate-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                            <th className="py-2 px-3">Name</th>
                            <th className="py-2 px-3">Company</th>
                            <th className="py-2 px-3">Email</th>
                            <th className="py-2 px-3">NTN / GST</th>
                            <th className="py-2 px-3 text-right">Opening Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {parsedCustomers.map((c, idx) => (
                            <tr key={idx} className="text-[11px] text-slate-600 hover:bg-slate-50">
                              <td className="py-2 px-3 font-semibold text-slate-800">{c.name}</td>
                              <td className="py-2 px-3">{c.company}</td>
                              <td className="py-2 px-3 font-mono">{c.email}</td>
                              <td className="py-2 px-3 font-mono">
                                {c.ntn !== 'N/A' ? `NTN: ${c.ntn}` : ''}
                                {c.ntn !== 'N/A' && c.gst !== 'N/A' ? ' | ' : ''}
                                {c.gst !== 'N/A' ? `GST: ${c.gst}` : ''}
                                {c.ntn === 'N/A' && c.gst === 'N/A' ? 'N/A' : ''}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-semibold">PKR {(c.openingBalance || 0).toLocaleString()}</td>
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
                    setParsedCustomers([]);
                    setImportWarnings([]);
                    setImportError(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/80 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={parsedCustomers.length === 0}
                  onClick={handleConfirmImport}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  Confirm Bulk Import ({parsedCustomers.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
