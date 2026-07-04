import { motion } from 'motion/react';
import { 
  Users, 
  Package, 
  BadgePercent, 
  ShoppingCart, 
  Shuffle, 
  Landmark, 
  CreditCard, 
  Receipt, 
  UserCog, 
  BarChart3, 
  Globe, 
  Settings, 
  CalendarClock,
  Wrench,
  Sparkles
} from 'lucide-react';

interface WorkInProgressProps {
  moduleName: string;
}

export default function WorkInProgress({ moduleName }: WorkInProgressProps) {
  const getModuleConfig = (name: string) => {
    switch (name) {
      case 'Parties':
        return {
          icon: Users,
          color: 'text-purple-500 bg-purple-50 border-purple-100',
          desc: 'Manage customer accounts, supplier contacts, and accounts payable/receivable ledgers in one location.'
        };
      case 'Product Manager':
        return {
          icon: Package,
          color: 'text-blue-500 bg-blue-50 border-blue-100',
          desc: 'Configure SKU details, categories, minimum inventory thresholds, and retail pricings.'
        };
      case 'Sales':
        return {
          icon: BadgePercent,
          color: 'text-amber-500 bg-amber-50 border-amber-100',
          desc: 'View sales pipeline, generate quotes, manage active deals, and apply discount matrices.'
        };
      case 'Purchases':
        return {
          icon: ShoppingCart,
          color: 'text-emerald-500 bg-emerald-50 border-emerald-100',
          desc: 'Draft purchase orders, track incoming shipments, and verify vendor receipt ledgers.'
        };
      case 'Stock Transfer':
        return {
          icon: Shuffle,
          color: 'text-cyan-500 bg-cyan-50 border-cyan-100',
          desc: 'Log internal warehouse re-allocations and transport logistics tracking numbers.'
        };
      case 'POS':
        return {
          icon: Landmark,
          color: 'text-rose-500 bg-rose-50 border-rose-100',
          desc: 'Launch the offline-first Point of Sale terminal to register in-person cash register sales.'
        };
      case 'Cash & Bank':
        return {
          icon: CreditCard,
          color: 'text-blue-500 bg-blue-50 border-blue-100',
          desc: 'Reconcile bank statements, manage physical registers, and audit cash reserves.'
        };
      case 'Expenses':
        return {
          icon: Receipt,
          color: 'text-teal-500 bg-teal-50 border-teal-100',
          desc: 'Categorize employee expense receipts, corporate travel allowances, and utility overheads.'
        };
      case 'Staff Members':
        return {
          icon: UserCog,
          color: 'text-orange-500 bg-orange-50 border-orange-100',
          desc: 'Configure role-based access permissions (RBAC) and view active login sessions.'
        };
      case 'Sales Reports':
        return {
          icon: BarChart3,
          color: 'text-fuchsia-500 bg-fuchsia-50 border-fuchsia-100',
          desc: 'Compile comprehensive balance sheets, income statements, and tax projection reports.'
        };
      case 'Online Orders':
        return {
          icon: Globe,
          color: 'text-sky-500 bg-sky-50 border-sky-100',
          desc: 'Monitor incoming e-commerce API webhooks from Shopify, WooCommerce, and Stripe checkout links.'
        };
      case 'Settings':
        return {
          icon: Settings,
          color: 'text-slate-600 bg-slate-50 border-slate-100',
          desc: 'Adjust brand colors, localization parameters, API keys, and notification triggers.'
        };
      case 'Subscription':
        return {
          icon: CalendarClock,
          color: 'text-violet-500 bg-violet-50 border-violet-100',
          desc: 'View subscription plans, update billing credit cards, and download workspace invoices.'
        };
      default:
        return {
          icon: Wrench,
          color: 'text-slate-500 bg-slate-50 border-slate-100',
          desc: 'This module is ready for connection to the backend service database.'
        };
    }
  };

  const { icon: Icon, color, desc } = getModuleConfig(moduleName);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto my-12 flex flex-col items-center gap-6"
      id={`wip-panel-${moduleName.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Decorative Icon */}
      <div className={`p-5 rounded-3xl border ${color} relative`}>
        <Icon size={32} strokeWidth={2} />
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white p-1 rounded-full animate-bounce">
          <Sparkles size={10} />
        </div>
      </div>

      {/* Texts */}
      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{moduleName} Hub</h3>
        <p className="text-xs text-blue-600 font-bold tracking-wider uppercase">Connected Enterprise Module</p>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto pt-2">
          {desc}
        </p>
      </div>

      {/* Mock details card */}
      <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-xs text-slate-500 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
          <span className="font-bold text-slate-700">Service Status:</span>
          <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-[10px]">
            ● Ready for Provisioning
          </span>
        </div>
        <p className="leading-normal">
          The front-end design is fully constructed and mapped to state. Real database syncing (Firestore) can be easily provisioned when ready.
        </p>
      </div>

      {/* Action to return */}
      <div className="flex gap-3">
        <span className="text-[10px] text-slate-400 font-medium">
          To return to the primary view, click <strong className="text-blue-600 font-bold">Dashboard</strong> in the sidebar.
        </span>
      </div>
    </motion.div>
  );
}
