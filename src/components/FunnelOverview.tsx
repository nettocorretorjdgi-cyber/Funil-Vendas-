import React from 'react';
import {
  Users,
  Target,
  MailCheck,
  DollarSign,
  HeartHandshake,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Lead, FunnelStageType } from '../types';

interface FunnelOverviewProps {
  leads: Lead[];
  onSelectStage: (stage: string) => void;
  onOpenCaptureSimulator: () => void;
}

export const FunnelOverview: React.FC<FunnelOverviewProps> = ({
  leads,
  onSelectStage,
  onOpenCaptureSimulator,
}) => {
  // Compute stage statistics
  const countByStage: Record<FunnelStageType, number> = {
    atrair: 0,
    capturar: 0,
    nutrir: 0,
    ofertar: 0,
    fidelizar: 0,
  };

  let totalRevenue = 0;
  let npsSum = 0;
  let npsCount = 0;

  leads.forEach((l) => {
    countByStage[l.stage] = (countByStage[l.stage] || 0) + 1;
    if (l.orderValue) {
      totalRevenue += l.orderValue;
    }
    if (l.npsScore !== undefined) {
      npsSum += l.npsScore;
      npsCount++;
    }
  });

  const totalCaptured = leads.length;
  const customers = countByStage.fidelizar;
  const conversionRate = totalCaptured > 0 ? ((customers / totalCaptured) * 100).toFixed(1) : '0.0';
  const averageNps = npsCount > 0 ? (npsSum / npsCount).toFixed(1) : '9.5';

  const stagesList = [
    {
      id: 'atrair',
      stepNum: 1,
      name: 'Atrair',
      tagline: 'Tráfego & Isca Digital',
      desc: 'Instagram, Google ou Anúncios atraindo com isca gratuita',
      count: 'Multi-canais',
      color: 'from-pink-500 to-rose-500',
      borderColor: 'border-pink-500/30',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400',
    },
    {
      id: 'capturar',
      stepNum: 2,
      name: 'Capturar',
      tagline: 'Base de Contatos',
      desc: 'Formulário/Landing page convertendo visitantes em leads',
      count: `${countByStage.capturar} contatos`,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
    },
    {
      id: 'nutrir',
      stepNum: 3,
      name: 'Nutrir',
      tagline: '3 Mensagens Estratégicas',
      desc: '1. Resolve problema | 2. Erros & Oportunidades | 3. Solução',
      count: `${countByStage.nutrir} em nutrição`,
      color: 'from-amber-500 to-orange-500',
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400',
    },
    {
      id: 'ofertar',
      stepNum: 4,
      name: 'Ofertar',
      tagline: 'Oferta Direta & CTA',
      desc: 'Benefícios, prova/resultado e prazo ou condição limitada',
      count: `${countByStage.ofertar} negociando`,
      color: 'from-emerald-500 to-green-500',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
    },
    {
      id: 'fidelizar',
      stepNum: 5,
      name: 'Fidelizar',
      tagline: 'Pós-venda & LTV',
      desc: 'Acompanhamento pessoal, feedback/NPS e próximo passo',
      count: `${countByStage.fidelizar} clientes fiéis`,
      color: 'from-purple-500 to-indigo-500',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Fórmula Validada: Atrair &rarr; Capturar &rarr; Nutrir &rarr; Ofertar &rarr; Fidelizar
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Motor de Vendas Automatizado & Nutrição Estratégica
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Estrutura completa para transformar seguidores do Instagram, buscas do Google e tráfego pago de anúncios em compradores recorrentes e defensores da sua marca.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCaptureSimulator}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              Simulador de Captura de Lead (Teste ao Vivo)
            </button>
            <button
              onClick={() => onSelectStage('nutrir')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <MailCheck className="w-4 h-4 text-amber-400" />
              Ver as 3 Mensagens de Nutrição
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Leads Totais</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalCaptured}</div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">+100%</span> captados com isca digital
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Taxa de Conversão</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{conversionRate}%</div>
          <p className="text-[11px] text-slate-400 mt-1">Lead capturado &rarr; Cliente fiel</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Receita Gerada</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Oferta direta & upsells</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">NPS Médio Pós-Venda</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">{averageNps} / 10</div>
          <p className="text-[11px] text-slate-400 mt-1">Satisfação & Fidelização</p>
        </div>
      </div>

      {/* Interactive Visual 5-Stage Pipeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Pipeline Interativo do Funil (5 Etapas)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Clique em qualquer etapa para visualizar os recursos e editar as estratégias
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-full">
            Fluxo Contínuo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {stagesList.map((stage, idx) => (
            <div
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`group cursor-pointer rounded-2xl p-5 border ${stage.borderColor} ${stage.bgColor} hover:scale-[1.02] transition-all relative flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 ${stage.textColor} border border-slate-800`}>
                    Fase {stage.stepNum}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
                </div>
                <h3 className="font-bold text-white text-base tracking-tight">{stage.name}</h3>
                <p className={`text-xs font-semibold ${stage.textColor} mt-0.5`}>{stage.tagline}</p>
                <p className="text-[11px] text-slate-300/80 mt-2 leading-relaxed">{stage.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">Volume:</span>
                <span className="font-bold text-white">{stage.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads Activity Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Leads Recentes no Funil</h3>
          </div>
          <button
            onClick={() => onSelectStage('capturar')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Ver todos ({leads.length}) &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Contato / Lead</th>
                <th className="pb-3 font-semibold">Origem de Tráfego</th>
                <th className="pb-3 font-semibold">Isca Solicitada</th>
                <th className="pb-3 font-semibold">Fase Atual</th>
                <th className="pb-3 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-medium text-white">
                    <div>{lead.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{lead.email}</div>
                  </td>
                  <td className="py-3">
                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                      {lead.trafficSource === 'ads' ? 'Anúncios' : lead.trafficSource}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 max-w-[200px] truncate" title={lead.leadMagnetTitle}>
                    {lead.leadMagnetTitle}
                  </td>
                  <td className="py-3">
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {lead.stage}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectStage(lead.stage)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs"
                    >
                      Avançar &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
