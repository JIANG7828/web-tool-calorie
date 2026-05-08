import { useState } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { getBMR, getTDEE, getTargetCal } from '../utils/calorie';

function ProfilePage() {
  const { userSettings, updateUserSettings, resetTodayRecords, getTodayTotalCalories } = useCalorieStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const bmr = getBMR(userSettings.gender, userSettings.weight, userSettings.height, userSettings.age);
  const tdee = getTDEE(bmr, userSettings.activityLevel);
  const targetCal = getTargetCal(tdee, userSettings.target);

  const activityLevels = [
    { value: 1.2, label: '久坐（几乎不运动）' },
    { value: 1.375, label: '轻度活动（每周运动1-3次）' },
    { value: 1.55, label: '中度活动（每周运动3-5次）' },
    { value: 1.725, label: '高强度（天天运动）' },
  ];

  const targets = [
    { value: 'fat', label: '减脂', desc: '每日缺口400千卡' },
    { value: 'keep', label: '维持', desc: '保持当前体重' },
    { value: 'muscle', label: '增肌', desc: '每日盈余300千卡' },
  ];

  const handleEdit = (field: string, currentValue: any) => {
    setEditingField(field);
    setTempValue(String(currentValue));
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (editingField) {
      let value: any = tempValue;

      if (['age', 'height', 'weight'].includes(editingField)) {
        value = Number(tempValue);
      }

      updateUserSettings({ [editingField]: value });
      setShowEditModal(false);
      setEditingField(null);
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置今日所有记录吗？')) {
      resetTodayRecords();
      alert('已重置');
    }
  };

  const getActivityLabel = (level: number) => {
    const found = activityLevels.find(a => a.value === level);
    return found ? found.label : '未知';
  };

  const getTargetInfo = (target: string) => {
    const found = targets.find(t => t.value === target);
    return found || { label: '未知', desc: '' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">{userSettings.nickname}</div>
            <div className="text-sm opacity-90">开始管理你的热量</div>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">资料展示</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="text-sm text-gray-600">性别</div>
              <button
                onClick={() => handleEdit('gender', userSettings.gender)}
                className="text-sm font-medium text-purple-600"
              >
                {userSettings.gender === 'male' ? '男' : '女'}
              </button>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="text-sm text-gray-600">年龄</div>
              <button
                onClick={() => handleEdit('age', userSettings.age)}
                className="text-sm font-medium text-purple-600"
              >
                {userSettings.age} 岁
              </button>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="text-sm text-gray-600">身高</div>
              <button
                onClick={() => handleEdit('height', userSettings.height)}
                className="text-sm font-medium text-purple-600"
              >
                {userSettings.height} cm
              </button>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="text-sm text-gray-600">体重</div>
              <button
                onClick={() => handleEdit('weight', userSettings.weight)}
                className="text-sm font-medium text-purple-600"
              >
                {userSettings.weight} kg
              </button>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="text-sm text-gray-600">当前目标</div>
              <button
                onClick={() => handleEdit('target', userSettings.target)}
                className="text-sm font-medium text-purple-600"
              >
                {getTargetInfo(userSettings.target).label}
              </button>
            </div>

            <div className="flex justify-between items-center py-3">
              <div className="text-sm text-gray-600">活动水平</div>
              <button
                onClick={() => handleEdit('activityLevel', userSettings.activityLevel)}
                className="text-sm font-medium text-purple-600 text-right max-w-[200px]"
              >
                {getActivityLabel(userSettings.activityLevel)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calorie Calculation Card */}
      <div className="px-6 py-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-semibold mb-4">热量计算结果</h2>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm opacity-80 mb-1">基础代谢 (BMR)</div>
              <div className="text-2xl font-bold">{Math.round(bmr)} 千卡/天</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm opacity-80 mb-1">每日总消耗 (TDEE)</div>
              <div className="text-2xl font-bold">{Math.round(tdee)} 千卡/天</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm opacity-80 mb-1">推荐摄入</div>
              <div className="text-3xl font-bold">{Math.round(targetCal)} 千卡/天</div>
              <div className="text-xs opacity-75 mt-1">
                {getTargetInfo(userSettings.target).desc}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action List */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={handleReset}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-red-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🔄</div>
              <span className="text-gray-800">重置今日所有记录</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>

          <button className="w-full px-6 py-4 flex justify-between items-center hover:bg-purple-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="text-2xl">ℹ️</div>
              <span className="text-gray-800">关于本工具</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>

          <button className="w-full px-6 py-4 flex justify-between items-center hover:bg-purple-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📖</div>
              <span className="text-gray-800">使用说明</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center">
        <div className="text-xs text-gray-400 mb-2">极简热量饮食管理</div>
        <div className="text-xs text-gray-300">无广告 · 无会员 · 无打卡 · 无社交</div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                编辑 {editingField === 'gender' ? '性别' : editingField === 'target' ? '目标' : editingField === 'activityLevel' ? '活动水平' : editingField}
              </h3>

              {editingField === 'gender' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setTempValue('male')}
                    className={`flex-1 py-4 rounded-xl font-medium transition-all ${
                      tempValue === 'male'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    男
                  </button>
                  <button
                    onClick={() => setTempValue('female')}
                    className={`flex-1 py-4 rounded-xl font-medium transition-all ${
                      tempValue === 'female'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    女
                  </button>
                </div>
              )}

              {editingField === 'target' && (
                <div className="space-y-3">
                  {targets.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTempValue(t.value)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        tempValue === t.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{t.label}</div>
                      <div className={`text-xs mt-1 ${tempValue === t.value ? 'text-white/80' : 'text-gray-500'}`}>
                        {t.desc}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {editingField === 'activityLevel' && (
                <div className="space-y-3">
                  {activityLevels.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => setTempValue(String(a.value))}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        tempValue === String(a.value)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="font-medium text-sm">{a.label}</div>
                    </button>
                  ))}
                </div>
              )}

              {!['gender', 'target', 'activityLevel'].includes(editingField || '') && (
                <input
                  type="number"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              )}
            </div>

            <div className="p-6 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
