import React, { useState } from 'react';

import { GlassCard } from '../ui/GlassCard';
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const user = await api.login({ email, password });
            setLoading(false);

            if (user.role === 'admin' || user.role === 'SUPER_ADMIN') {
                navigate('/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
            <GlassCard className="max-w-md w-full p-8 shadow-2xl border-brand-blue/5">
                <div className="flex flex-col items-center mb-8">
                    <div className="mb-4">
                        <img src="/certifix-logo.png" alt="Certifix Logo" className="w-12 h-12 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-brand-blue">Certifix'e Giriş Yap</h1>
                    <p className="text-zinc-500 text-sm mt-1 text-center font-medium">Panelinize erişmek için bilgilerinizi girin</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                            <Mail size={16} className="text-zinc-400" />
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all"
                            placeholder="admin@certifix.ai"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                            <Lock size={16} className="text-zinc-400" />
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100 italic">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-blue/20 hover:bg-zinc-900 transition-all flex items-center justify-center gap-2 disabled:opacity-80"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Giriş Yap'}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-zinc-500">
                            Hesabınız yok mu?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="text-brand-blue font-bold hover:underline"
                            >
                                Hemen Kayıt Ol
                            </button>
                        </p>
                    </div>
                </form>

                <p className="text-xs text-zinc-400 mt-8 text-center">
                    &copy; 2026 Certifix Inc. All rights reserved.
                </p>
            </GlassCard>
        </div>
    );
};
