import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import type { SubscriptionTier } from '../types';

const PLANS = [
  {
    id: 'free' as SubscriptionTier,
    name: '免费版',
    price: 0,
    period: '永久免费',
    points: 200,
    color: '#6b7280',
    features: [
      '每月 200 点数',
      '3种基础军师角色',
      '5个行业类目',
      '每日限制5次咨询',
      '基础报告生成',
    ],
    limits: ['不含高级军师角色', '无法导出PDF', '无优先响应'],
  },
  {
    id: 'pro' as SubscriptionTier,
    name: 'Pro 专业版',
    price: 99,
    period: '/月',
    points: 3000,
    color: '#14b882',
    featured: true,
    features: [
      '每月 3,000 点数',
      '全部6种军师角色',
      '全部10个行业类目',
      '无限咨询次数',
      '完整可视化报告',
      'PDF 报告导出',
      '优先响应速度',
    ],
    limits: [],
  },
  {
    id: 'enterprise' as SubscriptionTier,
    name: '企业旗舰版',
    price: 499,
    period: '/月',
    points: 20000,
    color: '#a78bfa',
    features: [
      '每月 20,000 点数',
      '专属定制军师角色',
      '全行业深度分析',
      '企业专属数据库',
      '批量报告生成',
      '团队多账号共享',
      '专属客户经理',
      'API 接口接入',
    ],
    limits: [],
  },
];

const POINT_PACKS = [
  { points: 500, price: 18, bonus: 0, tag: '' },
  { points: 1500, price: 48, bonus: 100, tag: '' },
  { points: 3000, price: 88, bonus: 300, tag: '热门' },
  { points: 10000, price: 268, bonus: 1500, tag: '超值' },
];

export function SubscriptionPage() {
  const { user, upgradeSubscription, addPoints } = useAppStore();
  const [upgrading, setUpgrading] = useState<SubscriptionTier | null>(null);
  const [buyingPoints, setBuyingPoints] = useState<number | null>(null);

  const handleUpgrade = (tier: SubscriptionTier) => {
    setUpgrading(tier);
    setTimeout(() => {
      upgradeSubscription(tier);
      setUpgrading(null);
      alert(`已成功升级到${PLANS.find(p => p.id === tier)?.name}！`);
    }, 1000);
  };

  const handleBuyPoints = (pack: typeof POINT_PACKS[0]) => {
    setBuyingPoints(pack.points);
    setTimeout(() => {
      addPoints(pack.points + pack.bonus);
      setBuyingPoints(null);
      alert(`成功充值 ${pack.points + pack.bonus} 点数！`);
    }, 800);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-white text-2xl font-bold mb-2">会员套餐</h1>
          <p className="text-gray-500 text-sm">选择适合您的咨询服务方案，点数越多，咨询越自由</p>
          {user && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
              <span className="text-yellow-400">✦</span>
              <span className="text-yellow-400 font-medium">当前剩余 {user.points.toLocaleString()} 点数</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-400 text-sm">
                当前套餐：
                <span className={user.tier === 'enterprise' ? 'text-purple-400' : user.tier === 'pro' ? 'text-jade-400' : 'text-gray-400'}>
                  {user.tier === 'enterprise' ? '企业旗舰版' : user.tier === 'pro' ? 'Pro专业版' : '免费版'}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`tier-card glass-panel rounded-2xl p-6 flex flex-col border ${
                plan.featured
                  ? 'border-jade-500/50 featured'
                  : 'border-white/[0.08]'
              }`}
            >
              {plan.featured && (
                <div className="text-center mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-jade-500/20 text-jade-400 border border-jade-500/30 font-medium">
                    ⭐ 推荐套餐
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span style={{ color: plan.color }} className="text-3xl font-bold">
                    {plan.price === 0 ? '免费' : `¥${plan.price}`}
                  </span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-yellow-400">✦</span>
                  <span className="text-yellow-400 font-medium">{plan.points.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm">点/月</span>
                </div>
              </div>

              <div className="space-y-2 flex-1 mb-6">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <span style={{ color: plan.color }}>✓</span>
                    <span className="text-gray-300">{f}</span>
                  </div>
                ))}
                {plan.limits.map(l => (
                  <div key={l} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-700">✕</span>
                    <span className="text-gray-600">{l}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => user?.tier !== plan.id && handleUpgrade(plan.id)}
                disabled={user?.tier === plan.id || upgrading !== null}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  user?.tier === plan.id
                    ? 'bg-white/[0.05] text-gray-600 cursor-default'
                    : upgrading === plan.id
                    ? 'opacity-70 cursor-not-allowed'
                    : plan.featured
                    ? 'bg-jade-600 hover:bg-jade-500 text-white hover:shadow-lg hover:shadow-jade-500/25'
                    : 'border border-white/20 text-white hover:bg-white/[0.05]'
                }`}
              >
                {user?.tier === plan.id ? '当前套餐' : upgrading === plan.id ? '升级中...' : plan.price === 0 ? '免费开始' : '立即订阅'}
              </button>
            </div>
          ))}
        </div>

        {/* Point packs */}
        <div>
          <h2 className="text-white font-bold text-lg mb-2">点数充值</h2>
          <p className="text-gray-500 text-sm mb-5">按需购买，灵活使用，永不过期</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {POINT_PACKS.map(pack => (
              <div
                key={pack.points}
                className="glass-panel rounded-xl p-4 border border-white/[0.08] hover:border-yellow-400/30 transition-all cursor-pointer"
                onClick={() => handleBuyPoints(pack)}
              >
                {pack.tag && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 mb-2 font-medium">
                    {pack.tag}
                  </span>
                )}
                <div className="text-yellow-400 font-bold text-xl flex items-center gap-1">
                  <span className="text-sm">✦</span>
                  {pack.points.toLocaleString()}
                </div>
                {pack.bonus > 0 && (
                  <div className="text-jade-500 text-xs mt-0.5">+赠{pack.bonus}点</div>
                )}
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-white font-bold">¥{pack.price}</span>
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  ≈ ¥{(pack.price / (pack.points + pack.bonus) * 100).toFixed(1)}/百点
                </div>
                <button
                  disabled={buyingPoints === pack.points}
                  className={`mt-3 w-full py-2 rounded-lg text-xs font-medium transition-all ${
                    buyingPoints === pack.points
                      ? 'bg-yellow-400/20 text-yellow-500 cursor-not-allowed'
                      : 'bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/20'
                  }`}
                >
                  {buyingPoints === pack.points ? '充值中...' : '立即充值'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <h2 className="text-white font-bold text-lg mb-4">常见问题</h2>
          <div className="space-y-3">
            {[
              { q: '点数有效期多久？', a: '充值的点数永不过期，订阅套餐内的点数有效期为当月，每月1日重置。' },
              { q: '可以随时取消订阅吗？', a: '是的，您可以随时取消订阅，取消后当月剩余点数可继续使用至到期日。' },
              { q: '不同军师消耗点数一样吗？', a: '不同，高级军师角色（如古代军师）消耗点数较高，基础角色消耗点数较低，详见选择页面。' },
            ].map(item => (
              <div key={item.q} className="glass-panel rounded-xl p-4">
                <div className="text-white font-medium text-sm mb-1">Q: {item.q}</div>
                <div className="text-gray-500 text-sm">A: {item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
