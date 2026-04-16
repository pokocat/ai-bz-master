import { useAppStore } from './store/appStore';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { ReportsPage } from './pages/ReportsPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { AccountPage } from './pages/AccountPage';

function MainLayout() {
  const { currentView, toggleSidebar, isSidebarOpen } = useAppStore();

  const renderPage = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardPage />;
      case 'chat': return <ChatPage />;
      case 'reports': return <ReportsPage />;
      case 'subscription': return <SubscriptionPage />;
      case 'account': return <AccountPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-10 flex items-center px-4 border-b border-white/[0.04] bg-[#0a0c12]/60">
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/[0.05] transition-all text-xs"
            title={isSidebarOpen ? '收起侧栏' : '展开侧栏'}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
          <div className="ml-3 flex items-center gap-2 text-xs text-gray-700">
            <span>AI 军师</span>
            <span>/</span>
            <span className="text-gray-500">
              {{
                dashboard: '首页',
                chat: '咨询',
                reports: '报告',
                subscription: '会员',
                account: '账户',
              }[currentView]}
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 flex overflow-hidden ink-bg">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

function App() {
  const isLoggedIn = useAppStore(s => s.isLoggedIn);

  return isLoggedIn ? <MainLayout /> : <LoginPage />;
}

export default App;
