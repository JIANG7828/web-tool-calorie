import { useState } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { calcSportCal } from '../utils/calorie';
import { DAILY_ACTIVITIES, EXERCISES, DailyActivity, Exercise } from '../utils/activities';

function ExercisePage() {
  const { userSettings, todayExercises, addExerciseRecord, getTodayExerciseCalories } = useCalorieStore();
  const [selectedItem, setSelectedItem] = useState<DailyActivity | Exercise | null>(null);
  const [duration, setDuration] = useState(30);
  const [showModal, setShowModal] = useState(false);

  const totalBurned = getTodayExerciseCalories();

  const handleSelect = (item: DailyActivity | Exercise) => {
    setSelectedItem(item);
    setDuration(30);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (selectedItem) {
      const calorie = calcSportCal(selectedItem.met, userSettings.weight, duration);
      addExerciseRecord({
        name: selectedItem.name,
        met: selectedItem.met,
        duration,
        calorie,
      });
      setShowModal(false);
      setSelectedItem(null);
    }
  };

  const calculatePreview = () => {
    if (!selectedItem) return 0;
    return calcSportCal(selectedItem.met, userSettings.weight, duration);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">运动 / 生活消耗记录</h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm opacity-90 mb-1">今日已消耗</div>
              <div className="text-3xl font-bold">{totalBurned}</div>
              <div className="text-xs opacity-75 mt-1">千卡</div>
            </div>
            <div className="text-6xl">🔥</div>
          </div>
        </div>
      </div>

      {/* Daily Activities Section */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">日常生活消耗</h2>
        <div className="grid grid-cols-4 gap-3">
          {DAILY_ACTIVITIES.map((activity) => (
            <button
              key={activity.id}
              onClick={() => handleSelect(activity)}
              className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-lg transition-all active:scale-95"
            >
              <div className="text-3xl">{activity.icon}</div>
              <div className="text-xs text-gray-700 text-center font-medium">{activity.name}</div>
              <div className="text-xs text-gray-400">MET {activity.met}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Section */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">运动消耗</h2>
        <div className="grid grid-cols-4 gap-3">
          {EXERCISES.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => handleSelect(exercise)}
              className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-lg transition-all active:scale-95"
            >
              <div className="text-3xl">{exercise.icon}</div>
              <div className="text-xs text-gray-700 text-center font-medium">{exercise.name}</div>
              <div className="text-xs text-gray-400">MET {exercise.met}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 px-6 py-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📊</div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">热量消耗计算</div>
              <div className="text-sm text-gray-700 leading-relaxed">
                记录日常 / 运动消耗，帮你更精准管控饮食热量
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Duration Selection Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{selectedItem.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedItem.name}</h3>
                  <div className="text-sm text-gray-500">MET {selectedItem.met}</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-600 mb-3 block">选择时长</label>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDuration(mins)}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        duration === mins
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {mins}分钟
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">预计消耗</div>
                  <div className="text-2xl font-bold text-blue-600">{calculatePreview()} 千卡</div>
                </div>
              </div>
            </div>

            <div className="p-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                确认记录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Records */}
      {todayExercises.length > 0 && (
        <div className="px-6 py-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">今日运动记录</h2>
          <div className="space-y-3">
            {todayExercises.map((ex) => (
              <div key={ex.id} className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm">
                <div>
                  <div className="font-medium text-gray-800">{ex.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{ex.duration}分钟</div>
                </div>
                <span className="font-semibold text-blue-600">{ex.calorie} 千卡</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExercisePage;
