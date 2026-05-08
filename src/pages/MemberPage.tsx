import { useState } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { MEMBER_PLANS, MemberLevel } from '../utils/memberPlans';

export default function MemberPage() {
  const { memberLevel, upgradeMember } = useCalorieStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MemberLevel | null>(null);

  const handleSelectPlan = (level: MemberLevel) => {
    if (level === 'free' || level === memberLevel) return;
    setSelectedPlan(level);
    setShowPayment(true);
  };

  const handlePayment = () => {
    if (selectedPlan) {
      upgradeMember(selectedPlan);
      setShowPayment(false);
      alert('支付成功！欢迎成为' + MEMBER_PLANS[selectedPlan].name);
    }
  };

  const plans = Object.values(MEMBER_PLANS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">会员中心</h1>
        <p className="text-sm opacity-90">升级解锁更多高级功能</p>
        {memberLevel !== 'free' && (
          <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 inline-block">
            <span className="text-sm">当前版本：{MEMBER_PLANS[memberLevel].name}</span>
          </div>
        )}
      </div>

      {/* Billing Toggle */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl p-2 flex shadow-sm">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-purple-500 text-white'
                : 'text-gray-600'
            }`}
          >
            月付
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              billingCycle === 'yearly'
                ? 'bg-purple-500 text-white'
                : 'text-gray-600'
            }`}
          >
            年付
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
              省30%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="px-6 space-y-4">
        {plans.map((plan) => {
          const isCurrentPlan = plan.level === memberLevel;
          const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
          const isFree = plan.level === 'free';

          return (
            <div
              key={plan.level}
              className={`bg-white rounded-2xl p-6 shadow-sm ${
                isCurrentPlan ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
                  <div className="text-2xl font-bold text-purple-600 mt-2">
                    {isFree ? '免费' : `¥${price}`}
                    {!isFree && (
                      <span className="text-sm font-normal text-gray-500">
                        /{billingCycle === 'yearly' ? '年' : '月'}
                      </span>
                    )}
                  </div>
                </div>
                {isCurrentPlan && (
                  <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                    当前
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.advancedFoods && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    <span>完整食物库（200+种）</span>
                  </div>
                )}
                {plan.features.exerciseRecord && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    <span>运动消耗记录</span>
                  </div>
                )}
                {plan.features.smartAnalysis && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    <span>智能分析报告</span>
                  </div>
                )}
                {plan.features.dataExport && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    <span>数据导出功能</span>
                  </div>
                )}
                {plan.features.aiRecognition && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    <span>AI食物识别</span>
                  </div>
                )}
                {plan.features.nutritionConsult && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    <span>专业营养师咨询</span>
                  </div>
                )}
                {plan.features.adFree && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    <span>无广告体验</span>
                  </div>
                )}
              </div>

              {!isFree && !isCurrentPlan && (
                <button
                  onClick={() => handleSelectPlan(plan.level)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  立即开通
                </button>
              )}
              {isCurrentPlan && !isFree && (
                <button className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-medium">
                  已订阅
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">确认支付</h3>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">会员等级</span>
                <span className="font-semibold">{MEMBER_PLANS[selectedPlan].name}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">支付方式</span>
                <span className="font-semibold">微信支付</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                <span className="text-purple-600 font-medium">应付金额</span>
                <span className="text-2xl font-bold text-purple-600">
                  ¥{billingCycle === 'yearly' ? MEMBER_PLANS[selectedPlan].price.yearly : MEMBER_PLANS[selectedPlan].price.monthly}
                </span>
              </div>
            </div>
            <div className="p-6 flex gap-3">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium"
              >
                取消
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium"
              >
                确认支付
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Ad */}
      <AdBanner />
    </div>
  );
}

function AdBanner() {
  return (
    <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4">
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-3xl">💊</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-800">限时优惠</div>
            <div className="text-xs text-gray-600">Pro会员年费仅¥89，点击查看</div>
          </div>
          <button className="bg-purple-500 text-white text-xs px-3 py-2 rounded-lg">
            查看
          </button>
        </div>
      </div>
    </div>
  );
}
