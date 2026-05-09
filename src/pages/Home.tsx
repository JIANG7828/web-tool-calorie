import { Card, Space, Progress, Button, Tag, Statistic } from 'antd';
import { FireOutlined, FireFilled, PlusOutlined, CoffeeOutlined, CloudOutlined, ThunderboltOutlined, AppstoreOutlined, AimOutlined, TrophyOutlined } from '@ant-design/icons';
import { useCalorieStore } from '../store/calorieStore';
import { formatDate } from '../utils/calorie';
import { calculateStreak, calculateAchievementStats } from '../utils/checkInSystem';
import AddFoodModal from './AddFoodModal';
import EvaluationPage from './EvaluationPage';
import WaterSuccessModal from './WaterSuccessModal';
import SmartSuggestion from '../components/SmartSuggestion';
import { useState, useEffect } from 'react';

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
    todayRecords,
    todayExercises,
    getTodayTotalCalories,
    getTodayExerciseCalories,
    getTodayMacros,
    evaluateLastMeal,
    todayWaterCount,
    addWater,
    checkIns,
  } = useCalorieStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [showWaterSuccess, setShowWaterSuccess] = useState(false);
  const [lastWaterCount, setLastWaterCount] = useState(0);
  const [showSmartSuggestion, setShowSmartSuggestion] = useState(true);
  const [animateProgress, setAnimateProgress] = useState(false);

  const targetCal = getTargetCalorie(userSettings);
  const totalCal = getTodayTotalCalories();
  const macros = getTodayMacros();
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

  const stats = calculateAchievementStats(checkIns, userSettings.startDate ? new Date(userSettings.startDate) : new Date());
  const consecutiveDays = calculateStreak(checkIns);

  useEffect(() => {
    if (totalCal >= targetCal * 0.8 && todayRecords.length > 0) {
      const eval_ = evaluateLastMeal();
      if (eval_) {
        setEvaluationData(eval_);
        setShowEvaluation(true);
      }
    }
  }, [totalCal, targetCal, todayRecords.length]);

  const handleAddWater = () => {
    addWater();
    setLastWaterCount(todayWaterCount + 1);
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
            <h1 className="page-title">今日饮食记录</h1>
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
              const isToday = dateStr === formatDate(new Date());
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    width: '36px', height: '48px', borderRadius: '6px', border: 'none',
                    background: isToday ? '#1677FF' : 'transparent',
                    color: isToday ? '#fff' : '#666',
                    cursor: 'pointer', fontSize: '12px',
                  }}
                >
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>周{WEEKDAYS[date.getDay()]}</span>
                  <span style={{ fontWeight: isToday ? 700 : 400, fontSize: '13px' }}>{date.getDate()}</span>
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
            <p className="caption-text" style={{ marginBottom: '4px' }}>今日摄入</p>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '24px' }}>
        {MEAL_TYPES.map((meal) => (
          <Button
            key={meal.key}
            type="default"
            onClick={() => {
              if (meal.key === 'exercise') {
                window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'exercise' } }));
              } else {
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
              <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>今日已喝 {todayWaterCount} 杯 / 8 杯</p>
            </div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddWater} />
        </div>
      </Card>

      {/* Smart Suggestion */}
      {showSmartSuggestion && (
        <div style={{ marginBottom: '24px' }}>
          <SmartSuggestion
            currentCal={totalCal}
            targetCal={targetCal}
            mealTime={todayRecords.length > 0
              ? (todayRecords[todayRecords.length - 1].mealType === 'snack' ? 'dinner' : todayRecords[todayRecords.length - 1].mealType === 'dinner' ? 'dinner' : 'lunch')
              : 'breakfast'}
            onClose={() => setShowSmartSuggestion(false)}
          />
        </div>
      )}

      {/* Achievement Stats */}
      <Card style={{ marginBottom: '24px', borderRadius: '8px' }} styles={{ body: { padding: '16px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <TrophyOutlined style={{ color: '#FAAD14', fontSize: '18px' }} />
          <span className="section-title">成就统计</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{
            backgroundColor: '#F6FFED', borderRadius: '8px', padding: '12px',
            textAlign: 'center', border: '1px solid #B7EB8F',
          }}>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#52C41A', margin: '0 0 4px 0' }}>
              {stats.length > 0 ? stats[0].totalDays : 0}
            </p>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>总打卡天数</p>
          </div>
          <div style={{
            backgroundColor: '#E6F4FF', borderRadius: '8px', padding: '12px',
            textAlign: 'center', border: '1px solid #91CAFF',
          }}>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#1677FF', margin: '0 0 4px 0' }}>
              {stats.find(s => s.type === 'water')?.successDays || 0}
            </p>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>饮水达标</p>
          </div>
          <div style={{
            backgroundColor: '#FFFBE6', borderRadius: '8px', padding: '12px',
            textAlign: 'center', border: '1px solid #FFE58F',
          }}>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#FAAD14', margin: '0 0 4px 0' }}>
              {consecutiveDays}
            </p>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>连续打卡</p>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <AddFoodModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      {showEvaluation && evaluationData && (
        <EvaluationPage evaluation={evaluationData} onClose={() => setShowEvaluation(false)} />
      )}

      {showWaterSuccess && (
        <WaterSuccessModal waterCount={lastWaterCount} onClose={() => setShowWaterSuccess(false)} />
      )}
    </div>
  );
}
