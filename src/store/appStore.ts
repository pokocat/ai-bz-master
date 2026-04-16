import { create } from 'zustand';
import type {
  User, Advisor, Conversation, Message, AppView, IndustryCategory, SubscriptionTier
} from '../types';
import { ADVISORS } from '../data/advisors';

interface AppState {
  // Auth
  isLoggedIn: boolean;
  user: User | null;

  // Navigation
  currentView: AppView;

  // Advisor selection
  selectedAdvisor: Advisor | null;
  selectedIndustry: IndustryCategory | null;

  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;

  // UI state
  isSidebarOpen: boolean;
  isTyping: boolean;

  // Actions
  login: (name: string) => void;
  logout: () => void;
  setView: (view: AppView) => void;
  selectAdvisor: (advisor: Advisor) => void;
  selectIndustry: (industry: IndustryCategory) => void;
  startNewConversation: () => string;
  addMessage: (conversationId: string, message: Omit<Message, 'id'>) => void;
  setIsTyping: (typing: boolean) => void;
  setActiveConversation: (id: string | null) => void;
  spendPoints: (amount: number) => boolean;
  addPoints: (amount: number) => void;
  upgradeSubscription: (tier: SubscriptionTier) => void;
  toggleSidebar: () => void;
}

const FAKE_USER: User = {
  id: 'user-001',
  name: '张老板',
  avatar: '👨‍💼',
  email: 'zhang@example.com',
  points: 2580,
  tier: 'pro',
  joinedAt: new Date('2024-01-15'),
  totalConsultations: 47,
  totalConsultationMinutes: 342,
  monthlyConsultations: 12,
};

export const useAppStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  currentView: 'dashboard',
  selectedAdvisor: ADVISORS[0],
  selectedIndustry: 'ecommerce',
  conversations: [],
  activeConversationId: null,
  isSidebarOpen: true,
  isTyping: false,

  login: (name: string) => {
    set({
      isLoggedIn: true,
      user: { ...FAKE_USER, name: name || FAKE_USER.name },
    });
  },

  logout: () => {
    set({ isLoggedIn: false, user: null, currentView: 'dashboard' });
  },

  setView: (view: AppView) => {
    set({ currentView: view });
  },

  selectAdvisor: (advisor: Advisor) => {
    set({ selectedAdvisor: advisor });
  },

  selectIndustry: (industry: IndustryCategory) => {
    set({ selectedIndustry: industry });
  },

  startNewConversation: () => {
    const { selectedAdvisor, selectedIndustry, user } = get();
    if (!selectedAdvisor || !selectedIndustry || !user) return '';

    const id = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id,
      title: `${selectedAdvisor.name} · ${new Date().toLocaleDateString('zh-CN')}`,
      advisorId: selectedAdvisor.id,
      industryId: selectedIndustry,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      totalPoints: 0,
    };

    set(state => ({
      conversations: [newConv, ...state.conversations],
      activeConversationId: id,
      currentView: 'chat',
    }));

    return id;
  },

  addMessage: (conversationId: string, message: Omit<Message, 'id'>) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const fullMessage: Message = { ...message, id };

    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, fullMessage],
              updatedAt: new Date(),
              totalPoints: conv.totalPoints + (message.pointsUsed || 0),
            }
          : conv
      ),
    }));
  },

  setIsTyping: (typing: boolean) => {
    set({ isTyping: typing });
  },

  setActiveConversation: (id: string | null) => {
    set({ activeConversationId: id, currentView: id ? 'chat' : 'dashboard' });
  },

  spendPoints: (amount: number): boolean => {
    const { user } = get();
    if (!user || user.points < amount) return false;
    set(state => ({
      user: state.user ? { ...state.user, points: state.user.points - amount } : null,
    }));
    return true;
  },

  addPoints: (amount: number) => {
    set(state => ({
      user: state.user ? { ...state.user, points: state.user.points + amount } : null,
    }));
  },

  upgradeSubscription: (tier: SubscriptionTier) => {
    const pointsMap: Record<SubscriptionTier, number> = {
      free: 0,
      pro: 2000,
      enterprise: 10000,
    };
    set(state => ({
      user: state.user
        ? { ...state.user, tier, points: state.user.points + pointsMap[tier] }
        : null,
    }));
  },

  toggleSidebar: () => {
    set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
  },
}));
