import React from 'react';
import { NavItem } from '../types';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Award, 
  FileBadge, 
  Settings, 
  Building2,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'certificates', label: 'Certificates', icon: Award, path: '/certificates' },
    { id: 'templates', label: 'Templates', icon: FileBadge, path: '/templates' },
    { id: 'customers', label: 'Customers', icon: Building2, path: '/customers' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-64 p-6 z-50 hidden md:flex flex-col justify-between"
    >
      {/* Background Container for Glass Effect */}
      <div className="absolute inset-0 m-4 rounded-[32px] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] -z-10" />

      <div className="relative z-10 flex flex-col h-full px-2 py-4">
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 mb-12 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-white shadow-lg shadow-zinc-200">
            <Sparkles size={20} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 leading-none">Certifix</h1>
            <p className="text-[10px] text-zinc-500 font-medium tracking-wide mt-1">PRO ADMIN</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group
                  ${isActive 
                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
                    : 'text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900'}
                `}
              >
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-900'}`} 
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User / Bottom Action */}
        <div className="pt-6 border-t border-zinc-100">
           <button 
             onClick={() => navigate('/')}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50/50 transition-colors"
           >
            <LogOut size={20} />
            Sign Out
           </button>
        </div>
      </div>
    </motion.aside>
  );
};