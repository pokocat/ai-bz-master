import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { ADVISORS } from '../data/advisors';
import { INDUSTRIES } from '../data/industries';
import { getMockResponse, QUICK_QUESTIONS } from '../data/mockResponses';
import { ReportPanel } from '../components/ReportPanel';
import { useIsMobile } from '../hooks/useIsMobile';
import type { ReportData, IndustryCategory } from '../types';

// ── Inline markdown renderer ──────────────────────────────
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith('# '))  return <h1 key={i} className="text-white text-base font-bold mt-3 mb-1">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-white text-sm font-semibold mt-2 mb-1">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-jade-400 text-sm font-semibold mt-2 mb-0.5">{line.slice(4)}</h3>;
        if (line.startsWith('**') && line.endsWith('**') && !line.slice(2,-2).includes('**'))
          return <strong key={i} className="text-white block mt-2 mb-0.5">{line.slice(2,-2)}</strong>;
        if (line.startsWith('- ') || line.startsWith('* '))
          return <div key={i} className="flex gap-2 my-0.5"><span className="text-jade-400 flex-shrink-0">•</span><span>{renderInline(line.slice(2))}</span></div>;
        if (/^\d+\. /.test(line)) {
          const [num, ...rest] = line.split('. ');
          return <div key={i} className="flex gap-2 my-0.5"><span className="text-jade-400 flex-shrink-0 font-medium">{num}.</span><span>{renderInline(rest.join('. '))}</span></div>;
        }
        if (line.startsWith('> '))
          return <blockquote key={i} className="border-l-2 border-jade-500/50 pl-3 my-1.5 text-gray-400 italic">{renderInline(line.slice(2))}</blockquote>;
        if (line.startsWith('---')) return <hr key={i} className="border-white/10 my-2" />;
        if (line.trim() === '') return <div key={i} className="h-1.5" />;
        return <p key={i} className="my-0.5 leading-relaxed">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="text-white">{part.slice(2,-2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="bg-white/10 text-jade-300 px-1 rounded text-xs font-mono">{part.slice(1,-1)}</code>;
    return part;
  });
}

// ── ChatPage ──────────────────────────────────────────────
export function ChatPage() {
  const {
    activeConversationId, conversations, selectedAdvisor, selectedIndustry,
    addMessage, isTyping, setIsTyping, spendPoints, startNewConversation, user,
  } = useAppStore();
  const isMobile = useIsMobile();

  const [input, setInput] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [showReport, setShowReport] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const advisor = selectedAdvisor || ADVISORS[0];
  const industry = selectedIndustry || 'ecommerce';
  const industryInfo = INDUSTRIES.find(i => i.id === industry);
  const quickQuestions = QUICK_QUESTIONS[industry] || QUICK_QUESTIONS.default;
  const messages = activeConv?.messages || [];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, isTyping]);

  // On mobile: scroll page up when keyboard appears so input stays visible
  useEffect(() => {
    if (!isMobile) return;
    const handleResize = () => {
      const el = scrollContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    };
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const autoResizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, isMobile ? 120 : 160) + 'px';
  };

  const handleSend = (text?: string) => {
    const content = (text || input).trim();
    if (!content || isTyping) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = startNewConversation();
      if (!convId) return;
    }

    if (!spendPoints(advisor.pointCostPerMessage)) {
      alert('点数不足，请充值或升级会员！');
      return;
    }

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    addMessage(convId, {
      role: 'user',
      content,
      timestamp: new Date(),
      pointsUsed: advisor.pointCostPerMessage,
    });

    setIsTyping(true);
    const delay = 1200 + Math.random() * 1500;
    setTimeout(() => {
      const response = getMockResponse(content, advisor.style, industry as IndustryCategory);
      setIsTyping(false);
      addMessage(convId!, {
        role: 'advisor',
        content: response.content,
        timestamp: new Date(),
        advisorId: advisor.id,
        hasReport: response.hasReport,
        reportData: response.hasReport ? {
          type: 'market',
          title: response.reportTitle || '行业分析报告',
          industry: industry as IndustryCategory,
          generatedAt: new Date(),
          sections: response.reportSections || [],
          charts: response.chartData || [],
        } : undefined,
      });
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    /* On mobile use dvh and avoid any extra scroll wrapper */
    <div className="flex h-full overflow-hidden">
      {/* ── Chat column ─────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Chat sub-header (desktop only – mobile uses MobileHeader) */}
        {!isMobile && (
          <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-3 bg-[#0a0c12]/50 flex-shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${advisor.color}20`, border: `1px solid ${advisor.color}40` }}
            >
              {advisor.avatar}
            </div>
            <div>
              <div className="text-white font-semibold">{advisor.name}</div>
              <div className="text-gray-500 text-xs flex items-center gap-1.5">
                <span>{advisor.title}</span>
                <span>·</span>
                <span>{industryInfo?.icon} {industryInfo?.name}</span>
                <span>·</span>
                <span className="text-yellow-400">✦{advisor.pointCostPerMessage} 点/条</span>
              </div>
            </div>
            <div className="ml-auto">
              {user && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                  <span className="text-yellow-400 text-sm">✦</span>
                  <span className="text-yellow-400 text-sm font-medium">{user.points.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages area */}
        <div
          ref={scrollContainerRef}
          className={`flex-1 overflow-y-auto ${isMobile ? 'px-3 py-3' : 'px-6 py-5'} space-y-4`}
        >
          {messages.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div
                className={`rounded-2xl flex items-center justify-center mb-3 ${isMobile ? 'w-16 h-16 text-3xl' : 'w-20 h-20 text-4xl'}`}
                style={{ background: `${advisor.color}15`, border: `1px solid ${advisor.color}30` }}
              >
                {advisor.avatar}
              </div>
              <h3 className={`text-white font-bold mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}>{advisor.name}</h3>
              <p className="text-jade-600 italic text-xs mb-2">"{advisor.tagline}"</p>
              <p className="text-gray-600 text-xs max-w-xs mb-6 leading-relaxed">{advisor.description}</p>

              {/* Quick questions */}
              <div className="w-full max-w-sm">
                <p className="text-gray-600 text-xs mb-2">快速提问</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map(q => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className={`text-left rounded-xl bg-white/[0.03] border border-white/[0.08] active:bg-white/[0.08] transition-all text-xs text-gray-400 active:scale-[0.97] ${isMobile ? 'p-2.5' : 'p-3 hover:border-jade-500/40 hover:bg-white/[0.06] hover:text-white'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 self-end">
                    {msg.role === 'advisor' ? (
                      <div
                        className={`rounded-xl flex items-center justify-center ${isMobile ? 'w-8 h-8 text-base' : 'w-9 h-9 text-lg'}`}
                        style={{ background: `${advisor.color}20`, border: `1px solid ${advisor.color}30` }}
                      >
                        {advisor.avatar}
                      </div>
                    ) : (
                      <div className={`rounded-xl flex items-center justify-center bg-jade-600/20 border border-jade-600/30 ${isMobile ? 'w-8 h-8 text-base' : 'w-9 h-9 text-lg'}`}>
                        {user?.avatar || '👤'}
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`flex flex-col ${isMobile ? 'max-w-[82%]' : 'max-w-[75%]'} ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {/* Meta */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-gray-600 text-[10px]">
                        {msg.role === 'advisor' ? advisor.name : user?.name}
                      </span>
                      <span className="text-gray-700 text-[10px]">
                        {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.pointsUsed && msg.role === 'user' && (
                        <span className="text-yellow-600 text-[10px]">-✦{msg.pointsUsed}</span>
                      )}
                    </div>

                    <div className={`${msg.role === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-ai text-gray-200'} ${isMobile ? 'px-3 py-2.5 text-[13px]' : 'px-4 py-3 text-sm'}`}>
                      {msg.role === 'advisor' ? (
                        <div className={advisor.style === 'ancient' ? 'ancient-style' : ''}>
                          <SimpleMarkdown content={msg.content} />
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>

                    {/* Report button */}
                    {msg.hasReport && msg.reportData && (
                      <button
                        onClick={() => { setReportData(msg.reportData!); setShowReport(true); }}
                        className={`mt-1.5 flex items-center gap-1.5 rounded-lg bg-jade-500/10 border border-jade-500/30 text-jade-400 active:bg-jade-500/20 transition-all ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs hover:bg-jade-500/20'}`}
                      >
                        <span>📊</span>
                        <span>查看可视化分析报告</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2 animate-fade-in">
                  <div
                    className={`rounded-xl flex items-center justify-center flex-shrink-0 ${isMobile ? 'w-8 h-8 text-base' : 'w-9 h-9 text-lg'}`}
                    style={{ background: `${advisor.color}20`, border: `1px solid ${advisor.color}30` }}
                  >
                    {advisor.avatar}
                  </div>
                  <div className={`chat-bubble-ai ${isMobile ? 'px-3 py-2.5' : 'px-4 py-3'}`}>
                    <div className="typing-dots flex items-center gap-1 h-4">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input bar */}
        <div className={`chat-input-bar border-t border-white/[0.06] bg-[#0a0c12]/60 flex-shrink-0 ${isMobile ? 'px-3 pt-2' : 'px-5 pt-3 pb-3'}`}>
          {isMobile ? (
            /* Mobile: single row, icon send button */
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-2xl overflow-hidden focus-within:border-jade-500/40 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => { setInput(e.target.value); autoResizeTextarea(e.target); }}
                  onKeyDown={handleKeyDown}
                  placeholder={`问 ${advisor.name}...`}
                  rows={1}
                  className="w-full bg-transparent px-3 py-2.5 text-white placeholder-gray-600 text-sm resize-none focus:outline-none"
                  style={{ maxHeight: 120 }}
                />
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={`flex-shrink-0 w-10 h-10 mb-0.5 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                  input.trim() && !isTyping
                    ? 'bg-jade-600 text-white'
                    : 'bg-white/[0.06] text-gray-600'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </button>
            </div>
          ) : (
            /* Desktop: multi-row with footer hint */
            <div className="flex gap-3 items-end">
              <div className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-2xl overflow-hidden focus-within:border-jade-500/50 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => { setInput(e.target.value); autoResizeTextarea(e.target); }}
                  onKeyDown={handleKeyDown}
                  placeholder={`向${advisor.name}提问... (Enter 发送，Shift+Enter 换行)`}
                  rows={1}
                  className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-600 text-sm resize-none focus:outline-none"
                  style={{ maxHeight: 160 }}
                />
                <div className="px-4 pb-2 flex items-center justify-between">
                  <span className="text-gray-700 text-xs">
                    消耗 <span className="text-yellow-500">✦{advisor.pointCostPerMessage}</span> 点 · 余额{' '}
                    <span className="text-yellow-500">{user?.points.toLocaleString()}</span>
                  </span>
                  <span className="text-gray-700 text-xs">{input.length}/2000</span>
                </div>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !isTyping
                    ? 'bg-jade-600 hover:bg-jade-500 text-white'
                    : 'bg-white/[0.05] text-gray-600 cursor-not-allowed'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Report panel — desktop side panel, mobile bottom sheet */}
      {showReport && reportData && (
        <ReportPanel
          data={reportData}
          advisorName={advisor.name}
          onClose={() => setShowReport(false)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
