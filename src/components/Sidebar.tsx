import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart,
  FileText,
  Truck,
  FileCheck,
  ShoppingBag,
  Package,
  DollarSign,
  BookOpen,
  Contact,
  TrendingUp,
  UserCog,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  hasArrow?: boolean;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: SidebarItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Customers', icon: Users, hasArrow: true },
    { name: 'Vendors', icon: ShoppingCart, hasArrow: true },
    { name: 'Invoices', icon: FileText, hasArrow: true },
    { name: 'Delivery Challans', icon: Truck, hasArrow: true },
    { name: 'Quotations', icon: FileCheck, hasArrow: true },
    { name: 'Purchase Orders', icon: ShoppingBag, hasArrow: true },
    { name: 'Inventory', icon: Package, hasArrow: true },
    { name: 'Expense', icon: DollarSign, hasArrow: true },
    { name: 'General Ledger', icon: BookOpen, hasArrow: true },
    { name: 'Party Ledger', icon: Contact, hasArrow: true },
    { name: 'Reports', icon: TrendingUp, hasArrow: true },
    { name: 'Employees', icon: UserCog, hasArrow: true },
  ];

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setIsOpen(false); // Close mobile menu after clicking
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-[#111019] text-white hover:bg-[#201f2e] transition-colors shadow-md"
          id="mobile-sidebar-toggle"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs"
          id="sidebar-overlay"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="sidebar-container"
      >
        {/* Brand Logo & Name */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3 text-white font-bold text-lg tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-3.5 h-3.5 border-2 border-white rounded-xs"></div>
            </div>
            <span>PANZE</span>
            <span className="text-[10px] bg-slate-800 text-blue-400 font-semibold px-1.5 py-0.5 rounded-sm border border-slate-700/50">STUDIO</span>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleTabClick(item.name)}
                id={`sidebar-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    size={18} 
                    className={`transition-colors duration-150 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`} 
                  />
                  <span>{item.name}</span>
                </div>
                {item.hasArrow && !isActive && (
                  <ChevronRight 
                    size={14} 
                    className="text-slate-600 group-hover:text-slate-400 transition-colors" 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Plan Usage Indicator */}
        <div className="p-4 border-t border-slate-800/40">
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-2">Plan Usage</p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '72%' }}></div>
            </div>
            <p className="text-xs text-slate-300">7.2k / 10k requests</p>
          </div>
        </div>

        {/* Bottom Footer Credits */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm">
              FP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Francis Pervez</p>
              <p className="text-[10px] text-slate-500 truncate">francispervez777@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
