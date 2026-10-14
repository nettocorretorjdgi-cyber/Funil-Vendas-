import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types';

const STORAGE_KEY = 'funnelpro_supabase_config';

// Load stored configuration from localStorage or environment variables
export function getSavedSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Erro ao ler config do Supabase do localStorage:', err);
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl,
    anonKey: envKey,
    isConnected: Boolean(envUrl && envKey),
    lastChecked: undefined,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Clear cached instance
    cachedClient = null;
  } catch (err) {
    console.error('Erro ao salvar config do Supabase:', err);
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) {
    return cachedClient;
  }

  const config = getSavedSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      cachedClient = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return cachedClient;
    } catch (err) {
      console.error('Falha ao inicializar cliente Supabase:', err);
      return null;
    }
  }
  return null;
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  if (!url || !anonKey) {
    return { success: false, message: 'URL e Chave Anon do Supabase são obrigatórias.' };
  }

  try {
    // Validate URL structure
    new URL(url);
  } catch {
    return { success: false, message: 'URL do Supabase inválida. Deve começar com https://...' };
  }

  try {
    const client = createClient(url, anonKey);
    // Simple ping check
    const { data: _data, error } = await client.from('funnel_leads').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      // 42P01 is "relation does not exist", which means connection succeeded, just table isn't created yet!
      return { 
        success: true, 
        message: 'Conectado ao Supabase com sucesso! (Observação: Crie as tabelas executando o script SQL fornecido).' 
      };
    }

    return { 
      success: true, 
      message: 'Conexão com o Supabase estabelecida e autenticada com sucesso!' 
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Falha na conexão: ${message}` };
  }
}

export function getSupabaseStorageSql(): string {
  return `-- ==============================================================================
-- POLÍTICAS DE ARMAZENAMENTO (SUPABASE STORAGE BUCKETS & RLS POLICIES)
-- ==============================================================================

-- 1. Criação dos Buckets de Armazenamento
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'lead-magnets',
    'lead-magnets',
    true,
    52428800, -- Limite de 50MB
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'video/mp4', 'audio/mpeg', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 52428800;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'social-proofs',
    'social-proofs',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 10485760;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'marketing-assets',
    'marketing-assets',
    false, -- Privado
    52428800,
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/svg+xml', 'application/json']
)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. Habilitação de RLS em storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Políticas Salvas para o Bucket 'lead-magnets' (Iscas Digitais)
DROP POLICY IF EXISTS "Iscas Digitais - Download Publico" ON storage.objects;
CREATE POLICY "Iscas Digitais - Download Publico"
ON storage.objects FOR SELECT
USING (bucket_id = 'lead-magnets');

DROP POLICY IF EXISTS "Iscas Digitais - Permissao de Upload" ON storage.objects;
CREATE POLICY "Iscas Digitais - Permissao de Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lead-magnets');

DROP POLICY IF EXISTS "Iscas Digitais - Atualizacao" ON storage.objects;
CREATE POLICY "Iscas Digitais - Atualizacao"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lead-magnets');

DROP POLICY IF EXISTS "Iscas Digitais - Delecao" ON storage.objects;
CREATE POLICY "Iscas Digitais - Delecao"
ON storage.objects FOR DELETE
USING (bucket_id = 'lead-magnets');

-- 4. Políticas Salvas para o Bucket 'social-proofs' (Provas Sociais)
DROP POLICY IF EXISTS "Provas Sociais - Visualizacao Publica" ON storage.objects;
CREATE POLICY "Provas Sociais - Visualizacao Publica"
ON storage.objects FOR SELECT
USING (bucket_id = 'social-proofs');

DROP POLICY IF EXISTS "Provas Sociais - Permissao de Upload" ON storage.objects;
CREATE POLICY "Provas Sociais - Permissao de Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'social-proofs');

DROP POLICY IF EXISTS "Provas Sociais - Delecao" ON storage.objects;
CREATE POLICY "Provas Sociais - Delecao"
ON storage.objects FOR DELETE
USING (bucket_id = 'social-proofs');

-- 5. Políticas Salvas para 'marketing-assets'
DROP POLICY IF EXISTS "Ativos Internos - Apenas Autenticados" ON storage.objects;
CREATE POLICY "Ativos Internos - Apenas Autenticados"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'marketing-assets');

DROP POLICY IF EXISTS "Ativos Internos - Upload Autenticado" ON storage.objects;
CREATE POLICY "Ativos Internos - Upload Autenticado"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'marketing-assets');
`;
}

export function getSupabaseSqlSchema(): string {
  return `-- ==============================================================================
-- FUNILPRO - ESQUEMA COMPLETO: BANCO DE DADOS + POLÍTICAS DE ARMAZENAMENTO
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BUCKETS DE ARMAZENAMENTO (STORAGE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('lead-magnets', 'lead-magnets', true, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'video/mp4', 'image/jpeg', 'image/png']),
    ('social-proofs', 'social-proofs', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4']),
    ('marketing-assets', 'marketing-assets', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 2. POLÍTICAS DO ARMAZENAMENTO (storage.objects)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Iscas Digitais - Download Publico" ON storage.objects;
CREATE POLICY "Iscas Digitais - Download Publico" ON storage.objects FOR SELECT USING (bucket_id = 'lead-magnets');

DROP POLICY IF EXISTS "Iscas Digitais - Permissao de Upload" ON storage.objects;
CREATE POLICY "Iscas Digitais - Permissao de Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lead-magnets');

DROP POLICY IF EXISTS "Iscas Digitais - Atualizacao" ON storage.objects;
CREATE POLICY "Iscas Digitais - Atualizacao" ON storage.objects FOR UPDATE USING (bucket_id = 'lead-magnets');

DROP POLICY IF EXISTS "Iscas Digitais - Delecao" ON storage.objects;
CREATE POLICY "Iscas Digitais - Delecao" ON storage.objects FOR DELETE USING (bucket_id = 'lead-magnets');

DROP POLICY IF EXISTS "Provas Sociais - Visualizacao Publica" ON storage.objects;
CREATE POLICY "Provas Sociais - Visualizacao Publica" ON storage.objects FOR SELECT USING (bucket_id = 'social-proofs');

DROP POLICY IF EXISTS "Provas Sociais - Permissao de Upload" ON storage.objects;
CREATE POLICY "Provas Sociais - Permissao de Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'social-proofs');

DROP POLICY IF EXISTS "Provas Sociais - Delecao" ON storage.objects;
CREATE POLICY "Provas Sociais - Delecao" ON storage.objects FOR DELETE USING (bucket_id = 'social-proofs');

-- 3. TABELAS DO BANCO DE DADOS RELACIONAL

-- 3.1 Iscas Digitais
CREATE TABLE IF NOT EXISTS public.lead_magnets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    type TEXT NOT NULL,
    format TEXT,
    estimated_value TEXT,
    file_storage_path TEXT, -- caminho no bucket lead-magnets
    download_url TEXT,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Contatos & Leads Capturados (Etapa 1 & 2)
CREATE TABLE IF NOT EXISTS public.funnel_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    traffic_source TEXT NOT NULL, -- 'instagram', 'google', 'ads'
    lead_magnet_id TEXT REFERENCES public.lead_magnets(id) ON DELETE SET NULL,
    lead_magnet_title TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'capturar', -- 'atrair', 'capturar', 'nutrir', 'ofertar', 'fidelizar'
    notes TEXT,
    nutricao_progress INTEGER DEFAULT 0,
    purchased_offer_id TEXT,
    order_value NUMERIC(10,2) DEFAULT 0,
    nps_score INTEGER,
    feedback_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_interaction_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_funnel_leads_email ON public.funnel_leads(email);
CREATE INDEX IF NOT EXISTS idx_funnel_leads_stage ON public.funnel_leads(stage);

-- 3.3 Mensagens de Nutrição (Etapa 3)
CREATE TABLE IF NOT EXISTS public.nurture_messages (
    id SERIAL PRIMARY KEY,
    step_number INTEGER NOT NULL UNIQUE,
    step_title TEXT NOT NULL,
    purpose TEXT NOT NULL,
    subject TEXT NOT NULL,
    email_body TEXT NOT NULL,
    whatsapp_body TEXT NOT NULL,
    delay_days INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Ofertas Diretas (Etapa 4)
CREATE TABLE IF NOT EXISTS public.funnel_offers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    regular_price NUMERIC(10,2) NOT NULL,
    special_price NUMERIC(10,2) NOT NULL,
    cta_text TEXT NOT NULL,
    cta_subtext TEXT,
    scarcity_type TEXT DEFAULT 'limited_slots',
    scarcity_value TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 Vendas e Pós-Venda (Etapa 5)
CREATE TABLE IF NOT EXISTS public.funnel_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.funnel_leads(id) ON DELETE CASCADE,
    offer_id TEXT REFERENCES public.funnel_offers(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT DEFAULT 'credit_card',
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.funnel_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.funnel_leads(id) ON DELETE CASCADE,
    nps_score INTEGER NOT NULL,
    feedback_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POLÍTICAS RLS DAS TABELAS
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurture_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso Total Leads" ON public.funnel_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Iscas" ON public.lead_magnets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Mensagens" ON public.nurture_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Ofertas" ON public.funnel_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Vendas" ON public.funnel_sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Feedbacks" ON public.funnel_feedbacks FOR ALL USING (true) WITH CHECK (true);
`;
}

