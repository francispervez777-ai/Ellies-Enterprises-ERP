export interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  unit?: string;
}

export interface Invoice {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'Delivered' | 'In Progress' | 'Cancelled' | 'Pending';
  email: string;
  phone: string;
  items: InvoiceItem[];
  address?: string;
  ntn?: string;
  gst?: string;
  po?: string;
  paymentMode?: string;
  paidAmount?: number;
  dueDate?: string;
  hasSalesTax?: boolean;
}

export interface KPI {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  type: 'sales' | 'expense' | 'sent' | 'received';
}

export interface DeviceShare {
  name: string;
  percentage: number;
  count: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  target: number;
  sales: number;
  purchases: number;
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  unit?: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalInvoiced: number;
  balance: number; // Positive means they owe us
  ntn?: string;
  gst?: string;
  po?: string;
  openingBalance?: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: 'Engineering' | 'Operations' | 'Marketing' | 'HR' | 'Finance';
  status: 'Present' | 'On Leave' | 'Remote';
  salary: number;
  email: string;
  joinDate: string;
}

