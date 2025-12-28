import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { ChevronRight, Building2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../components/ui/Skeleton';

const customersData = [
  {
    id: 'demo-academy',
    name: 'Demo Academy',
    type: 'Education Institution',
    status: 'Active',
    certificates: 12480,
    joinDate: 'Jan 12, 2024',
    logo: 'DA'
  }
];

export const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate loading delay for skeleton demo
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="relative group">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
             <input 
                type="text" 
                placeholder="Search organizations..." 
                className="pl-10 pr-4 py-2 bg-white/50 border border-white/40 rounded-xl text-sm text-zinc-700 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100 w-64 shadow-sm transition-all"
             />
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-xl shadow-lg hover:bg-zinc-800 transition-colors"
        >
            Add Customer
        </motion.button>
      </div>

      <GlassCard className="overflow-hidden min-h-[500px]">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-zinc-100 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <th className="px-6 py-5">Organization</th>
                    <th className="px-6 py-5">Type</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Usage</th>
                    <th className="px-6 py-5 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
                {loading ? (
                  // Skeleton Loading State
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                              <Skeleton className="w-10 h-10 rounded-xl" delay={i * 50} />
                              <div className="space-y-2">
                                  <Skeleton className="h-4 w-32" delay={i * 50 + 50} />
                                  <Skeleton className="h-3 w-20" delay={i * 50 + 100} />
                              </div>
                          </div>
                      </td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" delay={i * 50 + 100} /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" delay={i * 50 + 150} /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-12" delay={i * 50 + 200} /></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))
                ) : (
                  // Real Data
                  <>
                    {customersData.map((customer) => (
                        <tr 
                            key={customer.id} 
                            onClick={() => navigate(`/customers/${customer.id}`)}
                            className="group hover:bg-zinc-50/80 transition-all cursor-pointer duration-200"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <motion.div 
                                      layoutId={`customer-logo-${customer.id}`}
                                      className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-200"
                                    >
                                        {customer.logo}
                                    </motion.div>
                                    <div>
                                        <p className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{customer.name}</p>
                                        <p className="text-xs text-zinc-500">ID: {customer.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="flex items-center gap-2 text-sm text-zinc-600">
                                    <Building2 size={16} className="text-zinc-400" />
                                    {customer.type}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    {customer.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">{customer.certificates.toLocaleString()}</p>
                                    <p className="text-xs text-zinc-400">Certificates</p>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all" onClick={(e) => { e.stopPropagation(); navigate(`/customers/${customer.id}`); }}>
                                    <span className="text-xs font-medium mr-2 hidden group-hover:inline-block transition-all">View</span>
                                    <ChevronRight size={16} className="inline-block" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {/* Empty fillers for aesthetics */}
                    {Array.from({ length: 3 }).map((_, i) => (
                        <tr key={`empty-${i}`} className="opacity-0 pointer-events-none">
                            <td colSpan={5} className="py-8"></td>
                        </tr>
                    ))}
                  </>
                )}
            </tbody>
        </table>
      </GlassCard>
    </div>
  );
};