import { useState } from 'react';
import { useAppStore } from '../store/appStore';

export function LoginPage() {
  const [name, setName] = useState('');
  const [isEntering, setIsEntering] = useState(false);
  const login = useAppStore(s => s.login);

  const handleLogin = (preset?: string) => {
    setIsEntering(true);
    setTimeout(() => {
      login(preset || name || '张老板');
    }, 800);
  };

  const presetUsers = [
    { name: '张老板', role: '电商创业者', icon: '👨‍💼' },
    { name: '李总', role: '制造业CEO', icon: '🏭' },
    { name: '王经理', role: '市场总监', icon: '📊' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center ink-bg relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl opacity-5 select-none">謀</div>
        <div className="absolute bottom-20 right-20 text-8xl opacity-5 select-none">策</div>
        <div className="absolute top-1/3 right-10 text-6xl opacity-5 select-none">智</div>
        <div className="absolute bottom-1/3 left-20 text-6xl opacity-5 select-none">商</div>
        <div className="absolute top-20 right-1/3 text-5xl opacity-5 select-none">勝</div>
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-jade-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className={`relative z-10 w-full max-w-md px-6 transition-all duration-700 ${isEntering ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-jade-500/20 to-jade-600/10 border border-jade-500/30 mb-6 animate-pulse-glow">
            <span className="text-4xl">⚔️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 glow-text">AI 军师</h1>
          <p className="text-jade-400 text-lg font-medium">运筹帷幄 · 决胜商场</p>
          <p className="text-gray-500 text-sm mt-2">智能商业顾问 · 战略规划 · 市场洞察</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl p-8">
          <p className="text-gray-400 text-sm text-center mb-6">
            选择角色快速进入，或输入您的姓名
          </p>

          {/* Preset users */}
          <div className="space-y-3 mb-6">
            {presetUsers.map(user => (
              <button
                key={user.name}
                onClick={() => handleLogin(user.name)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-jade-500/40 transition-all duration-200 group"
              >
                <span className="text-2xl">{user.icon}</span>
                <div className="text-left">
                  <div className="text-white font-medium group-hover:text-jade-300 transition-colors">{user.name}</div>
                  <div className="text-gray-500 text-sm">{user.role}</div>
                </div>
                <div className="ml-auto text-gray-600 group-hover:text-jade-400 transition-colors">→</div>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-sm">或自定义</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Custom name input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="输入您的称呼..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-jade-500/50 transition-colors"
            />
            <button
              onClick={() => handleLogin()}
              className="px-6 py-3 bg-jade-600 hover:bg-jade-500 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-jade-500/25"
            >
              进入
            </button>
          </div>

          <p className="text-center text-gray-600 text-xs mt-4">
            无需注册 · 免费体验 · 数据安全
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {['🏆 商业战略', '📊 市场分析', '🛒 电商运营', '📈 数据可视化', '🤖 AI军师'].map(tag => (
            <span key={tag} className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-gray-500">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
