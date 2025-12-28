import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ShieldCheck, Mail, Lock, User, Building2, Phone, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        company_name: '',
        phone: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.register(formData);
            setLoading(false);
            // After registration, redirect to login or automatically log in
            navigate('/login', { state: { message: 'Kayıt başarılı! Giriş yapabilirsiniz.' } });
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
            <GlassCard className="max-w-md w-full p-8 shadow-2xl border-brand-blue/5">
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-brand-blue transition-colors mb-6 font-medium"
                >
                    <ArrowLeft size={16} />
                    Giriş Yap'a Dön
                </button>

                <div className="flex flex-col items-center mb-8">
                    <div className="mb-4">
                        <img src="/certifix-logo.png" alt="Certifix Logo" className="w-12 h-12 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-brand-blue">Kayıt Ol</h1>
                    <p className="text-zinc-500 text-sm mt-1 text-center font-medium">Hesabınızı oluşturun ve sertifikalarınızı yönetmeye başlayın</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                            <User size={16} className="text-zinc-400" />
                            Ad Soyad
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            required
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all"
                            placeholder="Zeynep Demir"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                            <Mail size={16} className="text-zinc-400" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all"
                            placeholder="zeynep@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                            <Building2 size={16} className="text-zinc-400" />
                            Firma Adı
                        </label>
                        <input
                            type="text"
                            name="company_name"
                            required
                            value={formData.company_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all"
                            placeholder="Certifix Ltd."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                            <Phone size={16} className="text-zinc-400" />
                            Telefon
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all"
                            placeholder="+90 5xx xxx xx xx"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                            <Lock size={16} className="text-zinc-400" />
                            Şifre
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-blue/20 hover:bg-zinc-900 transition-all flex items-center justify-center gap-2 disabled:opacity-80"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Kayıt Ol'}
                    </button>
                </form>
            </GlassCard>
        </div>
    );
};
