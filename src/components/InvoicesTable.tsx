import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  X, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Printer, 
  DollarSign, 
  ShoppingBag,
  Filter,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Invoice, InvoiceItem } from '../types';

interface InvoicesTableProps {
  invoices: Invoice[];
  onAddInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
}

type StatusType = 'All' | 'Delivered' | 'In Progress' | 'Cancelled' | 'Pending';

export default function InvoicesTable({ invoices, onAddInvoice, onDeleteInvoice }: InvoicesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusType>('All');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Create Invoice Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState('Lexus Room Salon');
  const [newEmail, setNewEmail] = useState('lexus.room.salon@example.com');
  const [newPhone, setNewPhone] = useState('03001090425');
  const [newAddress, setNewAddress] = useState('27-C, Ittehad lane no.6, Ground Floor Shop - 2, Phase-6, Karachi.');
  const [newNtn, setNewNtn] = useState('N/A');
  const [newGst, setNewGst] = useState('N/A');
  const [newPo, setNewPo] = useState('N/A');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPaymentMode, setNewPaymentMode] = useState<string>('CASH');
  const [newPaidAmount, setNewPaidAmount] = useState('0.00');
  const [newStatus, setNewStatus] = useState<Exclude<StatusType, 'All'>>('Delivered');
  const [newItems, setNewItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { name: 'Breeze Bed Rolls (1000Grm)', qty: 6, price: 1250, unit: 'pcs' }
  ]);
  const [newHasSalesTax, setNewHasSalesTax] = useState(true);

  // Helpers
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100/50';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100/50';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100/50';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle size={12} className="mr-1 text-emerald-500" />;
      case 'In Progress':
        return <Clock size={12} className="mr-1 text-blue-500" />;
      case 'Cancelled':
        return <AlertTriangle size={12} className="mr-1 text-rose-500" />;
      case 'Pending':
        return <Clock size={12} className="mr-1 text-amber-500" />;
      default:
        return null;
    }
  };

  // Add Item to creation form
  const handleAddFormItem = () => {
    setNewItems([...newItems, { name: '', qty: 1, price: 50, unit: 'pcs' }]);
  };

  // Remove Item from creation form
  const handleRemoveFormItem = (idx: number) => {
    if (newItems.length === 1) return;
    setNewItems(newItems.filter((_, i) => i !== idx));
  };

  // Update Item in creation form
  const handleUpdateFormItem = (idx: number, field: keyof Omit<InvoiceItem, 'id'>, val: any) => {
    const updated = [...newItems];
    if (field === 'qty') {
      updated[idx].qty = Math.max(1, parseInt(val) || 0);
    } else if (field === 'price') {
      updated[idx].price = Math.max(0, parseFloat(val) || 0);
    } else if (field === 'unit') {
      updated[idx].unit = val;
    } else {
      updated[idx].name = val;
    }
    setNewItems(updated);
  };

  // Print Invoice Document
  const handlePrint = (invoice: Invoice) => {
    const itemSubtotal = invoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const hasTax = invoice.hasSalesTax !== false;
    const calculatedGst = hasTax ? itemSubtotal * 0.18 : 0;
    const calculatedTotal = itemSubtotal + calculatedGst;
    const paidAmount = invoice.paidAmount ?? calculatedTotal;
    const balanceDue = calculatedTotal - paidAmount;

    const itemsRowsHtml = invoice.items.map((item, idx) => {
      const lineSub = item.qty * item.price;
      const lineGst = hasTax ? lineSub * 0.18 : 0;
      const lineTot = lineSub + lineGst;
      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; text-align: center; border-right: 1px solid #cbd5e1;" class="font-mono">${idx + 1}</td>
          <td style="padding: 10px; font-weight: bold; border-right: 1px solid #cbd5e1;">${item.name}</td>
          <td style="padding: 10px; text-align: center; border-right: 1px solid #cbd5e1;" class="font-mono">${item.qty} ${item.unit || 'pcs'}</td>
          <td style="padding: 10px; text-align: right; border-right: 1px solid #cbd5e1;" class="font-mono">PKR ${item.price.toFixed(2)}</td>
          <td style="padding: 10px; text-align: right; border-right: 1px solid #cbd5e1; color: #475569;" class="font-mono">PKR ${lineGst.toFixed(2)}</td>
          <td style="padding: 10px; text-align: right; font-weight: bold;" class="font-mono">PKR ${lineTot.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow popups to print invoices.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoice.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
            body {
              font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
              color: #0f172a;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header-title {
              font-size: 28px;
              font-weight: 900;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: -0.5px;
            }
            .header-subtitle {
              font-size: 13px;
              font-weight: 600;
              color: #4b5563;
              margin-top: 2px;
            }
            .company-info {
              font-size: 12px;
              color: #1e293b;
              margin-top: 10px;
              line-height: 1.5;
            }
            .divider {
              border-top: 1px solid #94a3b8;
              margin: 20px 0;
            }
            .sale-invoice-title {
              text-align: center;
              font-size: 20px;
              font-weight: 900;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin: 25px 0;
            }
            .sale-invoice-title span {
              border-bottom: 2px solid #0f172a;
              padding-bottom: 3px;
            }
            .meta-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              font-size: 12px;
              margin-bottom: 30px;
            }
            .meta-column {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .meta-row {
              display: flex;
            }
            .meta-label {
              width: 110px;
              font-weight: bold;
              color: #0f172a;
            }
            .meta-value {
              flex: 1;
              color: #1e293b;
            }
            .meta-value-bold {
              font-weight: bold;
              color: #0f172a;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #cbd5e1;
              font-size: 11px;
              margin-top: 20px;
            }
            th {
              background-color: #f1f5f9;
              color: #0f172a;
              font-weight: bold;
              padding: 10px;
              border: 1px solid #cbd5e1;
              text-align: left;
            }
            .totals-container {
              display: flex;
              justify-content: flex-end;
              margin-top: 20px;
            }
            .totals-table {
              width: 280px;
              font-size: 12px;
              line-height: 1.8;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
            }
            .totals-label {
              color: #4b5563;
              font-weight: 500;
            }
            .totals-value {
              font-family: 'JetBrains Mono', monospace;
              font-weight: bold;
            }
            .font-mono {
              font-family: 'JetBrains Mono', monospace;
            }
            .totals-total {
              font-size: 14px;
              font-weight: 900;
              border-top: 1px solid #cbd5e1;
              padding-top: 4px;
              margin-top: 4px;
              color: #0f172a;
              text-transform: uppercase;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 70px;
              padding-bottom: 30px;
              font-size: 12px;
            }
            .signature-line {
              color: #94a3b8;
            }
            .footer-page {
              text-align: center;
              font-size: 10px;
              color: #94a3b8;
              border-top: 1px solid #f1f5f9;
              padding-top: 10px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div>
            <h1 class="header-title">Breeze Enterprises</h1>
            <div class="header-subtitle">Premium Quality Goods & General Order Supplier</div>
            <div class="company-info">
              Address: Office No 03, Plot 60-C, 22nd Commercial Lane, Phase 2 DHA, Karachi.<br/>
              Phone: 021-36397459, 0300-1070550<br/>
              Email: sales@breezeenterprises.pk<br/>
              Web: www.breezeenterprises.pk
            </div>
          </div>
          <div class="divider"></div>
          
          <div class="sale-invoice-title">
            <span>Sale Invoice</span>
          </div>

          <div class="meta-section">
            <div class="meta-column">
              <div class="meta-row">
                <span class="meta-label">Bill To:</span>
                <span class="meta-value meta-value-bold">${invoice.customer}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Contact:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${invoice.phone || 'N/A'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Address:</span>
                <span class="meta-value">${invoice.address || 'N/A'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">NTN:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${invoice.ntn || 'N/A'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">GST:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${invoice.gst || 'N/A'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">PO#:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${invoice.po || 'N/A'}</span>
              </div>
            </div>
            <div class="meta-column">
              <div class="meta-row">
                <span class="meta-label">Invoice Number:</span>
                <span class="meta-value meta-value-bold font-mono" style="font-family: 'JetBrains Mono', monospace;">${invoice.id}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Invoice Date:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${invoice.date}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Due Date:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${invoice.dueDate || invoice.date}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">NTN:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">C727561-1</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">GST:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">3840132000345</span>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="text-align: center; width: 8%;">Sr. #</th>
                <th>Description</th>
                <th style="text-align: center; width: 15%;">Quantity</th>
                <th style="text-align: right; width: 15%;">Unit Price</th>
                <th style="text-align: right; width: 15%;">GST (${hasTax ? '18%' : '0%'})</th>
                <th style="text-align: right; width: 15%;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
          </table>

          <div class="totals-container">
            <div class="totals-table">
              <div class="totals-row">
                <span class="totals-label">Subtotal:</span>
                <span class="totals-value">PKR ${itemSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="totals-row">
                <span class="totals-label">GST (${hasTax ? '18%' : '0%'}):</span>
                <span class="totals-value">PKR ${calculatedGst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="totals-row totals-total">
                <span>Total:</span>
                <span style="font-family: 'JetBrains Mono', monospace;">PKR ${calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="totals-row" style="color: #4b5563;">
                <span>Paid Amount:</span>
                <span class="totals-value">PKR ${paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="totals-row" style="border-top: 1px dotted #cbd5e1; font-weight: bold; margin-top: 4px; padding-top: 4px;">
                <span>Balance Due:</span>
                <span class="totals-value">PKR ${balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="totals-row" style="font-size: 10px; color: #64748b; margin-top: 4px;">
                <span>Payment Mode:</span>
                <span style="font-weight: bold; text-transform: uppercase;">${invoice.paymentMode || 'CASH'}</span>
              </div>
            </div>
          </div>

          <div class="signature-section">
            <div>
              <span style="font-weight: bold;">Delivered By:</span>
              <span class="signature-line">________________________</span>
            </div>
            <div>
              <span style="font-weight: bold;">Received By:</span>
              <span class="signature-line">________________________</span>
            </div>
          </div>

          <div class="footer-page">
            Page 1 of 1
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle Form Submission
  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.trim()) return;

    const subtotal = newItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const gstTotal = newHasSalesTax ? subtotal * 0.18 : 0;
    const totalAmount = subtotal + gstTotal;

    const dateStr = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    
    // Generate Sequential Invoice ID matching INV-2026-XXX
    let maxNum = 0;
    const regex = /^INV-2026-(\d+)$/;
    invoices.forEach(inv => {
      const match = inv.id.match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    });
    const nextNum = maxNum + 1;
    const paddedNum = String(nextNum).padStart(3, '0');
    const invoiceID = `INV-2026-${paddedNum}`;

    const newInvoiceObj: Invoice = {
      id: invoiceID,
      customer: newCustomer,
      date: dateStr,
      amount: totalAmount,
      status: newStatus,
      email: newEmail || 'customer@example.com',
      phone: newPhone || '+1 (555) 000-0000',
      address: newAddress,
      ntn: newNtn,
      gst: newGst,
      po: newPo,
      dueDate: newDueDate,
      paymentMode: newPaymentMode,
      paidAmount: parseFloat(newPaidAmount) || 0,
      hasSalesTax: newHasSalesTax,
      items: newItems.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        ...item
      }))
    };

    onAddInvoice(newInvoiceObj);
    
    // Reset Form
    setNewCustomer('Lexus Room Salon');
    setNewEmail('lexus.room.salon@example.com');
    setNewPhone('03001090425');
    setNewAddress('27-C, Ittehad lane no.6, Ground Floor Shop - 2, Phase-6, Karachi.');
    setNewNtn('N/A');
    setNewGst('N/A');
    setNewPo('N/A');
    setNewDueDate(new Date().toISOString().split('T')[0]);
    setNewPaymentMode('CASH');
    setNewPaidAmount('0.00');
    setNewStatus('Delivered');
    setNewHasSalesTax(true);
    setNewItems([{ name: 'Breeze Bed Rolls (1000Grm)', qty: 6, price: 1250, unit: 'pcs' }]);
    setIsCreateOpen(false);
  };

  // Filtering
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="invoices-card">
      {/* Table Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Recent Invoice</h3>
          <p className="text-xs text-slate-400">Manage, generate, and view dynamic billing records</p>
        </div>

        {/* Search and Create Buttons */}
        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <div className="relative flex-1 md:flex-none md:w-60">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoices or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-50/50 hover:bg-slate-50 border border-slate-200/70 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"
              id="invoice-search-input"
            />
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            id="create-invoice-btn"
          >
            <Plus size={15} />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Tabs Filter Section */}
      <div className="flex items-center gap-1 border-b border-slate-100 pb-3 mb-4 overflow-x-auto whitespace-nowrap scrollbar-none" id="invoices-filter-tabs">
        {(['All', 'Delivered', 'In Progress', 'Pending', 'Cancelled'] as StatusType[]).map((tab) => {
          const count = tab === 'All' 
            ? invoices.length 
            : invoices.filter((i) => i.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                statusFilter === tab ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto" id="invoices-table-container">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Invoice ID</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Sales Date</th>
              <th className="py-3 px-3">Paid Amount</th>
              <th className="py-3 px-3">Sales Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            <AnimatePresence>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <motion.tr
                    key={inv.id}
                    id={`invoice-row-${inv.id}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedInvoice(inv)}
                    className="hover:bg-slate-50/30 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-3 font-semibold font-mono text-slate-800 text-xs flex items-center gap-2">
                      <FileText size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                      #{inv.id}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-bold">{inv.customer}</td>
                    <td className="py-3.5 px-3 text-slate-400">{inv.date}</td>
                    <td className="py-3.5 px-3 text-slate-800 font-bold font-mono">PKR {inv.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${getStatusStyle(inv.status)}`}>
                        {getStatusIcon(inv.status)}
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer"
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteInvoice(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete invoice"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingBag size={24} className="text-slate-300" />
                      <p className="font-semibold text-xs">No invoices found matching your query</p>
                      <p className="text-[10px] text-slate-400">Try adjusting your filters or click Create Invoice.</p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* MODAL 1: VIEW INVOICE DETAILS */}
      <AnimatePresence>
        {selectedInvoice && (() => {
          const hasTax = selectedInvoice.hasSalesTax !== false;
          const viewSubtotal = selectedInvoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
          const viewGst = hasTax ? viewSubtotal * 0.18 : 0;
          const viewTotal = viewSubtotal + viewGst;
          const viewPaidAmount = selectedInvoice.paidAmount ?? viewTotal;
          const viewBalanceDue = viewTotal - viewPaidAmount;

          const clientAddress = selectedInvoice.address || '27-C, Ittehad lane no.6, Ground Floor Shop - 2, Phase-6, Karachi.';
          const clientNtn = selectedInvoice.ntn || 'N/A';
          const clientGst = selectedInvoice.gst || 'N/A';
          const clientPo = selectedInvoice.po || 'N/A';
          const clientDueDate = selectedInvoice.dueDate || selectedInvoice.date;
          const clientPaymentMode = selectedInvoice.paymentMode || 'CASH';

          return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto" id="view-invoice-modal">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col my-8"
              >
                {/* Modal Header Actions Bar */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" size={18} />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">Preview Sale Invoice</h4>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">#{selectedInvoice.id}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body - Styled EXACTLY like the Breeze Enterprises Invoice image */}
                <div className="p-8 flex-1 overflow-y-auto space-y-6 bg-white max-h-[70vh]">
                  
                  {/* Breeze Enterprises Company Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Breeze Enterprises</h1>
                      <p className="text-xs font-bold text-slate-500 tracking-tight mt-0.5 uppercase">
                        Premium Quality Goods & General Order Supplier
                      </p>
                      <div className="text-[11px] text-slate-600 mt-2 space-y-0.5">
                        <p><span className="font-bold">Address:</span> Office No 03, Plot 60-C, 22nd Commercial Lane, Phase 2 DHA, Karachi.</p>
                        <p><span className="font-bold">Phone:</span> 021-36397459, 0300-1070550</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right text-[11px] text-slate-500 space-y-0.5">
                      <p><span className="font-bold">Email:</span> sales@breezeenterprises.pk</p>
                      <p><span className="font-bold">Web:</span> www.breezeenterprises.pk</p>
                    </div>
                  </div>

                  {/* Centered Document Title */}
                  <div className="text-center py-2">
                    <span className="text-lg font-black tracking-widest text-slate-950 uppercase border-b-2 border-slate-900 pb-0.5">
                      SALE INVOICE
                    </span>
                  </div>

                  {/* Two-Column Metadata section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] leading-relaxed text-slate-800">
                    {/* Left Column: Bill To */}
                    <div className="space-y-1.5">
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">Bill To:</span>
                        <span className="flex-1 font-bold text-slate-950">{selectedInvoice.customer}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">Contact:</span>
                        <span className="flex-1 font-semibold">{selectedInvoice.phone || '03001090425'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">Address:</span>
                        <span className="flex-1 text-slate-700">{clientAddress}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">NTN:</span>
                        <span className="flex-1">{clientNtn}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">GST:</span>
                        <span className="flex-1">{clientGst}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">PO#:</span>
                        <span className="flex-1">{clientPo}</span>
                      </div>
                    </div>

                    {/* Right Column: Invoice Info */}
                    <div className="space-y-1.5 md:pl-8">
                      <div className="flex">
                        <span className="w-32 font-extrabold text-slate-900 uppercase">Invoice Number:</span>
                        <span className="flex-1 font-bold text-slate-950 font-mono">{selectedInvoice.id}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-extrabold text-slate-900 uppercase">Invoice Date:</span>
                        <span className="flex-1 font-medium">{selectedInvoice.date}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-extrabold text-slate-900 uppercase">Due Date:</span>
                        <span className="flex-1 font-medium">{clientDueDate}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-extrabold text-slate-900 uppercase">NTN:</span>
                        <span className="flex-1 font-mono">C727561-1</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-extrabold text-slate-900 uppercase">GST:</span>
                        <span className="flex-1 font-mono">3840132000345</span>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="border border-slate-300 rounded-lg overflow-hidden mt-6">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-100/90 text-slate-900 font-extrabold border-b border-slate-300">
                          <th className="py-2.5 px-3 border-r border-slate-300 text-center w-12">Sr. #</th>
                          <th className="py-2.5 px-3 border-r border-slate-300">Description</th>
                          <th className="py-2.5 px-3 border-r border-slate-300 text-center w-24">Quantity</th>
                          <th className="py-2.5 px-3 border-r border-slate-300 text-right w-28">Unit Price</th>
                          <th className="py-2.5 px-3 border-r border-slate-300 text-right w-28">GST ({hasTax ? '18%' : '0%'})</th>
                          <th className="py-2.5 px-3 text-right w-28">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300 text-slate-800">
                        {selectedInvoice.items.map((item, idx) => {
                          const lineSubtotal = item.qty * item.price;
                          const lineGst = hasTax ? lineSubtotal * 0.18 : 0;
                          const lineTotal = lineSubtotal + lineGst;
                          return (
                            <tr key={item.id || idx} className="hover:bg-slate-50/40">
                              <td className="py-2.5 px-3 border-r border-slate-300 text-center font-mono">{idx + 1}</td>
                              <td className="py-2.5 px-3 border-r border-slate-300 font-bold text-slate-900">{item.name}</td>
                              <td className="py-2.5 px-3 border-r border-slate-300 text-center">{item.qty} {item.unit || 'pcs'}</td>
                              <td className="py-2.5 px-3 border-r border-slate-300 text-right font-mono">PKR {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="py-2.5 px-3 border-r border-slate-300 text-right font-mono text-slate-600">PKR {lineGst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-black text-slate-950">PKR {lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations and Summary Block */}
                  <div className="flex justify-end pt-4">
                    <div className="w-72 text-xs space-y-1.5 text-slate-800">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-500">Subtotal:</span>
                        <span className="font-mono font-bold">PKR {viewSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-500">GST ({hasTax ? '18%' : '0%'}):</span>
                        <span className="font-mono font-bold">PKR {viewGst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-300 pt-2 text-sm">
                        <span className="font-black text-slate-950 uppercase">Total:</span>
                        <span className="font-mono font-black text-slate-950 text-base">PKR {viewTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Paid Amount:</span>
                        <span className="font-mono font-bold">PKR {viewPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200/80 pt-1 text-slate-950">
                        <span className="font-bold">Balance Due:</span>
                        <span className="font-mono font-bold text-rose-600">PKR {viewBalanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[10px] pt-1">
                        <span>Payment Mode:</span>
                        <span className="font-black uppercase tracking-wider text-slate-700 bg-slate-50 border border-slate-200 px-1.5 py-0.2 rounded">{clientPaymentMode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Signature block */}
                  <div className="flex justify-between items-center pt-16 pb-4 text-[11px] text-slate-800">
                    <div>
                      <span className="font-extrabold text-slate-900 uppercase">Delivered By:</span> <span className="text-slate-300">________________________</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 uppercase">Received By:</span> <span className="text-slate-300">________________________</span>
                    </div>
                  </div>

                  {/* Centered Document Footer */}
                  <div className="text-center text-[10px] text-slate-400 mt-4 border-t border-slate-100 pt-3">
                    Page 1 of 1
                  </div>
                </div>

                {/* Modal Actions Footer */}
                <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <button
                    onClick={() => onDeleteInvoice(selectedInvoice.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 px-3.5 py-2.5 rounded-xl border border-rose-200 hover:border-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Delete Invoice
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrint(selectedInvoice)}
                      className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <Printer size={13} />
                      Print Invoice
                    </button>
                    <button
                      onClick={() => setSelectedInvoice(null)}
                      className="text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* MODAL 2: CREATE NEW INVOICE */}
      <AnimatePresence>
        {isCreateOpen && (() => {
          const createSubtotal = newItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
          const createGst = newHasSalesTax ? createSubtotal * 0.18 : 0;
          const createTotal = createSubtotal + createGst;

          return (
            <div className="fixed inset-0 bg-black/55 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto" id="create-invoice-modal">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col my-8"
              >
                <form onSubmit={handleSubmitInvoice} className="flex flex-col h-full overflow-hidden max-h-[85vh]">
                  {/* Modal Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Plus size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">Generate Sale Invoice (Breeze Format)</h4>
                        <p className="text-[10px] text-slate-400">Add client metadata and billable line items with auto-computed 18% GST</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Modal Body (Scrollable) */}
                  <div className="p-6 flex-1 overflow-y-auto space-y-5 text-xs font-medium text-slate-600">
                    {/* Customer Information */}
                    <div className="space-y-3">
                      <h5 className="font-bold text-slate-800 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider">1. Client Profile</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Customer Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Liam Sterling"
                            value={newCustomer}
                            onChange={(e) => setNewCustomer(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Contact Phone *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 03001090425"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Email Address</label>
                          <input
                            type="email"
                            placeholder="client@company.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Due Date</label>
                          <input
                            type="date"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Customer Address *</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Full delivery/billing address"
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Customer NTN</label>
                          <input
                            type="text"
                            placeholder="N/A"
                            value={newNtn}
                            onChange={(e) => setNewNtn(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Customer GST ID</label>
                          <input
                            type="text"
                            placeholder="N/A"
                            value={newGst}
                            onChange={(e) => setNewGst(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">PO# / Ref</label>
                          <input
                            type="text"
                            placeholder="N/A"
                            value={newPo}
                            onChange={(e) => setNewPo(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Payment Mode</label>
                          <select
                            value={newPaymentMode}
                            onChange={(e) => setNewPaymentMode(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                          >
                            <option value="CASH">CASH</option>
                            <option value="BANK TRANSFER">BANK TRANSFER</option>
                            <option value="CREDIT CARD">CREDIT CARD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Paid Amount (PKR)</label>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            placeholder="0.00"
                            value={newPaidAmount}
                            onChange={(e) => setNewPaidAmount(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Invoice Status</label>
                          <select
                            value={newStatus}
                            onChange={(e: any) => setNewStatus(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                          >
                            <option value="Delivered">Delivered (Paid)</option>
                            <option value="In Progress">In Progress (Unpaid)</option>
                            <option value="Pending">Pending (Draft)</option>
                          </select>
                        </div>
                      </div>

                      {/* Sales Tax Choice Option */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between mt-2">
                        <div>
                          <label className="block text-slate-800 font-bold text-xs uppercase tracking-wider">Apply Sales Tax (GST 18%)</label>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Toggle to include/exclude 18% general sales tax on this invoice</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={newHasSalesTax}
                            onChange={(e) => setNewHasSalesTax(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">2. Billable Line Items</h5>
                        <button
                          type="button"
                          onClick={handleAddFormItem}
                          className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={14} /> Add Line Item
                        </button>
                      </div>

                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {newItems.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                required
                                placeholder="Item description"
                                value={item.name}
                                onChange={(e) => handleUpdateFormItem(idx, 'name', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                              />
                            </div>
                            <div className="w-16">
                              <input
                                type="number"
                                min={1}
                                required
                                placeholder="Qty"
                                value={item.qty}
                                onChange={(e) => handleUpdateFormItem(idx, 'qty', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-center text-slate-800 font-mono"
                              />
                            </div>
                            <div className="w-16">
                              <input
                                type="text"
                                required
                                placeholder="Unit"
                                value={item.unit || 'pcs'}
                                onChange={(e) => handleUpdateFormItem(idx, 'unit', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-center text-slate-800"
                              />
                            </div>
                            <div className="w-24">
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-[10px]">PKR</span>
                                <input
                                  type="number"
                                  min={0}
                                  step="any"
                                  required
                                  placeholder="0.00"
                                  value={item.price}
                                  onChange={(e) => handleUpdateFormItem(idx, 'price', e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-right text-slate-800 font-mono"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={newItems.length === 1}
                              onClick={() => handleRemoveFormItem(idx)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Totals Preview Card */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Items Subtotal:</span>
                        <span className="font-mono font-semibold">PKR {createSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Sales GST ({newHasSalesTax ? '18%' : '0%'}):</span>
                        <span className="font-mono font-semibold">PKR {createGst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-sm">
                        <span className="font-bold text-slate-800">Dynamic Total:</span>
                        <span className="font-extrabold text-blue-600 font-mono text-base">
                          PKR {createTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/80 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                      id="submit-new-invoice-btn"
                    >
                      Save & Apply Format
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
