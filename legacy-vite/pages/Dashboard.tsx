import React, { useEffect, useRef } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { 
  ShieldCheck, 
  FileBadge, 
  Users, 
  Activity, 
  CheckCircle2,
  Linkedin,
  FilePlus2,
  Send
} from 'lucide-react';
import { motion, useInView, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Simple CountUp Component for numbers
const Counter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!inView || !ref.current) return;
    
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1], // easeOutQuint
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent = Math.floor(v).toLocaleString('en-US');
        }
      }
    });
    
    return () => controls.stop();
  }, [value, inView]);

  return <span ref={ref}>0</span>;
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  subtext?: string;
  isStatus?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, subtext, isStatus, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.6, ease: "easeOut" }}
    className="flex-1"
  >
      <GlassCard className="p-8 relative overflow-hidden group h-full flex flex-col justify-between" hoverEffect>
        <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-2xl border ${isStatus ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-zinc-50/80 border-zinc-100 text-zinc-900'}`}>
                <Icon size={24} strokeWidth={1.5} />
            </div>
            {isStatus && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-700">Online</span>
                </div>
            )}
        </div>
        
        <div>
            <h3 className="text-4xl font-semibold text-zinc-900 tracking-tight mb-2">
                {typeof value === 'number' ? <Counter value={value} /> : value}
            </h3>
            <p className="text-sm font-medium text-zinc-500">{label}</p>
            {subtext && <p className="text-xs text-zinc-400 mt-1">{subtext}</p>}
        </div>
      </GlassCard>
  </motion.div>
);

const ActivityItem = ({ icon: Icon, title, desc, time, delay }: any) => (
    <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 + (delay * 0.1) }}
        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/50 transition-colors group cursor-default"
    >
        <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:scale-105 transition-all shadow-sm">
            <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium text-zinc-900">{title}</p>
            <p className="text-sm text-zinc-500">{desc}</p>
        </div>
        <span className="text-xs text-zinc-400 font-medium">{time}</span>
    </motion.div>
);

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            delay={1} 
            icon={FileBadge} 
            label="Certificates Issued" 
            value={12480} 
            subtext="+124 this week"
        />
        <StatCard 
            delay={2} 
            icon={ShieldCheck} 
            label="Verifications" 
            value={32910} 
            subtext="99.9% success rate"
        />
        <StatCard 
            delay={3} 
            icon={Users} 
            label="Active Customers" 
            value={1} 
            subtext="Enterprise Plan"
        />
        <StatCard 
            delay={4} 
            icon={Activity} 
            label="System Status" 
            value="Operational" 
            subtext="All systems normal"
            isStatus
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Feed */}
         <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
         >
            <h3 className="text-lg font-semibold text-zinc-900 mb-6 px-2">Recent Activity</h3>
            <GlassCard className="p-2">
                <div className="flex flex-col gap-1">
                    <ActivityItem 
                        delay={1}
                        icon={Send}
                        title="Certificate Issued"
                        desc={<>Issued to <span className="text-zinc-900 font-medium">Ayşe Yılmaz</span> for UX Design Course</>}
                        time="2m ago"
                    />
                    <div className="h-px bg-zinc-50 mx-4" />
                    <ActivityItem 
                        delay={2}
                        icon={Linkedin}
                        title="Verification Successful"
                        desc={<>Certificate <span className="font-mono text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">CRT-882</span> verified by LinkedIn</>}
                        time="15m ago"
                    />
                    <div className="h-px bg-zinc-50 mx-4" />
                    <ActivityItem 
                        delay={3}
                        icon={FilePlus2}
                        title="New Template Created"
                        desc={<>New layout <span className="text-zinc-900 font-medium">"Tech Conference 2026"</span> added to library</>}
                        time="1h ago"
                    />
                    <div className="h-px bg-zinc-50 mx-4" />
                    <ActivityItem 
                        delay={4}
                        icon={CheckCircle2}
                        title="System Backup"
                        desc="Daily automated backup completed successfully"
                        time="4h ago"
                    />
                </div>
            </GlassCard>
         </motion.div>

         {/* Side Widget */}
         <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
         >
            <h3 className="text-lg font-semibold text-zinc-900 mb-6 px-2">Quick Access</h3>
            <GlassCard className="p-6 h-full flex flex-col justify-center items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-zinc-100 to-white border border-white shadow-lg flex items-center justify-center mb-2">
                    <FileBadge size={32} className="text-zinc-900" strokeWidth={1.5} />
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-zinc-900">Issue New Certificate</h4>
                    <p className="text-sm text-zinc-500 mt-2 max-w-[200px] mx-auto">Create and send a single certificate manually.</p>
                </div>
                <button 
                  onClick={() => navigate('/certificates/new')}
                  className="px-6 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 hover:scale-105 transition-all shadow-lg shadow-zinc-200"
                >
                    Create Now
                </button>
            </GlassCard>
         </motion.div>
      </div>
    </div>
  );
};