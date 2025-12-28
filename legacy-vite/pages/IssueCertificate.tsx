import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Wand2,
  Calendar,
  User,
  Award,
  Loader2,
  QrCode,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../components/ui/Toast';
import { api } from '../lib/api';

interface CertificateData {
  id: string;
  recipient: string;
  program: string;
  date: string;
  qrCode: string;
}

export const IssueCertificate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [generatedCert, setGeneratedCert] = useState<CertificateData | null>(null);

  const [formData, setFormData] = useState({
    recipient: '',
    program: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const id = `CRT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await api.issueCertificate({
        id,
        recipient_name: formData.recipient,
        program_name: formData.program,
        issue_date: formData.date
      });

      setGeneratedCert({
        id,
        recipient: formData.recipient,
        program: formData.program,
        date: formData.date,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`
      });
      setIsLoading(false);
      setToastMessage('Certificate generated and saved successfully');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Error issuing certificate: ' + (error.message || 'Unknown error'));
      setIsLoading(false);
    }
  };

  const handleVerifyClick = () => {
    if (generatedCert) {
      window.open(`/#/verify/${generatedCert.id}`, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Toast
        isVisible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />

      <motion.button
        onClick={() => navigate('/dashboard')}
        whileHover={{ x: -4 }}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </motion.button>

      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-zinc-900 tracking-tight mb-2"
        >
          Issue New Certificate
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-500"
        >
          Create a tamper-proof digital credential in seconds.
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        {!generatedCert ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <GlassCard className="max-w-xl mx-auto p-8">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                    <User size={16} className="text-zinc-400" />
                    Recipient Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    placeholder="e.g. Ahmet Yılmaz"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all placeholder:text-zinc-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                    <Award size={16} className="text-zinc-400" />
                    Program / Course Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    placeholder="e.g. Advanced UX Design"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all placeholder:text-zinc-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                    <Calendar size={16} className="text-zinc-400" />
                    Issue Date
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-zinc-700"
                  />
                </div>

                <div className="pt-4">
                  <motion.button
                    whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-zinc-900 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 size={20} className="animate-spin" />
                        Generating...
                      </motion.div>
                    ) : (
                      <>
                        <Wand2 size={20} />
                        Generate Certificate
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="flex flex-col items-center space-y-8"
          >
            {/* Certificate Preview Card */}
            <div className="relative w-full max-w-3xl aspect-[1.414/1] bg-white rounded-none shadow-2xl overflow-hidden border-8 border-white group hover:shadow-3xl transition-shadow duration-500">
              {/* Decorative Border */}
              <div className="absolute inset-4 border border-zinc-200 pointer-events-none"></div>
              <div className="absolute inset-5 border border-zinc-100 pointer-events-none"></div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-zinc-100 to-transparent opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-zinc-100 to-transparent opacity-50"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                <div className="mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="w-16 h-16 mx-auto bg-zinc-900 text-white rounded-full flex items-center justify-center mb-4 shadow-xl"
                  >
                    <Award size={32} />
                  </motion.div>
                  <h2 className="text-3xl font-serif text-zinc-900 tracking-wide uppercase">Certificate of Completion</h2>
                  <p className="text-sm text-zinc-400 mt-2 uppercase tracking-[0.2em]">This is to certify that</p>
                </div>

                <div className="mb-8 w-full">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl md:text-5xl font-serif text-zinc-800 italic mb-4"
                  >
                    {generatedCert.recipient}
                  </motion.h3>
                  <div className="h-px w-64 bg-zinc-200 mx-auto"></div>
                </div>

                <div className="mb-12 max-w-lg">
                  <p className="text-zinc-500 mb-2">Has successfully completed the program</p>
                  <motion.h4
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-xl font-bold text-zinc-900"
                  >
                    {generatedCert.program}
                  </motion.h4>
                </div>

                <div className="w-full flex items-end justify-between px-12 mt-auto">
                  <div className="text-left">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Date Issued</p>
                    <p className="text-sm font-medium text-zinc-900">{generatedCert.date}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-32 border-b border-zinc-300 mb-2"></div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider">Authorized Signature</p>
                  </div>

                  <div className="text-right">
                    <img src={generatedCert.qrCode} alt="QR" className="w-16 h-16 mb-2 mix-blend-multiply opacity-90" />
                    <p className="text-[10px] font-mono text-zinc-400">{generatedCert.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVerifyClick}
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl shadow-lg hover:bg-zinc-800 transition-all flex items-center gap-2 font-medium"
              >
                <ExternalLink size={18} />
                View Public Page
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center gap-2 font-medium"
              >
                <Copy size={18} />
                Copy Link
              </motion.button>
            </motion.div>

            <button
              onClick={() => { setGeneratedCert(null); setFormData({ ...formData, recipient: '' }); }}
              className="text-sm text-zinc-400 hover:text-zinc-600 underline underline-offset-4 transition-colors"
            >
              Issue Another Certificate
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};