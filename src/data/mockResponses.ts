import type { IndustryCategory, AdvisorStyle, ChartData, ReportSection } from '../types';

interface MockResponse {
  content: string;
  hasReport?: boolean;
  reportTitle?: string;
  reportSections?: ReportSection[];
  chartData?: ChartData[];
}

const ANCIENT_TEMPLATES = [
  (industry: string, query: string) => `
吾观此局，${query}之事，实乃当下企业之要务也。

**一曰知势**

天下商战，如同沙场。${industry}行业如今正处于变局之中，市场格局未定，正是英雄用武之时。所谓"知彼知己，百战不殆"，当先明察己身优劣，再审视竞争格局。

**二曰谋局**

依吾之策，宜分三步：
- **第一步**：固守基本盘，稳住现有客户与市场份额，此乃"守正"之道
- **第二步**：寻找差异化突破口，以"奇"制胜，出竞争对手意料之外
- **第三步**：布局长远，构建护城河，让竞争者难以复制

**三曰行动**

然空谈误国，实干兴邦。策略再好，不付诸实施，终是纸上谈兵。建议优先聚焦于**核心用户群体**，以小博大，以点带面，逐步扩张版图。

吾料此策若能坚持施行，三月之内，必见成效。汝以为然否？
  `,
  (industry: string, _query: string) => `
运筹帷幄之中，决胜千里之外。观${industry}行业之形势，吾有几言相告。

**局势研判**

当前市场如"围魏救赵"之局——正面竞争未必有益，侧翼迂回或许更妙。吾观此行业，有三大趋势不可不察：

1. **消费者心智之变** — 用户需求从功能性转向情感价值，品牌力愈发重要
2. **数字化浪潮席卷** — 数据即资产，算法即护城河，不数字化者将被淘汰
3. **竞争维度升维** — 单纯价格战已入死局，服务、体验、生态方是出路

**谋略建议**

所谓"上兵伐谋"，我建议以下三计：

> **借势之计**：借助行业大势，如站在风口，顺势而为，事半功倍
> **结盟之计**：寻找战略伙伴，构建联盟，以合力对抗强敌
> **蓄势之计**：当下蓄力，等待时机，厚积而薄发

汝之企业，正值关键节点。此时当静心谋划，切勿因小失大，贪功冒进。
  `,
];

const SECRETARY_TEMPLATES = [
  (industry: string, query: string) => `
**商业分析报告摘要**

---

您好，针对您关于"${query}"的咨询，以下是基于${industry}行业最新数据的专业分析：

**执行摘要**

根据我们的分析，当前${industry}市场整体处于**稳健增长**阶段，年复合增长率约为12-15%。市场总规模预计在2024年达到新高点。

**关键发现**

| 维度 | 现状 | 趋势 |
|------|------|------|
| 市场规模 | 持续扩大 | ↑ 增长 |
| 竞争强度 | 中高水平 | → 稳定 |
| 用户需求 | 多元化升级 | ↑ 增长 |
| 技术驱动 | AI赋能加速 | ↑ 快速增长 |

**战略建议**

1. **短期（0-6个月）**：聚焦核心产品线，提升市场渗透率
2. **中期（6-18个月）**：拓展新客户群体，强化品牌差异化
3. **长期（18个月+）**：布局生态系统，构建可持续竞争优势

**下一步行动**

建议安排深度战略规划会议，邀请各部门负责人参与，制定详细执行方案。如需生成完整分析报告，请告知。
  `,
];

const ECOMMERCE_TEMPLATES = [
  (_industry: string, query: string) => `
哎！这个问题问到点上了！关于"${query}"，我来给你说说电商这块儿的核心逻辑👇

**流量侧分析**

现在平台流量分配逻辑变了！算法越来越看重这几个核心指标：
- **点击率（CTR）**：主图要卷！前3张图决定90%的点击
- **转化率**：详情页要有"钩子"，前屏黄金3秒必须抓住用户
- **坑产**：GMV/展位，这个高了平台才给你推自然流量

**我给你的落地建议**

🔥 **立竿见影的优化（本周就能做）**：
- 主图A/B测试，至少测3个版本
- 标题关键词重排，把搜索量大的词放前面
- 前20条评价要精选，差评要有高质量回复

📈 **中期爆款打法（1-3个月）**：
- 用"搜索+直播"双轮驱动，互相拉权重
- 找腰部达人做种草，CPM控制在50元以内为优
- 测款期ROI跑到1.5就可以考虑加投

💡 **一个容易被忽略的点**：
现在${query.includes('抖音') ? '抖音' : '平台'}的货架电商流量回来了！别只盯着直播，搜索入口同样是金矿。

要不要我帮你做个详细的运营数据诊断？
  `,
];

const ANALYST_TEMPLATES = [
  (industry: string, query: string) => `
**市场分析：${query}**

基于对${industry}行业的深度数据挖掘，以下是量化分析结果：

**市场规模与增速**

2023年${industry}市场总规模约为 **¥2.8万亿**，同比增长 **13.2%**。预计2025年将突破3.5万亿，CAGR维持在11-14%区间。

**竞争格局分析（HHI指数）**

市场集中度指数为 0.18（中度分散），头部3家玩家占据约42%市场份额，中小企业存在较大成长空间。

**用户画像洞察**

- 核心用户年龄：25-40岁（占比68%）
- 决策周期：B端平均45天，C端平均7天
- 客单价区间：¥200-¥5000（中位数¥680）
- 复购率：行业均值31%，头部玩家可达52%

**风险矩阵**

| 风险因素 | 概率 | 影响度 | 综合评级 |
|---------|------|--------|---------|
| 政策监管趋严 | 中 | 高 | ⚠️ 重点关注 |
| 需求端疲软 | 低 | 高 | ✅ 可控 |
| 竞争加剧 | 高 | 中 | ⚠️ 重点关注 |
| 技术颠覆 | 中 | 高 | ⚠️ 重点关注 |

**投资逻辑**

基于以上分析，${industry}赛道在当前阶段呈现**成长期特征**，建议采取积极策略，优先布局具有差异化壁垒的细分领域。
  `,
];

const TECH_TEMPLATES = [
  (industry: string, query: string) => `
🚀 关于"${query}"，我从数字化视角给你拆解一下！

**AI+${industry}的机会矩阵**

目前这个行业的数字化成熟度大概在 **Level 2-3**（满分5级），意味着还有巨大的提升空间！

**三大技术杠杆**

\`\`\`
技术层       → 应用场景              → 业务价值
──────────────────────────────────────
大语言模型   → 客服自动化/内容生成   → 降低人力成本60-80%
计算机视觉   → 质检/推荐/识别        → 效率提升3-5倍
预测分析     → 需求预测/风险控制     → 库存优化15-30%
\`\`\`

**数字化转型路线图**

**Phase 1 — 数据基础（0-6个月）**
- 打通数据孤岛，建立统一数据中台
- 部署基础BI工具，实现数据可视化
- 成本：¥50-200万

**Phase 2 — AI赋能（6-18个月）**
- 引入AI决策辅助系统
- 实现核心业务流程自动化
- 预期ROI：2-3年回收

**Phase 3 — 智能运营（18个月+）**
- 全面智能化运营
- 构建数字竞争壁垒

**我的判断**

${industry}行业现在是数字化转型的"黄金窗口期"——早一步布局，晚一步被布局。建议从**最小可行产品（MVP）**开始，快速验证，迭代优化。

要不要聊聊具体的技术选型方案？
  `,
];

export function getMockResponse(
  query: string,
  style: AdvisorStyle,
  industry: IndustryCategory,
): MockResponse {
  const industryName = getIndustryName(industry);
  let content = '';

  const shouldGenerateReport = query.length > 20 &&
    (query.includes('分析') || query.includes('报告') || query.includes('市场') ||
     query.includes('策略') || query.includes('建议') || query.includes('趋势'));

  switch (style) {
    case 'ancient':
      content = ANCIENT_TEMPLATES[Math.floor(Math.random() * ANCIENT_TEMPLATES.length)](industryName, query);
      break;
    case 'secretary':
      content = SECRETARY_TEMPLATES[0](industryName, query);
      break;
    case 'ecommerce':
      content = ECOMMERCE_TEMPLATES[0](industryName, query);
      break;
    case 'analyst':
    case 'finance':
      content = ANALYST_TEMPLATES[0](industryName, query);
      break;
    case 'tech':
      content = TECH_TEMPLATES[0](industryName, query);
      break;
    default:
      content = ANALYST_TEMPLATES[0](industryName, query);
  }

  if (shouldGenerateReport) {
    return {
      content,
      hasReport: true,
      reportTitle: `${industryName}行业深度分析报告`,
      reportSections: generateReportSections(industry),
      chartData: generateChartData(industry),
    };
  }

  return { content };
}

function getIndustryName(industry: IndustryCategory): string {
  const names: Record<IndustryCategory, string> = {
    ecommerce: '电商零售',
    finance: '金融投资',
    tech: '科技互联网',
    manufacturing: '制造业',
    healthcare: '医疗健康',
    education: '教育培训',
    retail: '实体零售',
    'real-estate': '房地产',
    food: '餐饮食品',
    logistics: '物流供应链',
  };
  return names[industry];
}

function generateReportSections(industry: IndustryCategory): ReportSection[] {
  return [
    {
      title: '市场概览',
      content: `${getIndustryName(industry)}行业2024年市场规模预计达到2.8万亿元，同比增长13.2%。`,
      highlight: 'CAGR 13.2%',
    },
    {
      title: '竞争格局',
      content: '市场集中度适中，头部3家企业占据42%份额，中小企业仍有较大增长空间。',
      highlight: 'CR3: 42%',
    },
    {
      title: '用户洞察',
      content: '核心用户群体为25-40岁中产消费者，决策周期缩短，品牌忠诚度提升。',
      highlight: '复购率 +18%',
    },
    {
      title: '战略建议',
      content: '建议聚焦差异化竞争策略，在技术赋能和用户体验上持续投入，构建长期壁垒。',
    },
  ];
}

export function generateChartData(industry: IndustryCategory): ChartData[] {
  const industryName = getIndustryName(industry);

  return [
    {
      type: 'area',
      title: `${industryName}市场规模趋势（亿元）`,
      data: [
        { year: '2020', value: 18500, projected: null },
        { year: '2021', value: 21200, projected: null },
        { year: '2022', value: 23800, projected: null },
        { year: '2023', value: 26900, projected: null },
        { year: '2024', value: 28400, projected: 28400 },
        { year: '2025', value: null, projected: 32100 },
        { year: '2026', value: null, projected: 36500 },
      ],
      dataKeys: ['value', 'projected'],
      colors: ['#14b882', '#f59e0b'],
    },
    {
      type: 'bar',
      title: '各季度增长率对比（%）',
      data: [
        { quarter: 'Q1 2023', growth: 11.2, industry: 8.5 },
        { quarter: 'Q2 2023', growth: 13.8, industry: 9.2 },
        { quarter: 'Q3 2023', growth: 15.1, industry: 10.8 },
        { quarter: 'Q4 2023', growth: 12.9, industry: 11.3 },
        { quarter: 'Q1 2024', growth: 14.5, industry: 12.1 },
        { quarter: 'Q2 2024', growth: 16.2, industry: 13.5 },
      ],
      dataKeys: ['growth', 'industry'],
      colors: ['#14b882', '#6366f1'],
    },
    {
      type: 'pie',
      title: '市场份额分布',
      data: [
        { name: '头部企业', value: 42 },
        { name: '腰部企业', value: 33 },
        { name: '中小企业', value: 25 },
      ],
      dataKeys: ['value'],
      colors: ['#14b882', '#f59e0b', '#6366f1'],
    },
    {
      type: 'radar',
      title: '竞争力维度分析',
      data: [
        { dimension: '品牌力', A: 85, B: 72, C: 58 },
        { dimension: '产品力', A: 78, B: 81, C: 65 },
        { dimension: '运营力', A: 90, B: 68, C: 72 },
        { dimension: '技术力', A: 75, B: 88, C: 55 },
        { dimension: '渠道力', A: 88, B: 70, C: 80 },
        { dimension: '服务力', A: 82, B: 75, C: 68 },
      ],
      dataKeys: ['A', 'B', 'C'],
      colors: ['#14b882', '#f59e0b', '#6366f1'],
    },
  ];
}

export const QUICK_QUESTIONS: Record<string, string[]> = {
  ecommerce: [
    '如何提升店铺转化率？',
    '分析竞品定价策略',
    '直播电商如何起步？',
    '双11大促备战方案',
  ],
  finance: [
    '分析当前A股投资机会',
    '企业融资策略建议',
    '如何做好财务风险管理？',
    '股权激励方案设计',
  ],
  tech: [
    'AI如何赋能我的业务？',
    '数字化转型路线图',
    'SaaS产品定价策略',
    '技术团队如何搭建？',
  ],
  default: [
    '分析行业市场趋势',
    '竞争对手分析报告',
    '制定增长战略',
    '用户画像与定位',
  ],
};
