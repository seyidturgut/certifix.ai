import React from 'react';
import { Bell, Search, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const location = useLocation();
  
  // Clean up path name logic
  let pathName = 'Dashboard';
  if (location.pathname !== '/dashboard' && location.pathname !== '/') {
    const segment = location.pathname.split('/')[1]; // get first segment
    pathName = segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 px-8 py-6"
    >
      <div className="flex items-center justify-between">
        {/* Breadcrumbs / Page Title */}
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                <span>Admin</span>
                <ChevronRight size={12} />
                <span className="text-zinc-800">{pathName}</span>
            </div>
            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">{pathName}</h2>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-white/40 focus:border-zinc-300 rounded-full text-sm w-64 shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all"
            />
          </div>

          <button className="relative p-2.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white text-zinc-500 hover:text-zinc-900 shadow-sm transition-all">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-2">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-zinc-900">Emre Can</p>
                <p className="text-xs text-zinc-500">Super Admin</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-zinc-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://picsum.photos/100/100" alt="Profile" className="h-full w-full object-cover" />
             </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};