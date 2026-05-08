import { useState } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { getBMR, getTDEE, getTargetCal, getSuggestion } from '../utils/calorie';
import { Food, searchFood, FOOD_DATABASE } from '../utils/foodDatabase';

function Home() {
  const { userSettings, todayRecords, addFoodRecord, removeFoodRecord, getTodayTotalCalories, getTodayExerciseCalories, getNetCalories } = useCalorieStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [portion, setPortion] = useState(100);

  const todayDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const bmr = getBMR(userSettings.gender, userSettings.weight, userSettings.height, userSettings.age);
  const tdee = getTDEE(bmr, userSettings.activityLevel);
  const targetCal = getTargetCal(tdee, userSettings.target);
  const todayIntake = getTodayTotalCalories();
  const todayExercise = getTodayExerciseCalories();
  const netCalories = getNetCalories();
  const remaining = targetCal - netCalories;
  const suggestion = getSuggestion(targetCal, netCalories);

  const targetLabel = {
    fat: '减脂',
    keep: '维持',
    muscle: '增肌'
  };

  const handleAddFood = () => {
    if (selectedFood) {
      const calorie = Math.round((selectedFood.calorie / 100) * portion);
      addFoodRecord({
        name: selectedFood.name,
        calorie,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      });
      setShowAddModal(false);
      setSelectedFood(null);
      setPortion(100);
      setSearchKeyword('');
    }
  };

  const filteredFoods = searchKeyword
    ? searchFood(searchKeyword)
    : FOOD_DATABASE.slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm opacity-90">{todayDate}</div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
            {targetLabel[userSettings.target]}
          </div>
        </div>

        {/* Main Calorie Card */}
        <div className="bg-white rounded-2xl p-6 text-gray-800 shadow-xl">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-green-600 mb-2">
              {remaining}
            </div>
            <div className="text-gray-500 text-sm">剩余可摄入（千卡）</div>
          </div>

          <div className="flex justify-around text-sm text-gray-600 mb-6 pb-4 border-b border-gray-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800">{targetCal}</div>
              <div className="text-xs mt-1">今日推荐</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">{todayIntake}</div>
              <div className="text-xs mt-1">已摄入</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">-{todayExercise}</div>
              <div className="text-xs mt-1">运动消耗</div>
            </div>
          </div>

          {todayExercise > 0 && (
            <div className="bg-blue-50 rounded-xl p-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">净摄入 = 已摄入 - 运动消耗</span>
                <span className="font-semibold text-blue-600">{netCalories} 千卡</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-medium flex flex-col items-center gap-2 hover:shadow-lg transition-all active:scale-95"
            >
              <span className="text-3xl">🍽️</span>
              <span>手动添加食物</span>
            </button>
            <button className="bg-gradient-to-r from-orange-400 to-red-400 text-white py-4 rounded-xl font-medium flex flex-col items-center gap-2 hover:shadow-lg transition-all active:scale-95">
              <span className="text-3xl">📷</span>
              <span>拍照识别食物</span>
            </button>
          </div>
        </div>
      </div>

      {/* Food Records List */}
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">今日饮食记录</h2>
          <span className="text-sm text-gray-500">{todayRecords.length} 条</span>
        </div>

        {todayRecords.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">🍽️</div>
            <div className="text-gray-500 text-sm">暂无记录</div>
          </div>
        ) : (
          <div className="space-y-3">
            {todayRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="font-medium text-gray-800">{record.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{record.time}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-orange-600">{record.calorie} 千卡</span>
                  <button
                    onClick={() => removeFoodRecord(record.id)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Smart Suggestion */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 px-6 py-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">智能管控建议</div>
              <div className="text-sm text-gray-700 leading-relaxed">{suggestion}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">添加食物</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-2xl">&times;</button>
              </div>
              <input
                type="text"
                placeholder="搜索食物..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="overflow-y-auto max-h-[50vh] p-6">
              {selectedFood ? (
                <div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="font-semibold text-gray-800">{selectedFood.name}</div>
                        <div className="text-sm text-gray-500">{selectedFood.calorie}千卡/100g</div>
                      </div>
                      <button
                        onClick={() => setSelectedFood(null)}
                        className="text-sm text-green-600"
                      >
                        重新选择
                      </button>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">输入重量（克）</label>
                      <input
                        type="number"
                        value={portion}
                        onChange={(e) => setPortion(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="输入克数"
                      />
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">计算热量</span>
                        <span className="text-xl font-bold text-orange-600">
                          {Math.round((selectedFood.calorie / 100) * portion)} 千卡
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleAddFood}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    确认添加
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredFoods.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => setSelectedFood(food)}
                      className="bg-gray-50 hover:bg-green-50 rounded-xl p-4 text-left transition-colors"
                    >
                      <div className="font-medium text-gray-800 text-sm mb-1">{food.name}</div>
                      <div className="text-xs text-gray-500">{food.calorie}千卡/100g</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom padding for suggestion bar */}
      <div className="h-32"></div>
    </div>
  );
}

export default Home;
