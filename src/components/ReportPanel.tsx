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
  isMobile?: boolean;
}

const CHART_COLORS = ['#14b882', '#f59e0b', '#6366f1', '#ec4899', '#0ea5e9'];

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

function ChartRenderer({ chart, compact }: { chart: ReportData['charts'][0]; compact?: boolean }) {
  const h = compact ? 160 : 200;

  switch (chart.type) {
    case 'area':
      return (
        <ResponsiveContainer width="100%" height={h}>
          <AreaChart data={chart.data}>
            <defs>
              <linearGradient id="ag0" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b882" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b882" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#14b882" fill="url(#ag0)" strokeWidth={2} name="实际值" dot={false} connectNulls={false} />
            <Area type="monotone" dataKey="projected" stroke="#f59e0b" fill="url(#ag1)" strokeWidth={2} strokeDasharray="4 4" name="预测值" dot={false} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={h}>
          <BarChart data={chart.data} barSize={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="quarter" tick={{ fill: '#6b7280', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10, color: '#9ca3af' }} />
            <Bar dataKey="growth" name="企业增速%" fill="#14b882" radius={[3,3,0,0]} />
            <Bar dataKey="industry" name="行业均值%" fill="#6366f1" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={h}>
          <PieChart>
            <Pie data={chart.data} cx="50%" cy="50%" innerRadius={compact ? 40 : 55} outerRadius={compact ? 60 : 80} paddingAngle={3} dataKey="value">
              {chart.data.map((_: any, idx: number) => (
                <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [`${value}%`]}
              contentStyle={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
            />
            <Legend formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      );

    case 'radar':
      return (
        <ResponsiveContainer width="100%" height={compact ? 180 : 220}>
          <RadarChart cx="50%" cy="50%" outerRadius={compact ? 60 : 80} data={chart.data}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Radar name="头部企业" dataKey="A" stroke="#14b882" fill="#14b882" fillOpacity={0.15} strokeWidth={2} />
            <Radar name="中部企业" dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
            <Radar name="您的位置" dataKey="C" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
            <Legend formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 10 }}>{v}</span>} />
            <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
          </RadarChart>
        </ResponsiveContainer>
      );

    default: return null;
  }
}

// ── Report content (shared between desktop panel and mobile sheet)
function ReportContent({ data, advisorName, compact }: { data: ReportData; advisorName: string; compact?: boolean }) {
  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-5'}`}>
      {/* Title card */}
      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-white font-bold text-sm mb-1">{data.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>📅 {new Date(data.generatedAt).toLocaleDateString('zh-CN')}</span>
          <span>·</span>
          <span className="text-jade-500">由 {advisorName} 生成</span>
        </div>
      </div>

      {/* Key metrics */}
      <div>
        <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-2">关键指标</h4>
        <div className="grid grid-cols-2 gap-2">
          {data.sections.filter(s => s.highlight).map(section => (
            <div key={section.title} className="glass-panel rounded-xl p-3">
              <div className="text-jade-400 font-bold text-base">{section.highlight}</div>
              <div className="text-gray-500 text-[11px] mt-0.5">{section.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      {data.charts.map((chart, i) => (
        <div key={i} className="glass-panel rounded-xl p-4">
          <h4 className="text-white text-xs font-medium mb-3">{chart.title}</h4>
          <ChartRenderer chart={chart} compact={compact} />
        </div>
      ))}

      {/* Analysis sections */}
      <div>
        <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-2">深度分析</h4>
        <div className="space-y-2">
          {data.sections.map(section => (
            <div key={section.title} className="glass-panel rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-jade-500 text-xs">◆</span>
                <h5 className="text-white text-xs font-medium">{section.title}</h5>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed pl-4">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <button className="w-full py-3 rounded-xl border border-jade-500/30 text-jade-400 text-sm active:bg-jade-500/10 transition-all flex items-center justify-center gap-2">
        <span>⬇️</span><span>导出 PDF 报告</span>
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export function ReportPanel({ data, advisorName, onClose, isMobile }: ReportPanelProps) {
  if (isMobile) {
    /* Mobile: full-screen bottom sheet */
    return (
      <>
        {/* Backdrop */}
        <div className="bottom-sheet-overlay" onClick={onClose} />

        {/* Sheet */}
        <div className="bottom-sheet">
          <div className="bottom-sheet-handle" />

          {/* Sheet header */}
          <div className="px-4 pb-3 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-white font-semibold text-sm flex items-center gap-1.5">
                <span>📊</span> 可视化分析报告
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-gray-500 active:bg-white/[0.12] text-sm"
            >
              ✕
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <ReportContent data={data} advisorName={advisorName} compact />
          </div>
        </div>
      </>
    );
  }

  /* Desktop: side panel */
  return (
    <div className="w-[460px] flex-shrink-0 border-l border-white/[0.06] flex flex-col bg-[#0d0f18] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <span>📊</span> 可视化分析报告
          </h2>
          <p className="text-gray-600 text-xs mt-0.5">由 {advisorName} 生成</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-gray-500 hover:text-white transition-all text-sm"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <ReportContent data={data} advisorName={advisorName} />
      </div>
    </div>
  );
}
