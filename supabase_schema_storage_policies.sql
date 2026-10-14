-- ==============================================================================
-- FUNILPRO - SCRIPT SQL COMPLETO COM POLÍTICAS DE ARMAZENAMENTO (STORAGE) E BANCO
-- Compatível com Supabase: Tabelas, Buckets de Storage e Políticas RLS (Row Level Security)
-- ==============================================================================

-- Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. CRIAÇÃO DOS BUCKETS DE ARMAZENAMENTO (SUPABASE STORAGE)
-- ==============================================================================

-- 1.1 Bucket para Iscas Digitais (PDFs, E-books, Checklists, Áudios) - Público para download
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'lead-magnets',
    'lead-magnets',
    true,
    52428800, -- Limite de 50MB por arquivo
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'video/mp4', 'audio/mpeg', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800;

-- 1.2 Bucket para Provas Sociais e Depoimentos (Prints, Fotos de Clientes, Vídeos curtos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'social-proofs',
    'social-proofs',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760;

-- 1.3 Bucket para Ativos de Marketing Internos (Templates, Materiais de Apoio)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'marketing-assets',
    'marketing-assets',
    false, -- Privado: apenas autenticados
    52428800,
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/svg+xml', 'application/json']
)
ON CONFLICT (id) DO UPDATE SET
    public = false;

-- ==============================================================================
-- 2. POLÍTICAS DE SEGURANÇA E ACESSO DO STORAGE (storage.objects RLS)
-- ==============================================================================

-- Habilitar RLS na tabela de objetos do storage caso ainda não esteja
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2.1 Políticas para o Bucket 'lead-magnets' (Iscas Digitais)
-- Permite leitura/download público de qualquer arquivo de isca digital
DROP POLICY IF EXISTS "Iscas Digitais - Download Publico" ON storage.objects;
CREATE POLICY "Iscas Digitais - Download Publico"
ON storage.objects FOR SELECT
USING (bucket_id = 'lead-magnets');

-- Permite upload de iscas digitais por usuários autenticados e chave anon
DROP POLICY IF EXISTS "Iscas Digitais - Permissao de Upload" ON storage.objects;
CREATE POLICY "Iscas Digitais - Permissao de Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lead-magnets');

-- Permite atualização de iscas digitais existentes
DROP POLICY IF EXISTS "Iscas Digitais - Atualizacao" ON storage.objects;
CREATE POLICY "Iscas Digitais - Atualizacao"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lead-magnets');

-- Permite exclusão de iscas digitais
DROP POLICY IF EXISTS "Iscas Digitais - Delecao" ON storage.objects;
CREATE POLICY "Iscas Digitais - Delecao"
ON storage.objects FOR DELETE
USING (bucket_id = 'lead-magnets');

-- 2.2 Políticas para o Bucket 'social-proofs' (Provas Sociais)
-- Permite visualização pública dos prints e depoimentos
DROP POLICY IF EXISTS "Provas Sociais - Visualizacao Publica" ON storage.objects;
CREATE POLICY "Provas Sociais - Visualizacao Publica"
ON storage.objects FOR SELECT
USING (bucket_id = 'social-proofs');

-- Permite upload de fotos e depoimentos
DROP POLICY IF EXISTS "Provas Sociais - Permissao de Upload" ON storage.objects;
CREATE POLICY "Provas Sociais - Permissao de Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'social-proofs');

-- Permite deleção de fotos e depoimentos
DROP POLICY IF EXISTS "Provas Sociais - Delecao" ON storage.objects;
CREATE POLICY "Provas Sociais - Delecao"
ON storage.objects FOR DELETE
USING (bucket_id = 'social-proofs');

-- 2.3 Políticas para o Bucket 'marketing-assets' (Ativos Internos)
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

-- ==============================================================================
-- 3. TABELAS DO BANCO DE DADOS RELACIONAL (ESQUEMA DO FUNIL)
-- ==============================================================================

-- 3.1 Tabela de Usuários / Estrategistas
CREATE TABLE IF NOT EXISTS public.funnel_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- Vínculo opcional com auth.users do Supabase
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    company TEXT,
    role TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'marketer', 'sales_rep'
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Tabela de Iscas Digitais (com link para o arquivo no Storage)
CREATE TABLE IF NOT EXISTS public.lead_magnets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    type TEXT NOT NULL, -- 'ebook', 'checklist', 'minicourse', 'template', 'diagnosis'
    format TEXT,
    estimated_value TEXT,
    file_storage_path TEXT, -- Caminho no bucket 'lead-magnets' (ex: "guias/funil-alta-conversao.pdf")
    download_url TEXT,       -- URL pública ou assinada do arquivo
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Tabela de Contatos & Leads Capturados (Etapa 1 & 2)
CREATE TABLE IF NOT EXISTS public.funnel_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    traffic_source TEXT NOT NULL CHECK (traffic_source IN ('instagram', 'google', 'ads', 'outros')),
    lead_magnet_id TEXT REFERENCES public.lead_magnets(id) ON DELETE SET NULL,
    lead_magnet_title TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'capturar' CHECK (stage IN ('atrair', 'capturar', 'nutrir', 'ofertar', 'fidelizar')),
    notes TEXT,
    nutricao_progress INTEGER DEFAULT 0 CHECK (nutricao_progress BETWEEN 0 AND 3),
    purchased_offer_id TEXT,
    order_value NUMERIC(10,2) DEFAULT 0,
    nps_score INTEGER CHECK (nps_score BETWEEN 0 AND 10),
    feedback_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_interaction_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de performance para busca rápida
CREATE INDEX IF NOT EXISTS idx_funnel_leads_email ON public.funnel_leads(email);
CREATE INDEX IF NOT EXISTS idx_funnel_leads_stage ON public.funnel_leads(stage);
CREATE INDEX IF NOT EXISTS idx_funnel_leads_traffic_source ON public.funnel_leads(traffic_source);
CREATE INDEX IF NOT EXISTS idx_funnel_leads_created_at ON public.funnel_leads(created_at DESC);

-- 3.4 Tabela de Sequência de Nutrição (3 Mensagens Estratégicas - Etapa 3)
CREATE TABLE IF NOT EXISTS public.nurture_messages (
    id SERIAL PRIMARY KEY,
    step_number INTEGER NOT NULL UNIQUE CHECK (step_number IN (1, 2, 3)),
    step_title TEXT NOT NULL,
    purpose TEXT NOT NULL,
    subject TEXT NOT NULL,
    email_body TEXT NOT NULL,
    whatsapp_body TEXT NOT NULL,
    delay_days INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 Tabela de Ofertas Diretas (Etapa 4 - Conversão)
CREATE TABLE IF NOT EXISTS public.funnel_offers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    regular_price NUMERIC(10,2) NOT NULL,
    special_price NUMERIC(10,2) NOT NULL,
    discount_percentage INTEGER DEFAULT 50,
    cta_text TEXT NOT NULL,
    cta_subtext TEXT,
    scarcity_type TEXT DEFAULT 'limited_slots',
    scarcity_value TEXT,
    guarantee_days INTEGER DEFAULT 15,
    benefits JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 Tabela de Provas Sociais e Depoimentos (com suporte a imagem do Storage)
CREATE TABLE IF NOT EXISTS public.funnel_social_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    role TEXT,
    avatar_storage_path TEXT, -- Caminho no bucket 'social-proofs'
    avatar_url TEXT,
    result TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7 Tabela de Transações e Vendas (Conversão & Pós-Venda)
CREATE TABLE IF NOT EXISTS public.funnel_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.funnel_leads(id) ON DELETE CASCADE,
    offer_id TEXT REFERENCES public.funnel_offers(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT DEFAULT 'credit_card', -- 'credit_card', 'pix', 'boleto'
    status TEXT NOT NULL DEFAULT 'completed', -- 'completed', 'pending', 'refunded'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8 Tabela de Feedbacks e NPS (Etapa 5 - Fidelização)
CREATE TABLE IF NOT EXISTS public.funnel_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.funnel_leads(id) ON DELETE CASCADE,
    nps_score INTEGER NOT NULL CHECK (nps_score BETWEEN 0 AND 10),
    feedback_text TEXT,
    status TEXT DEFAULT 'approved', -- 'approved', 'pending', 'hidden'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. POLÍTICAS DE ROW LEVEL SECURITY (RLS) DAS TABELAS DO BANCO
-- ==============================================================================

ALTER TABLE public.funnel_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurture_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_social_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_feedbacks ENABLE ROW LEVEL SECURITY;

-- 4.1 Políticas Abertas para Leitura de Iscas e Ofertas (Páginas Públicas)
DROP POLICY IF EXISTS "Leitura Publica Iscas" ON public.lead_magnets;
CREATE POLICY "Leitura Publica Iscas" ON public.lead_magnets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leitura Publica Ofertas" ON public.funnel_offers;
CREATE POLICY "Leitura Publica Ofertas" ON public.funnel_offers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leitura Publica Provas Sociais" ON public.funnel_social_proofs;
CREATE POLICY "Leitura Publica Provas Sociais" ON public.funnel_social_proofs FOR SELECT USING (true);

-- 4.2 Políticas para Captura de Leads (Visitantes podem se cadastrar anonimamente)
DROP POLICY IF EXISTS "Criacao de Lead Publica" ON public.funnel_leads;
CREATE POLICY "Criacao de Lead Publica" ON public.funnel_leads FOR INSERT WITH CHECK (true);

-- 4.3 Políticas de Acesso Total (Gerenciamento do Funil)
DROP POLICY IF EXISTS "Gerenciamento Total Leads" ON public.funnel_leads;
CREATE POLICY "Gerenciamento Total Leads" ON public.funnel_leads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Gerenciamento Total Iscas" ON public.lead_magnets;
CREATE POLICY "Gerenciamento Total Iscas" ON public.lead_magnets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Gerenciamento Total Mensagens" ON public.nurture_messages;
CREATE POLICY "Gerenciamento Total Mensagens" ON public.nurture_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Gerenciamento Total Ofertas" ON public.funnel_offers;
CREATE POLICY "Gerenciamento Total Ofertas" ON public.funnel_offers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Gerenciamento Total Vendas" ON public.funnel_sales;
CREATE POLICY "Gerenciamento Total Vendas" ON public.funnel_sales FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Gerenciamento Total Feedbacks" ON public.funnel_feedbacks;
CREATE POLICY "Gerenciamento Total Feedbacks" ON public.funnel_feedbacks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Gerenciamento Total Usuarios" ON public.funnel_users;
CREATE POLICY "Gerenciamento Total Usuarios" ON public.funnel_users FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 5. TRIGGER PARA ATUALIZAR TIMESTAMPS AUTOMATICAMENTE
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_lead_magnets_updated_at ON public.lead_magnets;
CREATE TRIGGER trigger_lead_magnets_updated_at
BEFORE UPDATE ON public.lead_magnets
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_nurture_messages_updated_at ON public.nurture_messages;
CREATE TRIGGER trigger_nurture_messages_updated_at
BEFORE UPDATE ON public.nurture_messages
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
