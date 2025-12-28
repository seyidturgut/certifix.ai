import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Globe,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Layout,
  FileText,
  MousePointer2,
  Smartphone
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-brand-blue selection:text-white">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/certifix-logo.png" alt="Certifix Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight text-brand-blue">Certifix</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm font-medium text-zinc-500 hover:text-brand-blue transition-colors">Özellikler</button>
            <button className="text-sm font-medium text-zinc-500 hover:text-brand-blue transition-colors">Nasıl Çalışır?</button>
            <button className="text-sm font-medium text-zinc-500 hover:text-brand-blue transition-colors">Fiyatlandırma</button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-zinc-600 hover:text-brand-blue transition-colors px-4 py-2"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 bg-brand-blue text-white text-sm font-semibold rounded-lg hover:bg-brand-teal transition-all shadow-md shadow-brand-blue/10 active:scale-95"
            >
              Hemen Başla
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Modern Background Accents */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-teal/10 rounded-full blur-[80px] -z-10" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-[60px] -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeIn} className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/5 border border-brand-teal/10 text-[11px] font-bold text-brand-teal uppercase tracking-wider">
                <Zap size={12} fill="currentColor" />
                DİJİTAL SERTİFİKASYON v2.0
              </span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-blue leading-[1.1]"
            >
              Güvenle Sertifika <br />
              <span className="bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent">Oluşturun ve Doğrulayın</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Eğitim ve etkinlikleriniz için kopyalanamaz, anında doğrulanabilir ve modern dijital belgeler üretin.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-blue text-white rounded-xl font-bold text-base hover:bg-zinc-900 transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
              >
                Hizmete Başla
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/verify')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white border border-zinc-200 text-brand-blue rounded-xl font-bold text-base hover:border-brand-teal transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={20} className="text-brand-teal" />
                Sertifika Doğrula
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Compact Feature Grid */}
      <section className="py-16 px-6 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-blue/5 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                <Layout size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Kolay Tasarım</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Sürükle bırak editörümüzle dakikalar içinde profesyonel sertifikalar hazırlayın.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-teal/5 text-brand-teal rounded-xl flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Toplu Üretim</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Tek bir tıklama ile binlerce katılımcı için özel verilerle sertifika oluşturun.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-gold/5 text-brand-gold rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Tam Güvenlik</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Kriptografik altyapımız ile belgelerinizin gerçekliği her an doğrulanabilir.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Content Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-brand-blue leading-tight">Sertifikalarınız her yerde <span className="text-brand-teal underline decoration-brand-teal/30 underline-offset-4">güvende.</span></h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                  <CheckCircle2 size={12} />
                </div>
                <p className="text-zinc-600 text-sm font-medium">QR Kod ile saniyeler içinde anlık doğrulama.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                  <CheckCircle2 size={12} />
                </div>
                <p className="text-zinc-600 text-sm font-medium">Linkedin ve sosyal medya ağlarında tek tıkla paylaşım.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                  <CheckCircle2 size={12} />
                </div>
                <p className="text-zinc-600 text-sm font-medium">Belge geçmişi ve revizyon takibi.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full flex justify-center">
            <div className="relative group basis-full lg:basis-2/3">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-teal/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
              <div className="relative p-6 bg-white border border-zinc-100 rounded-3xl shadow-xl">
                <img src="/certifix-logo.png" alt="Branding" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <div className="h-4 w-3/4 bg-zinc-100 rounded-full mx-auto mb-2" />
                <div className="h-4 w-1/2 bg-zinc-50 rounded-full mx-auto mb-6" />
                <div className="h-32 w-full bg-brand-blue/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-brand-blue/10">
                  <ShieldCheck size={48} className="text-brand-blue/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified CTA */}
      <section className="py-20 px-6 bg-brand-blue relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-10">
          <Globe size={300} strokeWidth={0.5} className="text-white" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Geleceği sertifikalandırmaya bugün başlayın.</h2>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-brand-gold text-brand-blue rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-black/20"
          >
            Hemen Ücretsiz Dene
          </button>
          <div className="flex justify-center gap-8 text-white/50 text-xs font-bold uppercase tracking-widest">
            <span>Kredi Kartı Gerekmez</span>
            <span>İstediğin Zaman İptal Et</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/certifix-logo.png" alt="Logo" className="w-5 h-5 opacity-70" />
            <span className="font-bold text-zinc-900">Certifix</span>
          </div>
          <div className="text-sm text-zinc-400 font-medium">
            © {new Date().getFullYear()} Certifix Inc. Tüm hakları saklıdır.
          </div>
          <div className="flex gap-6 text-zinc-400 text-sm font-medium">
            <button className="hover:text-brand-blue transition-colors">Gizlilik</button>
            <button className="hover:text-brand-blue transition-colors">Şartlar</button>
            <button className="hover:text-brand-blue transition-colors">Destek</button>
          </div>
        </div>
      </footer>
    </div>
  );
};