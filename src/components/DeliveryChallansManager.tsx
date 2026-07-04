import React, { useState } from 'react';
import { Search, Plus, Truck, Clock, CheckCircle, AlertTriangle, Play, Trash2, X, MapPin, Printer, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChallanItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  productCode: string;
}

interface DeliveryChallan {
  id: string;
  date: string;
  time: string;
  customer: string;
  contact: string;
  address: string;
  ntn: string;
  gst: string;
  po: string;
  driverName: string;
  vehicleNo: string;
  status: 'Dispatched' | 'In Transit' | 'Delivered' | 'Returned';
  weightKg: number;
  items: ChallanItem[];
}

export default function DeliveryChallansManager() {
  const [challans, setChallans] = useState<DeliveryChallan[]>([
    {
      id: 'BE-2026-126',
      date: '24-Jun-2026',
      time: '07:38 PM',
      customer: 'Jupiter Foods (Pvt) Ltd.',
      contact: '03333309331',
      address: 'Plot.No 50,Sector 7 Korangi Industrial Area Karachi.',
      ntn: '9703305',
      gst: 'N/A',
      po: 'N/A',
      driverName: 'Logan Paul',
      vehicleNo: 'NY-882-XYZ',
      status: 'Delivered',
      weightKg: 450,
      items: [
        { id: 'item-1', name: 'Toilet Cleaner (500Ml)', qty: 60, unit: 'pcs', productCode: 'General' }
      ]
    },
    {
      id: 'BE-2026-127',
      date: '02-Jul-2026',
      time: '04:15 PM',
      customer: 'Lexus Room Salon',
      contact: '03001090425',
      address: '27-C, Ittehad lane no.6, Ground Floor Shop - 2, Phase-6, Karachi.',
      ntn: 'N/A',
      gst: 'N/A',
      po: 'N/A',
      driverName: 'Sam Spade',
      vehicleNo: 'CA-505-LQR',
      status: 'In Transit',
      weightKg: 120,
      items: [
        { id: 'item-2', name: 'Breeze Bed Rolls (1000Grm)', qty: 6, unit: 'pcs', productCode: 'General' }
      ]
    },
    {
      id: 'BE-2026-128',
      date: '03-Jul-2026',
      time: '11:00 AM',
      customer: 'Gigi Hadid',
      contact: '03001122334',
      address: '890 Fashion Blvd, Karachi',
      ntn: '1234567',
      gst: 'N/A',
      po: 'PO-9912',
      driverName: 'Mike Ehrmantraut',
      vehicleNo: 'NM-333-MKO',
      status: 'Dispatched',
      weightKg: 85,
      items: [
        { id: 'item-3', name: 'Premium Floor Polishing Liquid', qty: 10, unit: 'ltr', productCode: 'General' }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Returned'>('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState<DeliveryChallan | null>(null);

  // Form states pre-filled with the exact visual document details
  const [customer, setCustomer] = useState('Jupiter Foods (Pvt) Ltd.');
  const [contact, setContact] = useState('03333309331');
  const [address, setAddress] = useState('Plot.No 50,Sector 7 Korangi Industrial Area Karachi.');
  const [ntn, setNtn] = useState('9703305');
  const [gst, setGst] = useState('N/A');
  const [po, setPo] = useState('N/A');
  const [driverName, setDriverName] = useState('Logan Paul');
  const [vehicleNo, setVehicleNo] = useState('NY-882-XYZ');
  const [weightKg, setWeightKg] = useState('450');
  const [status, setStatus] = useState<'Dispatched' | 'In Transit' | 'Delivered'>('Dispatched');
  
  const [newItems, setNewItems] = useState<Omit<ChallanItem, 'id'>[]>([
    { name: 'Toilet Cleaner (500Ml)', qty: 60, unit: 'pcs', productCode: 'General' }
  ]);

  const filteredChallans = challans.filter(c => {
    const matchesSearch = c.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddFormItem = () => {
    setNewItems([...newItems, { name: '', qty: 1, unit: 'pcs', productCode: 'General' }]);
  };

  const handleRemoveFormItem = (idx: number) => {
    if (newItems.length > 1) {
      setNewItems(newItems.filter((_, i) => i !== idx));
    }
  };

  const handleUpdateFormItem = (idx: number, field: keyof Omit<ChallanItem, 'id'>, val: string) => {
    const updated = [...newItems];
    if (field === 'qty') {
      updated[idx].qty = Math.max(1, parseInt(val) || 0);
    } else {
      updated[idx][field] = val as any;
    }
    setNewItems(updated);
  };

  const handleCreateChallan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !driverName || !vehicleNo) return;

    const dateObj = new Date();
    const dateStr = dateObj.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-'); // e.g. 24-Jun-2026

    const timeStr = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }); // e.g. 07:38 PM

    const newChallan: DeliveryChallan = {
      id: `BE-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: dateStr,
      time: timeStr,
      customer,
      contact,
      address,
      ntn: ntn || 'N/A',
      gst: gst || 'N/A',
      po: po || 'N/A',
      driverName,
      vehicleNo,
      status,
      weightKg: parseFloat(weightKg) || 100,
      items: newItems.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        ...item
      }))
    };

    setChallans([newChallan, ...challans]);
    setIsCreateOpen(false);

    // Reset Form
    setCustomer('Jupiter Foods (Pvt) Ltd.');
    setContact('03333309331');
    setAddress('Plot.No 50,Sector 7 Korangi Industrial Area Karachi.');
    setNtn('9703305');
    setGst('N/A');
    setPo('N/A');
    setDriverName('Logan Paul');
    setVehicleNo('NY-882-XYZ');
    setWeightKg('450');
    setStatus('Dispatched');
    setNewItems([{ name: 'Toilet Cleaner (500Ml)', qty: 60, unit: 'pcs', productCode: 'General' }]);
  };

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setChallans(challans.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleDelete = (id: string) => {
    setChallans(challans.filter(c => c.id !== id));
    if (selectedChallan?.id === id) {
      setSelectedChallan(null);
    }
  };

  const handlePrint = (dc: DeliveryChallan) => {
    const itemsRowsHtml = dc.items.map((item, idx) => {
      return `
        <tr style="border-bottom: 1px solid #cbd5e1;">
          <td style="padding: 12px; text-align: center; border-right: 1px solid #cbd5e1;" class="font-mono">${idx + 1}</td>
          <td style="padding: 12px; font-weight: bold; border-right: 1px solid #cbd5e1; text-align: left;">${item.name}</td>
          <td style="padding: 12px; text-align: center; border-right: 1px solid #cbd5e1;" class="font-mono">${item.unit || 'pcs'}</td>
          <td style="padding: 12px; text-align: center; border-right: 1px solid #cbd5e1;" class="font-mono">${item.productCode || 'General'}</td>
          <td style="padding: 12px; text-align: center; font-weight: bold;" class="font-mono">${item.qty}</td>
        </tr>
      `;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow popups to print delivery challans.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Delivery Challan - ${dc.id}</title>
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
            <span>Delivery Challan</span>
          </div>

          <div class="meta-section">
            <div class="meta-column">
              <div class="meta-row">
                <span class="meta-label">Customer:</span>
                <span class="meta-value meta-value-bold">${dc.customer}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Contact:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${dc.contact}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Address:</span>
                <span class="meta-value">${dc.address}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">NTN:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${dc.ntn}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">GST:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${dc.gst}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">PO#:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${dc.po}</span>
              </div>
            </div>
            <div class="meta-column">
              <div class="meta-row">
                <span class="meta-label">DC Number:</span>
                <span class="meta-value meta-value-bold font-mono" style="font-family: 'JetBrains Mono', monospace;">${dc.id}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Delivery Date:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${dc.date}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Delivery Time:</span>
                <span class="meta-value font-mono" style="font-family: 'JetBrains Mono', monospace;">${dc.time || 'N/A'}</span>
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
                <th style="text-align: center; width: 22%;">Specification/<br/>Unit</th>
                <th style="text-align: center; width: 20%;">Product Code</th>
                <th style="text-align: center; width: 15%;">QTY</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
          </table>

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

  const getStatusBadgeClass = (s: string) => {
    switch (s) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Transit': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Dispatched': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Returned': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="delivery-challans-manager">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Delivery Challans & Logistics</h3>
          <p className="text-xs text-slate-400">Dispatch items, coordinate shipping, and log vehicle assignments with transit updates</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search challans or drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 w-52"
            />
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} /> Create Challan
          </button>
        </div>
      </div>

      {/* Tabs / Filter Row */}
      <div className="flex items-center gap-1 border-b border-slate-100 pb-3 mb-5 overflow-x-auto whitespace-nowrap scrollbar-none">
        {(['All', 'Dispatched', 'In Transit', 'Delivered', 'Returned'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {filteredChallans.length > 0 ? (
          filteredChallans.map((c) => (
            <div 
              key={c.id} 
              onClick={() => setSelectedChallan(c)}
              className="border border-slate-100 hover:border-slate-200 rounded-xl p-4 bg-slate-50/20 hover:bg-slate-50/50 transition-all flex flex-col justify-between group cursor-pointer hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck size={14} className="text-blue-500" /> #{c.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(c.status)}`}>
                    {c.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Recipient:</span>
                    <span className="font-bold text-slate-800">{c.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Driver:</span>
                    <span className="font-semibold text-slate-700">{c.driverName} ({c.vehicleNo})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Line Items:</span>
                    <span className="font-bold text-slate-700">{c.items.length} items ({c.items.reduce((sum, item) => sum + item.qty, 0)} total units)</span>
                  </div>
                  <div className="flex items-start gap-1 pt-1 text-[10px] text-slate-400">
                    <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                    <span className="truncate" title={c.address}>{c.address}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] text-slate-400 font-mono">Date: {c.date} {c.time && `• ${c.time}`}</span>
                
                <div className="flex items-center gap-1">
                  {c.status === 'Dispatched' && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, 'In Transit')}
                      className="px-2 py-1 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                    >
                      Start Transit
                    </button>
                  )}
                  {c.status === 'In Transit' && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, 'Delivered')}
                      className="px-2 py-1 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                    >
                      Complete Delivery
                    </button>
                  )}
                  <button
                    onClick={() => handlePrint(c)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Quick Print"
                  >
                    <Printer size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            No delivery challans found for the active filter.
          </div>
        )}
      </div>

      {/* Preview Delivery Challan Modal */}
      <AnimatePresence>
        {selectedChallan && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto" id="preview-challan-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col my-8"
            >
              {/* Modal Actions Bar */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-600" size={18} />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">Preview Delivery Challan</h4>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">#{selectedChallan.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChallan(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body - styled exactly like the Breeze Enterprises Delivery Challan PDF */}
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
                    Delivery Challan
                  </span>
                </div>

                {/* Two-Column Metadata section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] leading-relaxed text-slate-800">
                  {/* Left Column */}
                  <div className="space-y-1.5">
                    <div className="flex">
                      <span className="w-20 font-extrabold text-slate-900 uppercase">Customer:</span>
                      <span className="flex-1 font-bold text-slate-950">{selectedChallan.customer}</span>
                    </div>
                    <div className="flex">
                      <span className="w-20 font-extrabold text-slate-900 uppercase">Contact:</span>
                      <span className="flex-1 font-semibold">{selectedChallan.contact}</span>
                    </div>
                    <div className="flex">
                      <span className="w-20 font-extrabold text-slate-900 uppercase">Address:</span>
                      <span className="flex-1 text-slate-700">{selectedChallan.address}</span>
                    </div>
                    <div className="flex">
                      <span className="w-20 font-extrabold text-slate-900 uppercase">NTN:</span>
                      <span className="flex-1">{selectedChallan.ntn}</span>
                    </div>
                    <div className="flex">
                      <span className="w-20 font-extrabold text-slate-900 uppercase">GST:</span>
                      <span className="flex-1">{selectedChallan.gst}</span>
                    </div>
                    <div className="flex">
                      <span className="w-20 font-extrabold text-slate-900 uppercase">PO#:</span>
                      <span className="flex-1">{selectedChallan.po}</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-1.5 md:pl-8">
                    <div className="flex">
                      <span className="w-32 font-extrabold text-slate-900 uppercase">DC Number:</span>
                      <span className="flex-1 font-bold text-slate-950 font-mono">{selectedChallan.id}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-extrabold text-slate-900 uppercase">Delivery Date:</span>
                      <span className="flex-1 font-medium">{selectedChallan.date}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-extrabold text-slate-900 uppercase">Delivery Time:</span>
                      <span className="flex-1 font-medium">{selectedChallan.time || 'N/A'}</span>
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
                      <span className="w-32 font-bold text-slate-500 uppercase">Logistics Status:</span>
                      <span className={`px-2 py-0.2 text-[10px] rounded-full font-bold border ${getStatusBadgeClass(selectedChallan.status)}`}>
                        {selectedChallan.status}
                      </span>
                    </div>
                    <div className="flex text-slate-600 text-[10px]">
                      <span className="w-32 font-semibold">Driver / Vehicle:</span>
                      <span className="flex-1">{selectedChallan.driverName} ({selectedChallan.vehicleNo})</span>
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
                        <th className="py-2.5 px-3 border-r border-slate-300 text-center w-36">Specification/Unit</th>
                        <th className="py-2.5 px-3 border-r border-slate-300 text-center w-32">Product Code</th>
                        <th className="py-2.5 px-3 text-center w-24">QTY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 text-slate-800">
                      {selectedChallan.items.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50/40">
                          <td className="py-2.5 px-3 border-r border-slate-300 text-center font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3 border-r border-slate-300 font-bold text-slate-900">{item.name}</td>
                          <td className="py-2.5 px-3 border-r border-slate-300 text-center">{item.unit || 'pcs'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-300 text-center">{item.productCode || 'General'}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-black text-slate-950">{item.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  onClick={() => handleDelete(selectedChallan.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 px-3.5 py-2.5 rounded-xl border border-rose-200 hover:border-rose-600 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                  Delete Challan
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint(selectedChallan)}
                    className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md"
                  >
                    <Printer size={13} />
                    Print Challan
                  </button>
                  <button
                    onClick={() => setSelectedChallan(null)}
                    className="text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Delivery Challan Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden border border-slate-100 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Truck size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">Generate Delivery Challan</h4>
                    <p className="text-[10px] text-slate-400">Set route parameters, client metadata, and billable line items</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateChallan} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-medium text-slate-600">
                
                <h5 className="font-bold text-slate-800 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider">1. Recipient Details</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Customer / Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      placeholder="e.g. Jupiter Foods (Pvt) Ltd."
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="e.g. 03333309331"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Destination Address *</label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete shipping address"
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 resize-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Customer NTN</label>
                    <input
                      type="text"
                      value={ntn}
                      onChange={(e) => setNtn(e.target.value)}
                      placeholder="N/A"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Customer GST</label>
                    <input
                      type="text"
                      value={gst}
                      onChange={(e) => setGst(e.target.value)}
                      placeholder="N/A"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">PO# / Ref</label>
                    <input
                      type="text"
                      value={po}
                      onChange={(e) => setPo(e.target.value)}
                      placeholder="N/A"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>

                <h5 className="font-bold text-slate-800 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider pt-2">2. Logistics & Vehicle</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Driver / Logistics Agent *</label>
                    <input
                      type="text"
                      required
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="Driver full name"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Vehicle Plate Number *</label>
                    <input
                      type="text"
                      required
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                      placeholder="e.g. NY-882-XYZ"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Weight (KG)</label>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Initial Status</label>
                    <select
                      value={status}
                      onChange={(e: any) => setStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    >
                      <option value="Dispatched">Dispatched</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {/* Line Items List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">3. Delivery Line Items</h5>
                    <button
                      type="button"
                      onClick={handleAddFormItem}
                      className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
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
                        <div className="w-20">
                          <input
                            type="text"
                            required
                            placeholder="Unit (pcs)"
                            value={item.unit}
                            onChange={(e) => handleUpdateFormItem(idx, 'unit', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-center text-slate-800"
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="text"
                            required
                            placeholder="Code"
                            value={item.productCode}
                            onChange={(e) => handleUpdateFormItem(idx, 'productCode', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-center text-slate-800"
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

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/80 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    Generate & Print Challan
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
