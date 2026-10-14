import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, Mail, User, Building, Sparkles, AlertCircle, X, Shield } from 'lucide-react';
import { useAuth } from '../lib/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const { login, register, loginDemo, authError, clearError } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    clearError();

    let success = false;
    if (mode === 'login') {
      success = await login(email, password);
    } else {
      success = await register(name, email, password, company);
    }

    setLocalLoading(false);
    if (success) {
      onClose();
    }
  };

  const handleDemoClick = () => {
    loginDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-indigo-500 rounded-full blur-sm" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Logo / Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 mb-3 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {mode === 'login' ? 'Acessar FunilPro' : 'Criar Conta de Estrategista'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login'
                ? 'Entre com suas credenciais para gerenciar sua esteira de vendas'
                : 'Cadastre-se para configurar seus funis de alta conversão'}
            </p>
          </div>

          {/* Quick Demo Access banner */}
          <div className="mb-6 p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-indigo-200">Acesso Rápido de Demonstração</p>
                <p className="text-[11px] text-indigo-300/80">Dados pré-carregados (Netto Corretor)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoClick}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              Entrar Demo
            </button>
          </div>

          {/* Mode switch */}
          <div className="flex bg-slate-950 p-1 rounded-xl mb-5 border border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                clearError();
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Entrar (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                clearError();
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Nova Conta (Senha)
            </button>
          </div>

          {/* Error notice */}
          {authError && (
            <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1 leading-snug">{authError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Ex: João da Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Empresa ou Nicho (Opcional)</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Ex: Imóveis, Mentoria, Agência"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Profissional</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Senha</label>
                {mode === 'login' && (
                  <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                    Mínimo 6 dígitos
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={localLoading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/40 active:scale-[0.98] disabled:opacity-50"
            >
              {localLoading ? (
                'Processando...'
              ) : mode === 'login' ? (
                'Entrar no Painel'
              ) : (
                'Criar Minha Conta'
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-[11px] text-slate-500 text-center mt-5">
            Compatível com autenticação local e Supabase Auth.
          </p>
        </div>
      </div>
    </div>
  );
};
