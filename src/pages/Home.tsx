import { Card, Space, Progress, Button, Tag, Statistic, Badge } from 'antd';
import { FireOutlined, FireFilled, PlusOutlined, CoffeeOutlined, CloudOutlined, ThunderboltOutlined, AppstoreOutlined, AimOutlined, CameraOutlined, StarOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { useCalorieStore } from '../store/calorieStore';
import { formatDate } from '../utils/calorie';
import { getRecipesByDate, deleteMealPlanByDate } from '../utils/recipeData';

import AddFoodModal from './AddFoodModal';
import WaterSuccessModal from './WaterSuccessModal';
import SmartSuggestion from '../components/SmartSuggestion';
import { useState, useEffect, useRef } from 'react';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const MEAL_TYPES = [
  { key: 'breakfast', label: '早餐', icon: <CoffeeOutlined />, color: '#FAAD14' },
  { key: 'lunch', label: '午餐', icon: <ThunderboltOutlined />, color: '#52C41A' },
  { key: 'dinner', label: '晚餐', icon: <CloudOutlined />, color: '#1677FF' },
  { key: 'snack', label: '加餐', icon: <AppstoreOutlined />, color: '#FF4D4F' },
  { key: 'exercise', label: '运动', icon: <FireOutlined />, color: '#FAAD14' },
];

const getTargetCalorie = (userSettings: any) => {
  const weight = userSettings.weight || 55;
  const activityLevel = userSettings.activityLevel || 1.2;
  const bmr = weight * 22;
  const tdee = bmr * activityLevel;
  if (userSettings.target === 'fat') return Math.round(tdee - 400);
  if (userSettings.target === 'muscle') return Math.round(tdee + 300);
  return Math.round(tdee);
};

export default function Home() {
  const {
    userSettings,
    getRecordsByDate,
    getExercisesByDate,
    getWaterCountByDate,
    addWater,
    addFoodRecord,
  } = useCalorieStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWaterSuccess, setShowWaterSuccess] = useState(false);
  const [lastWaterCount, setLastWaterCount] = useState(0);
  const [showSmartSuggestion, setShowSmartSuggestion] = useState(true);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('lunch');
  const [showTodayMealPlan, setShowTodayMealPlan] = useState(false);

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDateStr === todayStr;

  const [todayMealPlan, setTodayMealPlan] = useState(() => getRecipesByDate(selectedDateStr));

  // Refresh meal plan when date changes or after operations
  const refreshTodayMealPlan = () => {
    setTodayMealPlan(getRecipesByDate(selectedDateStr));
  };

  // Auto refresh when date changes
  useEffect(() => {
    refreshTodayMealPlan();
  }, [selectedDateStr]);

  const dateRecords = getRecordsByDate(selectedDateStr);
  const dateExercises = getExercisesByDate(selectedDateStr);
  const waterCount = getWaterCountByDate(selectedDateStr);

  const dateTotalCal = dateRecords.reduce((sum, r) => sum + r.calorie, 0);
  const dateExerciseCal = dateExercises.reduce((sum, r) => sum + r.calorie, 0);

  const dateMacros = (() => {
    const macros = { protein: 0, fat: 0, carbs: 0 };
    dateRecords.forEach((r) => {
      if (r.macro) {
        macros.protein += r.macro.protein;
        macros.fat += r.macro.fat;
        macros.carbs += r.macro.carbs;
      }
    });
    return macros;
  })();

  const targetCal = getTargetCalorie(userSettings);
  const totalCal = dateTotalCal;
  const macros = dateMacros;
  const remaining = targetCal - totalCal;
  const progress = Math.min((totalCal / targetCal) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const getDateTitle = () => {
    if (isToday) return '今日饮食记录';
    const dayOfWeek = `周${WEEKDAYS[selectedDate.getDay()]}`;
    return `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日 ${dayOfWeek}`;
  };

  const handleAddWater = () => {
    addWater();
    setLastWaterCount(waterCount + 1);
    setShowWaterSuccess(true);
  };

  const macroConfig = [
    { key: 'protein' as const, label: '蛋白质', target: 150, color: '#1677FF', bgColor: '#E6F4FF' },
    { key: 'fat' as const, label: '脂肪', target: 60, color: '#FAAD14', bgColor: '#FFFBE6' },
    { key: 'carbs' as const, label: '碳水', target: 300, color: '#52C41A', bgColor: '#F6FFED' },
  ];

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Hi, {userSettings.nickname || '用户'}</p>
            <h1 className="page-title">{getDateTitle()}</h1>
          </div>
        </div>

        {/* Date Navigator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: '#fff', borderRadius: '8px', padding: '8px 12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        }}>
          <button
            onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 7); setSelectedDate(d); }}
            style={{ border: 'none', background: '#F5F7FA', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: '#666' }}
          >◀</button>
          <div style={{ display: 'flex', gap: '6px' }}>
            {weekDates.map((date) => {
              const dateStr = formatDate(date);
              const isSelected = dateStr === selectedDateStr;
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    width: '36px', height: '48px', borderRadius: '6px', border: 'none',
                    background: isSelected ? '#1677FF' : 'transparent',
                    color: isSelected ? '#fff' : '#666',
                    cursor: 'pointer', fontSize: '12px',
                  }}
                >
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>周{WEEKDAYS[date.getDay()]}</span>
                  <span style={{ fontWeight: isSelected ? 700 : 400, fontSize: '13px' }}>{date.getDate()}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 7); setSelectedDate(d); }}
            style={{ border: 'none', background: '#F5F7FA', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: '#666' }}
          >▶</button>
        </div>
      </div>

      {/* Calorie Ring Card */}
      <Card style={{ marginBottom: '24px', borderRadius: '8px' }} styles={{ body: { padding: '16px' } }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <p className="caption-text" style={{ marginBottom: '4px' }}>{isToday ? '今日摄入' : '摄入'}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#333' }}>{totalCal}</span>
              <span style={{ fontSize: '14px', color: '#666' }}>/ {targetCal} 千卡</span>
            </div>
            <p style={{ fontSize: '12px', color: remaining >= 0 ? '#52C41A' : '#FF4D4F', fontWeight: 500, marginBottom: '16px' }}>
              {remaining >= 0 ? `剩余 ${remaining} 千卡` : `超标 ${Math.abs(remaining)} 千卡`}
            </p>

            {/* Macro Progress */}
            <Space orientation="vertical" size={8} style={{ width: '100%' }}>
              {macroConfig.map((macro) => {
                const value = macros[macro.key] || 0;
                const pct = Math.min((value / macro.target) * 100, 100);
                return (
                  <div key={macro.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>{macro.label}</span>
                      <span style={{ fontSize: '12px', color: '#333', fontWeight: 600 }}>{value}g / {macro.target}g</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: macro.bgColor, borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%', backgroundColor: macro.color, borderRadius: '3px',
                          width: animateProgress ? `${pct}%` : '0%',
                          transition: 'width 1s ease-out',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </Space>
          </div>

          {/* Circular Progress */}
          <div style={{ width: '100px', height: '100px', flexShrink: 0, marginLeft: '16px' }}>
            <Progress
              type="circle"
              percent={animateProgress ? Math.round(progress) : 0}
              size={100}
              strokeColor="#1677FF"
              format={(p) => <span style={{ fontSize: '18px', fontWeight: 700, color: '#333' }}>{p}%</span>}
            />
          </div>
        </div>
      </Card>

      {/* Meal Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {MEAL_TYPES.map((meal) => (
          <Button
            key={meal.key}
            type="default"
            onClick={() => {
                if (meal.key === 'exercise') {
                  window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'exercise' } }));
                } else {
                  setSelectedMealType(meal.key);
                  setShowAddModal(true);
                }
              }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              height: '72px', borderRadius: '8px', border: '1px solid #F0F0F0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ fontSize: '20px', color: meal.color, marginBottom: '4px' }}>{meal.icon}</span>
            <span style={{ fontSize: '12px', color: '#666' }}>{meal.label}</span>
          </Button>
        ))}
      </div>

      {/* AI Recognition Banner */}
      <Card
        style={{
          marginBottom: '24px', borderRadius: '12px', cursor: 'pointer',
          background: '#F0F5FF',
          border: '1px solid #ADC6FF',
        }}
        styles={{ body: { padding: '16px 20px' } }}
        onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'recognition' } }))}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              backgroundColor: '#1677FF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '22px',
            }}>
              <CameraOutlined style={{ color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#333', margin: 0 }}>📷 AI 拍照识食物</p>
              <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0 0' }}>拍照自动识别，一键记录热量</p>
            </div>
          </div>
          <span style={{ fontSize: '20px', color: '#666', opacity: 0.4 }}>›</span>
        </div>
      </Card>

      {/* Custom Meal Plan Banner */}
      <Card
        style={{
          marginBottom: '24px', borderRadius: '12px', cursor: 'pointer',
          background: '#FFF7E6',
          border: '1px solid #FFE7BA',
        }}
        styles={{ body: { padding: '16px 20px' } }}
        onClick={() => setShowTodayMealPlan(!showTodayMealPlan)}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              backgroundColor: '#FA8C16', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '22px',
            }}>
              <StarOutlined style={{ color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#333', margin: 0 }}>
                今日定制餐单
                <Tag style={{ marginLeft: '8px', background: '#FA8C16', color: '#fff', border: 'none', fontSize: '10px' }}>
                  {todayMealPlan.length} 道菜
                </Tag>
              </p>
              <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0 0' }}>点击查看今日餐单详情</p>
            </div>
          </div>
          <span style={{ fontSize: '20px', color: '#666', opacity: 0.4 }}>›</span>
        </div>
        
        {showTodayMealPlan && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #FFE7BA' }}>
            {todayMealPlan.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', margin: '16px 0' }}>
                今日暂无定制餐单
              </p>
            ) : (
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                {todayMealPlan.map((recipe) => (
                  <Card key={recipe.id} size="small" style={{ borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', margin: '0 0 4px 0' }}>
                          {recipe.name}
                          <Tag style={{ marginLeft: '8px', fontSize: '10px' }}>
                            {recipe.category === 'chinese' ? '中餐' : '轻食'}
                          </Tag>
                          <Tag style={{ fontSize: '10px' }}>
                            {recipe.mealType === 'breakfast' ? '早餐' : recipe.mealType === 'lunch' ? '午餐' : '晚餐'}
                          </Tag>
                        </p>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                          {recipe.calorie}千卡 | 蛋白质{recipe.protein}g 脂肪{recipe.fat}g 碳水{recipe.carbs}g
                        </p>
                      </div>
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          const timeStr = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
                          const mealTypeMap: Record<string, string> = {
                            breakfast: 'breakfast',
                            lunch: 'lunch',
                            dinner: 'dinner',
                          };
                          addFoodRecord({
                            id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
                            date: new Date().toISOString().split('T')[0],
                            name: recipe.name,
                            calorie: recipe.calorie,
                            time: timeStr,
                            mealType: mealTypeMap[recipe.mealType] as 'breakfast' | 'lunch' | 'dinner' | 'snack',
                            macro: {
                              protein: recipe.protein,
                              fat: recipe.fat,
                              carbs: recipe.carbs,
                            },
                            timestamp: Date.now(),
                          });
                          refreshTodayMealPlan();
                        }}
                      >
                        添加到记录
                      </Button>
                    </div>
                  </Card>
                ))}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    danger
                    block
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMealPlanByDate(selectedDateStr);
                      refreshTodayMealPlan();
                    }}
                  >
                    删除今日餐单
                  </Button>
                  <Button
                    type="primary"
                    block
                    icon={<StarOutlined />}
                    onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'recipe' } }));
                  }}
                    style={{ background: '#FA8C16', borderColor: '#FA8C16' }}
                  >
                    定制更多
                  </Button>
                </div>
              </Space>
            )}
          </div>
        )}
      </Card>

      {/* Water Tracker */}
      <Card style={{ marginBottom: '24px', borderRadius: '8px' }} styles={{ body: { padding: '16px' } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '6px',
              backgroundColor: '#E6F4FF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px',
            }}>💧</div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', margin: 0 }}>饮水记录</p>
              <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{isToday ? '今日' : '当日'}已喝 {waterCount} 杯 / 8 杯</p>
            </div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddWater} />
        </div>
      </Card>

      {/* Smart Suggestion */}
      {showSmartSuggestion && isToday && (
        <div style={{ marginBottom: '24px' }}>
          <SmartSuggestion
            currentCal={totalCal}
            targetCal={targetCal}
            mealTime={dateRecords.length > 0
              ? (dateRecords[dateRecords.length - 1].mealType === 'snack' ? 'dinner' : dateRecords[dateRecords.length - 1].mealType === 'dinner' ? 'dinner' : 'lunch')
              : 'breakfast'}
            todayExerciseCal={dateExerciseCal}
            todayRecords={dateRecords}
            userProfile={userSettings}
            onClose={() => setShowSmartSuggestion(false)}
          />
        </div>
      )}

      {/* Modals */}
      <AddFoodModal key={selectedMealType} isOpen={showAddModal} onClose={() => setShowAddModal(false)} defaultMealType={selectedMealType} />

      {showWaterSuccess && (
        <WaterSuccessModal waterCount={lastWaterCount} onClose={() => setShowWaterSuccess(false)} />
      )}
    </div>
  );
}