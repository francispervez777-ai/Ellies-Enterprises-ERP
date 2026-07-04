import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  X, 
  Eye, 
  FileText, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Printer, 
  Mail, 
  MessageSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuotationItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  unit?: string;
}

interface Quotation {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  ntn: string;
  gst: string;
  po: string;
  date: string;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Expired';
  items: QuotationItem[];
}

export default function QuotationsManager() {
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: 'QT-2026-001',
      customer: 'Zayn Malik',
      email: 'zayn.malik@example.com',
      phone: '03001090425',
      address: 'Office 402, 4th Floor, Clifton Centre, Block 5 Clifton, Karachi.',
      ntn: '9703305',
      gst: 'N/A',
      po: 'N/A',
      date: '2026-07-02',
      validUntil: '2026-08-02',
      status: 'Sent',
      items: [
        { id: 'item-1', name: 'Premium Floor Polishing Liquid', qty: 2, price: 1355.93, unit: 'ltr' }
      ]
    },
    {
      id: 'QT-2026-002',
      customer: 'Gigi Hadid',
      email: 'gigi.hadid@example.com',
      phone: '03333309331',
      address: 'Plot.No 50, Sector 7 Korangi Industrial Area Karachi.',
      ntn: '1234567',
      gst: 'N/A',
      po: 'PO-9912',
      date: '2026-06-25',
      validUntil: '2026-07-25',
      status: 'Approved',
      items: [
        { id: 'item-2', name: 'Breeze Toilet Cleaner (500Ml)', qty: 60, price: 125.71, unit: 'pcs' }
      ]
    },
    {
      id: 'QT-2026-003',
      customer: 'Harry Styles',
      email: 'harry.styles@example.com',
      phone: '03001122334',
      address: '890 Fashion Blvd, Karachi',
      ntn: 'N/A',
      gst: 'N/A',
      po: 'N/A',
      date: '2026-07-03',
      validUntil: '2026-08-03',
      status: 'Draft',
      items: [
        { id: 'item-3', name: 'Industrial Grade Multi-surface Disinfectant', qty: 10, price: 1305.08, unit: 'ltr' }
      ]
    },
    {
      id: 'QT-2026-004',
      customer: 'Kendall Jenner',
      email: 'kendall.jenner@example.com',
      phone: '03219876543',
      address: 'DHA Phase 6, Karachi',
      ntn: 'N/A',
      gst: 'N/A',
      po: 'N/A',
      date: '2026-05-10',
      validUntil: '2026-06-10',
      status: 'Expired',
      items: [
        { id: 'item-4', name: 'Breeze Hand Sanitizer Gel (500ml)', qty: 4, price: 254.23, unit: 'pcs' }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Sent' | 'Approved' | 'Expired'>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);

  // Form states pre-filled with Breeze Enterprise typical data
  const [customer, setCustomer] = useState('Jupiter Foods (Pvt) Ltd.');
  const [email, setEmail] = useState('jupiter.foods@example.com');
  const [phone, setPhone] = useState('03333309331');
  const [address, setAddress] = useState('Plot.No 50, Sector 7 Korangi Industrial Area Karachi.');
  const [ntn, setNtn] = useState('9703305');
  const [gst, setGst] = useState('N/A');
  const [po, setPo] = useState('N/A');
  const [validUntil, setValidUntil] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Sent'>('Draft');
  const [newItems, setNewItems] = useState<Omit<QuotationItem, 'id'>[]>([
    { name: 'Toilet Cleaner (500Ml)', qty: 60, price: 125, unit: 'pcs' }
  ]);

  const getSubtotal = (items: QuotationItem[]) => {
    return items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  };

  const getGst = (items: QuotationItem[]) => {
    return getSubtotal(items) * 0.18;
  };

  const getTotal = (items: QuotationItem[]) => {
    return getSubtotal(items) + getGst(items);
  };

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddFormItem = () => {
    setNewItems([...newItems, { name: '', qty: 1, price: 100, unit: 'pcs' }]);
  };

  const handleRemoveFormItem = (idx: number) => {
    if (newItems.length > 1) {
      setNewItems(newItems.filter((_, i) => i !== idx));
    }
  };

  const handleUpdateFormItem = (idx: number, field: keyof Omit<QuotationItem, 'id'>, val: any) => {
    const updated = [...newItems];
    if (field === 'qty') {
      updated[idx].qty = Math.max(1, parseInt(val) || 0);
    } else if (field === 'price') {
      updated[idx].price = Math.max(0, parseFloat(val) || 0);
    } else {
      updated[idx][field] = val;
    }
    setNewItems(updated);
  };

  const handleAddQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || newItems.some(i => !i.name)) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const defaultValidStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newQuote: Quotation = {
      id: `QT-2026-00${quotations.length + 1}`,
      customer,
      email: email || 'N/A',
      phone: phone || 'N/A',
      address: address || 'N/A',
      ntn: ntn || 'N/A',
      gst: gst || 'N/A',
      po: po || 'N/A',
      date: todayStr,
      validUntil: validUntil || defaultValidStr,
      status,
      items: newItems.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        ...item
      }))
    };

    setQuotations([newQuote, ...quotations]);
    setIsAddOpen(false);

    // Reset Form
    setCustomer('Jupiter Foods (Pvt) Ltd.');
    setEmail('jupiter.foods@example.com');
    setPhone('03333309331');
    setAddress('Plot.No 50, Sector 7 Korangi Industrial Area Karachi.');
    setNtn('9703305');
    setGst('N/A');
    setPo('N/A');
    setValidUntil('');
    setStatus('Draft');
    setNewItems([{ name: 'Toilet Cleaner (500Ml)', qty: 60, price: 125, unit: 'pcs' }]);
  };

  const handleDelete = (id: string) => {
    setQuotations(quotations.filter(q => q.id !== id));
    if (selectedQuote?.id === id) {
      setSelectedQuote(null);
    }
  };

  const handleWhatsAppShare = (q: Quotation) => {
    const subtotal = getSubtotal(q.items);
    const gst = getGst(q.items);
    const total = getTotal(q.items);
    
    const itemsText = q.items.map(item => `• ${item.qty}x ${item.name} (${item.unit || 'pcs'}) @ PKR ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`).join('\n');
    
    const text = `*BREEZE ENTERPRISES - QUOTATION*
----------------------------------------
*Quotation ID:* ${q.id}
*Date:* ${q.date}
*Valid Until:* ${q.validUntil}
*Customer:* ${q.customer}
*Contact:* ${q.phone}
*Address:* ${q.address || 'N/A'}

*Quotation Items:*
${itemsText}

----------------------------------------
*Subtotal:* PKR ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
*GST (18%):* PKR ${gst.toLocaleString(undefined, { minimumFractionDigits: 2 })}
*Total Amount:* PKR ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}

_Thank you for choosing Breeze Enterprises! Please let us know if you approve this proposal._`;

    const cleanPhone = q.phone.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?${cleanPhone ? `phone=${cleanPhone}&` : ''}text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = (q: Quotation) => {
    const subtotal = getSubtotal(q.items);
    const gst = getGst(q.items);
    const total = getTotal(q.items);
    
    const itemsText = q.items.map(item => `- ${item.qty}x ${item.name} (${item.unit || 'pcs'}) @ PKR ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`).join('\n');
    
    const subject = `Quotation ${q.id} - Breeze Enterprises`;
    const body = `Dear ${q.customer},

Please find our quotation details below from Breeze Enterprises:

QUOTATION DETAILS:
----------------------------------------
Quotation ID: ${q.id}
Date: ${q.date}
Valid Until: ${q.validUntil}
Customer: ${q.customer}
Contact Phone: ${q.phone}
Address: ${q.address || 'N/A'}

QUOTED ITEMS:
----------------------------------------
${itemsText}

CALCULATIONS:
----------------------------------------
Subtotal: PKR ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
GST (18%): PKR ${gst.toLocaleString(undefined, { minimumFractionDigits: 2 })}
Total Amount: PKR ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}

Thank you for choosing Breeze Enterprises! Please feel free to reply to this email or contact us at sales@breezeenterprises.pk for any questions or to approve this quotation.

Best regards,
Breeze Enterprises
Premium Quality Goods & General Order Supplier
Web: www.breezeenterprises.pk`;

    const url = `mailto:${q.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  const handlePrint = (q: Quotation) => {
    const itemSubtotal = getSubtotal(q.items);
    const calculatedGst = getGst(q.items);
    const calculatedTotal = getTotal(q.items);

    const itemsRowsHtml = q.items.map((item, idx) => {
      const lineSub = item.qty * item.price;
      const lineGst = lineSub * 0.18;
      const lineTot = lineSub + lineGst;
      return `
        <tr style="border-bottom: 1px solid #cbd5e1;">
          <td style="padding: 10px; text-align: center; border-right: 1px solid #cbd5e1;" class="font-mono">${idx + 1}</td>
          <td style="padding: 10px; font-weight: bold; border-right: 1px solid #cbd5e1; text-align: left;">${item.name}</td>
          <td style="padding: 10px; text-align: center; border-right: 1px solid #cbd5e1;" class="font-mono">${item.qty} ${item.unit || 'pcs'}</td>
          <td style="padding: 10px; text-align: right; border-right: 1px solid #cbd5e1;" class="font-mono">PKR ${item.price.toFixed(2)}</td>
          <td style="padding: 10px; text-align: right; border-right: 1px solid #cbd5e1; color: #475569;" class="font-mono">PKR ${lineGst.toFixed(2)}</td>
          <td style="padding: 10px; text-align: right; font-weight: bold;" class="font-mono">PKR ${lineTot.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow popups to print.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Quotation - ${q.id}</title>
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
            .document-title {
              text-align: center;
              font-size: 20px;
              font-weight: 900;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin: 25px 0;
            }
            .document-title span {
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
            .font-mono {
              font-family: 'JetBrains Mono', monospace;
            }
            .summary-container {
              display: flex;
              justify-content: flex-end;
              margin-top: 20px;
              font-size: 11px;
            }
            .summary-table {
              width: 280px;
              border: none;
              margin-top: 0;
            }
            .summary-table td {
              padding: 6px 12px;
              border: none;
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
          
          <div class="document-title">
            <span>QUOTATION / PROPOSAL</span>
          </div>

          <div class="meta-section">
            <div class="meta-column">
              <div class="meta-row">
                <span class="meta-label">Customer:</span>
                <span class="meta-value meta-value-bold">${q.customer}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Contact:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${q.phone}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Address:</span>
                <span class="meta-value">${q.address || 'N/A'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">NTN:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${q.ntn || 'N/A'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">GST:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${q.gst || 'N/A'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">PO#:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${q.po || 'N/A'}</span>
              </div>
            </div>
            <div class="meta-column">
              <div class="meta-row">
                <span class="meta-label">Quotation ID:</span>
                <span class="meta-value meta-value-bold font-mono" style="font-family: 'JetBrains Mono', monospace;">${q.id}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Date:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${q.date}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Valid Until:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${q.validUntil}</span>
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
                <th style="text-align: right; width: 20%;">Unit Price</th>
                <th style="text-align: right; width: 18%;">GST (18%)</th>
                <th style="text-align: right; width: 22%;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
          </table>

          <div class="summary-container">
            <table class="summary-table">
              <tr>
                <td style="font-weight: bold; color: #475569;">Subtotal:</td>
                <td style="text-align: right; font-weight: bold; font-family: 'JetBrains Mono', monospace;">PKR ${itemSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #475569;">GST (18%):</td>
                <td style="text-align: right; font-weight: bold; color: #475569; font-family: 'JetBrains Mono', monospace;">PKR ${calculatedGst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr style="border-top: 1px solid #cbd5e1;">
                <td style="font-weight: 900; font-size: 13px; text-transform: uppercase;">Total:</td>
                <td style="text-align: right; font-weight: 900; font-size: 13px; font-family: 'JetBrains Mono', monospace;">PKR ${calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </table>
          </div>

          <div class="signature-section">
            <div>
              <span style="font-weight: bold;">Prepared By:</span>
              <span class="signature-line">________________________</span>
            </div>
            <div>
              <span style="font-weight: bold;">Approved By (Client):</span>
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

  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Sent': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Draft': return 'bg-slate-50 text-slate-700 border-slate-100';
      case 'Expired': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="quotations-manager">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Proposals & Quotations</h3>
          <p className="text-xs text-slate-400">Generate pricing estimates with 18% GST, share instantly with clients, and track approvals</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 w-52"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} /> Create Quotation
          </button>
        </div>
      </div>

      {/* Grid Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Total Value</p>
          <p className="text-sm font-black text-slate-800 mt-1">
            PKR {quotations.reduce((sum, q) => sum + getTotal(q.items), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Approved Proposals</p>
          <p className="text-sm font-black text-emerald-600 mt-1">
            {quotations.filter(q => q.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Pending Quotes</p>
          <p className="text-sm font-black text-blue-600 mt-1">
            {quotations.filter(q => q.status === 'Sent' || q.status === 'Draft').length}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Conversion rate</p>
          <p className="text-sm font-black text-purple-600 mt-1">
            {((quotations.filter(q => q.status === 'Approved').length / Math.max(1, quotations.length)) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Tabs / Filter Row */}
      <div className="flex items-center gap-1 border-b border-slate-100 pb-3 mb-5 overflow-x-auto whitespace-nowrap scrollbar-none">
        {(['All', 'Draft', 'Sent', 'Approved', 'Expired'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Quotes Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Quotation ID</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Primary Quoted Item</th>
              <th className="py-3 px-3 text-right">Estimate Val (Incl. GST)</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            {filteredQuotations.length > 0 ? (
              filteredQuotations.map((q) => {
                const totalAmount = getTotal(q.items);
                const firstItemName = q.items[0]?.name || 'Supply Goods';
                const itemsCount = q.items.length;
                const displaySummary = itemsCount > 1 ? `${firstItemName} + ${itemsCount - 1} more items` : firstItemName;

                return (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3.5 px-3 font-semibold font-mono text-slate-800 text-xs flex items-center gap-2">
                      <FileText size={14} className="text-slate-400" />
                      {q.id}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-bold">{q.customer}</td>
                    <td className="py-3.5 px-3 text-slate-400 max-w-xs truncate" title={displaySummary}>
                      {displaySummary}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">
                      PKR {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(q.status)}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick View */}
                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all cursor-pointer"
                          title="View & Edit"
                        >
                          <Eye size={13} />
                        </button>

                        {/* WhatsApp Quick Share */}
                        <button
                          onClick={() => handleWhatsAppShare(q)}
                          className="p-1.5 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                          title="Share on WhatsApp"
                        >
                          <MessageSquare size={13} />
                        </button>

                        {/* Email Quick Share */}
                        <button
                          onClick={() => handleEmailShare(q)}
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                          title="Share via Email"
                        >
                          <Mail size={13} />
                        </button>

                        {/* Status update togglers */}
                        {q.status === 'Draft' && (
                          <button
                            onClick={() => setQuotations(quotations.map(x => x.id === q.id ? { ...x, status: 'Sent' } : x))}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                            title="Mark Sent"
                          >
                            <Send size={13} />
                          </button>
                        )}
                        {q.status === 'Sent' && (
                          <button
                            onClick={() => setQuotations(quotations.map(x => x.id === q.id ? { ...x, status: 'Approved' } : x))}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                            title="Approve Proposal"
                          >
                            <CheckCircle size={13} />
                          </button>
                        )}

                        {/* Print */}
                        <button
                          onClick={() => handlePrint(q)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                          title="Print Document"
                        >
                          <Printer size={13} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          title="Delete Quote"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  No quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Proposal Modal */}
      <AnimatePresence>
        {isAddOpen && (() => {
          const createSubtotal = newItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
          const createGst = createSubtotal * 0.18;
          const createTotal = createSubtotal + createGst;

          return (
            <div className="fixed inset-0 bg-black/55 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto" id="create-quote-modal">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col my-8"
              >
                <form onSubmit={handleAddQuotation} className="flex flex-col h-full overflow-hidden max-h-[85vh]">
                  {/* Modal Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Plus size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">Generate Quotation (Breeze Format)</h4>
                        <p className="text-[10px] text-slate-400">Add client details, specific quantities, unit prices, and automatic 18% GST</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Scrollable Form Body */}
                  <div className="p-6 flex-1 overflow-y-auto space-y-5 text-xs font-medium text-slate-600">
                    
                    {/* Client Information */}
                    <div className="space-y-3">
                      <h5 className="font-bold text-slate-800 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider">1. Customer Information</h5>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Customer / Lead Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Jupiter Foods (Pvt) Ltd."
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Contact Phone *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 03333309331"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Contact Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. sales@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Validity Limit (Valid Until Date)</label>
                          <input
                            type="date"
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Billing / Destination Address</label>
                        <textarea
                          placeholder="Complete business location details"
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 resize-none font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">NTN Number</label>
                          <input
                            type="text"
                            placeholder="9703305"
                            value={ntn}
                            onChange={(e) => setNtn(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">GST Number</label>
                          <input
                            type="text"
                            placeholder="N/A"
                            value={gst}
                            onChange={(e) => setGst(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">PO# / Project Ref</label>
                          <input
                            type="text"
                            placeholder="N/A"
                            value={po}
                            onChange={(e) => setPo(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quotation Parameters */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">Initial Status</label>
                        <select
                          value={status}
                          onChange={(e: any) => setStatus(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                        >
                          <option value="Draft">Draft (Internal Estimate)</option>
                          <option value="Sent">Sent (Shared with Customer)</option>
                        </select>
                      </div>
                    </div>

                    {/* Quotation Items List */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">2. Proposal Line Items</h5>
                        <button
                          type="button"
                          onClick={handleAddFormItem}
                          className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={14} /> Add Item
                        </button>
                      </div>

                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {newItems.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                required
                                placeholder="Item description / specification"
                                value={item.name}
                                onChange={(e) => handleUpdateFormItem(idx, 'name', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-bold text-xs"
                              />
                            </div>
                            <div className="w-20">
                              <input
                                type="text"
                                required
                                placeholder="Unit"
                                value={item.unit || ''}
                                onChange={(e) => handleUpdateFormItem(idx, 'unit', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-center text-slate-800 text-xs"
                              />
                            </div>
                            <div className="w-24">
                              <input
                                type="number"
                                min={1}
                                required
                                placeholder="Qty"
                                value={item.qty}
                                onChange={(e) => handleUpdateFormItem(idx, 'qty', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-center text-slate-800 font-mono text-xs"
                              />
                            </div>
                            <div className="w-28">
                              <input
                                type="number"
                                min={0}
                                required
                                placeholder="Unit Price"
                                value={item.price}
                                onChange={(e) => handleUpdateFormItem(idx, 'price', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-right text-slate-800 font-mono text-xs"
                              />
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

                    {/* Interactive Calculation Preview */}
                    <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 flex flex-col items-end space-y-1.5">
                      <div className="flex justify-between w-64 text-xs">
                        <span className="text-slate-400 font-semibold">Subtotal:</span>
                        <span className="font-mono text-slate-700">PKR {createSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between w-64 text-xs">
                        <span className="text-slate-400 font-semibold">GST (18%):</span>
                        <span className="font-mono text-slate-700">PKR {createGst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between w-64 border-t border-slate-200 pt-2 text-xs font-black text-slate-900">
                        <span>Grand Total:</span>
                        <span className="font-mono text-slate-950 text-sm">PKR {createTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                  </div>

                  {/* Modal Action Buttons Footer */}
                  <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/80 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      Generate Quotation
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Quote Details View & Edit Modal */}
      <AnimatePresence>
        {selectedQuote && (() => {
          const viewSubtotal = getSubtotal(selectedQuote.items);
          const viewGst = getGst(selectedQuote.items);
          const viewTotal = getTotal(selectedQuote.items);

          return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto" id="view-quote-modal">
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
                      <h4 className="text-sm font-extrabold text-slate-800">Preview Quotation Proposal</h4>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">#{selectedQuote.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Quick WhatsApp Share inside Modal header */}
                    <button
                      onClick={() => handleWhatsAppShare(selectedQuote)}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                      title="Share on WhatsApp"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </button>
                    {/* Quick Email Share inside Modal header */}
                    <button
                      onClick={() => handleEmailShare(selectedQuote)}
                      className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                      title="Share via Email"
                    >
                      <Mail size={13} />
                      <span>Email</span>
                    </button>
                    <button
                      onClick={() => setSelectedQuote(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ml-1"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Modal Body - styled exactly like the Breeze Enterprises Sale Invoice */}
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
                      QUOTATION / PROPOSAL
                    </span>
                  </div>

                  {/* Two-Column Metadata section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] leading-relaxed text-slate-800">
                    {/* Left Column: Bill To */}
                    <div className="space-y-1.5">
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">Customer:</span>
                        <span className="flex-1 font-bold text-slate-950">{selectedQuote.customer}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">Contact:</span>
                        <span className="flex-1 font-semibold">{selectedQuote.phone || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">Email:</span>
                        <span className="flex-1 font-semibold text-slate-700">{selectedQuote.email || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">Address:</span>
                        <span className="flex-1 text-slate-700">{selectedQuote.address || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">NTN:</span>
                        <span className="flex-1">{selectedQuote.ntn || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">GST:</span>
                        <span className="flex-1">{selectedQuote.gst || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-extrabold text-slate-900 uppercase">PO#:</span>
                        <span className="flex-1">{selectedQuote.po || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Right Column: Invoice Info */}
                    <div className="space-y-1.5 md:pl-8">
                      <div className="flex">
                        <span className="w-32 font-extrabold text-slate-900 uppercase">Quotation ID:</span>
                        <span className="flex-1 font-bold text-slate-950 font-mono">{selectedQuote.id}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-extrabold text-slate-900 uppercase">Quotation Date:</span>
                        <span className="flex-1 font-medium">{selectedQuote.date}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-extrabold text-slate-900 uppercase">Valid Until:</span>
                        <span className="flex-1 font-medium text-rose-600">{selectedQuote.validUntil}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-extrabold text-slate-900 uppercase">NTN:</span>
                        <span className="flex-1 font-mono">C727561-1</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-extrabold text-slate-900 uppercase">GST:</span>
                        <span className="flex-1 font-mono">3840132000345</span>
                      </div>
                      <div className="flex border-t border-slate-100 pt-1.5 mt-1.5">
                        <span className="w-32 font-bold text-slate-500 uppercase">Proposal Status:</span>
                        <span className={`px-2 py-0.2 text-[10px] rounded-full font-bold border ${getStatusStyle(selectedQuote.status)}`}>
                          {selectedQuote.status}
                        </span>
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
                          <th className="py-2.5 px-3 border-r border-slate-300 text-right w-28">GST (18%)</th>
                          <th className="py-2.5 px-3 text-right w-28">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300 text-slate-800">
                        {selectedQuote.items.map((item, idx) => {
                          const lineSubtotal = item.qty * item.price;
                          const lineGst = lineSubtotal * 0.18;
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
                        <span className="font-semibold text-slate-500">GST (18%):</span>
                        <span className="font-mono font-bold">PKR {viewGst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-300 pt-2 text-sm">
                        <span className="font-black text-slate-950 uppercase">Total:</span>
                        <span className="font-mono font-black text-slate-950 text-base">PKR {viewTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Signature block */}
                  <div className="flex justify-between items-center pt-16 pb-4 text-[11px] text-slate-800">
                    <div>
                      <span className="font-extrabold text-slate-900 uppercase">Prepared By:</span> <span className="text-slate-300">________________________</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 uppercase">Approved By (Client):</span> <span className="text-slate-300">________________________</span>
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
                    onClick={() => handleDelete(selectedQuote.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 px-3.5 py-2.5 rounded-xl border border-rose-200 hover:border-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Delete Quote
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrint(selectedQuote)}
                      className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <Printer size={13} />
                      Print Proposal
                    </button>
                    <button
                      onClick={() => setSelectedQuote(null)}
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
    </div>
  );
}
