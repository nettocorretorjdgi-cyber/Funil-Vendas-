import React, { useState } from 'react';
import {
  Mail,
  Send,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  Copy,
  Edit3,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Smartphone,
  Laptop,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NurtureMessage, Lead } from '../../types';

interface NurtureStageProps {
  messages: NurtureMessage[];
  onUpdateMessage: (updated: NurtureMessage) => void;
  leads: Lead[];
  onUpdateLead: (updated: Lead) => void;
  onAdvanceToOffer: () => void;
}

export const NurtureStage: React.FC<NurtureStageProps> = ({
  messages,
  onUpdateMessage,
  leads,
  onUpdateLead,
  onAdvanceToOffer,
}) => {
  const [activeMessageId, setActiveMessageId] = useState<number>(1);
  const [previewMode, setPreviewMode] = useState<'email' | 'whatsapp'>('email');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [copiedText, setCopiedText] = useState(false);
  const [simulatedSent, setSimulatedSent] = useState(false);

  // Editing state for active message
  const currentMessage = messages.find((m) => m.id === activeMessageId) || messages[0];
  const [editSubject, setEditSubject] = useState(currentMessage.subject);
  const [editEmailBody, setEditEmailBody] = useState(currentMessage.emailBody);
  const [editWhatsappBody, setEditWhatsappBody] = useState(currentMessage.whatsappBody);

  // Sync edit state when active message changes
  const handleSelectMessage = (id: number) => {
    setActiveMessageId(id);
    const msg = messages.find((m) => m.id === id) || messages[0];
    setEditSubject(msg.subject);
    setEditEmailBody(msg.emailBody);
    setEditWhatsappBody(msg.whatsappBody);
    setSimulatedSent(false);
  };

  const handleSaveMessage = () => {
    const updated: NurtureMessage = {
      ...currentMessage,
      subject: editSubject,
      emailBody: editEmailBody,
      whatsappBody: editWhatsappBody,
    };
    onUpdateMessage(updated);
    alert('Mensagem de nutrição salva com sucesso!');
  };

  // Find selected lead for dynamic preview
  const activeLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const leadName = activeLead ? activeLead.name.split(' ')[0] : 'Carlos';
  const leadMagnet = activeLead ? activeLead.leadMagnetTitle : 'Guia Prático de Funil';

  // Replace tags
  const renderPreviewText = (template: string) => {
    return template
      .replace(/{nome}/g, leadName)
      .replace(/{isca}/g, leadMagnet)
      .replace(/{isca_id}/g, 'download-gratis')
      .replace(/{empresa}/g, 'FunilPro');
  };

  const handleSendSimulated = () => {
    if (!activeLead) return;

    // Update lead progress
    const nextProgress = Math.max(activeLead.nutricaoProgress, activeMessageId);
    const shouldMoveToOffer = nextProgress === 3 && activeLead.stage === 'capturar';

    onUpdateLead({
      ...activeLead,
      nutricaoProgress: nextProgress,
      stage: shouldMoveToOffer ? 'nutrir' : activeLead.stage,
      lastInteractionAt: new Date().toISOString(),
      notes: `${activeLead.notes || ''} [Disparada Mensagem ${activeMessageId} em ${new Date().toLocaleDateString('pt-BR')}]`,
    });

    setSimulatedSent(true);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  const handleOpenWhatsApp = () => {
    if (!activeLead) return;
    const cleanPhone = activeLead.phone ? activeLead.phone.replace(/\D/g, '') : '';
    const text = renderPreviewText(currentMessage.whatsappBody);
    const url = cleanPhone
      ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(renderPreviewText(text));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Etapa 3 da Fórmula: Nutrir (3 Mensagens Estratégicas)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sequência Automatizada de Nutrição
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Transforme contatos frios em leads altamente conscientes e prontos para comprar com a sequência de 3 etapas:
              <br />
              <strong>1. Conteúdo que resolve parte do problema</strong> &bull;{' '}
              <strong>2. Mostre erros e oportunidades</strong> &bull;{' '}
              <strong>3. Apresente sua solução</strong>.
            </p>
          </div>

          <button
            onClick={onAdvanceToOffer}
            className="self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            Ir para Oferta Direta (Etapa 4) &rarr;
          </button>
        </div>
      </div>

      {/* Message Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {messages.map((msg) => {
          const isSelected = activeMessageId === msg.id;
          return (
            <div
              key={msg.id}
              onClick={() => handleSelectMessage(msg.id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-950/40'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  Mensagem {msg.id}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {msg.delayDays === 0 ? 'Envio Imediato' : `D+${msg.delayDays} dias`}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm mt-1">{msg.stepTitle}</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{msg.purpose}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-400/90 font-medium">
                <span>E-mail & WhatsApp</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Studio: Editor on Left, Live Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Editor da Mensagem {activeMessageId}
              </h2>
              <p className="text-xs text-slate-400">{currentMessage.stepTitle}</p>
            </div>
            <button
              onClick={handleSaveMessage}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Salvar Alterações
            </button>
          </div>

          {/* Email Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Assunto do E-mail (Taxa de Abertura):</span>
              <span className="text-[11px] text-slate-500 font-mono">Tags: {'{nome}'}, {'{isca}'}</span>
            </label>
            <input
              type="text"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Email Body */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Corpo do E-mail:
            </label>
            <textarea
              rows={8}
              value={editEmailBody}
              onChange={(e) => setEditEmailBody(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
            />
          </div>

          {/* WhatsApp Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              Versão Curta para WhatsApp:
            </label>
            <textarea
              rows={4}
              value={editWhatsappBody}
              onChange={(e) => setEditWhatsappBody(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Live Simulator & Lead Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Lead Selector for Personalization */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Personalizar Prévia com o Lead:
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.email}) - {l.nutricaoProgress}/3 mensagens
                </option>
              ))}
            </select>
          </div>

          {/* Device & Channel Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode('email')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    previewMode === 'email'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  E-mail
                </button>
                <button
                  onClick={() => setPreviewMode('whatsapp')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    previewMode === 'whatsapp'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
              </div>

              <button
                onClick={() =>
                  handleCopyText(
                    previewMode === 'email' ? editEmailBody : editWhatsappBody
                  )
                }
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedText ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copiar
                  </>
                )}
              </button>
            </div>

            {/* Simulated Email Client */}
            {previewMode === 'email' ? (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 text-xs space-y-3 font-sans">
                <div className="border-b border-slate-800 pb-2 text-[11px] text-slate-400 space-y-0.5">
                  <div><strong>De:</strong> Equipe FunilPro &lt;contato@funilpro.app&gt;</div>
                  <div><strong>Para:</strong> {activeLead?.name} &lt;{activeLead?.email}&gt;</div>
                  <div className="text-white font-semibold pt-1">
                    {renderPreviewText(editSubject)}
                  </div>
                </div>

                <div className="text-slate-300 whitespace-pre-line leading-relaxed text-xs">
                  {renderPreviewText(editEmailBody)}
                </div>
              </div>
            ) : (
              /* Simulated WhatsApp Chat */
              <div className="bg-[#0b141a] rounded-2xl border border-slate-800 p-4 text-xs font-sans">
                <div className="flex items-center gap-2 border-b border-emerald-900/30 pb-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    FP
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xs leading-none">FunilPro Consultoria</p>
                    <p className="text-[10px] text-emerald-400">online</p>
                  </div>
                </div>

                <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tl-sm text-xs whitespace-pre-line leading-relaxed max-w-[90%] shadow-md">
                  {renderPreviewText(editWhatsappBody)}
                  <div className="text-[9px] text-emerald-200 text-right mt-1">10:42 ✓✓</div>
                </div>
              </div>
            )}

            {/* Trigger Actions */}
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5">
              <button
                onClick={handleSendSimulated}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Registrar Envio para {leadName} ({activeMessageId}/3)
              </button>

              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Abrir Mensagem Direta no WhatsApp
                <ExternalLink className="w-3 h-3" />
              </button>

              {simulatedSent && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Envio da mensagem {activeMessageId} registrado com sucesso para {activeLead?.name}!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
