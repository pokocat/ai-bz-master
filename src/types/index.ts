export type AdvisorStyle = 'ancient' | 'secretary' | 'analyst' | 'ecommerce' | 'finance' | 'tech';

export type IndustryCategory =
  | 'ecommerce'
  | 'finance'
  | 'tech'
  | 'manufacturing'
  | 'healthcare'
  | 'education'
  | 'retail'
  | 'real-estate'
  | 'food'
  | 'logistics';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export type MessageRole = 'user' | 'advisor';

export type ReportType = 'market' | 'competitor' | 'strategy' | 'ecommerce' | 'financial';

export interface Advisor {
  id: string;
  name: string;
  title: string;
  style: AdvisorStyle;
  avatar: string;
  description: string;
  tagline: string;
  personality: string;
  specialties: IndustryCategory[];
  pointCostPerMessage: number;
  color: string;
  bgGradient: string;
}

export interface Industry {
  id: IndustryCategory;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  advisorId?: string;
  pointsUsed?: number;
  hasReport?: boolean;
  reportData?: ReportData;
}

export interface Conversation {
  id: string;
  title: string;
  advisorId: string;
  industryId: IndustryCategory;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  totalPoints: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  points: number;
  tier: SubscriptionTier;
  joinedAt: Date;
  totalConsultations: number;
  totalConsultationMinutes: number;
  monthlyConsultations: number;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  pointsPerMonth: number;
  features: string[];
  maxConsultationsPerDay: number;
  color: string;
  featured?: boolean;
}

export interface ReportData {
  type: ReportType;
  title: string;
  industry: IndustryCategory;
  generatedAt: Date;
  sections: ReportSection[];
  charts: ChartData[];
}

export interface ReportSection {
  title: string;
  content: string;
  highlight?: string;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'radar' | 'area';
  title: string;
  data: Record<string, unknown>[];
  dataKeys: string[];
  colors: string[];
}

export type AppView = 'dashboard' | 'chat' | 'reports' | 'subscription' | 'account';
