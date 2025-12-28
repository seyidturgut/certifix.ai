import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { CustomerDetail } from './pages/CustomerDetail';
import { IssueCertificate } from './pages/IssueCertificate';
import { VerifyCertificate } from './pages/VerifyCertificate';
import { LandingPage } from './pages/LandingPage';
import { Certificates } from './pages/Certificates';
import { EmptyState } from './components/ui/EmptyState';
import { AnimatePresence, motion } from 'framer-motion';
import { Construction, FileBadge, Settings, Wand2 } from 'lucide-react';
import { PageTransition } from './components/ui/PageTransition';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { CustomerDashboard } from './pages/CustomerDashboard';

// Placeholder Pages with New Empty State

const TemplatesPlaceholder = () => (
  <PageTransition>
    <EmptyState
      icon={FileBadge}
      title="Template Library"
      description="Access professional, pre-designed certificate templates. This feature will be available in the next release."
    />
  </PageTransition>
);

const SettingsPlaceholder = () => (
  <PageTransition>
    <EmptyState
      icon={Settings}
      title="System Settings"
      description="Configure API keys, webhooks, and team permissions. This area is restricted in the demo environment."
    />
  </PageTransition>
);

// Admin Layout Component with Transition Support
const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-zinc-900 selection:bg-zinc-900 selection:text-white overflow-x-hidden font-sans">
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex relative z-10">
        <Sidebar />

        <main className="flex-1 md:ml-64 transition-all duration-300">
          <div className="max-w-7xl mx-auto min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 px-8 py-4 relative">
              <AnimatePresence mode="wait">
                <motion.div key={location.pathname} className="w-full h-full">
                  <Routes location={location}>
                    <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                    <Route path="/certificates" element={<PageTransition><Certificates /></PageTransition>} />
                    <Route path="/certificates/new" element={<PageTransition><IssueCertificate /></PageTransition>} />
                    <Route path="/templates" element={<TemplatesPlaceholder />} />
                    <Route path="/customers" element={<PageTransition><Customers /></PageTransition>} />
                    <Route path="/customers/:id" element={<PageTransition><CustomerDetail /></PageTransition>} />
                    <Route path="/settings" element={<SettingsPlaceholder />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="px-8 py-6 text-center text-xs text-zinc-400">
              <p>&copy; 2026 Certifix Inc. All rights reserved.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* All Routes Public for Local MAMP Version */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:id" element={<VerifyCertificate />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/customer/dashboard" element={<AdminLayout><CustomerDashboard /></AdminLayout>} />
        <Route path="/*" element={<AdminLayout />} />
      </Routes>
    </Router>
  );
};

export default App;