import { useAppStore } from '../store/appStore';
import type { AppView } from '../types';
import { ADVISORS } from '../data/advisors';

interface NavItem {
  id: AppView;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: '首页', icon: '🏠' },
  { id: 'chat', label: '咨询军师', icon: '💬' },
  { id: 'reports', label: '分析报告', icon: '📊' },
  { id: 'subscription', label: '会员套餐', icon: '⭐' },
  { id: 'account', label: '我的账户', icon: '👤' },
];

export function Sidebar() {
  const {
    currentView, setView, user, selectedAdvisor,
    conversations, setActiveConversation, isSidebarOpen
  } = useAppStore();

  if (!isSidebarOpen) return null;

  const recentConvs = conversations.slice(0, 5);

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-[#0a0c12] border-r border-white/[0.06] h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-jade-600/40 to-jade-800/20 border border-jade-500/30 flex items-center justify-center text-lg">
            ⚔️
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">AI 军师</div>
            <div className="text-jade-500 text-xs">智能商业顾问</div>
          </div>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03]">
            <span className="text-xl">{user.avatar}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user.name}</div>
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-400 text-xs">✦</span>
                <span className="text-yellow-400 text-xs font-medium">{user.points.toLocaleString()}</span>
                <span className="text-gray-600 text-xs">点数</span>
              </div>
            </div>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
              user.tier === 'enterprise' ? 'bg-purple-500/20 text-purple-400' :
              user.tier === 'pro' ? 'bg-jade-500/20 text-jade-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {user.tier === 'enterprise' ? '企业' : user.tier === 'pro' ? 'Pro' : '免费'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="px-3 py-3 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
              currentView === item.id
                ? 'sidebar-item-active text-white'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {item.id === 'chat' && conversations.length > 0 && (
              <span className="ml-auto text-xs bg-jade-500/20 text-jade-400 px-1.5 py-0.5 rounded-full">
                {conversations.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Current advisor */}
      {selectedAdvisor && (
        <div className="mx-3 mt-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <div className="text-gray-600 text-xs mb-2 font-medium uppercase tracking-wide">当前军师</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedAdvisor.avatar}</span>
            <div>
              <div className="text-white text-sm font-medium">{selectedAdvisor.name}</div>
              <div className="text-gray-600 text-xs">{selectedAdvisor.title}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-yellow-400 text-xs">✦</span>
            <span className="text-gray-500 text-xs">{selectedAdvisor.pointCostPerMessage} 点/条</span>
          </div>
        </div>
      )}

      {/* Recent conversations */}
      {recentConvs.length > 0 && (
        <div className="px-3 mt-3">
          <div className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-2 px-1">
            最近咨询
          </div>
          <div className="space-y-0.5">
            {recentConvs.map(conv => {
              const advisor = ADVISORS.find(a => a.id === conv.advisorId);
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] transition-all text-left"
                >
                  <span>{advisor?.avatar || '💬'}</span>
                  <span className="truncate">{conv.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom: New chat button */}
      <div className="mt-auto p-3 border-t border-white/[0.06]">
        <button
          onClick={() => setView('chat')}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-jade-600/80 hover:bg-jade-500 text-white text-sm font-medium transition-all duration-200"
        >
          <span>+</span>
          <span>新建咨询</span>
        </button>
      </div>
    </aside>
  );
}
