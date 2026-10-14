export type TrafficSourceType = 'instagram' | 'google' | 'ads';

export type TrafficSourceDetail = {
  id: TrafficSourceType;
  name: string;
  badge: string;
  iconName: string;
  description: string;
  channels: string[];
  tips: string[];
};

export type LeadMagnetType = 'ebook' | 'checklist' | 'minicourse' | 'template' | 'diagnosis' | 'calculator';

export interface LeadMagnet {
  id: string;
  type: LeadMagnetType;
  title: string;
  tagline: string;
  description: string;
  format: string; // e.g. "PDF (18 páginas)", "Planilha Google Sheets", "Vídeo-aula (35 min)"
  estimatedValue: string; // e.g. "R$ 97,00"
  downloadCount: number;
}

export type FunnelStageType = 'atrair' | 'capturar' | 'nutrir' | 'ofertar' | 'fidelizar';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  trafficSource: TrafficSourceType;
  leadMagnetId: string;
  leadMagnetTitle: string;
  stage: FunnelStageType;
  notes?: string;
  createdAt: string;
  lastInteractionAt: string;
  nutricaoProgress: number; // 0, 1, 2, 3 emails received
  purchasedOfferId?: string;
  orderValue?: number;
  npsScore?: number;
  feedbackText?: string;
}

export interface NurtureMessage {
  id: number; // 1, 2, 3
  stepTitle: string;
  purpose: string;
  subject: string;
  emailBody: string;
  whatsappBody: string;
  delayDays: number;
}

export interface OfferBenefit {
  id: string;
  title: string;
  description: string;
}

export interface SocialProof {
  id: string;
  author: string;
  role: string;
  avatar: string;
  result: string; // e.g. "+ R$ 42.000 em 30 dias"
  quote: string;
  rating: number;
}

export interface DirectOffer {
  id: string;
  title: string;
  subtitle: string;
  regularPrice: number;
  specialPrice: number;
  discountPercentage: number;
  currency: string;
  ctaText: string;
  ctaSubtext: string;
  scarcityType: 'countdown' | 'limited_slots' | 'bonus_deadline';
  scarcityValue: string; // e.g. "Restam apenas 7 vagas" ou data limite
  countdownEndHours: number;
  benefits: OfferBenefit[];
  socialProofs: SocialProof[];
  guaranteeDays: number;
}

export interface LoyaltyStep {
  id: string;
  type: 'upsell' | 'referral' | 'vip_community';
  title: string;
  description: string;
  rewardOrValue: string;
  status: 'active' | 'draft';
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: 'admin' | 'marketer' | 'sales_rep';
  avatar?: string;
  createdAt: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastChecked?: string;
}
