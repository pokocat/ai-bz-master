import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { ReportData } from '../types';

interface ReportPanelProps {
  data: ReportData;
  advisorName: string;
  onClose: () => void;
}

const CHART_COLORS = ['#14b882', '#f59e0b', '#6366f1', '#ec4899', '#0ea5e9', '#a78bfa'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}

function ChartRenderer({ chart }: { chart: ReportData['charts'][0] }) {
  const commonProps = {
    data: chart.data,
  };

  switch (chart.type) {
    case 'area':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="areaGrad0" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b882" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b882" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#14b882" fill="url(#areaGrad0)" strokeWidth={2} name="实际值" dot={false} connectNulls={false} />
            <Area type="monotone" dataKey="projected" stroke="#f59e0b" fill="url(#areaGrad1)" strokeWidth={2} strokeDasharray="4 4" name="预测值" dot={false} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart {...commonProps} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="quarter" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
            <Bar dataKey="growth" name="企业增速%" fill="#14b882" radius={[3, 3, 0, 0]} />
            <Bar dataKey="industry" name="行业均值%" fill="#6366f1" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chart.data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chart.data.map((_: any, idx: number) => (
                <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`]}
              contentStyle={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
            />
            <Legend
              formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      );

    case 'radar':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart cx="50%" cy="50%" outerRadius={80} data={chart.data}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Radar name="头部企业" dataKey="A" stroke="#14b882" fill="#14b882" fillOpacity={0.15} strokeWidth={2} />
            <Radar name="中部企业" dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
            <Radar name="您的位置" dataKey="C" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
            <Legend
              formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{value}</span>}
            />
            <Tooltip
              contentStyle={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
}

export function ReportPanel({ data, advisorName, onClose }: ReportPanelProps) {
  return (
    <div className="w-[480px] flex-shrink-0 border-l border-white/[0.06] flex flex-col bg-[#0d0f18] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <span>📊</span> 可视化分析报告
          </h2>
          <p className="text-gray-600 text-xs mt-0.5">由 {advisorName} 生成</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-gray-500 hover:text-white transition-all"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Report title & meta */}
        <div className="glass-panel rounded-xl p-4">
          <h3 className="text-white font-bold text-base mb-1">{data.title}</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>📅 {new Date(data.generatedAt).toLocaleDateString('zh-CN')}</span>
            <span>·</span>
            <span className="text-jade-500">AI 生成</span>
          </div>
        </div>

        {/* Key metrics */}
        <div>
          <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">关键指标</h4>
          <div className="grid grid-cols-2 gap-2">
            {data.sections.filter(s => s.highlight).map(section => (
              <div key={section.title} className="glass-panel rounded-xl p-3">
                <div className="text-jade-400 font-bold text-lg mb-1">{section.highlight}</div>
                <div className="text-gray-500 text-xs">{section.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        {data.charts.map((chart, i) => (
          <div key={i} className="glass-panel rounded-xl p-4">
            <h4 className="text-white text-sm font-medium mb-4">{chart.title}</h4>
            <ChartRenderer chart={chart} />
          </div>
        ))}

        {/* Analysis sections */}
        <div>
          <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">深度分析</h4>
          <div className="space-y-3">
            {data.sections.map(section => (
              <div key={section.title} className="glass-panel rounded-xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-jade-500 text-sm mt-0.5">◆</span>
                  <h5 className="text-white text-sm font-medium">{section.title}</h5>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed pl-5">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Export button */}
        <button className="w-full py-3 rounded-xl border border-jade-500/30 text-jade-400 text-sm hover:bg-jade-500/10 transition-all flex items-center justify-center gap-2">
          <span>⬇️</span>
          <span>导出 PDF 报告</span>
        </button>
      </div>
    </div>
  );
}
