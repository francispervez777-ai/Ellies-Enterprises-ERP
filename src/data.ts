import { Invoice, MonthlyData, DeviceShare, StockItem, KPI } from './types';

export const INITIAL_KPIS: KPI[] = [
  {
    id: 'kpi-1',
    title: 'Total Sales',
    value: 'PKR 12,345',
    change: '+20%',
    isPositive: true,
    type: 'sales'
  },
  {
    id: 'kpi-2',
    title: 'Total Expense',
    value: 'PKR 3,213',
    change: '+8%',
    isPositive: true,
    type: 'expense'
  },
  {
    id: 'kpi-3',
    title: 'Payment Sent',
    value: 'PKR 65,920',
    change: '+32%',
    isPositive: true,
    type: 'sent'
  },
  {
    id: 'kpi-4',
    title: 'Payment Received',
    value: 'PKR 72,840',
    change: '-3%',
    isPositive: false,
    type: 'received'
  }
];

export const INITIAL_MONTHLY_DATA: MonthlyData[] = [
  { month: 'Feb', target: 6500, sales: 4500, purchases: 2800 },
  { month: 'Mar', target: 5300, sales: 5000, purchases: 2500 },
  { month: 'Apr', target: 4000, sales: 3000, purchases: 1200 },
  { month: 'May', target: 5800, sales: 5600, purchases: 1800 },
  { month: 'Jun', target: 6000, sales: 3000, purchases: 2000 },
  { month: 'Jul', target: 4500, sales: 4000, purchases: 3800 }
];

export const INITIAL_DEVICE_SHARES: DeviceShare[] = [
  { name: 'iOS', percentage: 40, count: 480, color: '#84cc16' }, // Lime Green
  { name: 'MacBook', percentage: 12, count: 144, color: '#3b82f6' }, // Vibrant Blue
  { name: 'Smart TV', percentage: 8, count: 96, color: '#a855f7' }, // Purple
  { name: 'Tesla Model S', percentage: 10, count: 120, color: '#f43f5e' }, // Pinkish Red
  { name: 'Google Pixel', percentage: 30, count: 360, color: '#f97316' } // Warm Orange
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-006',
    customer: 'Skylar Price',
    date: '11/20/2024',
    amount: 354,
    status: 'Delivered',
    email: 'skylar.price@example.com',
    phone: '+1 (555) 234-5678',
    items: [
      { id: 'item-1', name: 'SaaS Integration Services', qty: 1, price: 250 },
      { id: 'item-2', name: 'Database Setup', qty: 1, price: 104 }
    ]
  },
  {
    id: 'INV-2026-005',
    customer: 'Julian Jenkins',
    date: '11/20/2024',
    amount: 910,
    status: 'In Progress',
    email: 'julian.j@example.com',
    phone: '+1 (555) 876-5432',
    items: [
      { id: 'item-1', name: 'Premium UI/UX Wireframing', qty: 1, price: 500 },
      { id: 'item-2', name: 'Brand Guide Consulting', qty: 2, price: 205 }
    ]
  },
  {
    id: 'INV-2026-004',
    customer: 'Nova Sterling',
    date: '11/19/2024',
    amount: 1250,
    status: 'Delivered',
    email: 'nova.sterling@techcorp.com',
    phone: '+1 (555) 912-3456',
    items: [
      { id: 'item-1', name: 'Full-stack Dashboard Development', qty: 1, price: 1250 }
    ]
  },
  {
    id: 'INV-2026-003',
    customer: 'Beckett Vance',
    date: '11/18/2024',
    amount: 420,
    status: 'Cancelled',
    email: 'vance.b@outlook.com',
    phone: '+1 (555) 432-1098',
    items: [
      { id: 'item-1', name: 'System Performance Auditing', qty: 1, price: 420 }
    ]
  },
  {
    id: 'INV-2026-002',
    customer: 'Emery Cole',
    date: '11/17/2024',
    amount: 150,
    status: 'Pending',
    email: 'emery.cole@agency.co',
    phone: '+1 (555) 654-9870',
    items: [
      { id: 'item-1', name: 'API Hookup & Configuration', qty: 1, price: 150 }
    ]
  },
  {
    id: 'INV-2026-001',
    customer: 'Rowan Avery',
    date: '11/15/2024',
    amount: 2300,
    status: 'Delivered',
    email: 'rowan.a@designstudio.io',
    phone: '+1 (555) 321-7890',
    items: [
      { id: 'item-1', name: 'Custom E-Commerce Platform Build', qty: 1, price: 2000 },
      { id: 'item-2', name: 'Project Maintenance Plan', qty: 1, price: 300 }
    ]
  }
];

export const INITIAL_STOCK_ITEMS: StockItem[] = [
  {
    id: 'stock-1',
    name: 'Logitech MX Master 3S',
    sku: 'LOG-MX3S-GR',
    category: 'Peripherals',
    stock: 124,
    minStock: 20,
    price: 99,
    status: 'In Stock'
  },
  {
    id: 'stock-2',
    name: 'Keychron Q1 Pro Keyboard',
    sku: 'KEY-Q1P-ANSI',
    category: 'Peripherals',
    stock: 14,
    minStock: 15,
    price: 199,
    status: 'Low Stock'
  },
  {
    id: 'stock-3',
    name: 'LG UltraFine 32" 4K Monitor',
    sku: 'LG-32UF-IPS',
    category: 'Displays',
    stock: 3,
    minStock: 5,
    price: 599,
    status: 'Low Stock'
  },
  {
    id: 'stock-4',
    name: 'Apple MacBook Pro M3 (16")',
    sku: 'APP-MBP16-M3',
    category: 'Computers',
    stock: 45,
    minStock: 10,
    price: 2499,
    status: 'In Stock'
  },
  {
    id: 'stock-5',
    name: 'Sony WH-1000XM5 ANC Headphones',
    sku: 'SONY-XM5-BLK',
    category: 'Audio',
    stock: 0,
    minStock: 10,
    price: 399,
    status: 'Out of Stock'
  }
];
