import React, { useState } from 'react';
import { AuthProvider } from './lib/authContext';
import { Navbar } from './components/Navbar';
import { FunnelOverview } from './components/FunnelOverview';
import { AttractionStage } from './components/stages/AttractionStage';
import { CaptureStage } from './components/stages/CaptureStage';
import { NurtureStage } from './components/stages/NurtureStage';
import { ConversionStage } from './components/stages/ConversionStage';
import { PostSaleStage } from './components/stages/PostSaleStage';
import { SupabaseModal } from './components/SupabaseModal';
import { AuthModal } from './components/AuthModal';
import { PublicCaptureModal } from './components/PublicCaptureModal';
import {
  loadLeads,
  saveLeads,
  loadLeadMagnets,
  saveLeadMagnets,
  loadNurtureMessages,
  saveNurtureMessages,
  loadOffer,
  saveOffer,
  loadLoyaltySteps,
  saveLoyaltySteps,
} from './lib/storage';
import {
  Lead,
  LeadMagnet,
  NurtureMessage,
  DirectOffer,
  LoyaltyStep,
  TrafficSourceType,
} from './types';

function FunnelAppContent() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [leads, setLeads] = useState<Lead[]>(() => loadLeads());
  const [selectedSource, setSelectedSource] = useState<TrafficSourceType>('instagram');
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>(() => loadLeadMagnets());
  const [selectedMagnet, setSelectedMagnet] = useState<LeadMagnet>(() => leadMagnets[0]);
  const [messages, setMessages] = useState<NurtureMessage[]>(() => loadNurtureMessages());
  const [offer, setOffer] = useState<DirectOffer>(() => loadOffer());
  const [loyaltySteps, setLoyaltySteps] = useState<LoyaltyStep[]>(() => loadLoyaltySteps());

  // Modals state
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPublicCaptureModalOpen, setIsPublicCaptureModalOpen] = useState(false);

  // Update handlers
  const handleUpdateLead = (updated: Lead) => {
    const nextLeads = leads.map((l) => (l.id === updated.id ? updated : l));
    setLeads(nextLeads);
    saveLeads(nextLeads);
  };

  const handleDeleteLead = (id: string) => {
    const nextLeads = leads.filter((l) => l.id !== id);
    setLeads(nextLeads);
    saveLeads(nextLeads);
  };

  const handleAddLead = (newLead: Lead) => {
    const nextLeads = [newLead, ...leads];
    setLeads(nextLeads);
    saveLeads(nextLeads);
  };

  const handleLeadCapturedFromSimulator = (data: {
    name: string;
    email: string;
    phone: string;
    trafficSource: TrafficSourceType;
    leadMagnetId: string;
    leadMagnetTitle: string;
  }) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      trafficSource: data.trafficSource,
      leadMagnetId: data.leadMagnetId,
      leadMagnetTitle: data.leadMagnetTitle,
      stage: 'capturar',
      notes: `Capturado via simulador de landing page (${data.trafficSource})`,
      createdAt: new Date().toISOString(),
      lastInteractionAt: new Date().toISOString(),
      nutricaoProgress: 0,
    };
    handleAddLead(newLead);
  };

  const handleAddNewMagnet = (magnet: LeadMagnet) => {
    const nextMagnets = [...leadMagnets, magnet];
    setLeadMagnets(nextMagnets);
    saveLeadMagnets(nextMagnets);
  };

  const handleUpdateMessage = (updated: NurtureMessage) => {
    const nextMessages = messages.map((m) => (m.id === updated.id ? updated : m));
    setMessages(nextMessages);
    saveNurtureMessages(nextMessages);
  };

  const handleUpdateOffer = (newOffer: DirectOffer) => {
    setOffer(newOffer);
    saveOffer(newOffer);
  };

  const handleUpdateLoyaltySteps = (steps: LoyaltyStep[]) => {
    setLoyaltySteps(steps);
    saveLoyaltySteps(steps);
  };

  const handleDataReset = () => {
    setLeads(loadLeads());
    setLeadMagnets(loadLeadMagnets());
    setMessages(loadNurtureMessages());
    setOffer(loadOffer());
    setLoyaltySteps(loadLoyaltySteps());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onDataReset={handleDataReset}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <FunnelOverview
            leads={leads}
            onSelectStage={(stage) => setActiveTab(stage)}
            onOpenCaptureSimulator={() => setIsPublicCaptureModalOpen(true)}
          />
        )}

        {activeTab === 'atrair' && (
          <AttractionStage
            selectedSource={selectedSource}
            onSelectSource={setSelectedSource}
            leadMagnets={leadMagnets}
            selectedMagnet={selectedMagnet}
            onSelectMagnet={setSelectedMagnet}
            onOpenPublicSimulator={() => setIsPublicCaptureModalOpen(true)}
            onAddNewMagnet={handleAddNewMagnet}
            onAdvanceToCapture={() => setActiveTab('capturar')}
          />
        )}

        {activeTab === 'capturar' && (
          <CaptureStage
            leads={leads}
            onUpdateLead={handleUpdateLead}
            onDeleteLead={handleDeleteLead}
            onAddManualLead={handleAddLead}
            onAdvanceToNurture={() => setActiveTab('nutrir')}
            onOpenCaptureSimulator={() => setIsPublicCaptureModalOpen(true)}
          />
        )}

        {activeTab === 'nutrir' && (
          <NurtureStage
            messages={messages}
            onUpdateMessage={handleUpdateMessage}
            leads={leads}
            onUpdateLead={handleUpdateLead}
            onAdvanceToOffer={() => setActiveTab('ofertar')}
          />
        )}

        {activeTab === 'ofertar' && (
          <ConversionStage
            offer={offer}
            onUpdateOffer={handleUpdateOffer}
            leads={leads}
            onUpdateLead={handleUpdateLead}
            onAdvanceToPostSale={() => setActiveTab('fidelizar')}
          />
        )}

        {activeTab === 'fidelizar' && (
          <PostSaleStage
            leads={leads}
            onUpdateLead={handleUpdateLead}
            loyaltySteps={loyaltySteps}
            onUpdateLoyaltySteps={handleUpdateLoyaltySteps}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            FunilPro &copy; {new Date().getFullYear()} &bull; Sistema Estratégico de Automação & Vendas (Atrair &rarr; Fidelizar).
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Configurar Supabase
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsPublicCaptureModalOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              Simulador de Captura
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigChanged={() => {}}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <PublicCaptureModal
        isOpen={isPublicCaptureModalOpen}
        onClose={() => setIsPublicCaptureModalOpen(false)}
        leadMagnet={selectedMagnet}
        trafficSource={selectedSource}
        onLeadCaptured={handleLeadCapturedFromSimulator}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FunnelAppContent />
    </AuthProvider>
  );
}
