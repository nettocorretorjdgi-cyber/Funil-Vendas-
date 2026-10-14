import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Filter,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Lead, TrafficSourceType, FunnelStageType } from '../../types';

interface CaptureStageProps {
  leads: Lead[];
  onUpdateLead: (updated: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onAddManualLead: (newLead: Lead) => void;
  onAdvanceToNurture: () => void;
  onOpenCaptureSimulator: () => void;
}

export const CaptureStage: React.FC<CaptureStageProps> = ({
  leads,
  onUpdateLead,
  onDeleteLead,
  onAddManualLead,
  onAdvanceToNurture,
  onOpenCaptureSimulator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | TrafficSourceType>('all');
  const [stageFilter, setStageFilter] = useState<'all' | FunnelStageType>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [trafficSource, setTrafficSource] = useState<TrafficSourceType>('instagram');
  const [notes, setNotes] = useState('');

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.phone && l.phone.includes(searchTerm));

    const matchesSource = sourceFilter === 'all' || l.trafficSource === sourceFilter;
    const matchesStage = stageFilter === 'all' || l.stage === stageFilter;

    return matchesSearch && matchesSource && matchesStage;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Origem', 'Isca', 'Fase', 'Data'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      l.email,
      l.phone || '',
      l.trafficSource,
      `"${l.leadMagnetTitle}"`,
      l.stage,
      l.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_funilpro_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdvanceStage = (lead: Lead) => {
    const stageOrder: FunnelStageType[] = ['capturar', 'nutrir', 'ofertar', 'fidelizar'];
    const currentIndex = stageOrder.indexOf(lead.stage);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      onUpdateLead({
        ...lead,
        stage: nextStage,
        lastInteractionAt: new Date().toISOString(),
      });
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      email,
      phone: phone || '(11) 99999-0000',
      trafficSource,
      leadMagnetId: 'manual',
      leadMagnetTitle: 'Cadastro Manual no Painel',
      stage: 'capturar',
      notes: notes || 'Inserido manualmente pelo operador',
      createdAt: new Date().toISOString(),
      lastInteractionAt: new Date().toISOString(),
      nutricaoProgress: 0,
    };

    onAddManualLead(newLead);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Etapa 2 da Fórmula: Capturar
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Base de Contatos Capturados & Pipeline de Leads
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Aqui estão reunidos todos os contatos que baixaram sua isca digital gratuita. Você pode monitorar o engajamento, enviar mensagens no WhatsApp e avançar os leads para a esteira de nutrição.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenCaptureSimulator}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
            >
              Simulador de Captura
            </button>
            <button
              onClick={onAdvanceToNurture}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              Ir para Nutrição (3 E-mails) &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Origem:</span>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">Todas as origens</option>
                <option value="instagram">Instagram</option>
                <option value="google">Google</option>
                <option value="ads">Anúncios</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Etapa:</span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">Todas as fases</option>
                <option value="capturar">Captura</option>
                <option value="nutrir">Nutrição</option>
                <option value="ofertar">Oferta Direta</option>
                <option value="fidelizar">Fidelização</option>
              </select>
            </div>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Contato
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Nome & Contato</th>
                <th className="pb-3 font-semibold">Origem do Tráfego</th>
                <th className="pb-3 font-semibold">Isca Baixada</th>
                <th className="pb-3 font-semibold">Progresso Nutrição</th>
                <th className="pb-3 font-semibold">Fase Atual</th>
                <th className="pb-3 font-semibold text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Nenhum contato encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const cleanPhone = lead.phone ? lead.phone.replace(/\D/g, '') : '';
                  const waLink = cleanPhone ? `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(lead.name.split(' ')[0])}%2C%20tudo%20bem%3F%20Vi%20que%20voc%C3%AA%20baixou%20o%20material%20${encodeURIComponent(lead.leadMagnetTitle)}!` : '#';

                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 font-medium text-white">
                        <div className="font-semibold text-slate-100">{lead.name}</div>
                        <div className="flex items-center gap-2 mt-0.5 text-slate-400 font-mono text-[11px]">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {lead.email}
                          </span>
                          {lead.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              {lead.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5">
                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {lead.trafficSource === 'ads' ? 'Anúncios Pagos' : lead.trafficSource}
                        </span>
                      </td>

                      <td className="py-3.5 text-slate-300 max-w-[200px] truncate" title={lead.leadMagnetTitle}>
                        {lead.leadMagnetTitle}
                      </td>

                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono text-amber-400 font-semibold">
                            {lead.nutricaoProgress}/3
                          </span>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${(lead.nutricaoProgress / 3) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {lead.stage}
                        </span>
                      </td>

                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {cleanPhone && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-emerald-400 hover:text-white hover:bg-emerald-600/20 rounded-lg transition-colors"
                              title="Abrir conversa no WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => handleAdvanceStage(lead)}
                            className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                            title="Avançar para a próxima etapa do funil"
                          >
                            <span>Avançar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => onDeleteLead(lead.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                            title="Excluir contato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              Adicionar Contato Manualmente
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Insira os dados do lead capturado externamente para incluir no funil.
            </p>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Ana Paula Ribeiro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">E-mail</label>
                <input
                  type="email"
                  placeholder="ana.paula@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  placeholder="(11) 98877-6655"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Origem do Tráfego</label>
                <select
                  value={trafficSource}
                  onChange={(e) => setTrafficSource(e.target.value as TrafficSourceType)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="instagram">Instagram</option>
                  <option value="google">Google</option>
                  <option value="ads">Anúncios Pagos</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notas / Observações</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Veio por indicação, tem interesse na mentoria..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl"
                >
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
