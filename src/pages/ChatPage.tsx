import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { ADVISORS } from '../data/advisors';
import { INDUSTRIES } from '../data/industries';
import { getMockResponse, QUICK_QUESTIONS } from '../data/mockResponses';
import { ReportPanel } from '../components/ReportPanel';
import type { ReportData, IndustryCategory } from '../types';

// We'll inline a simple markdown renderer since react-markdown needs install
function SimpleMarkdown({ content }: { content: string }) {
  // Basic markdown to HTML conversion
  const lines = content.split('\n');
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**') && !line.slice(2,-2).includes('**')) {
          return <strong key={i} className="text-white block mt-3 mb-1">{line.slice(2,-2)}</strong>;
        }
        if (line.startsWith('# ')) return <h1 key={i} className="text-white text-lg font-bold mt-4 mb-2">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-white text-base font-semibold mt-3 mb-1">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-jade-400 text-sm font-semibold mt-2 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return <div key={i} className="flex gap-2 my-1"><span className="text-jade-400 flex-shrink-0">•</span><span>{renderInline(line.slice(2))}</span></div>;
        }
        if (/^\d+\. /.test(line)) {
          const [num, ...rest] = line.split('. ');
          return <div key={i} className="flex gap-2 my-1"><span className="text-jade-400 flex-shrink-0 font-medium">{num}.</span><span>{renderInline(rest.join('. '))}</span></div>;
        }
        if (line.startsWith('> ')) {
          return <blockquote key={i} className="border-l-2 border-jade-500/50 pl-3 my-2 text-gray-400 italic">{renderInline(line.slice(2))}</blockquote>;
        }
        if (line.startsWith('---')) return <hr key={i} className="border-white/10 my-3" />;
        if (line.trim() === '') return <div key={i} className="h-2" />;
        return <p key={i} className="my-1 leading-relaxed">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Handle **bold** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white">{part.slice(2,-2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-white/10 text-jade-300 px-1 rounded text-xs font-mono">{part.slice(1,-1)}</code>;
    }
    return part;
  });
}

export function ChatPage() {
  const {
    activeConversationId, conversations, selectedAdvisor, selectedIndustry,
    addMessage, isTyping, setIsTyping, spendPoints, startNewConversation, user
  } = useAppStore();

  const [input, setInput] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [showReport, setShowReport] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const advisor = selectedAdvisor || ADVISORS[0];
  const industry = selectedIndustry || 'ecommerce';
  const industryInfo = INDUSTRIES.find(i => i.id === industry);
  const quickQuestions = QUICK_QUESTIONS[industry] || QUICK_QUESTIONS.default;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTyping]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isTyping) return;

    // Ensure we have a conversation
    let convId = activeConversationId;
    if (!convId) {
      convId = startNewConversation();
      if (!convId) return;
    }

    const pointCost = advisor.pointCostPerMessage;
    if (!spendPoints(pointCost)) {
      alert('点数不足，请充值或升级会员！');
      return;
    }

    setInput('');

    // Add user message
    addMessage(convId, {
      role: 'user',
      content,
      timestamp: new Date(),
      pointsUsed: pointCost,
    });

    // Simulate AI response
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const messages = activeConv?.messages || [];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-4 bg-[#0a0c12]/50">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${advisor.color}20`, border: `1px solid ${advisor.color}40` }}
          >
            {advisor.avatar}
          </div>
          <div>
            <div className="text-white font-semibold">{advisor.name}</div>
            <div className="text-gray-500 text-xs flex items-center gap-2">
              <span>{advisor.title}</span>
              <span>·</span>
              <span>{industryInfo?.icon} {industryInfo?.name}</span>
              <span>·</span>
              <span className="text-yellow-400">✦ {advisor.pointCostPerMessage} 点/条</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                <span className="text-yellow-400 text-sm">✦</span>
                <span className="text-yellow-400 text-sm font-medium">{user.points.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4"
                style={{ background: `${advisor.color}15`, border: `1px solid ${advisor.color}30` }}
              >
                {advisor.avatar}
              </div>
              <h3 className="text-white text-xl font-bold mb-2">{advisor.name}</h3>
              <p className="text-jade-600 italic text-sm mb-3">"{advisor.tagline}"</p>
              <p className="text-gray-600 text-sm max-w-md mb-8">{advisor.description}</p>

              {/* Quick questions */}
              <div className="w-full max-w-lg">
                <p className="text-gray-600 text-xs mb-3">快速提问</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map(q => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-left p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-jade-500/40 hover:bg-white/[0.06] transition-all text-sm text-gray-400 hover:text-white"
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
                  className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {msg.role === 'advisor' ? (
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: `${advisor.color}20`, border: `1px solid ${advisor.color}30` }}
                      >
                        {advisor.avatar}
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-jade-600/20 border border-jade-600/30">
                        {user?.avatar || '👤'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-600 text-xs">
                        {msg.role === 'advisor' ? advisor.name : user?.name}
                      </span>
                      <span className="text-gray-700 text-xs">
                        {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.pointsUsed && msg.role === 'user' && (
                        <span className="text-yellow-600 text-xs">-✦{msg.pointsUsed}</span>
                      )}
                    </div>

                    <div className={msg.role === 'user' ? 'chat-bubble-user px-4 py-3 text-white text-sm' : 'chat-bubble-ai px-4 py-4 text-gray-200 text-sm'}>
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
                        className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-jade-500/10 border border-jade-500/30 text-jade-400 text-xs hover:bg-jade-500/20 transition-all"
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
                <div className="flex gap-3 animate-fade-in">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${advisor.color}20`, border: `1px solid ${advisor.color}30` }}
                  >
                    {advisor.avatar}
                  </div>
                  <div className="chat-bubble-ai px-4 py-4">
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

        {/* Input area */}
        <div className="px-6 py-4 border-t border-white/[0.06] bg-[#0a0c12]/30">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-2xl overflow-hidden focus-within:border-jade-500/50 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`向${advisor.name}提问... (Enter发送，Shift+Enter换行)`}
                rows={1}
                className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-600 text-sm resize-none focus:outline-none max-h-40"
                style={{ height: 'auto' }}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 160) + 'px';
                }}
              />
              <div className="px-4 pb-2 flex items-center justify-between">
                <div className="text-gray-700 text-xs">
                  消耗 <span className="text-yellow-500">✦{advisor.pointCostPerMessage}</span> 点 · 余额 <span className="text-yellow-500">{user?.points.toLocaleString()}</span>
                </div>
                <div className="text-gray-700 text-xs">{input.length}/2000</div>
              </div>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isTyping
                  ? 'bg-jade-600 hover:bg-jade-500 text-white'
                  : 'bg-white/[0.05] text-gray-600 cursor-not-allowed'
              }`}
            >
              ↑
            </button>
          </div>
        </div>
      </div>

      {/* Report panel */}
      {showReport && reportData && (
        <ReportPanel
          data={reportData}
          advisorName={advisor.name}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
