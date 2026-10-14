import {
  Lead,
  LeadMagnet,
  NurtureMessage,
  DirectOffer,
  LoyaltyStep,
  TrafficSourceDetail,
  TrafficSourceType,
  FunnelStageType
} from '../types';
import { getSupabaseClient } from './supabase';

export const TRAFFIC_SOURCES: TrafficSourceDetail[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    badge: 'Redes Sociais',
    iconName: 'Instagram',
    description: 'Atração via Reels, Stories com adesivo de engajamento, Bio com link direto e direct automatizado com palavras-chave.',
    channels: ['Stories Diários + CTA', 'Reels com Dica Rápida', 'Link na Bio', 'Direct Automatizado (ManyChat)'],
    tips: [
      'Use stories para mostrar bastidores e abrir caixa de perguntas com a dor do cliente.',
      'No final de cada Reels, instrua: "Comente QUERO para receber o guia no direct".',
      'Mantenha o link da isca digital em destaque na bio do perfil.',
    ],
  },
  {
    id: 'google',
    name: 'Google',
    badge: 'Busca Intencional',
    iconName: 'Search',
    description: 'Captura de pessoas que já estão buscando ativamente a solução para a dor no Google Busca, Artigos de Blog ou Google Meu Negócio.',
    channels: ['Google Search (SEO)', 'Google Ads Palavra-chave', 'Google Perfil da Empresa', 'Artigos de Resolução de Dor'],
    tips: [
      'Foque em palavras-chave de "cauda longa" com alta intenção (ex: "como resolver x passo a passo").',
      'Coloque banners e pop-ups de saída para download da isca gratuita em artigos.',
      'Otimize a velocidade de carregamento da landing page para manter a taxa de rejeição baixa.',
    ],
  },
  {
    id: 'ads',
    name: 'Anúncios Pagos',
    badge: 'Escala Rápida',
    iconName: 'Megaphone',
    description: 'Campanhas de tráfego pago no Meta Ads (Facebook/Instagram Ads), Google Ads ou TikTok Ads direcionadas para o público ideal.',
    channels: ['Meta Ads (Feed & Stories)', 'Google Performance Max', 'YouTube Video Ads', 'Remarketing de Engajamento'],
    tips: [
      'Teste 3 a 5 criativos diferentes destacando o benefício imediato da isca digital gratuita.',
      'Público aberto ou Lookalike de clientes anteriores com formulário nativo (Lead Ads) ou Landing Page.',
      'Crie campanha de remarketing para quem visitou a página e não baixou o material.',
    ],
  },
];

export const INITIAL_LEAD_MAGNETS: LeadMagnet[] = [
  {
    id: 'magnet-1',
    type: 'ebook',
    title: 'Guia Prático: Os 5 Passos para Dominar o Funil de Vendas de Alta Conversão',
    tagline: 'O passo a passo detalhado para sair do zero e estruturar vendas previsíveis todos os dias.',
    description: 'Manual definitivo em formato PDF com estratégias práticas, modelos de mensagens e roteiros de fechamento direto.',
    format: 'E-book em PDF (24 páginas)',
    estimatedValue: 'R$ 97,00',
    downloadCount: 148,
  },
  {
    id: 'magnet-2',
    type: 'checklist',
    title: 'Checklist de 10 Pontos de Auditoria Comercial & Copywriting',
    tagline: 'Identifique em 15 minutos onde sua empresa está perdendo dinheiro e vendas.',
    description: 'Planilha prática e direta para auditar seus canais de tráfego, mensagens de nutrição e argumentos de conversão.',
    format: 'Checklist Interativo + PDF',
    estimatedValue: 'R$ 67,00',
    downloadCount: 92,
  },
  {
    id: 'magnet-3',
    type: 'minicourse',
    title: 'Mini-Treinamento em Vídeo: Como Criar Ofertas Irresistíveis em 30 Minutos',
    tagline: 'AULA EXCLUSIVA: A anatomia exata de uma proposta que o cliente sente que é burrice recusar.',
    description: 'Aula gravada em alta definição com exemplos práticos, quebra de objeções e estudo de casos reais de sucesso.',
    format: 'Vídeo-aula HD (38 minutos)',
    estimatedValue: 'R$ 197,00',
    downloadCount: 215,
  },
];

export const INITIAL_NURTURE_MESSAGES: NurtureMessage[] = [
  {
    id: 1,
    stepTitle: 'Mensagem 1: Conteúdo que resolve parte do problema',
    purpose: 'Entrega imediata da isca + vitória rápida prática (Quick-Win) para gerar confiança e autoridade instantânea.',
    delayDays: 0,
    subject: '🔥 Aqui está o seu material gratuito + O primeiro passo que você deve dar hoje!',
    emailBody: `Olá, {nome}!

Aqui é da equipe do FunilPro.

Conforme prometido, seu acesso ao material gratuito "{isca}" está liberado no link abaixo:

👉 [CLIQUE AQUI PARA BAIXAR O SEU MATERIAL GRATUITO]

Mas antes de você abrir, eu quero te dar uma vitória rápida AGORA:

A maioria das pessoas falha porque tenta resolver tudo de uma vez. Hoje, escolha apenas UMA única ação prática da página 3 do guia e aplique nas próximas 2 horas. 

Só esse pequeno ajuste já vai clarear o seu próximo passo e economizar tempo valioso.

Depois me responda este e-mail contando o que achou!

Abraços,
Equipe FunilPro`,
    whatsappBody: `Olá, {nome}! Tudo bem? 

Aqui está o link do seu material gratuito "{isca}":
🔗 https://funilpro.app/download/{isca_id}

💡 DICA DE OURO: Vá direto para o primeiro capítulo e aplique a técnica de vitória rápida ainda hoje! Qualquer dúvida, estou à disposição aqui neste WhatsApp.`,
  },
  {
    id: 2,
    stepTitle: 'Mensagem 2: Mostre erros e oportunidades',
    purpose: 'Diagnóstico profundo. Mostrar os 3 maiores erros que 95% cometem e as oportunidades que estão deixando na mesa.',
    delayDays: 1,
    subject: '⚠️ 95% das pessoas cometem esse erro grave (você também está cometendo?)',
    emailBody: `Olá, {nome}!

Ontem eu te enviei o material "{isca}". Conseguiu dar uma olhada?

Hoje eu preciso ser 100% sincero com você sobre o que eu mais vejo no mercado:

Mais de 95% das pessoas erram em 3 pontos cruciais:
❌ Erro 1: Gastar energia tentando atrair pessoas sem ter uma esteira de nutrição engajada.
❌ Erro 2: Ter vergonha de fazer uma oferta direta com prazo e benefícios claros.
❌ Erro 3: Esquecer do cliente no minuto seguinte após o fechamento, perdendo a chance de fidelização.

O custo de continuar cometendo esses erros é alto: você trabalha o dobro e fatura metade do que poderia.

A boa notícia? O mercado está carente de quem faz o básico bem feito. Se você corrigir esses 3 pontos, uma oportunidade gigante de faturamento se abre na sua frente.

No próximo e-mail, vou te mostrar a estrutura exata para virar esse jogo de uma vez por todas. Fique atento à sua caixa de entrada!

Atenciosamente,
Equipe FunilPro`,
    whatsappBody: `Fala, {nome}! Passando rapidinho para te alertar sobre um erro que vi muita gente cometer:

Tentar vender sem nutrir o contato antes é o motivo #1 de perda de clientes. Quando você mostra o erro e aponta a oportunidade, a venda acontece naturalmente.

Você conseguiu ver os 3 erros que te mandei no e-mail? Se quiser, posso te mandar um áudio de 1 minuto explicando! 🚀`,
  },
  {
    id: 3,
    stepTitle: 'Mensagem 3: Apresente sua solução',
    purpose: 'Conectar a dor e as oportunidades à sua metodologia comprovada, preparando a transição suave para a oferta direta.',
    delayDays: 2,
    subject: '🚀 A solução definitiva: como destravar seus resultados com método comprovado',
    emailBody: `Olá, {nome}!

Nas últimas mensagens, te mostrei como resolver a primeira etapa do seu gargalo e os maiores erros que podem estar drenando seus resultados.

Agora a grande questão é: como implementar uma solução robusta, sem precisar errar tudo do zero?

Foi exatamente por isso que nós desenvolvemos o nosso método completo: uma solução desenhada para quem não quer perder tempo com tentativa e erro.

Com esse método, você terá:
✅ Um sistema testado de atração e captura automática.
✅ Sequências prontas que nutrem e educam seu lead sem você precisar escrever tudo do zero.
✅ Roteiros de fechamento de alta conversão.

Nas próximas horas, vou liberar uma condição extremamente especial para os contatos prioritários como você.

Fique de olho, porque será por tempo muito limitado!

Um abraço,
Equipe FunilPro`,
    whatsappBody: `{nome}, amanhã vamos abrir uma oportunidade exclusiva para quem baixou nosso material gratuito e quer implementar a solução completa com suporte.

As vagas serão bem limitadas por conta do acompanhamento. Quer que eu te avise primeiro por aqui quando o link for liberado? 🎯`,
  },
];

export const INITIAL_OFFER: DirectOffer = {
  id: 'offer-master',
  title: 'Programa de Aceleração Comercial & Funil Completo',
  subtitle: 'A metodologia passo a passo para transformar tráfego frio em clientes fiéis recorrentes.',
  regularPrice: 997.00,
  specialPrice: 497.00,
  discountPercentage: 50,
  currency: 'R$',
  ctaText: 'Quero Garantir Minha Vaga com 50% de Desconto',
  ctaSubtext: 'Pagamento 100% seguro em até 12x no cartão ou à vista via PIX',
  scarcityType: 'limited_slots',
  scarcityValue: 'Restam apenas 5 vagas promocionais nesta turma',
  countdownEndHours: 24,
  guaranteeDays: 15,
  benefits: [
    {
      id: 'b-1',
      title: 'Sistema de Captação Automatizado',
      description: 'Modelos prontos de páginas de captura, iscas de alta conversão e integrações com Instagram e Google.',
    },
    {
      id: 'b-2',
      title: 'Sequência de 3 E-mails de Nutrição Validados',
      description: 'Copys prontas de Dor, Erros/Oportunidades e Apresentação de Solução que já geraram mais de 6 dígitos.',
    },
    {
      id: 'b-3',
      title: 'Roteiros de Fechamento & Scripts WhatsApp',
      description: 'Como conduzir conversas de vendas individuais sem parecer chato ou insistente.',
    },
    {
      id: 'b-4',
      title: 'Esteira de Pós-Venda & Fidelização (LTV Máximo)',
      description: 'Scripts de onboarding, formulários de NPS e estratégias para vender mais de uma vez para o mesmo cliente.',
    },
  ],
  socialProofs: [
    {
      id: 'sp-1',
      author: 'Carlos Eduardo',
      role: 'Consultor Imobiliário & Negócios',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      result: '+ R$ 38.500 no 1º mês',
      quote: 'A sequência de 3 mensagens mudou completamente meu jogo. Antes eu recebia o contato e não sabia o que falar. Agora eles chegam prontos para comprar!',
      rating: 5,
    },
    {
      id: 'sp-2',
      author: 'Juliana Mendes',
      role: 'Especialista em Infoprodutos',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      result: 'Taxa de conversão de 14.2%',
      quote: 'A clareza dos benefícios e a escassez real fizeram minha lista de espera esgotar em menos de 24 horas.',
      rating: 5,
    },
    {
      id: 'sp-3',
      author: 'Rodrigo Siqueira',
      role: 'Agência de Tráfego & Performance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      result: 'Triplicou o LTV dos clientes',
      quote: 'O módulo de pós-venda e coleta de feedback gerou mais indicações no último trimestre do que anúncios pagos.',
      rating: 5,
    },
  ],
};

export const INITIAL_LOYALTY_STEPS: LoyaltyStep[] = [
  {
    id: 'step-onboarding',
    type: 'vip_community',
    title: 'Acompanhamento Personalizado no WhatsApp',
    description: 'Mensagem individual enviada em até 1 hora após a compra com link de acesso rápido e contato do gestor de sucesso.',
    rewardOrValue: 'Suporte humanizado 1-a-1',
    status: 'active',
  },
  {
    id: 'step-feedback',
    type: 'vip_community',
    title: 'Pesquisa de Satisfação & NPS (7 dias)',
    description: 'Envio automático de formulário de avaliação de 0 a 10. Clientes promotores (9 e 10) recebem convite para gravar depoimento.',
    rewardOrValue: 'Depoimento & Prova Social',
    status: 'active',
  },
  {
    id: 'step-referral',
    type: 'referral',
    title: 'Programa de Indicação Premiada',
    description: 'Cada cliente satisfeito ganha um link exclusivo: indicou um colega que fechou, ganha R$ 100 de bônus ou 1 mês extra.',
    rewardOrValue: 'R$ 100 de bônus por amigo',
    status: 'active',
  },
  {
    id: 'step-upsell',
    type: 'upsell',
    title: 'Upgrade para Mentoria Individual Quinzenal',
    description: 'Apresentação do próximo nível para quem concluiu a primeira fase e deseja acompanhamento estratégico semanal.',
    rewardOrValue: 'Ticket R$ 2.497,00',
    status: 'active',
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Mariana Lima',
    email: 'mariana.lima@exemplo.com.br',
    phone: '(11) 98452-1102',
    trafficSource: 'instagram',
    leadMagnetId: 'magnet-1',
    leadMagnetTitle: 'Guia Prático: Os 5 Passos para Dominar o Funil de Vendas',
    stage: 'fidelizar',
    notes: 'Comprou o Programa Completo. Deu nota 10 no NPS e já indicou uma amiga!',
    createdAt: '2026-09-18T10:30:00Z',
    lastInteractionAt: '2026-09-29T14:20:00Z',
    nutricaoProgress: 3,
    purchasedOfferId: 'offer-master',
    orderValue: 497.00,
    npsScore: 10,
    feedbackText: 'Atendimento excepcional e a esteira de mensagens é impecável. Já recuperei o investimento na primeira semana!',
  },
  {
    id: 'lead-2',
    name: 'Fernando Rocha',
    email: 'fernando.rocha@techcorp.com',
    phone: '(21) 99124-8833',
    trafficSource: 'google',
    leadMagnetId: 'magnet-2',
    leadMagnetTitle: 'Checklist de 10 Pontos de Auditoria Comercial',
    stage: 'ofertar',
    notes: 'Recebeu as 3 mensagens de nutrição, abriu o link da oferta duas vezes hoje.',
    createdAt: '2026-09-22T08:15:00Z',
    lastInteractionAt: '2026-09-30T11:45:00Z',
    nutricaoProgress: 3,
  },
  {
    id: 'lead-3',
    name: 'Beatriz Almeida',
    email: 'beatriz.almeida@gmail.com',
    phone: '(31) 97321-4455',
    trafficSource: 'ads',
    leadMagnetId: 'magnet-3',
    leadMagnetTitle: 'Mini-Treinamento em Vídeo: Como Criar Ofertas Irresistíveis',
    stage: 'nutrir',
    notes: 'Recebeu mensagem 1 e mensagem 2. Respondeu com dúvida sobre o checklist.',
    createdAt: '2026-09-27T16:40:00Z',
    lastInteractionAt: '2026-09-29T09:10:00Z',
    nutricaoProgress: 2,
  },
  {
    id: 'lead-4',
    name: 'Lucas Fagundes',
    email: 'lucas.fagundes@consultoria.com.br',
    phone: '(41) 98844-3322',
    trafficSource: 'instagram',
    leadMagnetId: 'magnet-1',
    leadMagnetTitle: 'Guia Prático: Os 5 Passos para Dominar o Funil de Vendas',
    stage: 'capturar',
    notes: 'Baixou a isca pelo Stories do Instagram há poucas horas.',
    createdAt: '2026-09-30T13:00:00Z',
    lastInteractionAt: '2026-09-30T13:00:00Z',
    nutricaoProgress: 0,
  },
  {
    id: 'lead-5',
    name: 'Renata Vasconcelos',
    email: 'renata.v@imoveisprime.com.br',
    phone: '(19) 99233-1188',
    trafficSource: 'ads',
    leadMagnetId: 'magnet-3',
    leadMagnetTitle: 'Mini-Treinamento em Vídeo: Como Criar Ofertas Irresistíveis',
    stage: 'fidelizar',
    notes: 'Aluna muito participativa, solicitou informações da Mentoria VIP.',
    createdAt: '2026-09-15T11:00:00Z',
    lastInteractionAt: '2026-09-28T16:00:00Z',
    nutricaoProgress: 3,
    purchasedOfferId: 'offer-master',
    orderValue: 497.00,
    npsScore: 9,
    feedbackText: 'Os scripts de WhatsApp me fizeram fechar 2 contratos no mesmo dia. Nota 9 porque quero mais exemplos em vídeo!',
  },
];

// LocalStorage Keys
const LEADS_KEY = 'funnelpro_leads_data';
const MAGNETS_KEY = 'funnelpro_lead_magnets';
const MESSAGES_KEY = 'funnelpro_nurture_messages';
const OFFER_KEY = 'funnelpro_direct_offer';
const LOYALTY_KEY = 'funnelpro_loyalty_steps';

export function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler leads do storage:', err);
  }
  return INITIAL_LEADS;
}

export function saveLeads(leads: Lead[]): void {
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('Erro ao salvar leads no storage:', err);
  }

  // Also sync to Supabase in background if client is active
  const supabase = getSupabaseClient();
  if (supabase) {
    syncLeadsToSupabase(supabase, leads).catch((err) => {
      console.warn('Sync em segundo plano para Supabase com aviso:', err);
    });
  }
}

async function syncLeadsToSupabase(supabase: ReturnType<typeof getSupabaseClient>, leads: Lead[]) {
  if (!supabase) return;
  try {
    // Map leads to supabase table format
    const rows = leads.map((l) => ({
      name: l.name,
      email: l.email,
      phone: l.phone,
      traffic_source: l.trafficSource,
      lead_magnet_id: l.leadMagnetId,
      lead_magnet_title: l.leadMagnetTitle,
      stage: l.stage,
      notes: l.notes,
      nutricao_progress: l.nutricaoProgress,
      purchased_offer_id: l.purchasedOfferId,
      order_value: l.orderValue,
      nps_score: l.npsScore,
      feedback_text: l.feedbackText,
      last_interaction_at: l.lastInteractionAt,
    }));
    await supabase.from('funnel_leads').upsert(rows, { onConflict: 'email' });
  } catch (e) {
    console.warn('Supabase sync leads skipped:', e);
  }
}

export function loadLeadMagnets(): LeadMagnet[] {
  try {
    const raw = localStorage.getItem(MAGNETS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler iscas:', err);
  }
  return INITIAL_LEAD_MAGNETS;
}

export function saveLeadMagnets(magnets: LeadMagnet[]): void {
  try {
    localStorage.setItem(MAGNETS_KEY, JSON.stringify(magnets));
  } catch (err) {
    console.error('Erro ao salvar iscas:', err);
  }
}

export function loadNurtureMessages(): NurtureMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler mensagens de nutrição:', err);
  }
  return INITIAL_NURTURE_MESSAGES;
}

export function saveNurtureMessages(messages: NurtureMessage[]): void {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (err) {
    console.error('Erro ao salvar mensagens de nutrição:', err);
  }
}

export function loadOffer(): DirectOffer {
  try {
    const raw = localStorage.getItem(OFFER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler oferta:', err);
  }
  return INITIAL_OFFER;
}

export function saveOffer(offer: DirectOffer): void {
  try {
    localStorage.setItem(OFFER_KEY, JSON.stringify(offer));
  } catch (err) {
    console.error('Erro ao salvar oferta:', err);
  }
}

export function loadLoyaltySteps(): LoyaltyStep[] {
  try {
    const raw = localStorage.getItem(LOYALTY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler passos de pós-venda:', err);
  }
  return INITIAL_LOYALTY_STEPS;
}

export function saveLoyaltySteps(steps: LoyaltyStep[]): void {
  try {
    localStorage.setItem(LOYALTY_KEY, JSON.stringify(steps));
  } catch (err) {
    console.error('Erro ao salvar passos de pós-venda:', err);
  }
}

export function resetToDemoData(): void {
  localStorage.setItem(LEADS_KEY, JSON.stringify(INITIAL_LEADS));
  localStorage.setItem(MAGNETS_KEY, JSON.stringify(INITIAL_LEAD_MAGNETS));
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_NURTURE_MESSAGES));
  localStorage.setItem(OFFER_KEY, JSON.stringify(INITIAL_OFFER));
  localStorage.setItem(LOYALTY_KEY, JSON.stringify(INITIAL_LOYALTY_STEPS));
}
