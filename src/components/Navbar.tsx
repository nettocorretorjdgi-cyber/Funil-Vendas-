import React from 'react';
import {
  Layers,
  Database,
  User,
  LogOut,
  LogIn,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { getSavedSupabaseConfig } from '../lib/supabase';
import { resetToDemoData } from '../lib/storage';

interface NavbarProps {
  onOpenSupabaseModal: () => void;
  onOpenAuthModal: () => void;
  onDataReset: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSupabaseModal,
  onOpenAuthModal,
  onDataReset,
  activeTab,
  onTabChange,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const supabaseConfig = getSavedSupabaseConfig();

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de demonstração da esteira?')) {
      resetToDemoData();
      onDataReset();
    }
  };

  const navItems = [
    { id: 'overview', label: 'Visão Geral & Funil', badge: 'Pipeline' },
    { id: 'atrair', label: '1. Atração', badge: 'Tráfego & Isca' },
    { id: 'capturar', label: '2. Captura', badge: 'Leads' },
    { id: 'nutrir', label: '3. Nutrição', badge: '3 Mensagens' },
    { id: 'ofertar', label: '4. Conversão', badge: 'Oferta Direta' },
    { id: 'fidelizar', label: '5. Pós-Venda', badge: 'Fidelização' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">Funil<span className="text-indigo-400">Pro</span></span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                  Fórmula 5 Etapas
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Atrair &rarr; Capturar &rarr; Nutrir &rarr; Ofertar &rarr; Fidelizar
              </p>
            </div>
          </div>

          {/* Right Tools & Auth */}
          <div className="flex items-center gap-2.5">
            {/* Supabase Status Pill */}
            <button
              onClick={onOpenSupabaseModal}
              title="Configurar banco de dados Supabase"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                supabaseConfig.isConnected
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${supabaseConfig.isConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {supabaseConfig.isConnected ? 'Supabase Conectado' : 'Supabase (Configurar)'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseConfig.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </button>

            {/* Reset demo data */}
            <button
              onClick={handleResetData}
              title="Restaurar dados de teste"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors hidden md:flex items-center gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px]">Restaurar Demo</span>
            </button>

            {/* User Profile / Auth */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-indigo-500/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-white leading-none truncate max-w-[130px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[130px] mt-0.5">
                      {user.company || user.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sair da conta"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                Entrar / Login
              </button>
            )}
          </div>
        </div>

        {/* Stage Tabs Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
