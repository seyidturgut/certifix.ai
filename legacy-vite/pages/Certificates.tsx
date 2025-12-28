import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileBadge,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    ExternalLink,
    ShieldCheck,
    Calendar,
    User as UserIcon,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Skeleton } from '../components/ui/Skeleton';
import { Toast } from '../components/ui/Toast';

export const Certificates = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const data = await api.getCertificates();
            setCertificates(data || []);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        }
        setLoading(false);
    };

    const handleRevoke = async (id: string) => {
        if (!window.confirm('Are you sure you want to revoke this certificate?')) return;

        try {
            await api.revokeCertificate(id);
            setToastMessage('Certificate revoked successfully');
            fetchCertificates();
        } catch (error) {
            setToastMessage('Error revoking certificate: ' + (error.message || 'Unknown error'));
        }
        setShowToast(true);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <Toast isVisible={showToast} message={toastMessage} onClose={() => setShowToast(false)} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Certificates</h1>
                    <p className="text-zinc-500 mt-1">Manage and track all issued credentials.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/certificates/new')}
                    className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl shadow-lg hover:bg-zinc-800 transition-all font-medium flex items-center justify-center gap-2"
                >
                    Issue New Certificate
                </motion.button>
            </div>

            <GlassCard className="p-2 overflow-hidden min-h-[500px]">
                <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search by recipient or ID..."
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all flex items-center gap-2">
                            <Filter size={14} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-50">
                                <th className="px-6 py-4">Credential</th>
                                <th className="px-6 py-4">Recipient</th>
                                <th className="px-6 py-4">Issue Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : certificates.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileBadge size={48} className="text-zinc-200" />
                                            <p className="text-zinc-500 font-medium">No certificates found</p>
                                            <button
                                                onClick={() => navigate('/certificates/new')}
                                                className="text-sm text-zinc-900 underline underline-offset-4 mt-2"
                                            >
                                                Issue your first certificate
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                certificates.map((cert) => (
                                    <tr key={cert.id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-zinc-900 text-sm">{cert.program_name}</p>
                                                <p className="text-xs font-mono text-zinc-400 mt-0.5">{cert.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                    {cert.recipient_name.charAt(0)}
                                                </div>
                                                <span className="text-sm text-zinc-700 font-medium">{cert.recipient_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-500">
                                            {new Date(cert.issue_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cert.status === 'valid'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                : 'bg-red-50 text-red-700 border border-red-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cert.status === 'valid' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                {cert.status === 'valid' ? 'Valid' : 'Revoked'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => window.open(`/#/verify/${cert.id}`, '_blank')}
                                                    className="p-2 text-zinc-400 hover:text-zinc-900 transition-all"
                                                >
                                                    <ExternalLink size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleRevoke(cert.id)}
                                                    disabled={cert.status === 'revoked'}
                                                    className="p-2 text-zinc-400 hover:text-red-600 transition-all disabled:opacity-30 disabled:hover:text-zinc-400"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};
