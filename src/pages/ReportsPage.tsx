import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { ADVISORS } from '../data/advisors';
import { INDUSTRIES } from '../data/industries';
import { generateChartData } from '../data/mockResponses';
import { ReportPanel } from '../components/ReportPanel';
import type { ReportData, IndustryCategory } from '../types';

const SAMPLE_REPORTS: Array<{
  id: string;
  title: string;
  industry: IndustryCategory;
  advisorId: string;
  type: string;
  date: string;
  highlight: string;
}> = [
  { id: 'r1', title: '2024年电商行业深度分析报告', industry: 'ecommerce', advisorId: 'ecom-expert', type: '市场分析', date: '2024-11-15', highlight: '市场规模增长13.2%' },
  { id: 'r2', title: '竞争格局与市场机会评估', industry: 'ecommerce', advisorId: 'sunzi', type: '竞争分析', date: '2024-11-10', highlight: 'CR3: 42%' },
  { id: 'r3', title: '科技行业数字化转型白皮书', industry: 'tech', advisorId: 'tech-guru', type: '战略规划', date: '2024-11-05', highlight: 'AI赋能效率+65%' },
  { id: 'r4', title: '金融市场风险评估与投资建议', industry: 'finance', advisorId: 'market-analyst', type: '风险评估', date: '2024-10-28', highlight: '夏普比率 1.8' },
  { id: 'r5', title: '制造业供应链优化策略报告', industry: 'manufacturing', advisorId: 'secretary', type: '运营优化', date: '2024-10-20', highlight: '成本降低18%' },
  { id: 'r6', title: '餐饮行业增长策略分析', industry: 'food', advisorId: 'zhuge', type: '增长策略', date: '2024-10-15', highlight: '同店增长22%' },
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
  const [activeReport, setActiveReport] = useState<ReportData | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredReports = filter === 'all'
    ? SAMPLE_REPORTS
    : SAMPLE_REPORTS.filter(r => r.type === filter);

  const handleOpenReport = (report: typeof SAMPLE_REPORTS[0]) => {
    const rd: ReportData = {
      type: 'market',
      title: report.title,
      industry: report.industry,
      generatedAt: new Date(report.date),
      sections: [
        { title: '市场概览', content: `${INDUSTRIES.find(i => i.id === report.industry)?.name}行业2024年市场规模预计达到2.8万亿元，同比增长13.2%。行业整体保持稳健增长态势。`, highlight: 'CAGR 13.2%' },
        { title: '竞争格局', content: '市场集中度适中，头部3家企业占据42%份额，中小企业仍有较大增长空间，差异化竞争是破局关键。', highlight: 'CR3: 42%' },
        { title: '用户洞察', content: '核心用户群体为25-40岁中产消费者，决策周期缩短，品牌忠诚度提升，体验经济崛起。', highlight: '复购率 +18%' },
        { title: '战略建议', content: '建议聚焦差异化竞争策略，在技术赋能和用户体验上持续投入，构建长期护城河，避免陷入价格战泥潭。' },
      ],
      charts: generateChartData(report.industry),
    };
    setActiveReport(rd);
  };

  const types = ['all', ...Array.from(new Set(SAMPLE_REPORTS.map(r => r.type)))];

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">分析报告库</h1>
              <p className="text-gray-500 text-sm">AI军师生成的深度行业分析与可视化报告</p>
            </div>
            <button className="px-4 py-2 bg-jade-600/80 hover:bg-jade-500 text-white text-sm rounded-xl transition-all">
              + 生成新报告
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === type
                    ? 'bg-jade-600/80 text-white'
                    : 'bg-white/[0.05] text-gray-500 hover:text-gray-300 hover:bg-white/[0.08]'
                }`}
              >
                {type === 'all' ? '全部类型' : type}
              </button>
            ))}
          </div>

          {/* Reports grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map(report => {
              const advisor = ADVISORS.find(a => a.id === report.advisorId);
              const industry = INDUSTRIES.find(i => i.id === report.industry);
              const typeColor = TYPE_COLORS[report.type] || 'text-gray-400 bg-gray-400/10';

              return (
                <div
                  key={report.id}
                  onClick={() => handleOpenReport(report)}
                  className="report-card rounded-xl p-5 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor}`}>
                        {report.type}
                      </span>
                      <span className="text-gray-600 text-xs">{industry?.icon} {industry?.name}</span>
                    </div>
                    <span className="text-gray-700 text-xs">{report.date}</span>
                  </div>

                  <h3 className="text-white font-semibold text-sm mb-2 leading-tight">{report.title}</h3>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: `${advisor?.color}20` }}
                      >
                        {advisor?.avatar}
                      </span>
                      <span className="text-gray-600 text-xs">{advisor?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-jade-400 font-bold text-sm">{report.highlight}</span>
                      <span className="text-gray-600 text-xs">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Report panel */}
      {activeReport && (
        <ReportPanel
          data={activeReport}
          advisorName={ADVISORS.find(a => SAMPLE_REPORTS.find(r => r.industry === activeReport.industry)?.advisorId === a.id)?.name || 'AI军师'}
          onClose={() => setActiveReport(null)}
        />
      )}
    </div>
  );
}
