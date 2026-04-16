import { useAppStore } from '../store/appStore';
import { ADVISORS } from '../data/advisors';
import { useIsMobile } from '../hooks/useIsMobile';

const POINT_HISTORY = [
  { date: '2024-11-15', desc: '与诸葛军师咨询 · 电商策略分析',  points: -15,   type: 'spend' },
  { date: '2024-11-14', desc: 'Pro订阅月度点数发放',             points: +3000, type: 'earn'  },
  { date: '2024-11-13', desc: '与孙子策士咨询 · 竞争分析报告',  points: -24,   type: 'spend' },
  { date: '2024-11-12', desc: '与电商导师咨询 · 双11运营策略',  points: -20,   type: 'spend' },
  { date: '2024-11-10', desc: '点数充值 · ¥88充值套餐',          points: +3300, type: 'earn'  },
  { date: '2024-11-08', desc: '与市场分析师咨询 · 市场趋势',    points: -10,   type: 'spend' },
  { date: '2024-11-05', desc: '与科技先锋咨询 · 数字化转型',    points: -15,   type: 'spend' },
];

export function AccountPage() {
  const { user, logout, conversations, setView } = useAppStore();
  const isMobile = useIsMobile();

  if (!user) return null;

  const tierLabel = user.tier === 'enterprise' ? '企业旗舰版' : user.tier === 'pro' ? 'Pro专业版' : '免费版';
  const tierColor = user.tier === 'enterprise' ? 'text-purple-400' : user.tier === 'pro' ? 'text-jade-400' : 'text-gray-400';

  const favoriteAdvisor = ADVISORS[0];

  const stats = [
    { label: '剩余点数', value: user.points.toLocaleString(), icon: '✦', color: 'text-yellow-400' },
    { label: '累计咨询', value: `${user.totalConsultations}次`,          icon: '💬', color: 'text-jade-400' },
    { label: '咨询时长', value: `${user.totalConsultationMinutes}m`,     icon: '⏱️', color: 'text-blue-400' },
    { label: '本月咨询', value: `${user.monthlyConsultations}次`,        icon: '📅', color: 'text-purple-400' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-3xl mx-auto px-6 py-8'}`}>

        {/* Profile */}
        <div className={`glass-panel rounded-2xl border border-white/[0.08] ${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl bg-jade-600/20 border border-jade-600/30 flex items-center justify-center flex-shrink-0 ${isMobile ? 'w-14 h-14 text-2xl' : 'w-16 h-16 text-3xl'}`}>
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className={`text-white font-bold truncate ${isMobile ? 'text-lg' : 'text-xl'}`}>{user.name}</h1>
              <div className="text-gray-500 text-xs">{user.email}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium ${tierColor}`}>⭐ {tierLabel}</span>
                <span className="text-gray-600 text-xs">·</span>
                <span className="text-gray-600 text-xs">{new Date(user.joinedAt).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
            {isMobile ? (
              <button
                onClick={logout}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 text-xs active:bg-red-500/10 transition-all"
              >
                退出
              </button>
            ) : (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all"
              >
                退出登录
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-4 gap-2 ${isMobile ? 'mb-4' : 'mb-6'}`}>
          {stats.map(stat => (
            <div key={stat.label} className={`glass-panel rounded-xl border border-white/[0.06] ${isMobile ? 'p-3' : 'p-4'}`}>
              <div className={`font-bold ${stat.color} ${isMobile ? 'text-sm' : 'text-xl'}`}>
                {stat.icon === '✦' ? <><span className="text-[10px]">✦</span> {stat.value}</> : stat.value}
              </div>
              <div className="text-gray-600 text-[10px] mt-0.5 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Upgrade prompt (mobile) */}
        {isMobile && user.tier === 'free' && (
          <button
            onClick={() => setView('subscription')}
            className="w-full mb-4 p-4 glass-panel rounded-2xl border border-jade-500/20 bg-gradient-to-r from-jade-900/20 to-transparent flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <span className="text-2xl">⭐</span>
            <div className="text-left">
              <div className="text-white font-semibold text-sm">升级至 Pro</div>
              <div className="text-gray-500 text-xs">每月3000点数 · 全部军师解锁</div>
            </div>
            <span className="ml-auto text-jade-400 text-lg">›</span>
          </button>
        )}

        {/* Favorite advisor */}
        <div className={`glass-panel rounded-xl border border-white/[0.06] ${isMobile ? 'p-4 mb-4' : 'p-5 mb-6'}`}>
          <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-3">最常用军师</div>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${favoriteAdvisor.color}20`, border: `1px solid ${favoriteAdvisor.color}40` }}
            >
              {favoriteAdvisor.avatar}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{favoriteAdvisor.name}</div>
              <div className="text-gray-500 text-xs">{favoriteAdvisor.title}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-jade-400 font-bold">{conversations.length || 3}次</div>
              <div className="text-gray-600 text-xs">咨询次数</div>
            </div>
          </div>
        </div>

        {/* Points history */}
        <div className={`glass-panel rounded-xl border border-white/[0.06] overflow-hidden ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <div className={`border-b border-white/[0.06] ${isMobile ? 'px-4 py-3' : 'px-5 py-4'}`}>
            <h3 className="text-white font-semibold text-sm">点数明细</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {POINT_HISTORY.map((item, i) => (
              <div key={i} className={`flex items-center justify-between ${isMobile ? 'px-4 py-2.5' : 'px-5 py-3'}`}>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-300 text-xs truncate">{item.desc}</div>
                  <div className="text-gray-700 text-[10px] mt-0.5">{item.date}</div>
                </div>
                <span className={`font-bold text-sm ml-3 flex-shrink-0 ${item.type === 'earn' ? 'text-jade-400' : 'text-gray-500'}`}>
                  {item.type === 'earn' ? '+' : ''}{item.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="glass-panel rounded-xl border border-white/[0.06] overflow-hidden">
          <div className={`border-b border-white/[0.06] ${isMobile ? 'px-4 py-3' : 'px-5 py-4'}`}>
            <h3 className="text-white font-semibold text-sm">账户设置</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {[
              { label: '通知设置', desc: '接收咨询提醒和报告推送', icon: '🔔' },
              { label: '数据隐私', desc: '管理您的咨询数据和隐私', icon: '🔒' },
              { label: '帮助与支持', desc: '使用指南和客户服务',   icon: '❓' },
            ].map(item => (
              <button key={item.label} className={`w-full flex items-center gap-3 active:bg-white/[0.03] transition-all text-left ${isMobile ? 'px-4 py-3' : 'px-5 py-4 hover:bg-white/[0.03]'}`}>
                <span className={`${isMobile ? 'text-lg' : 'text-xl'}`}>{item.icon}</span>
                <div>
                  <div className="text-white text-sm">{item.label}</div>
                  <div className="text-gray-600 text-xs">{item.desc}</div>
                </div>
                <span className="ml-auto text-gray-600">›</span>
              </button>
            ))}
          </div>
        </div>

        {!isMobile && (
          <div className="mt-6 flex justify-center">
            <button onClick={logout} className="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all">
              退出登录
            </button>
          </div>
        )}

        {isMobile && <div className="h-4" />}
      </div>
    </div>
  );
}
