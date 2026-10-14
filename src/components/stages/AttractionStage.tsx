import React, { useState } from 'react';
import {
  Instagram,
  Search,
  Megaphone,
  Gift,
  CheckCircle,
  Plus,
  Copy,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BookOpen,
  ListChecks,
  Video,
  FileSpreadsheet,
} from 'lucide-react';
import { TrafficSourceType, LeadMagnet } from '../../types';
import { TRAFFIC_SOURCES } from '../../lib/storage';

interface AttractionStageProps {
  selectedSource: TrafficSourceType;
  onSelectSource: (src: TrafficSourceType) => void;
  leadMagnets: LeadMagnet[];
  selectedMagnet: LeadMagnet;
  onSelectMagnet: (magnet: LeadMagnet) => void;
  onOpenPublicSimulator: () => void;
  onAddNewMagnet: (magnet: LeadMagnet) => void;
  onAdvanceToCapture: () => void;
}

export const AttractionStage: React.FC<AttractionStageProps> = ({
  selectedSource,
  onSelectSource,
  leadMagnets,
  selectedMagnet,
  onSelectMagnet,
  onOpenPublicSimulator,
  onAddNewMagnet,
  onAdvanceToCapture,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New magnet form states
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newFormat, setNewFormat] = useState('E-book em PDF');
  const [newValue, setNewValue] = useState('R$ 97,00');

  const currentSourceInfo = TRAFFIC_SOURCES.find((s) => s.id === selectedSource) || TRAFFIC_SOURCES[0];

  const getSourceIcon = (id: TrafficSourceType) => {
    switch (id) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-400" />;
      case 'google':
        return <Search className="w-5 h-5 text-blue-400" />;
      case 'ads':
        return <Megaphone className="w-5 h-5 text-amber-400" />;
    }
  };

  const getMagnetIcon = (type: string) => {
    switch (type) {
      case 'ebook':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'checklist':
        return <ListChecks className="w-4 h-4 text-cyan-400" />;
      case 'minicourse':
        return <Video className="w-4 h-4 text-purple-400" />;
      default:
        return <FileSpreadsheet className="w-4 h-4 text-amber-400" />;
    }
  };

  const trackingUrl = `https://funilpro.app/captura/${selectedMagnet.id}?utm_source=${selectedSource}&utm_medium=funnel&utm_campaign=isca_gratuita`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateMagnet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const created: LeadMagnet = {
      id: `magnet-${Date.now()}`,
      type: 'ebook',
      title: newTitle,
      tagline: newTagline || 'Material exclusivo e gratuito para acelerar seus resultados.',
      description: 'Guia completo focado em resolver a dor imediata do seu cliente potencial.',
      format: newFormat,
      estimatedValue: newValue,
      downloadCount: 0,
    };

    onAddNewMagnet(created);
    onSelectMagnet(created);
    setShowCreateModal(false);
    setNewTitle('');
    setNewTagline('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Etapa 1 da Fórmula: Atrair
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Fonte de Tráfego & Isca Digital Gratuita
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              O objetivo desta etapa é atrair visitantes qualificados através do Instagram, Google ou Anúncios e oferecer uma isca digital gratuita de alto valor percebido para captar nome, e-mail e WhatsApp.
            </p>
          </div>

          <button
            onClick={onAdvanceToCapture}
            className="self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            Ver Leads Capturados &rarr;
          </button>
        </div>
      </div>

      {/* Part 1: Escolha da Fonte de Tráfego */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center font-bold">1</span>
          Escolha sua Fonte Principal de Tráfego
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Selecione o canal onde seu público ideal está concentrado para ativar a estratégia correspondente:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRAFFIC_SOURCES.map((source) => {
            const isSelected = selectedSource === source.id;
            return (
              <div
                key={source.id}
                onClick={() => onSelectSource(source.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
                  isSelected
                    ? 'bg-slate-800/90 border-pink-500 ring-2 ring-pink-500/30 shadow-lg shadow-pink-950/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {getSourceIcon(source.id)}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {source.badge}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base">{source.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{source.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Canais de Ativação:</span>
                  <div className="flex flex-wrap gap-1">
                    {source.channels.map((ch, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected traffic playbook tips */}
        <div className="mt-6 p-4 rounded-2xl bg-pink-950/20 border border-pink-900/30">
          <h4 className="text-xs font-bold text-pink-300 flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Estratégia Recomendada para {currentSourceInfo.name}:
          </h4>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
            {currentSourceInfo.tips.map((tip, idx) => (
              <li key={idx} className="leading-relaxed">{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Part 2: Isca Digital Gratuita */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              Defina a Isca Digital Gratuita para Captação
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              A isca digital é o ímã irresistível que faz o visitante fornecer os dados de contato espontaneamente.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            Criar Nova Isca Digital
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leadMagnets.map((magnet) => {
            const isSelected = selectedMagnet.id === magnet.id;
            return (
              <div
                key={magnet.id}
                onClick={() => onSelectMagnet(magnet)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                      {getMagnetIcon(magnet.type)}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {magnet.format}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm leading-snug">{magnet.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{magnet.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400 text-[11px]">
                    Valor: <span className="line-through">{magnet.estimatedValue}</span> &rarr; <span className="text-emerald-400 font-bold">GRÁTIS</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">
                    {magnet.downloadCount} downloads
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tracking Link & Live Simulator CTA */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Link de Divulgação da Isca no {currentSourceInfo.name}:
            </span>
            <div className="font-mono text-xs text-indigo-300 truncate max-w-xl">
              {trackingUrl}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedLink ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Link
                </>
              )}
            </button>

            <button
              onClick={onOpenPublicSimulator}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Testar Captação ao Vivo
            </button>
          </div>
        </div>
      </div>

      {/* Modal for creating custom Lead Magnet */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-400" />
              Cadastrar Nova Isca Digital
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Crie uma isca personalizada para o seu nicho específico.
            </p>

            <form onSubmit={handleCreateMagnet} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título da Isca</label>
                <input
                  type="text"
                  placeholder="Ex: Planilha de Gestão Financeira para Negócios"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subtítulo / Promessa de Transformação</label>
                <input
                  type="text"
                  placeholder="Ex: Descubra como economizar até 30% em custos fixos em 7 dias."
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Formato</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="E-book em PDF">E-book em PDF</option>
                    <option value="Checklist Interativo">Checklist Interativo</option>
                    <option value="Vídeo-Aula Exclusiva">Vídeo-Aula Exclusiva</option>
                    <option value="Planilha Google Sheets">Planilha Google Sheets</option>
                    <option value="Sessão de Diagnóstico">Sessão de Diagnóstico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Valor Estimado</label>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-xl"
                >
                  Salvar Isca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
