import React, { useState } from 'react';
import {
  HeartHandshake,
  MessageSquare,
  Star,
  Sparkles,
  CheckCircle2,
  Gift,
  ArrowUpRight,
  Send,
  ExternalLink,
  Phone,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lead, LoyaltyStep } from '../../types';

interface PostSaleStageProps {
  leads: Lead[];
  onUpdateLead: (updated: Lead) => void;
  loyaltySteps: LoyaltyStep[];
  onUpdateLoyaltySteps: (steps: LoyaltyStep[]) => void;
}

export const PostSaleStage: React.FC<PostSaleStageProps> = ({
  leads,
  onUpdateLead,
  loyaltySteps,
  onUpdateLoyaltySteps,
}) => {
  // Filter leads in post-sale stage (fidelizar) or converted
  const customerLeads = leads.filter((l) => l.stage === 'fidelizar' || l.orderValue);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customerLeads[0]?.id || leads[0]?.id || ''
  );

  const activeCustomer = leads.find((l) => l.id === selectedCustomerId) || customerLeads[0] || leads[0];

  // Feedback form state
  const [npsScore, setNpsScore] = useState<number>(activeCustomer?.npsScore || 10);
  const [feedbackText, setFeedbackText] = useState<string>(activeCustomer?.feedbackText || '');
  const [feedbackSaved, setFeedbackSaved] = useState<boolean>(false);

  // Sync state when active customer changes
  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    const found = leads.find((l) => l.id === id);
    if (found) {
      setNpsScore(found.npsScore || 10);
      setFeedbackText(found.feedbackText || '');
    }
    setFeedbackSaved(false);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) return;

    onUpdateLead({
      ...activeCustomer,
      npsScore,
      feedbackText,
      lastInteractionAt: new Date().toISOString(),
      notes: `${activeCustomer.notes || ''} [NPS Registrado: ${npsScore}/10]`,
    });

    setFeedbackSaved(true);
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  const customerName = activeCustomer ? activeCustomer.name.split(' ')[0] : 'Cliente';
  const cleanPhone = activeCustomer?.phone ? activeCustomer.phone.replace(/\D/g, '') : '';

  const onboardingWaText = `Olá, ${customerName}! Tudo bem? 🎉
Aqui é o seu gestor de sucesso no FunilPro.

Passando para te dar as boas-vindas oficiais e confirmar que seu acesso ao programa já está 100% ativo!

👉 Link de Acesso à Área de Membros: https://funilpro.app/dashboard
👤 Seu login: ${activeCustomer?.email}

Se você precisar de qualquer suporte, basta me chamar aqui neste WhatsApp a qualquer momento. Parabéns pela decisão!`;

  const waLink = cleanPhone
    ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(onboardingWaText)}`
    : `https://wa.me/?text=${encodeURIComponent(onboardingWaText)}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Etapa 5 da Fórmula: Fidelizar (Pós-Venda & LTV)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Acompanhamento Personalizado & Fidelização
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              O fechamento não é o fim, é o começo: faça um <strong>acompanhamento personalizado</strong> no WhatsApp,{' '}
              <strong>peça feedback com NPS</strong> e apresente o <strong>próximo passo</strong> (upsell, programa de indicação ou comunidade VIP) para maximizar o LTV.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-xl text-xs font-bold font-mono">
              {customerLeads.length} Clientes Ativos
            </span>
          </div>
        </div>
      </div>

      {/* Customer Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Selecione o Cliente para Gerenciar o Pós-Venda:
          </label>
          <p className="text-xs text-slate-400">
            Acompanhe cada cliente de forma individual e personalizada
          </p>
        </div>
        <select
          value={selectedCustomerId}
          onChange={(e) => handleSelectCustomer(e.target.value)}
          className="px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 max-w-md font-semibold"
        >
          {leads.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.email}) - {l.orderValue ? `Comprou (R$ ${l.orderValue.toFixed(2)})` : `Fase: ${l.stage}`}
            </option>
          ))}
        </select>
      </div>

      {/* 3 Pillars of Post-Sale Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Acompanhamento Personalizado */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Pilar 1 do Pós-Venda
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Acompanhamento Personalizado
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Mensagem individual de boas-vindas e suporte humanizado via WhatsApp para garantir uma primeira impressão inesquecível.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
              {onboardingWaText}
            </div>
          </div>

          <div className="pt-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40"
            >
              <Phone className="w-4 h-4" />
              Enviar Boas-Vindas no WhatsApp
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Pillar 2: Pedido de Feedback & NPS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Pilar 2 do Pós-Venda
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Pedido de Feedback & NPS
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Avalie o nível de satisfação (0 a 10) e colete depoimentos que servirão de prova social para novos clientes.
            </p>

            <form onSubmit={handleSaveFeedback} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Nota de Satisfação (NPS):</span>
                  <span className="text-amber-400 font-bold">{npsScore} / 10</span>
                </label>
                <div className="flex items-center gap-1 justify-between">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNpsScore(i)}
                      className={`w-7 h-8 rounded-lg text-xs font-bold transition-all ${
                        npsScore === i
                          ? 'bg-amber-400 text-slate-950 scale-105 shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Depoimento do Cliente:
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: O método é direto ao ponto e o atendimento no WhatsApp resolveu minha dúvida na hora..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Registrar Feedback do Cliente
              </button>

              {feedbackSaved && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Feedback e NPS salvos com sucesso!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Pillar 3: Próximo Passo para Fidelização */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Pilar 3 do Pós-Venda
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Próximo Passo & Fidelização
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Mantenha o cliente engajado com opções de esteira: Upsell para mentoria, indicação premiada e comunidade VIP.
            </p>

            <div className="mt-4 space-y-3">
              {loyaltySteps.map((step) => (
                <div
                  key={step.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{step.title}</span>
                    <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-md">
                      {step.rewardOrValue}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                alert(`Oferta do Próximo Passo enviada para ${customerName}!`);
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-900/40"
            >
              <span>Apresentar Próximo Passo para {customerName}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
