import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  ShieldCheck,
  FolderArchive,
  Download,
  FileCode,
} from 'lucide-react';
import {
  getSavedSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  getSupabaseSqlSchema,
  getSupabaseStorageSql,
} from '../lib/supabase';
import { SupabaseConfig } from '../types';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose, onConfigChanged }) => {
  const [config, setConfig] = useState<SupabaseConfig>(getSavedSupabaseConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'credentials' | 'storage' | 'full_schema'>('storage');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(config.url, config.anonKey);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleSave = () => {
    const updated: SupabaseConfig = {
      ...config,
      isConnected: Boolean(config.url && config.anonKey),
      lastChecked: new Date().toISOString(),
    };
    saveSupabaseConfig(updated);
    setConfig(updated);
    onConfigChanged();
    onClose();
  };

  const handleCopySql = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadSqlFile = () => {
    const element = document.createElement('a');
    const file = new Blob([getSupabaseSqlSchema()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'funilpro_supabase_schema_storage.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Banco de Dados & Armazenamento Supabase
              </h2>
              <p className="text-xs text-slate-400">
                Tabelas relacionais, Buckets de Storage e Políticas RLS salvas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/60 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('storage')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'storage'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            Políticas de Armazenamento (Storage)
          </button>
          <button
            onClick={() => setActiveTab('full_schema')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'full_schema'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Script Completo (Tabelas + Storage)
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'credentials'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Credenciais & Conexão
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-4">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <FolderArchive className="w-4 h-4 text-emerald-400" />
                    Políticas de Storage Salvas (Buckets: lead-magnets, social-proofs, marketing-assets)
                  </h4>
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">
                    Permite download público de iscas gratuitas, upload de provas e proteção de ativos.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopySql(getSupabaseStorageSql())}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    {copiedSql ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Políticas de Storage
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-80 overflow-y-auto leading-relaxed select-all">
                <pre>{getSupabaseStorageSql()}</pre>
              </div>
            </div>
          )}

          {activeTab === 'full_schema' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    Script SQL Completo (Tabelas do Funil + Armazenamento)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Crie todo o ambiente do FunilPro com 1 único clique no SQL Editor do Supabase.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadSqlFile}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar .SQL
                  </button>
                  <button
                    onClick={() => handleCopySql(getSupabaseSqlSchema())}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-900/30"
                  >
                    {copiedSql ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Script Completo
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-80 overflow-y-auto leading-relaxed select-all">
                <pre>{getSupabaseSqlSchema()}</pre>
              </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-5">
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4 text-xs text-emerald-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <p className="font-semibold text-emerald-200 mb-1">Como obter suas chaves do Supabase:</p>
                  <p className="text-emerald-300/90 leading-relaxed">
                    Acesse seu painel no Supabase (<span className="font-mono text-emerald-200">supabase.com</span>) &rarr;
                    Selecione seu projeto &rarr; <strong>Project Settings</strong> &rarr; <strong>API</strong>. Copie o <strong>Project URL</strong> e a <strong>anon public API key</strong>.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Project URL do Supabase
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={config.url}
                  onChange={(e) => setConfig({ ...config, url: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Anon / Public Key do Supabase
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={config.anonKey}
                  onChange={(e) => setConfig({ ...config, anonKey: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-xs"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                    testResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  )}
                  <div className="flex-1">{testResult.message}</div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !config.url || !config.anonKey}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl font-medium text-xs transition-colors flex items-center gap-2"
                >
                  {isTesting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Testar Conexão
                </button>

                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                >
                  Abrir Supabase Dashboard
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/80">
          <p className="text-xs text-slate-500">
            {config.url && config.anonKey ? '🟢 Supabase Configurado' : '🟡 Modo Local Ativo (Sem Supabase conectado)'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-emerald-900/30"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

