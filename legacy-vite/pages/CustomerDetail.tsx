import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    ExternalLink, 
    ShieldCheck, 
    Users, 
    Mail, 
    Globe, 
    MapPin, 
    MoreHorizontal 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Nav */}
      <button 
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Customers
      </button>

      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-200">
                DA
            </div>
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Demo Academy</h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
                    <span className="flex items-center gap-1.5"><Globe size={14} /> demo-academy.edu</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> Istanbul, TR</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-600 text-sm font-medium rounded-xl hover:bg-zinc-50 transition-colors shadow-sm">
                Edit Profile
            </button>
            <button className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2 group">
                Enter Customer Panel
                <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
        </div>
      </motion.div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats */}
        <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-8">
                <h3 className="text-lg font-semibold text-zinc-900 mb-6">Usage Overview</h3>
                <div className="grid grid-cols-3 gap-8">
                    <div>
                        <p className="text-sm text-zinc-500 mb-1">Certificates Issued</p>
                        <p className="text-3xl font-bold text-zinc-900">12,480</p>
                    </div>
                    <div>
                        <p className="text-sm text-zinc-500 mb-1">Storage Used</p>
                        <p className="text-3xl font-bold text-zinc-900">45.2 <span className="text-lg text-zinc-400 font-normal">GB</span></p>
                    </div>
                    <div>
                        <p className="text-sm text-zinc-500 mb-1">API Calls</p>
                        <p className="text-3xl font-bold text-zinc-900">1.2M</p>
                    </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-zinc-100">
                     <h4 className="text-sm font-medium text-zinc-900 mb-4">Active Modules</h4>
                     <div className="flex flex-wrap gap-3">
                        {['Certificate Builder', 'Bulk Sending', 'API Access', 'White Labeling'].map((mod) => (
                            <span key={mod} className="px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-medium text-zinc-600">
                                {mod}
                            </span>
                        ))}
                     </div>
                </div>
            </GlassCard>
        </div>

        {/* Contact / Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-zinc-900">Account Manager</h3>
                    <button className="text-zinc-400 hover:text-zinc-600"><MoreHorizontal size={16}/></button>
                </div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden">
                        <img src="https://picsum.photos/seed/manager/100" alt="Manager" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-900">Sarah Connor</p>
                        <p className="text-xs text-zinc-500">Primary Contact</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-zinc-600 p-2 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer">
                        <Mail size={16} className="text-zinc-400" />
                        sarah@demo-academy.edu
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-600 p-2 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer">
                        <ShieldCheck size={16} className="text-zinc-400" />
                        Verified Account
                    </div>
                     <div className="flex items-center gap-3 text-sm text-zinc-600 p-2 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer">
                        <Users size={16} className="text-zinc-400" />
                        5 Team Members
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800">
                <h3 className="text-white font-medium mb-2">Subscription</h3>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-white">$299</span>
                    <span className="text-zinc-400 text-sm">/mo</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">Enterprise</span>
                    <span className="text-xs text-zinc-400">Renews in 12 days</span>
                </div>
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/10">
                    Manage Billing
                </button>
            </GlassCard>
        </div>
      </div>
    </div>
  );
};