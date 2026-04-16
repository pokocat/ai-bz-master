import { useAppStore } from '../store/appStore';
import { ADVISORS } from '../data/advisors';
import { INDUSTRIES } from '../data/industries';
import { useIsMobile } from '../hooks/useIsMobile';
import type { IndustryCategory } from '../types';

export function DashboardPage() {
  const {
    user, selectedAdvisor, selectedIndustry,
    selectAdvisor, selectIndustry,
    startNewConversation, setView,
  } = useAppStore();
  const isMobile = useIsMobile();

  const handleStartChat = () => {
    const id = startNewConversation();
    if (!id) setView('chat');
  };

  const stats = [
    { label: '累计咨询', value: user?.totalConsultations ?? 0,    icon: '💬', color: 'text-jade-400' },
    { label: '本月咨询', value: user?.monthlyConsultations ?? 0,  icon: '📅', color: 'text-purple-400' },
    { label: '咨询时长', value: `${user?.totalConsultationMinutes ?? 0}m`, icon: '⏱️', color: 'text-blue-400' },
    { label: '剩余点数', value: user?.points.toLocaleString() ?? 0, icon: '✦', color: 'text-yellow-400' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-5xl mx-auto px-6 py-8'}`}>

          {/* ── Welcome ─────────────────────────────── */}
          <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-6'}`}>
            <span className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>{user?.avatar}</span>
            <div>
              <h1 className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                欢迎回来，{user?.name}
              </h1>
              <p className="text-gray-500 text-xs">运筹帷幄之中，决胜千里之外</p>
            </div>
            {isMobile && (
              <button
                onClick={() => setView('subscription')}
                className="ml-auto flex-shrink-0 px-3 py-1.5 rounded-full bg-jade-600/20 border border-jade-500/30 text-jade-400 text-xs font-medium active:scale-95 transition-transform"
              >
                ⭐ 升级
              </button>
            )}
          </div>

          {/* ── Stats grid ──────────────────────────── */}
          <div className={`grid grid-cols-4 gap-2 ${isMobile ? 'mb-5' : 'mb-8'}`}>
            {stats.map(stat => (
              <div key={stat.label} className={`glass-panel rounded-xl ${isMobile ? 'p-3' : 'p-4'}`}>
                <div className={`font-bold ${stat.color} ${isMobile ? 'text-base' : 'text-xl'}`}>
                  {stat.icon === '✦'
                    ? <><span className="text-xs">✦</span> {stat.value}</>
                    : stat.value}
                </div>
                <div className="text-gray-600 text-[10px] mt-0.5 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── Select Advisor ───────────────────────── */}
          <div className={`${isMobile ? 'mb-5' : 'mb-8'}`}>
            <h2 className={`text-white font-semibold flex items-center gap-2 ${isMobile ? 'text-sm mb-3' : 'text-base mb-4'}`}>
              <span>⚔️</span> 选择您的军师
            </h2>

            {isMobile ? (
              /* Mobile: horizontal scroll carousel */
              <div className="scroll-x -mx-4 px-4">
                {ADVISORS.map(advisor => (
                  <button
                    key={advisor.id}
                    onClick={() => selectAdvisor(advisor)}
                    className={`advisor-card glass-panel rounded-2xl p-4 text-left border w-[200px] transition-all ${
                      selectedAdvisor?.id === advisor.id
                        ? 'selected border-jade-500/60 bg-jade-500/5'
                        : 'border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: `${advisor.color}20`, border: `1px solid ${advisor.color}40` }}
                      >
                        {advisor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm">{advisor.name}</div>
                        <div className="text-gray-500 text-[11px] leading-tight">{advisor.title}</div>
                      </div>
                      {selectedAdvisor?.id === advisor.id && (
                        <span className="text-jade-400 text-sm">✓</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed line-clamp-2 mb-2">{advisor.description}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xs">✦</span>
                      <span className="text-gray-600 text-[11px]">{advisor.pointCostPerMessage}点/条</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Desktop: grid */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ADVISORS.map(advisor => (
                  <button
                    key={advisor.id}
                    onClick={() => selectAdvisor(advisor)}
                    className={`advisor-card glass-panel rounded-xl p-4 text-left border transition-all ${
                      selectedAdvisor?.id === advisor.id
                        ? 'selected border-jade-500/60 bg-jade-500/5'
                        : 'border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: `${advisor.color}20`, border: `1px solid ${advisor.color}40` }}
                      >
                        {advisor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm">{advisor.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{advisor.title}</div>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-yellow-400 text-xs">✦</span>
                          <span className="text-gray-600 text-xs">{advisor.pointCostPerMessage}点/条</span>
                        </div>
                      </div>
                      {selectedAdvisor?.id === advisor.id && (
                        <div className="text-jade-400 text-sm">✓</div>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs mt-3 leading-relaxed line-clamp-2">{advisor.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {advisor.specialties.slice(0, 2).map(s => {
                        const ind = INDUSTRIES.find(i => i.id === s);
                        return ind ? (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                            {ind.icon} {ind.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Industry selector ────────────────────── */}
          <div className={`${isMobile ? 'mb-5' : 'mb-8'}`}>
            <h2 className={`text-white font-semibold flex items-center gap-2 ${isMobile ? 'text-sm mb-3' : 'text-base mb-4'}`}>
              <span>🏭</span> 选择行业类目
            </h2>

            {isMobile ? (
              <div className="scroll-x -mx-4 px-4">
                {INDUSTRIES.map(industry => (
                  <button
                    key={industry.id}
                    onClick={() => selectIndustry(industry.id as IndustryCategory)}
                    className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all duration-150 min-w-[76px] ${
                      selectedIndustry === industry.id
                        ? 'border-jade-500/60 bg-jade-500/10 text-white'
                        : 'border-white/[0.06] bg-white/[0.02] text-gray-500'
                    }`}
                  >
                    <span className="text-2xl">{industry.icon}</span>
                    <span className="text-[11px] font-medium whitespace-nowrap">{industry.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {INDUSTRIES.map(industry => (
                  <button
                    key={industry.id}
                    onClick={() => selectIndustry(industry.id as IndustryCategory)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                      selectedIndustry === industry.id
                        ? 'border-jade-500/60 bg-jade-500/10 text-white'
                        : 'border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/20 hover:text-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{industry.icon}</span>
                    <span className="text-xs font-medium text-center leading-tight">{industry.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── CTA card ─────────────────────────────── */}
          {selectedAdvisor && (
            <div className={`glass-panel rounded-2xl border border-jade-500/20 bg-gradient-to-br from-jade-900/20 to-transparent ${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}`}>
              {isMobile ? (
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${selectedAdvisor.color}20`, border: `1px solid ${selectedAdvisor.color}40` }}
                  >
                    {selectedAdvisor.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm">{selectedAdvisor.name}</div>
                    <div className="text-gray-500 text-xs truncate">
                      {INDUSTRIES.find(i => i.id === selectedIndustry)?.name} ·
                      <span className="text-yellow-400"> ✦{selectedAdvisor.pointCostPerMessage}</span> 点/条
                    </div>
                    <div className="text-jade-600 text-[10px] italic truncate mt-0.5">"{selectedAdvisor.tagline}"</div>
                  </div>
                  <button
                    onClick={handleStartChat}
                    className="flex-shrink-0 px-5 py-2.5 bg-jade-600 active:bg-jade-500 text-white rounded-xl font-semibold text-sm transition-all active:scale-95"
                  >
                    开始 →
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {selectedAdvisor.avatar} 与 {selectedAdvisor.name} 开始咨询
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {INDUSTRIES.find(i => i.id === selectedIndustry)?.name} 行业 ·
                      消耗 <span className="text-yellow-400">{selectedAdvisor.pointCostPerMessage} 点</span>/条消息
                    </p>
                    <p className="text-jade-600 text-xs mt-2 italic">"{selectedAdvisor.tagline}"</p>
                  </div>
                  <button
                    onClick={handleStartChat}
                    className="flex-shrink-0 px-8 py-3 bg-jade-600 hover:bg-jade-500 text-white rounded-xl font-semibold transition-all text-sm hover:shadow-lg hover:shadow-jade-500/25"
                  >
                    开始咨询 →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Quick actions (desktop only) ─────────── */}
          {!isMobile && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: '📊', title: '查看分析报告', desc: '查看历史生成的市场报告', view: 'reports' as const },
                { icon: '⭐', title: '升级会员',     desc: '获取更多点数和高级功能', view: 'subscription' as const },
                { icon: '👤', title: '账户管理',     desc: '查看点数记录和消费详情', view: 'account' as const },
              ].map(item => (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className="flex items-center gap-3 p-4 glass-panel rounded-xl hover:border-white/20 border border-white/[0.06] transition-all text-left"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{item.title}</div>
                    <div className="text-gray-600 text-xs">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── Mobile quick actions ─────────────────── */}
          {isMobile && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: '📊', label: '分析报告', view: 'reports' as const },
                { icon: '⭐', label: '会员套餐', view: 'subscription' as const },
                { icon: '👤', label: '账户',     view: 'account' as const },
              ].map(item => (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className="flex flex-col items-center gap-1.5 p-3 glass-panel rounded-xl border border-white/[0.06] active:scale-95 transition-transform"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-gray-400 text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Bottom spacing on mobile for content above nav bar */}
          {isMobile && <div className="h-4" />}
        </div>
      </div>
    </div>
  );
}
