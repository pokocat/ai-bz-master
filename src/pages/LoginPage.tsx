import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { useIsMobile } from '../hooks/useIsMobile';

export function LoginPage() {
  const [name, setName] = useState('');
  const [isEntering, setIsEntering] = useState(false);
  const login = useAppStore(s => s.login);
  const isMobile = useIsMobile();

  const handleLogin = (preset?: string) => {
    setIsEntering(true);
    setTimeout(() => {
      login(preset || name || '张老板');
    }, 600);
  };

  const presetUsers = [
    { name: '张老板', role: '电商创业者', icon: '👨‍💼' },
    { name: '李总',   role: '制造业CEO', icon: '🏭' },
    { name: '王经理', role: '市场总监',   icon: '📊' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ink-bg relative overflow-hidden">
      {/* Background glyphs — hidden on small screens for perf */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute top-10 left-10 text-8xl opacity-5">謀</div>
          <div className="absolute bottom-20 right-20 text-8xl opacity-5">策</div>
          <div className="absolute top-1/3 right-10 text-6xl opacity-5">智</div>
          <div className="absolute bottom-1/3 left-20 text-6xl opacity-5">商</div>
        </div>
      )}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-jade-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative z-10 w-full transition-all duration-500 ${
          isEntering ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${isMobile ? 'px-5 flex flex-col justify-between min-h-screen py-12' : 'max-w-md px-6'}`}
      >
        {/* Logo & Title */}
        <div className={`text-center ${isMobile ? 'pt-8 mb-8' : 'mb-8'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-jade-500/20 to-jade-600/10 border border-jade-500/30 mb-5 animate-pulse-glow">
            <span className="text-4xl">⚔️</span>
          </div>
          <h1 className={`font-bold text-white mb-1 glow-text ${isMobile ? 'text-4xl' : 'text-4xl'}`}>AI 军师</h1>
          <p className="text-jade-400 text-lg font-medium">运筹帷幄 · 决胜商场</p>
          <p className="text-gray-600 text-sm mt-2">智能商业顾问 · 战略规划 · 市场洞察</p>
        </div>

        {/* Login Card */}
        <div className={`${isMobile ? 'flex-1' : ''}`}>
          <div className={`glass-panel rounded-2xl ${isMobile ? 'p-5' : 'p-7'}`}>
            <p className="text-gray-500 text-xs text-center mb-5">选择角色快速进入，或输入您的姓名</p>

            {/* Preset users */}
            <div className="space-y-2.5 mb-5">
              {presetUsers.map(user => (
                <button
                  key={user.name}
                  onClick={() => handleLogin(user.name)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] active:bg-white/[0.08] border border-white/[0.08] active:border-jade-500/40 transition-all duration-150 group active:scale-[0.98]"
                >
                  <span className="text-2xl">{user.icon}</span>
                  <div className="text-left flex-1">
                    <div className="text-white font-medium text-sm">{user.name}</div>
                    <div className="text-gray-600 text-xs">{user.role}</div>
                  </div>
                  <span className="text-gray-600 text-sm">›</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-gray-700 text-xs">或自定义</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Custom name */}
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="输入您的称呼..."
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-jade-500/50 transition-colors"
              />
              <button
                onClick={() => handleLogin()}
                className="px-5 py-3 bg-jade-600 active:bg-jade-500 text-white rounded-xl font-medium text-sm transition-all active:scale-95"
              >
                进入
              </button>
            </div>

            <p className="text-center text-gray-700 text-xs mt-4">无需注册 · 免费体验 · 数据安全</p>
          </div>
        </div>

        {/* Feature pills */}
        <div className={`flex flex-wrap justify-center gap-2 ${isMobile ? 'mt-6 mb-4' : 'mt-5'}`}>
          {['🏆 商业战略', '📊 市场分析', '🛒 电商运营', '📈 数据可视化'].map(tag => (
            <span key={tag} className="px-3 py-1 text-xs bg-white/[0.04] border border-white/[0.08] rounded-full text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
