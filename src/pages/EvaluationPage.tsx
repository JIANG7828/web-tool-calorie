import { useCalorieStore } from '../store/calorieStore';

interface EvaluationPageProps {
  evaluation: {
    rating: string;
    calories: number;
    macros: {
      protein: number;
      fat: number;
      carbs: number;
      percentage: { protein: number; fat: number; carbs: number };
    };
    pros: string[];
    cons: string[];
    suggestions: string[];
    mealType: string;
  };
  onClose: () => void;
}

export default function EvaluationPage({ evaluation, onClose }: EvaluationPageProps) {
  const getRatingColor = (rating: string) => {
    const colors: Record<string, string> = {
      '优秀': 'text-green-500',
      '良好': 'text-blue-500',
      '一般': 'text-yellow-500',
      '超标': 'text-red-500',
      '过少': 'text-orange-500',
    };
    return colors[rating] || 'text-gray-500';
  };

  const getRatingEmoji = (rating: string) => {
    const emojis: Record<string, string> = {
      '优秀': '',
      '良好': '😊',
      '一般': '😐',
      '超标': '😰',
      '过少': '😟',
    };
    return emojis[rating] || '';
  };

  const total = evaluation.macros.protein + evaluation.macros.fat + evaluation.macros.carbs;

  // Get next meal suggestion based on current meal type
  const getNextMealSuggestion = () => {
    const mealOrder = ['早餐', '午餐', '晚餐', '加餐'];
    const currentIndex = mealOrder.indexOf(evaluation.mealType);
    if (currentIndex === -1 || currentIndex === mealOrder.length - 1) return null;
    return mealOrder[currentIndex + 1];
  };

  const nextMeal = getNextMealSuggestion();

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-400/20 to-transparent pt-12 pb-6 px-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl"></span>
          <h1 className="text-2xl font-bold text-gray-800">记录成功!</h1>
        </div>
        <p className="text-center text-gray-500 mt-2">本次饮食的评价为</p>
      </div>

      {/* Rating Circle */}
      <div className="mx-4 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">{getRatingEmoji(evaluation.rating)}</span>
            <span className={`text-3xl font-bold ${getRatingColor(evaluation.rating)}`}>
              {evaluation.rating}
            </span>
          </div>

          {/* Circular Progress */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={evaluation.rating === '优秀' || evaluation.rating === '良好' ? '#4ade80' : evaluation.rating === '一般' ? '#fbbf24' : '#f87171'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${Math.min((evaluation.calories / 2000) * 251.2, 251.2)} 251.2`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{evaluation.calories}</span>
              <span className="text-xs text-gray-400">千卡</span>
            </div>
          </div>

          {/* Macro Percentages */}
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span className="text-gray-600">碳水 {evaluation.macros.percentage.carbs}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span className="text-gray-600">脂肪 {evaluation.macros.percentage.fat}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-gray-600">蛋白质 {evaluation.macros.percentage.protein}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Details */}
      <div className="mx-4 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">营养成分</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">蛋白质</span>
                <span className="font-medium">{evaluation.macros.protein}g</span>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((evaluation.macros.protein / (total || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">脂肪</span>
                <span className="font-medium">{evaluation.macros.fat}g</span>
              </div>
              <div className="h-2 bg-yellow-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((evaluation.macros.fat / (total || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">碳水</span>
                <span className="font-medium">{evaluation.macros.carbs}g</span>
              </div>
              <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((evaluation.macros.carbs / (total || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pros */}
      <div className="mx-4 mb-6">
        <div className="bg-green-50 rounded-3xl p-6">
          <h3 className="font-bold text-green-800 mb-3">👍 优点</h3>
          <ul className="space-y-2">
            {evaluation.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                <span className="text-green-500 mt-0.5">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cons */}
      {evaluation.cons.length > 0 && (
        <div className="mx-4 mb-6">
          <div className="bg-red-50 rounded-3xl p-6">
            <h3 className="font-bold text-red-800 mb-3">👎 不足</h3>
            <ul className="space-y-2">
              {evaluation.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Suggestions & Next Meal */}
      <div className="mx-4 mb-8">
        <div className="bg-amber-50 rounded-3xl p-6">
          <h3 className="font-bold text-amber-800 mb-3">💡 营养师建议</h3>
          <ul className="space-y-2">
            {evaluation.suggestions.map((sug, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>

          {/* Next Meal Suggestion */}
          {nextMeal && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <p className="text-sm font-medium text-amber-800 mb-2">🍽️ 下一餐建议 ({nextMeal})</p>
              <div className="bg-white/60 rounded-xl p-3">
                {evaluation.macros.protein < 20 && (
                  <p className="text-xs text-amber-700 mb-1">• 补充优质蛋白质：鸡胸肉、鸡蛋、豆腐</p>
                )}
                {evaluation.macros.carbs > 80 ? (
                  <p className="text-xs text-amber-700 mb-1">• 控制碳水摄入，增加蔬菜比例</p>
                ) : (
                  <p className="text-xs text-amber-700 mb-1">• 适量主食搭配：糙米饭、燕麦</p>
                )}
                <p className="text-xs text-amber-700">• 记得细嚼慢咽，吃到七分饱就刚好哦~</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close Button */}
      <div className="mx-4 mb-8">
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        >
          确定
        </button>
      </div>
    </div>
  );
}
