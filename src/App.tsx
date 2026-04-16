import { useAppStore } from './store/appStore';
import { useIsMobile } from './hooks/useIsMobile';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { MobileHeader } from './components/MobileHeader';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { ReportsPage } from './pages/ReportsPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { AccountPage } from './pages/AccountPage';

function renderPage(view: string) {
  switch (view) {
    case 'dashboard':    return <DashboardPage />;
    case 'chat':         return <ChatPage />;
    case 'reports':      return <ReportsPage />;
    case 'subscription': return <SubscriptionPage />;
    case 'account':      return <AccountPage />;
    default:             return <DashboardPage />;
  }
}

function DesktopLayout() {
  const { currentView, toggleSidebar, isSidebarOpen } = useAppStore();

  return (
    <div className="flex h-full overflow-hidden bg-[#0f1117]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top breadcrumb bar */}
        <div className="h-10 flex items-center px-4 border-b border-white/[0.04] bg-[#0a0c12]/60 flex-shrink-0">
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/[0.05] transition-all text-xs"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
          <div className="ml-3 flex items-center gap-2 text-xs text-gray-700">
            <span>AI 军师</span>
            <span>/</span>
            <span className="text-gray-500">
              {{ dashboard: '首页', chat: '咨询', reports: '报告', subscription: '会员', account: '账户' }[currentView as string]}
            </span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden ink-bg">
          {renderPage(currentView)}
        </div>
      </div>
    </div>
  );
}

function MobileLayout() {
  const { currentView } = useAppStore();

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0f1117]">
      {/* Mobile top header */}
      <MobileHeader />

      {/* Page content – fills remaining space */}
      <div className="flex-1 overflow-hidden ink-bg page-enter">
        {renderPage(currentView)}
      </div>

      {/* Bottom navigation tab bar */}
      <BottomNav />
    </div>
  );
}

function MainLayout() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}

export default function App() {
  const isLoggedIn = useAppStore(s => s.isLoggedIn);
  return isLoggedIn ? <MainLayout /> : <LoginPage />;
}
