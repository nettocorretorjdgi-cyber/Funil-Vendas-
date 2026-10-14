import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Download, ArrowRight, ShieldCheck, Instagram, Search, Megaphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LeadMagnet, TrafficSourceType } from '../types';

interface PublicCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadMagnet: LeadMagnet;
  trafficSource: TrafficSourceType;
  onLeadCaptured: (leadData: {
    name: string;
    email: string;
    phone: string;
    trafficSource: TrafficSourceType;
    leadMagnetId: string;
    leadMagnetTitle: string;
  }) => void;
}

export const PublicCaptureModal: React.FC<PublicCaptureModalProps> = ({
  isOpen,
  onClose,
  leadMagnet,
  trafficSource,
  onLeadCaptured,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    onLeadCaptured({
      name,
      email,
      phone: phone || '(11) 98765-4321',
      trafficSource,
      leadMagnetId: leadMagnet.id,
      leadMagnetTitle: leadMagnet.title,
    });

    setSubmitted(true);
  };

  const getSourceIcon = () => {
    switch (trafficSource) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-400" />;
      case 'google':
        return <Search className="w-3.5 h-3.5 text-blue-400" />;
      case 'ads':
        return <Megaphone className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getSourceLabel = () => {
    switch (trafficSource) {
      case 'instagram':
        return 'Origem: Instagram (Reels & Stories)';
      case 'google':
        return 'Origem: Busca Orgânica / Google Ads';
      case 'ads':
        return 'Origem: Anúncio Pago (Meta / TikTok Ads)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 z-10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Source banner */}
        <div className="bg-slate-950 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            {getSourceIcon()}
            <span className="font-semibold">{getSourceLabel()}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
            Simulador de Landing Page Pública
          </span>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Parabéns, {name.split(' ')[0]}! 🎉</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Seu acesso ao <strong>"{leadMagnet.title}"</strong> foi liberado com sucesso e enviado para o e-mail:
              <br />
              <span className="text-indigo-400 font-mono text-xs">{email}</span>
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-2 mt-4 text-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <Sparkles className="w-4 h-4" />
                O que acontece agora no FunilPro?
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px] list-disc pl-4">
                <li>O lead foi registrado na etapa <strong>2. Captura</strong>.</li>
                <li>A <strong>Mensagem 1 de Nutrição</strong> (Resolução de problema) já está pronta para envio.</li>
                <li>Você pode acompanhar a pontuação e avançar o lead para a Oferta Direta.</li>
              </ul>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                Voltar ao Painel do Funil
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            {/* Header info */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Acesso Gratuito e Imediato ({leadMagnet.format})
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                {leadMagnet.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                {leadMagnet.tagline}
              </p>
            </div>

            {/* Value Highlights */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 mb-6 space-y-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Conteúdo 100% aplicável e testado em campo de batalha.</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Valor estimado de mercado: <strong className="text-white line-through text-slate-500">{leadMagnet.estimatedValue}</strong> &rarr; <span className="text-emerald-400 font-bold">GRÁTIS HOJE</span>.</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Download imediato no seu e-mail e WhatsApp.</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Qual o seu nome?</label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Oliveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Seu melhor e-mail (para receber o material):</label>
                <input
                  type="email"
                  placeholder="carlos@exemplo.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp com DDD (para suporte e envio rápido):</label>
                <input
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                Baixar Material Gratuito Agora
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Seus dados estão seguros. Não enviamos spam.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
