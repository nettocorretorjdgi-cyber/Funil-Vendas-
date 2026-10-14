import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Star,
  Zap,
  ArrowRight,
  TrendingUp,
  ShoppingCart,
  Timer,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DirectOffer, Lead } from '../../types';

interface ConversionStageProps {
  offer: DirectOffer;
  onUpdateOffer: (offer: DirectOffer) => void;
  leads: Lead[];
  onUpdateLead: (updated: Lead) => void;
  onAdvanceToPostSale: () => void;
}

export const ConversionStage: React.FC<ConversionStageProps> = ({
  offer,
  onUpdateOffer,
  leads,
  onUpdateLead,
  onAdvanceToPostSale,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    leads.find((l) => l.stage === 'ofertar' || l.stage === 'nutrir')?.id || leads[0]?.id || ''
  );
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const handleSimulateConversion = () => {
    if (!activeLead) return;

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    onUpdateLead({
      ...activeLead,
      stage: 'fidelizar',
      purchasedOfferId: offer.id,
      orderValue: offer.specialPrice,
      lastInteractionAt: new Date().toISOString(),
      notes: `${activeLead.notes || ''} [CONVERTIDO EM VENDA: R$ ${offer.specialPrice.toFixed(2)}]`,
    });

    setPurchaseSuccess(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Etapa 4 da Fórmula: Ofertar (Conversão Direta)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Oferta Direta com Prova & Urgência
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Aqui a mágica da conversão acontece: destaque os <strong>benefícios tangíveis</strong>, apresente{' '}
              <strong>resultados e prova social</strong> de quem já chegou lá, estabeleça uma{' '}
              <strong>condição ou prazo limitado</strong> e apresente um <strong>CTA claro e irresistível</strong>.
            </p>
          </div>

          <button
            onClick={onAdvanceToPostSale}
            className="self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            Ir para Pós-Venda (Etapa 5) &rarr;
          </button>
        </div>
      </div>

      {/* Scarcity Banner (Prazo ou Condição Limitada) */}
      <div className="bg-gradient-to-r from-rose-950/80 via-amber-950/60 to-rose-950/80 border border-rose-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Timer className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Condição Limitada / Escassez Ativa
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                50% OFF
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-0.5">
              {offer.scarcityValue}
            </p>
          </div>
        </div>

        {/* Real-time countdown boxes */}
        <div className="flex items-center gap-2 font-mono text-center">
          <div className="bg-slate-950/90 border border-rose-900/60 rounded-xl px-3 py-1.5">
            <div className="text-lg font-extrabold text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[9px] text-slate-400 uppercase">Horas</div>
          </div>
          <span className="text-rose-400 font-bold">:</span>
          <div className="bg-slate-950/90 border border-rose-900/60 rounded-xl px-3 py-1.5">
            <div className="text-lg font-extrabold text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[9px] text-slate-400 uppercase">Minutos</div>
          </div>
          <span className="text-rose-400 font-bold">:</span>
          <div className="bg-slate-950/90 border border-rose-900/60 rounded-xl px-3 py-1.5">
            <div className="text-lg font-extrabold text-emerald-400">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[9px] text-slate-400 uppercase">Segundos</div>
          </div>
        </div>
      </div>

      {/* Offer Direct Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Offer Card (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              Proposta de Valor Irrecusável
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {offer.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {offer.subtitle}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">
                Preço normal sem condição: <span className="line-through">R$ {offer.regularPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  R$ {offer.specialPrice.toFixed(2)}
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  à vista ou em até 12x
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full">
                Economia de R$ {(offer.regularPrice - offer.specialPrice).toFixed(2)}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">{offer.ctaSubtext}</p>
            </div>
          </div>

          {/* Pillar 1: Destaque de Benefícios */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              O Que Você Recebe (Benefícios & Entregáveis):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {offer.benefits.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{b.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pillar 2: Prova Social & Resultados Comprovados */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Resultados Comprovados de Quem Já Fez:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {offer.socialProofs.map((sp) => (
                <div
                  key={sp.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={sp.avatar}
                        alt={sp.author}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">{sp.author}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{sp.role}</div>
                      </div>
                    </div>

                    <div className="text-emerald-400 font-extrabold text-xs bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md inline-block">
                      {sp.result}
                    </div>

                    <p className="text-[11px] text-slate-300 italic leading-relaxed">
                      "{sp.quote}"
                    </p>
                  </div>

                  <div className="flex text-amber-400 text-xs mt-3 pt-2 border-t border-slate-800/60">
                    {Array.from({ length: sp.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white">Garantia Incondicional de {offer.guaranteeDays} Dias:</strong> Se por qualquer motivo você não amar os resultados do método, basta um único e-mail para receber 100% do seu dinheiro de volta. Risco zero para você.
            </div>
          </div>
        </div>

        {/* Conversion Simulator (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              Simulador de Fechamento de Venda
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Converta qualquer lead que passou pela nutrição em cliente pagante. O valor será adicionado ao faturamento e o lead avançará para o pós-venda.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Selecionar Lead Qualificado:
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => {
                  setSelectedLeadId(e.target.value);
                  setPurchaseSuccess(false);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} - Fase: {l.stage} ({l.nutricaoProgress}/3 mensagens)
                  </option>
                ))}
              </select>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleSimulateConversion}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <DollarSign className="w-5 h-5" />
                <span>{offer.ctaText}</span>
              </button>
            </div>

            {purchaseSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Venda Concretizada com Sucesso! 🚀
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-200">
                  {activeLead?.name} adquiriu o <strong>{offer.title}</strong> por{' '}
                  <strong>R$ {offer.specialPrice.toFixed(2)}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onAdvanceToPostSale}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Iniciar Acompanhamento Pós-Venda &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
