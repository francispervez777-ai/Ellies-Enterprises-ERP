/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  Calendar, 
  ChevronDown, 
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  Sun,
  User,
  LogOut,
  Users,
  Package,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import Sidebar from './components/Sidebar';
import MetricCards from './components/MetricCards';
import SalesChart from './components/SalesChart';
import DevicesChart from './components/DevicesChart';
import InvoicesTable from './components/InvoicesTable';
import StockHistory from './components/StockHistory';
import WorkInProgress from './components/WorkInProgress';

// Modular Workspace Managers
import CustomersManager from './components/CustomersManager';
import VendorsManager from './components/VendorsManager';
import DeliveryChallansManager from './components/DeliveryChallansManager';
import QuotationsManager from './components/QuotationsManager';
import PurchaseOrdersManager from './components/PurchaseOrdersManager';
import InventoryManager from './components/InventoryManager';
import ExpenseManager from './components/ExpenseManager';
import GeneralLedgerManager from './components/GeneralLedgerManager';
import PartyLedgerManager from './components/PartyLedgerManager';
import ReportsManager from './components/ReportsManager';
import EmployeesManager from './components/EmployeesManager';

// Types & Static Data
import { Invoice, StockItem, MonthlyData, KPI, Customer, Employee } from './types';
import { 
  INITIAL_KPIS, 
  INITIAL_MONTHLY_DATA, 
  INITIAL_DEVICE_SHARES, 
  INITIAL_INVOICES, 
  INITIAL_STOCK_ITEMS 
} from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  
  // App state
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(INITIAL_MONTHLY_DATA);
  const [kpis, setKpis] = useState<KPI[]>(INITIAL_KPIS);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'CUST-001', name: 'Zayn Malik', company: 'Pillowtalk Styles', email: 'zayn@pillowtalk.com', phone: '+1 (555) 012-3456', address: '124 Bradford Lane, NY', totalOrders: 18, totalInvoiced: 4200, balance: 350, ntn: '9703305-1', gst: '3840132000345', po: 'PO-2026-001', openingBalance: 300 },
    { id: 'CUST-002', name: 'Gigi Hadid', company: 'Runway Corp', email: 'gigi@runway.com', phone: '+1 (555) 019-8765', address: '890 Fashion Blvd, NY', totalOrders: 12, totalInvoiced: 8900, balance: 0, ntn: '1234567-2', gst: '1234567890123', po: 'PO-2026-002', openingBalance: 0 },
    { id: 'CUST-003', name: 'Harry Styles', company: 'Golden Guitars Ltd', email: 'harry@golden.co', phone: '+1 (555) 014-9988', address: '42 Cherry Tree Lane, London', totalOrders: 25, totalInvoiced: 15400, balance: 1250, ntn: '7654321-3', gst: '9876543210987', po: 'PO-2026-003', openingBalance: 1000 },
    { id: 'CUST-004', name: 'Kendall Jenner', company: 'Teal Agency', email: 'kendall@teal.com', phone: '+1 (555) 017-1122', address: '77 Rodeo Dr, Beverly Hills', totalOrders: 9, totalInvoiced: 3100, balance: 0, ntn: 'N/A', gst: 'N/A', po: 'N/A', openingBalance: 0 },
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'EMP-001', name: 'James Smith', role: 'Chief Architect', department: 'Engineering', status: 'Present', salary: 12500, email: 'james.s@enterprise.com', joinDate: '2025-01-10' },
    { id: 'EMP-002', name: 'Maria Rodriguez', role: 'Operations Lead', department: 'Operations', status: 'Remote', salary: 8900, email: 'maria.r@enterprise.com', joinDate: '2025-03-15' },
    { id: 'EMP-003', name: 'John Doe', role: 'HR Generalist', department: 'HR', status: 'Present', salary: 6200, email: 'john.d@enterprise.com', joinDate: '2025-06-01' },
    { id: 'EMP-004', name: 'Lisa Chen', role: 'VP Finance', department: 'Finance', status: 'On Leave', salary: 14000, email: 'lisa.c@enterprise.com', joinDate: '2024-11-20' },
    { id: 'EMP-005', name: 'Sarah Connor', role: 'Logistics Supervisor', department: 'Operations', status: 'Present', salary: 7100, email: 'sarah.c@enterprise.com', joinDate: '2026-02-01' },
  ]);

  // 1. Add Custom Invoice & Update KPIs and Charts dynamically!
  const handleAddInvoice = (newInvoice: Invoice) => {
    setInvoices(prev => [newInvoice, ...prev]);

    // Update KPIs dynamically
    setKpis(prevKpis => {
      return prevKpis.map(kpi => {
        if (kpi.type === 'sales') {
          // Add to Total Sales
          const numericVal = parseInt(kpi.value.replace(/[^0-9]/g, '')) + newInvoice.amount;
          return {
            ...kpi,
            value: `PKR ${numericVal.toLocaleString()}`,
            change: `+${(parseFloat(kpi.change.replace('%', '')) + 1.5).toFixed(1)}%`
          };
        }
        if (kpi.type === 'received' && newInvoice.status === 'Delivered') {
          // Add to Payment Received
          const numericVal = parseInt(kpi.value.replace(/[^0-9]/g, '')) + newInvoice.amount;
          return {
            ...kpi,
            value: `PKR ${numericVal.toLocaleString()}`,
            change: `+${(parseFloat(kpi.change.replace('%', '')) + 0.8).toFixed(1)}%`
          };
        }
        return kpi;
      });
    });

    // Update Sales Chart - add sales to 'Jul'
    setMonthlyData(prevData => {
      return prevData.map(monthObj => {
        if (monthObj.month === 'Jul') {
          return {
            ...monthObj,
            sales: monthObj.sales + newInvoice.amount
          };
        }
        return monthObj;
      });
    });

    // Alert Notification
    setUnreadNotifications(prev => prev + 1);
  };

  // 2. Delete Invoice & Update KPIs and Charts dynamically!
  const handleDeleteInvoice = (id: string) => {
    const targetInv = invoices.find(inv => inv.id === id);
    if (!targetInv) return;

    setInvoices(prev => prev.filter(inv => inv.id !== id));

    // Update KPIs dynamically
    setKpis(prevKpis => {
      return prevKpis.map(kpi => {
        if (kpi.type === 'sales') {
          const numericVal = Math.max(0, parseInt(kpi.value.replace(/[^0-9]/g, '')) - targetInv.amount);
          return {
            ...kpi,
            value: `PKR ${numericVal.toLocaleString()}`
          };
        }
        if (kpi.type === 'received' && targetInv.status === 'Delivered') {
          const numericVal = Math.max(0, parseInt(kpi.value.replace(/[^0-9]/g, '')) - targetInv.amount);
          return {
            ...kpi,
            value: `PKR ${numericVal.toLocaleString()}`
          };
        }
        return kpi;
      });
    });

    // Update Sales Chart
    setMonthlyData(prevData => {
      return prevData.map(monthObj => {
        if (monthObj.month === 'Jul') {
          return {
            ...monthObj,
            sales: Math.max(0, monthObj.sales - targetInv.amount)
          };
        }
        return monthObj;
      });
    });
  };

  // 3. Handle Stock Restock
  const handleRestock = (id: string, qty: number) => {
    setStockItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          const newStock = item.stock + qty;
          const newStatus = newStock > item.minStock 
            ? 'In Stock' 
            : newStock > 0 
              ? 'Low Stock' 
              : 'Out of Stock';

          return {
            ...item,
            stock: newStock,
            status: newStatus
          };
        }
        return item;
      });
    });

    // Push notification
    setUnreadNotifications(prev => prev + 1);
  };

  // Clear notifications helper
  const handleClearNotifications = () => {
    setUnreadNotifications(0);
  };

  return (
    <div className="flex min-h-screen bg-[#fafafc] text-gray-700 font-sans" id="app-root-container">
      
      {/* 1. Collapsible & Responsive Sidebar Menu */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main content block */}
      <div className="flex-1 flex flex-col min-w-0" id="main-content-wrapper">
        
        {/* Top Header bar */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100 h-16 px-6 lg:px-8 flex items-center justify-between" id="app-header">
          {/* Section title */}
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600 animate-pulse" />
              {activeTab === 'Dashboard' ? 'Dashboard Overview' : `${activeTab} Workspace`}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Current Session • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Header Action Elements */}
          <div className="flex items-center gap-4">
            {/* Global search simulation */}
            <div className="relative hidden md:block w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Global tracking search..." 
                className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-lg pl-8 pr-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative" id="notifications-bell">
              <button 
                onClick={handleClearNotifications}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all relative cursor-pointer"
                title={unreadNotifications > 0 ? `Clear ${unreadNotifications} notifications` : "No new notifications"}
              >
                <Bell size={18} strokeWidth={2.2} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" id="profile-dropdown">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 border border-blue-500/10 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                  FP
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">Francis P.</p>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Administrator</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Panel */}
              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-45" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-50 text-xs font-semibold text-slate-600"
                    >
                      <div className="px-3.5 py-2.5 border-b border-slate-50 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                        Quick Account actions
                      </div>
                      <button 
                        onClick={() => { setIsProfileOpen(false); alert("Mocking Profile Settings page"); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <User size={14} /> Profile Information
                      </button>
                      <button 
                        onClick={() => { setIsProfileOpen(false); alert("Mocking Session Preferences"); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <SlidersHorizontal size={14} /> System Config
                      </button>
                      <button 
                        onClick={() => { setIsProfileOpen(false); alert("Mocking Log Out"); }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 border-t border-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* 3. Primary Workspace Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto bg-slate-50/50" id="app-workspace-body">
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' ? (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* A. KPI metrics cards row */}
                <MetricCards kpis={kpis} />

                {/* Operational Overview metrics row */}
                <div className="space-y-3">
                  <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    Operational pulse
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="operations-cards-grid">
                    {/* Total Customers */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between h-28 transition-all hover:shadow-md"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Customers</span>
                        <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">{customers.length}</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Active corporate accounts</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/50 shadow-xs">
                        <Users size={18} strokeWidth={2.2} />
                      </div>
                      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80" />
                    </motion.div>

                    {/* Total Inventory */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between h-28 transition-all hover:shadow-md"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Inventory</span>
                        <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                          {stockItems.reduce((sum, item) => sum + item.stock, 0).toLocaleString()} <span className="text-xs text-slate-400 font-medium">pcs</span>
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">{stockItems.length} unique items</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100/50 shadow-xs">
                        <Package size={18} strokeWidth={2.2} />
                      </div>
                      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-500 to-yellow-500 opacity-80" />
                    </motion.div>

                    {/* Invoice Overdue / Pending */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between h-28 transition-all hover:shadow-md"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Overdue</span>
                        <h3 className="text-2xl font-extrabold text-rose-600 tracking-tight">
                          {invoices.filter(i => i.status === 'Pending').length} <span className="text-xs text-rose-400 font-medium">unpaid</span>
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium font-semibold">
                          Total: PKR {invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100/50 shadow-xs">
                        <AlertCircle size={18} strokeWidth={2.2} />
                      </div>
                      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-rose-500 to-pink-500 opacity-80" />
                    </motion.div>

                    {/* Total Employee */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between h-28 transition-all hover:shadow-md"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Employee</span>
                        <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">{employees.length}</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Active personnel</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 shadow-xs">
                        <Briefcase size={18} strokeWidth={2.2} />
                      </div>
                      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80" />
                    </motion.div>
                  </div>
                </div>

                {/* B. Grid row 1: Sales Column chart & Devices Pie chart */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="dashboard-charts-row">
                  <div className="xl:col-span-2">
                    <SalesChart data={monthlyData} />
                  </div>
                  <div>
                    <DevicesChart shares={INITIAL_DEVICE_SHARES} />
                  </div>
                </div>

                {/* C. Grid row 2: Recent Invoices Table & Stock History alerts */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="dashboard-tables-row">
                  <div className="xl:col-span-2">
                    <InvoicesTable 
                      invoices={invoices} 
                      onAddInvoice={handleAddInvoice}
                      onDeleteInvoice={handleDeleteInvoice}
                    />
                  </div>
                  <div>
                    <StockHistory 
                      stockItems={stockItems} 
                      onRestock={handleRestock}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeTab}-view`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {(() => {
                  switch (activeTab) {
                    case 'Customers':
                      return <CustomersManager customers={customers} setCustomers={setCustomers} />;
                    case 'Vendors':
                      return <VendorsManager />;
                    case 'Invoices':
                      return (
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                          <h3 className="text-base font-bold text-slate-800 tracking-tight mb-2">Dedicated Invoices Ledger</h3>
                          <p className="text-xs text-slate-400 mb-6 font-medium">Manage corporate billing records, record payment streams, and recalculate metrics in real-time</p>
                          <InvoicesTable 
                            invoices={invoices} 
                            onAddInvoice={handleAddInvoice}
                            onDeleteInvoice={handleDeleteInvoice}
                          />
                        </div>
                      );
                    case 'Delivery Challans':
                      return <DeliveryChallansManager />;
                    case 'Quotations':
                      return <QuotationsManager />;
                    case 'Purchase Orders':
                      return <PurchaseOrdersManager />;
                    case 'Inventory':
                      return <InventoryManager stockItems={stockItems} onRestock={handleRestock} />;
                    case 'Expense':
                      return <ExpenseManager />;
                    case 'General Ledger':
                      return <GeneralLedgerManager />;
                    case 'Party Ledger':
                      return <PartyLedgerManager />;
                    case 'Reports':
                      return <ReportsManager />;
                    case 'Employees':
                      return <EmployeesManager employees={employees} setEmployees={setEmployees} />;
                    default:
                      return <WorkInProgress moduleName={activeTab} />;
                  }
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
