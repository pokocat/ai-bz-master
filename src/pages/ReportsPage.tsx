import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { ADVISORS } from '../data/advisors';
import { INDUSTRIES } from '../data/industries';
import { generateChartData } from '../data/mockResponses';
import { ReportPanel } from '../components/ReportPanel';
import { useIsMobile } from '../hooks/useIsMobile';
import type { ReportData, IndustryCategory } from '../types';

const SAMPLE_REPORTS = [
  { id: 'r1', title: '2024年电商行业深度分析报告',  industry: 'ecommerce'     as IndustryCategory, advisorId: 'ecom-expert',    type: '市场分析', date: '2024-11-15', highlight: '市场规模+13.2%' },
  { id: 'r2', title: '竞争格局与市场机会评估',       industry: 'ecommerce'     as IndustryCategory, advisorId: 'sunzi',          type: '竞争分析', date: '2024-11-10', highlight: 'CR3: 42%' },
  { id: 'r3', title: '科技行业数字化转型白皮书',     industry: 'tech'          as IndustryCategory, advisorId: 'tech-guru',      type: '战略规划', date: '2024-11-05', highlight: 'AI赋能+65%' },
  { id: 'r4', title: '金融市场风险评估与投资建议',   industry: 'finance'       as IndustryCategory, advisorId: 'market-analyst', type: '风险评估', date: '2024-10-28', highlight: '夏普比率 1.8' },
  { id: 'r5', title: '制造业供应链优化策略报告',     industry: 'manufacturing' as IndustryCategory, advisorId: 'secretary',      type: '运营优化', date: '2024-10-20', highlight: '成本降低18%' },
  { id: 'r6', title: '餐饮行业增长策略分析',         industry: 'food'          as IndustryCategory, advisorId: 'zhuge',          type: '增长策略', date: '2024-10-15', highlight: '同店增长22%' },
];

const TYPE_COLORS: Record<string, string> = {
  '市场分析': 'text-jade-400 bg-jade-400/10',
  '竞争分析': 'text-yellow-400 bg-yellow-400/10',
  '战略规划': 'text-purple-400 bg-purple-400/10',
  '风险评估': 'text-red-400 bg-red-400/10',
  '运营优化': 'text-blue-400 bg-blue-400/10',
  '增长策略': 'text-pink-400 bg-pink-400/10',
};

export function ReportsPage() {
  const { } = useAppStore();
  const isMobile = useIsMobile();
  const [activeReport, setActiveReport] = useState<ReportData | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? SAMPLE_REPORTS : SAMPLE_REPORTS.filter(r => r.type === filter);
  const types = ['all', ...Array.from(new Set(SAMPLE_REPORTS.map(r => r.type)))];

  const openReport = (report: typeof SAMPLE_REPORTS[0]) => {
    setActiveReport({
      type: 'market',
      title: report.title,
      industry: report.industry,
      generatedAt: new Date(report.date),
      sections: [
        { title: '市场概览',  content: `${INDUSTRIES.find(i => i.id === report.industry)?.name}行业2024年市场规模预计达到2.8万亿元，同比增长13.2%。`, highlight: 'CAGR 13.2%' },
        { title: '竞争格局',  content: '头部3家企业占42%份额，差异化竞争是破局关键。', highlight: 'CR3: 42%' },
        { title: '用户洞察',  content: '核心用户25-40岁，复购率提升明显，体验经济崛起。', highlight: '复购率+18%' },
        { title: '战略建议',  content: '聚焦差异化竞争，持续投入技术赋能与用户体验，构建长期护城河。' },
      ],
      charts: generateChartData(report.industry),
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className={`${isMobile ? 'px-4 py-4' : 'px-6 py-8 max-w-4xl mx-auto'}`}>

          {/* Header */}
          <div className={`flex items-center justify-between ${isMobile ? 'mb-4' : 'mb-6'}`}>
            <div>
              <h1 className={`text-white font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>分析报告库</h1>
              {!isMobile && <p className="text-gray-500 text-sm mt-0.5">AI军师生成的深度行业分析与可视化报告</p>}
            </div>
            <button className={`bg-jade-600/80 text-white rounded-xl font-medium transition-all active:scale-95 ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm hover:bg-jade-500'}`}>
              + 生成新报告
            </button>
          </div>

          {/* Filter tabs — horizontal scroll on mobile */}
          <div className="scroll-x -mx-4 px-4 mb-4">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 active:scale-95 ${
                  filter === type
                    ? 'bg-jade-600/80 text-white'
                    : 'bg-white/[0.05] text-gray-500'
                }`}
              >
                {type === 'all' ? '全部类型' : type}
              </button>
            ))}
          </div>

          {/* Reports grid */}
          <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-2 gap-4'}`}>
            {filtered.map(report => {
              const advisor = ADVISORS.find(a => a.id === report.advisorId);
              const industry = INDUSTRIES.find(i => i.id === report.industry);
              const typeColor = TYPE_COLORS[report.type] || 'text-gray-400 bg-gray-400/10';

              return (
                <div
                  key={report.id}
                  onClick={() => openReport(report)}
                  className={`report-card rounded-xl cursor-pointer active:scale-[0.99] transition-transform ${isMobile ? 'p-4' : 'p-5'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor}`}>{report.type}</span>
                      <span className="text-gray-600 text-xs">{industry?.icon} {industry?.name}</span>
                    </div>
                    <span className="text-gray-700 text-xs flex-shrink-0 ml-2">{report.date}</span>
                  </div>

                  <h3 className={`text-white font-semibold leading-tight ${isMobile ? 'text-sm' : 'text-sm mb-2'}`}>{report.title}</h3>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: `${advisor?.color}20` }}
                      >
                        {advisor?.avatar}
                      </span>
                      <span className="text-gray-600 text-xs">{advisor?.name}</span>
                    </div>
                    <span className="text-jade-400 font-bold text-sm">{report.highlight} →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {isMobile && <div className="h-4" />}
        </div>
      </div>

      {activeReport && (
        <ReportPanel
          data={activeReport}
          advisorName={ADVISORS.find(a => SAMPLE_REPORTS.find(r => r.industry === activeReport.industry)?.advisorId === a.id)?.name || 'AI军师'}
          onClose={() => setActiveReport(null)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
