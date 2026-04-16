import { useAppStore } from '../store/appStore';
import type { AppView } from '../types';

const PAGE_TITLES: Record<AppView, string> = {
  dashboard: '首页',
  chat: '咨询军师',
  reports: '分析报告',
  subscription: '会员套餐',
  account: '我的账户',
};

const PAGE_ICONS: Record<AppView, string> = {
  dashboard: '🏠',
  chat: '💬',
  reports: '📊',
  subscription: '⭐',
  account: '👤',
};

export function MobileHeader() {
  const { currentView, user, setView, selectedAdvisor } = useAppStore();

  const isChat = currentView === 'chat';

  return (
    <header className="mobile-header flex-shrink-0 flex items-center h-12 px-4 gap-3">
      {/* Left: logo or back */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isChat ? (
          <>
            <button
              onClick={() => setView('dashboard')}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 active:bg-white/10 transition-colors flex-shrink-0"
            >
              ‹
            </button>
            {selectedAdvisor && (
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${selectedAdvisor.color}20`, border: `1px solid ${selectedAdvisor.color}30` }}
                >
                  {selectedAdvisor.avatar}
                </span>
                <div className="min-w-0">
                  <div className="text-white text-sm font-semibold leading-tight truncate">
                    {selectedAdvisor.name}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <span className="text-lg">{PAGE_ICONS[currentView]}</span>
            <span className="text-white font-semibold text-base">{PAGE_TITLES[currentView]}</span>
          </>
        )}
      </div>

      {/* Right: brand logo + points pill */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {user && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20">
            <span className="text-yellow-400 text-xs">✦</span>
            <span className="text-yellow-400 text-xs font-semibold">{user.points.toLocaleString()}</span>
          </div>
        )}
        {!isChat && (
          <div className="w-7 h-7 rounded-lg bg-jade-600/20 border border-jade-500/30 flex items-center justify-center">
            <span className="text-sm">⚔️</span>
          </div>
        )}
      </div>
    </header>
  );
}
