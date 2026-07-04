import React, { useState } from 'react';
import { Search, Plus, UserCheck, X, Trash2, Shield, CalendarCheck, Sparkles, CircleDot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Employee } from '../types';

interface EmployeesManagerProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

export default function EmployeesManager({ employees, setEmployees }: EmployeesManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<Employee['department']>('Engineering');
  const [salary, setSalary] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Employee['status']>('Present');

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    const newEmp: Employee = {
      id: `EMP-00${employees.length + 1}`,
      name,
      role,
      department,
      status,
      salary: parseFloat(salary) || 4500,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@enterprise.com`,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setEmployees([newEmp, ...employees]);
    setIsAddOpen(false);

    // Reset Form
    setName('');
    setRole('');
    setDepartment('Engineering');
    setSalary('');
    setEmail('');
    setStatus('Present');
  };

  const handleRunPayroll = () => {
    setToastMsg("Processing salaries for the current billing cycle...");
    setTimeout(() => {
      const totalAmount = employees.reduce((sum, e) => sum + e.salary, 0);
      setToastMsg(`Success! Paid $${totalAmount.toLocaleString()} in salaries to ${employees.length} employees.`);
      setTimeout(() => setToastMsg(''), 4000);
    }, 1500);
  };

  const handleToggleStatus = (id: string, nextStatus: Employee['status']) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, status: nextStatus } : e));
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'Engineering': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Operations': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Finance': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'HR': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusIndicator = (s: string) => {
    switch (s) {
      case 'Present': return 'text-emerald-500';
      case 'Remote': return 'text-blue-500';
      case 'On Leave': return 'text-rose-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full" id="employees-manager">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Staff & HR Directory</h3>
          <p className="text-xs text-slate-400">Review staff membership profiles, log check-in attendance, and dispatch direct payroll transfers</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 w-48"
            />
          </div>

          <button
            onClick={handleRunPayroll}
            className="flex items-center gap-1.5 text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Run Payroll
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} /> Add Employee
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between border border-slate-800 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-400 animate-pulse animate-bounce" size={14} />
              <span>{toastMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roster Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Employee Profile</th>
              <th className="py-3 px-3">Role Designation</th>
              <th className="py-3 px-3">Department</th>
              <th className="py-3 px-3 text-center">Attendance Status</th>
              <th className="py-3 px-3 text-right">Mo. Salary</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs rounded-full">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-700">{emp.role}</td>
                <td className="py-3.5 px-3">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${getDepartmentColor(emp.department)}`}>
                    {emp.department}
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center justify-center gap-2">
                    <CircleDot size={12} className={getStatusIndicator(emp.status)} />
                    <select
                      value={emp.status}
                      onChange={(e) => handleToggleStatus(emp.id, e.target.value as any)}
                      className="bg-transparent border-none text-[11px] font-bold text-slate-600 cursor-pointer focus:ring-0 py-0"
                    >
                      <option value="Present">Present</option>
                      <option value="Remote">Remote</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">${emp.salary.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                    title="Terminate Staff Record"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-slate-100 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Shield size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">Add Corporate Employee</h4>
                    <p className="text-[10px] text-slate-400">Onboard new resource and set salary accounts</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddEmployee} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-medium text-slate-600">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Employee Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maria Rodriguez"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Corporate Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@enterprise.com"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Designation Role *</label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Operations Assistant"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e: any) => setDepartment(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Operations">Operations</option>
                      <option value="Marketing">Marketing</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Monthly Salary ($)</label>
                    <input
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="4500"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Check-In Status</label>
                    <select
                      value={status}
                      onChange={(e: any) => setStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    >
                      <option value="Present">Present</option>
                      <option value="Remote">Remote</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

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
                    Onboard Staff Resource
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
