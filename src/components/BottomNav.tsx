import { useAppStore } from '../store/appStore';
import type { AppView } from '../types';

const NAV_ITEMS: { id: AppView; label: string; icon: string; activeIcon: string }[] = [
  { id: 'dashboard', label: '首页',   icon: '🏠', activeIcon: '🏠' },
  { id: 'chat',      label: '咨询',   icon: '💬', activeIcon: '💬' },
  { id: 'reports',   label: '报告',   icon: '📊', activeIcon: '📊' },
  { id: 'subscription', label: '会员', icon: '⭐', activeIcon: '⭐' },
  { id: 'account',   label: '我的',   icon: '👤', activeIcon: '👤' },
];

export function BottomNav() {
  const { currentView, setView, conversations } = useAppStore();

  return (
    <nav className="bottom-nav flex items-start justify-around px-2 pt-2 flex-shrink-0">
      {NAV_ITEMS.map(item => {
        const active = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`bottom-nav-item flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-w-[52px] relative ${
              active ? 'active' : ''
            }`}
          >
            {/* Badge for chat conversations */}
            {item.id === 'chat' && conversations.length > 0 && !active && (
              <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-jade-500 text-white text-[9px] font-bold flex items-center justify-center">
                {conversations.length > 9 ? '9+' : conversations.length}
              </span>
            )}

            <span className={`nav-icon text-2xl leading-none transition-transform duration-150 ${active ? 'scale-110' : 'scale-100'}`}>
              {active ? item.activeIcon : item.icon}
            </span>

            <span className={`text-[10px] font-medium transition-colors duration-150 ${
              active ? 'text-jade-400' : 'text-gray-600'
            }`}>
              {item.label}
            </span>

            {/* Active indicator dot */}
            {active && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-jade-400" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
