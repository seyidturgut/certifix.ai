import React from 'react';
import { motion } from 'framer-motion';
import { Award, FileCheck, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { PageTransition } from '../components/ui/PageTransition';

export const CustomerDashboard = () => {
    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Hoş Geldiniz</h1>
                    <p className="text-zinc-500 mt-1">Sertifikalarınızı buradan görüntüleyebilir ve indirebilirsiniz.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="p-6">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <Award size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">Aktif Sertifikalar</h3>
                        <p className="text-3xl font-bold text-zinc-900 mt-2">1</p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                            <FileCheck size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">Doğrulanmış</h3>
                        <p className="text-3xl font-bold text-zinc-900 mt-2">12</p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="w-12 h-12 rounded-xl bg-zinc-50 text-zinc-600 flex items-center justify-center mb-4">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">Güvenlik Durumu</h3>
                        <p className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            %100 Güvenli
                        </p>
                    </GlassCard>
                </div>

                <GlassCard className="p-8 text-center bg-zinc-50/50 border-dashed">
                    <p className="text-zinc-500">Sertifika listeniz yükleniyor veya henüz sertifikanız bulunmuyor.</p>
                </GlassCard>
            </div>
        </PageTransition>
    );
};
