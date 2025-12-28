import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    ShieldCheck,
    Calendar,
    Hash,
    Award,
    Share2,
    Download,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { api } from '../lib/api';

export const VerifyCertificate: React.FC = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [cert, setCert] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (id) {
            api.getCertificate(id)
                .then(data => {
                    setCert(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError(true);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
                <Loader2 className="animate-spin text-zinc-400" size={32} />
            </div>
        );
    }

    if (error || (!id && !cert)) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <AlertCircle size={48} className="text-red-500 mx-auto" />
                    <h1 className="text-2xl font-bold text-zinc-900">Certificate Not Found</h1>
                    <p className="text-zinc-500">The certificate ID you provided does not exist or has been revoked.</p>
                </div>
            </div>
        );
    }

    const isRevoked = cert?.status === 'revoked';

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4 font-sans selection:bg-emerald-100 selection:text-emerald-900">

            {/* Brand Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center gap-2 text-zinc-400"
            >
                <ShieldCheck size={20} className="text-zinc-900" />
                <span className="font-semibold text-zinc-900 tracking-tight">Certifix</span>
                <span className="text-zinc-300">|</span>
                <span className="text-xs font-medium uppercase tracking-wider">Official Verification Portal</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-lg"
            >
                <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] overflow-hidden border border-white/50 ring-1 ring-zinc-900/5">

                    {/* Trust Header */}
                    <div className={`${isRevoked ? 'bg-red-50/80 border-red-100' : 'bg-emerald-50/80 border-emerald-100'} backdrop-blur-sm border-b p-8 text-center relative overflow-hidden`}>
                        <div className={`absolute inset-0 bg-[radial-gradient(${isRevoked ? '#ef4444' : '#10b981'}_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15]`}></div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-zinc-50"
                        >
                            {isRevoked ? (
                                <AlertCircle size={40} className="text-red-500" strokeWidth={3} />
                            ) : (
                                <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={3} />
                            )}
                        </motion.div>

                        <h1 className={`relative z-10 text-xl font-bold tracking-tight ${isRevoked ? 'text-red-950' : 'text-emerald-950'}`}>
                            {isRevoked ? 'Revoked Certificate' : 'Verified Certificate'}
                        </h1>
                        <p className={`relative z-10 text-sm mt-1 font-medium ${isRevoked ? 'text-red-700/80' : 'text-emerald-700/80'}`}>
                            {isRevoked ? 'This credential has been invalidated by the issuer.' : 'This credential is authentic, active, and untampered.'}
                        </p>
                    </div>

                    {/* Core Info */}
                    <div className="p-8 space-y-8">
                        <div className="text-center space-y-1">
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Issued To</p>
                            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">{cert?.recipient_name}</h2>
                        </div>

                        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm shrink-0">
                                <Award size={24} className="text-zinc-800" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Credential</p>
                                <h3 className="font-semibold text-zinc-900 leading-tight">{cert?.program_name}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-zinc-400 mb-1.5">
                                    <Building2Icon size={14} />
                                    <span className="text-xs font-medium uppercase tracking-wider">Issuer</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-[10px] text-white font-bold">CZ</div>
                                    <span className="font-semibold text-zinc-900 text-sm">Certifix</span>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-zinc-400 mb-1.5">
                                    <Calendar size={14} />
                                    <span className="text-xs font-medium uppercase tracking-wider">Issue Date</span>
                                </div>
                                <p className="font-semibold text-zinc-900 text-sm">{new Date(cert?.issue_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Technical / ID */}
                        <div className="pt-6 border-t border-zinc-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                        <Hash size={14} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Certificate ID</span>
                                    </div>
                                    <p className="font-mono text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md">{id}</p>
                                </div>
                                {!isRevoked && (
                                    <div className="p-2 bg-white border border-zinc-200 rounded-lg shadow-sm">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`} alt="QR" className="w-12 h-12 opacity-80 mix-blend-multiply" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="bg-zinc-50 p-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                        <button
                            disabled={isRevoked}
                            className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 py-2.5 rounded-xl shadow-sm hover:bg-zinc-50 transition-colors disabled:opacity-50"
                        >
                            <Download size={16} />
                            Download PDF
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-white bg-zinc-900 py-2.5 rounded-xl shadow-md hover:bg-zinc-800 transition-colors">
                            <Share2 size={16} />
                            Share
                        </button>
                    </div>
                </div>

                {/* Security Footer */}
                <div className="mt-8 text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">
                        <ShieldCheck size={14} className={isRevoked ? 'text-red-500' : 'text-emerald-500'} />
                        <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wide">Secured by Certifix Protocol</span>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};


// Helper Icon
const Building2Icon = ({ size, className }: { size: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
        <path d="M10 18h4" />
    </svg>
);