import { useState, useMemo } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { getBMR, getTDEE, getTargetCal } from '../utils/calorie';
import { searchFood, Food } from '../utils/foodDatabase';
import EvaluationPage from './EvaluationPage';
import AddFoodModal from './AddFoodModal';

const MEAL_TYPES = [
  { key: 'breakfast', label: '早餐', icon: '🌅' },
  { key: 'lunch', label: '午餐', icon: '☀️' },
  { key: 'dinner', label: '晚餐', icon: '🌙' },
  { key: 'snack', label: '加餐', icon: '🍎' },
];

export default function DietRecordPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMealType, setActiveMealType] = useState('all');
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [prevRecordCount, setPrevRecordCount] = useState(0);
  const { todayRecords, getTodayTotalCalories, getTodayExerciseCalories, evaluateLastMeal, isMealRecorded } = useCalorieStore();

  const todayCal = getTodayTotalCalories();
  const exerciseCal = getTodayExerciseCalories();

  const filteredRecords = useMemo(() => {
    const sorted = [...todayRecords].sort((a, b) => b.timestamp - a.timestamp);
    if (activeMealType === 'all') return sorted;
    return sorted.filter(r => r.mealType === activeMealType);
  }, [todayRecords, activeMealType]);

  const handleOpenModal = (mealType?: string) => {
    setActiveMealType(mealType || 'all');
    setShowAddModal(true);
  };

  // Show evaluation when new record added
  if (todayRecords.length > prevRecordCount && prevRecordCount > 0) {
    setTimeout(() => {
      setShowEvaluation(true);
      setPrevRecordCount(todayRecords.length);
    }, 300);
  }

  if (prevRecordCount === 0 && todayRecords.length > 0) {
    setPrevRecordCount(todayRecords.length);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-24">
      {/* Header */}
      <div className="pt-12 pb-4 px-4 bg-gradient-to-b from-green-400/10 to-transparent">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">每日饮食记录</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-gray-500">今日摄入</p>
              <p className="text-xl font-bold text-green-600">{todayCal} <span className="text-xs">千卡</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Type Buttons */}
      <div className="mx-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveMealType('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeMealType === 'all'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600'
            }`}
          >
            全部
          </button>
          {MEAL_TYPES.map((meal) => (
            <button
              key={meal.key}
              onClick={() => setActiveMealType(meal.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                activeMealType === meal.key
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-gray-600'
              }`}
            >
              <span>{meal.icon}</span>
              <span>{meal.label}</span>
              {isMealRecorded(meal.key) && <span className="text-xs">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Records */}
      <div className="mx-4">
        {filteredRecords.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-200" />
            
            <div className="space-y-4">
              {filteredRecords.map((record) => {
                const mealLabel = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' }[record.mealType] || record.mealType;
                return (
                  <div key={record.id} className="flex gap-4 animate-slide-up">
                    {/* Timeline Dot */}
                    <div className="flex-shrink-0 w-12 flex flex-col items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full ring-4 ring-green-100" />
                    </div>
                    
                    {/* Card */}
                    <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {record.mealType === 'breakfast' ? '🌅' : record.mealType === 'lunch' ? '☀️' : record.mealType === 'dinner' ? '🌙' : '🍎'}
                          </span>
                          <div>
                            <span className="font-medium text-gray-800">{mealLabel}</span>
                            <span className="text-xs text-gray-400 ml-2">{record.time}</span>
                          </div>
                        </div>
                        <span className="text-green-600 font-bold">{record.calorie} 千卡</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">
                          {record.name.includes('蛋') || record.name.includes('肉') ? '' : '️'}
                        </div>
                        <span className="text-gray-700 text-sm">{record.name}</span>
                      </div>

                      {record.macro && record.macro.protein > 0 && (
                        <div className="mt-2 flex gap-2 text-xs">
                          {record.macro.protein > 0 && <span className="px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full">蛋白质 {record.macro.protein}g</span>}
                          {record.macro.fat > 0 && <span className="px-2 py-0.5 bg-yellow-50 text-yellow-500 rounded-full">脂肪 {record.macro.fat}g</span>}
                          {record.macro.carbs > 0 && <span className="px-2 py-0.5 bg-green-50 text-green-500 rounded-full">碳水 {record.macro.carbs}g</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4"></div>
            <p className="text-gray-400">还没有饮食记录</p>
            <p className="text-gray-300 text-sm mt-1">点击下方按钮添加第一餐</p>
          </div>
        )}
      </div>

      {/* Add Food Button */}
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-4">
        <button
          onClick={() => handleOpenModal()}
          className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>记录饮食</span>
        </button>
      </div>

      {/* Add Food Modal */}
      <AddFoodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Evaluation Page */}
      {showEvaluation && evaluateLastMeal() && (
        <EvaluationPage
          evaluation={evaluateLastMeal()!}
          onClose={() => setShowEvaluation(false)}
        />
      )}
    </div>
  );
}
