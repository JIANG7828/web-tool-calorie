import { useState } from 'react';
import dayjs from 'dayjs';
import { useCalorieStore } from '../store/calorieStore';
import { getBMR, getTDEE, getTargetCal } from '../utils/calorie';
import { calculateStreak } from '../utils/checkInSystem';
import WeightChart from '../components/WeightChart';
import FoodDatabasePage from './FoodDatabasePage';
import WeightTrendPage from './WeightTrendPage';
import { Card, Space, Tag, Button, Modal, Typography, Input, Progress, List, Avatar, Statistic, DatePicker } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  ReloadOutlined,
  AimOutlined,
  CloseOutlined,
  CheckOutlined,
  BookOutlined,
  HeartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  LineChartOutlined,
  CalendarOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ProfilePage() {
  const [showSettings, setShowSettings] = useState(false);
  const [showFoodDatabase, setShowFoodDatabase] = useState(false);
  const [showWeightTrend, setShowWeightTrend] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const {
    userSettings,
    updateUserSettings,
    resetTodayRecords,
    checkIns,
    weightRecords,
    addWeightRecord,
    getAchievementStats,
    resetWater,
  } = useCalorieStore();

  const bmr = getBMR(userSettings.gender, userSettings.weight, userSettings.height, userSettings.age);
  const tdee = getTDEE(bmr, userSettings.activityLevel);
  const targetCal = getTargetCal(tdee, userSettings.target);

  const streak = calculateStreak(checkIns);

  // Calculate target plan days
  const getTargetPlanDays = () => {
    if (!userSettings.targetSetDate || !userSettings.targetAchievementDate) return 0;
    const start = new Date(userSettings.targetSetDate);
    const end = new Date(userSettings.targetAchievementDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  const targetPlanDays = getTargetPlanDays();

  // Calculate achievement rates based on target plan days
  const getCalorieSuccessDays = () => {
    return checkIns.filter(c => c.calorie <= c.target).length;
  };

  const getExerciseSuccessDays = () => {
    return checkIns.filter(c => c.exerciseCal && c.exerciseCal > 0).length;
  };

  const getWaterSuccessDays = () => {
    return checkIns.filter(c => c.waterCount && c.waterCount >= 8).length;
  };

  const calorieSuccessDays = getCalorieSuccessDays();
  const exerciseSuccessDays = getExerciseSuccessDays();
  const waterSuccessDays = getWaterSuccessDays();

  const calorieRate = targetPlanDays > 0 ? Math.round((calorieSuccessDays / targetPlanDays) * 100) : 0;
  const exerciseRate = targetPlanDays > 0 ? Math.round((exerciseSuccessDays / targetPlanDays) * 100) : 0;
  const waterRate = targetPlanDays > 0 ? Math.round((waterSuccessDays / targetPlanDays) * 100) : 0;

  const handleWeightSubmit = () => {
    if (newWeight) {
      addWeightRecord(Number(newWeight));
      setNewWeight('');
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置今日所有记录吗？')) {
      resetTodayRecords();
    }
  };

  const getTargetLabel = () => {
    const labels: Record<string, string> = { fat: '减脂', keep: '维持', muscle: '增肌' };
    return labels[userSettings.target];
  };

  const getTargetColor = () => {
    const colors: Record<string, string> = { fat: 'orange', keep: 'green', muscle: 'blue' };
    return colors[userSettings.target];
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0958D9 0%, #1677FF 100%)',
        paddingTop: '48px',
        paddingBottom: '24px',
      }}>
        <div style={{ padding: '0 20px' }}>
          <Space>
            <Avatar size={64} style={{ background: 'rgba(255,255,255,0.3)', color: '#FFF', fontSize: '32px' }}>
              <UserOutlined />
            </Avatar>
            <div>
              <Title level={4} style={{ margin: 0, color: '#FFF' }}>{userSettings.nickname}</Title>
              <Text style={{ color: '#FFF', fontSize: '12px' }}>已加入 {streak} 天</Text>
              <Tag color={getTargetColor()} style={{ marginTop: '4px' }}>{getTargetLabel()}</Tag>
            </div>
          </Space>
        </div>
      </div>

      {/* Content */}
      <Space orientation="vertical" size={16} style={{ width: '100%', padding: '16px' }}>
        {/* Quick Action: Fill Profile */}
        <Button
          type="primary"
          block
          size="large"
          icon={<UserOutlined />}
          onClick={() => setShowSettings(true)}
          style={{
            background: 'linear-gradient(90deg, #1677FF, #4096FF)',
            borderRadius: '24px',
            height: '52px',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          填写个人资料
        </Button>

        {/* Health Data */}
        <Card title="健康数据" styles={{ body: { padding: '16px' } }} style={{ borderRadius: '8px' }}>
          <Space style={{ width: '100%', justifyContent: 'space-around' }}>
            <Card style={{ flex: 1, borderRadius: '8px', background: '#F0F5FF', textAlign: 'center', border: 'none' }}>
              <Statistic title="基础代谢" value={bmr} suffix="千卡/天" valueStyle={{ fontSize: '18px', color: '#1677FF' }} />
            </Card>
            <Card style={{ flex: 1, borderRadius: '8px', background: '#F6FFED', textAlign: 'center', border: 'none' }}>
              <Statistic title="每日总消耗" value={tdee} suffix="千卡/天" valueStyle={{ fontSize: '18px', color: '#52C41A' }} />
            </Card>
            <Card style={{ flex: 1, borderRadius: '8px', background: '#FFF7E6', textAlign: 'center', border: 'none' }}>
              <Statistic title="目标摄入" value={targetCal} suffix="千卡/天" valueStyle={{ fontSize: '18px', color: '#FA8C16' }} />
            </Card>
          </Space>
        </Card>

        {/* Achievement Stats */}
        <Card
          title="成就"
          styles={{ body: { padding: '16px' } }}
          style={{ borderRadius: '8px' }}
        >
          <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            {/* Target Plan Info */}
            {userSettings.targetSetDate && userSettings.targetAchievementDate && (
              <Card style={{ borderRadius: '8px', background: '#FAFAFA', border: 'none' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Space>
                    <CalendarOutlined style={{ color: '#1677FF', fontSize: '18px' }} />
                    <div>
                      <Text style={{ fontSize: '12px', color: '#999' }}>目标计划天数</Text>
                      <Text strong style={{ display: 'block' }}>{targetPlanDays} 天</Text>
                    </div>
                  </Space>
                  <Text style={{ fontSize: '12px', color: '#999' }}>
                    {userSettings.targetSetDate} 至 {userSettings.targetAchievementDate}
                  </Text>
                </Space>
              </Card>
            )}

            {/* Calorie Achievement */}
            <Card style={{ borderRadius: '8px', background: '#FFF1F0', border: 'none' }}>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Avatar size={32} style={{ background: '#FF4D4F' }}>
                      <AimOutlined />
                    </Avatar>
                    <div>
                      <Text strong style={{ fontSize: '14px' }}>热量达标</Text>
                      <Text style={{ color: '#666', fontSize: '12px', display: 'block' }}>{calorieSuccessDays}/{targetPlanDays} 天</Text>
                    </div>
                  </Space>
                  <Title level={3} style={{ margin: 0, color: '#FF4D4F', fontSize: '24px' }}>
                    {calorieRate}%
                  </Title>
                </div>
                <Progress percent={Math.min(calorieRate, 100)} strokeColor="#FF4D4F" size="small" showInfo={false} />
              </Space>
            </Card>

            {/* Exercise Achievement */}
            <Card style={{ borderRadius: '8px', background: '#F6FFED', border: 'none' }}>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Avatar size={32} style={{ background: '#52C41A' }}>
                      <BarChartOutlined />
                    </Avatar>
                    <div>
                      <Text strong style={{ fontSize: '14px' }}>运动消耗</Text>
                      <Text style={{ color: '#666', fontSize: '12px', display: 'block' }}>{exerciseSuccessDays}/{targetPlanDays} 天</Text>
                    </div>
                  </Space>
                  <Title level={3} style={{ margin: 0, color: '#52C41A', fontSize: '24px' }}>
                    {exerciseRate}%
                  </Title>
                </div>
                <Progress percent={Math.min(exerciseRate, 100)} strokeColor="#52C41A" size="small" showInfo={false} />
              </Space>
            </Card>

            {/* Water Achievement */}
            <Card style={{ borderRadius: '8px', background: '#F0F5FF', border: 'none' }}>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Avatar size={32} style={{ background: '#1677FF' }}>
                      <HeartOutlined />
                    </Avatar>
                    <div>
                      <Text strong style={{ fontSize: '14px' }}>喝水达标</Text>
                      <Text style={{ color: '#666', fontSize: '12px', display: 'block' }}>{waterSuccessDays}/{targetPlanDays} 天</Text>
                    </div>
                  </Space>
                  <Title level={3} style={{ margin: 0, color: '#1677FF', fontSize: '24px' }}>
                    {waterRate}%
                  </Title>
                </div>
                <Progress percent={Math.min(waterRate, 100)} strokeColor="#1677FF" size="small" showInfo={false} />
              </Space>
            </Card>
          </Space>
        </Card>

        {/* Weight Management */}
        <Card
          title="体重管理"
          styles={{ body: { padding: '16px' } }}
          style={{ borderRadius: '8px' }}
        >
          <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            <Card style={{ borderRadius: '8px', background: '#F6FFED', border: 'none' }}>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  type="number"
                  placeholder="输入体重(kg)"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  prefix={<LineChartOutlined />}
                />
                <Button type="primary" icon={<CheckOutlined />} onClick={handleWeightSubmit}>
                  保存
                </Button>
              </Space.Compact>
            </Card>

            {weightRecords.length > 0 && (
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>最近记录</Text>
                <List
                  size="small"
                  dataSource={weightRecords.slice(-5).reverse()}
                  renderItem={(record) => {
                    const idx = weightRecords.findIndex(r => r.id === record.id);
                    const weightDiff = idx === 0 ? null : (() => {
                      const prev = weightRecords[idx - 1];
                      return prev ? record.weight - prev.weight : null;
                    })();

                    return (
                      <List.Item style={{ background: '#FAFAFA', borderRadius: '8px', padding: '8px 16px' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <Text strong>{record.weight} kg</Text>
                            <Text style={{ color: '#666', fontSize: '12px', display: 'block' }}>{record.date} {record.time}</Text>
                          </div>
                          {weightDiff !== null && (
                            <Text
                              strong
                              type={weightDiff > 0 ? 'danger' : weightDiff < 0 ? 'success' : undefined}
                            >
                              {weightDiff > 0 ? <ArrowUpOutlined /> : weightDiff < 0 ? <ArrowDownOutlined /> : <MinusOutlined />}
                              {' '}{Math.abs(weightDiff).toFixed(1)} kg
                            </Text>
                          )}
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </div>
            )}

            <WeightChart records={weightRecords} targetWeight={userSettings.targetWeight} />
          </Space>
        </Card>

        {/* Settings */}
        <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: '8px' }}>
          <Button
            type="text"
            block
            onClick={() => setShowFoodDatabase(true)}
            style={{ height: 'auto', padding: '16px', borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Space>
              <Avatar size={40} style={{ background: '#FFF7E6' }}>
                <BookOutlined style={{ color: '#FA8C16' }} />
              </Avatar>
              <Text>食物数据库</Text>
            </Space>
            <Text type="secondary">›</Text>
          </Button>
        </Card>
      </Space>

      {/* Modals */}
      {showFoodDatabase && (
        <div style={{ position: 'fixed', inset: 0, background: '#FFF', zIndex: 1000, overflow: 'auto' }}>
          <Button
            onClick={() => setShowFoodDatabase(false)}
            style={{ position: 'fixed', top: '48px', right: '16px', zIndex: 10 }}
            type="default"
            icon={<ArrowUpOutlined />}
          >
            返回
          </Button>
          <FoodDatabasePage />
        </div>
      )}

      {showWeightTrend && (
        <div style={{ position: 'fixed', inset: 0, background: '#FFF', zIndex: 1000, overflow: 'auto' }}>
          <Button
            onClick={() => setShowWeightTrend(false)}
            style={{ position: 'fixed', top: '48px', right: '16px', zIndex: 10 }}
            type="default"
            icon={<ArrowUpOutlined />}
          >
            返回
          </Button>
          <WeightTrendPage />
        </div>
      )}

      {/* Settings Modal */}
      <Modal
        open={showSettings}
        onCancel={() => setShowSettings(false)}
        footer={null}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: '16px' } }}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Title level={4} style={{ margin: 0 }}>个人资料</Title>

          <div>
            <Text style={{ display: 'block', marginBottom: '8px' }}>昵称</Text>
            <Input
              value={userSettings.nickname}
              onChange={(e) => updateUserSettings({ nickname: e.target.value })}
              prefix={<UserOutlined />}
            />
          </div>

          <div>
            <Text style={{ display: 'block', marginBottom: '8px' }}>性别</Text>
            <Button.Group style={{ width: '100%' }}>
              <Button
                block
                type={userSettings.gender === 'male' ? 'primary' : 'default'}
                onClick={() => updateUserSettings({ gender: 'male' })}
              >
                男
              </Button>
              <Button
                block
                type={userSettings.gender === 'female' ? 'primary' : 'default'}
                onClick={() => updateUserSettings({ gender: 'female' })}
              >
                女
              </Button>
            </Button.Group>
          </div>

          <div>
            <Text style={{ display: 'block', marginBottom: '8px' }}>年龄</Text>
            <Input
              type="number"
              value={userSettings.age}
              onChange={(e) => updateUserSettings({ age: Number(e.target.value) })}
            />
          </div>

          <div>
            <Text style={{ display: 'block', marginBottom: '8px' }}>身高 (cm)</Text>
            <Input
              type="number"
              value={userSettings.height}
              onChange={(e) => updateUserSettings({ height: Number(e.target.value) })}
            />
          </div>

          <div>
            <Text style={{ display: 'block', marginBottom: '8px' }}>体重 (kg)</Text>
            <Input
              type="number"
              value={userSettings.weight}
              onChange={(e) => updateUserSettings({ weight: Number(e.target.value) })}
            />
          </div>

          <div>
            <Text style={{ display: 'block', marginBottom: '8px' }}>目标体重 (kg)</Text>
            <Input
              type="number"
              value={userSettings.targetWeight || ''}
              onChange={(e) => updateUserSettings({ targetWeight: Number(e.target.value) })}
            />
          </div>

          <div>
            <Text style={{ display: 'block', marginBottom: '8px' }}>当前目标</Text>
            <Button.Group style={{ width: '100%' }}>
              {[
                { key: 'fat', label: '减脂' },
                { key: 'keep', label: '维持' },
                { key: 'muscle', label: '增肌' },
              ].map((item) => (
                <Button
                  key={item.key}
                  block
                  type={userSettings.target === item.key ? 'primary' : 'default'}
                  onClick={() => updateUserSettings({ target: item.key as 'fat' | 'keep' | 'muscle' })}
                >
                  {item.label}
                </Button>
              ))}
            </Button.Group>
          </div>

          <div>
            <Text style={{ display: 'block', marginBottom: '8px' }}>活动水平</Text>
            <Space orientation="vertical" size={8} style={{ width: '100%' }}>
              {[
                { value: 1.2, label: '久坐办公' },
                { value: 1.375, label: '轻度活动' },
                { value: 1.55, label: '中度活动' },
                { value: 1.725, label: '高强度' },
              ].map((item) => (
                <Button
                  key={item.value}
                  block
                  type={userSettings.activityLevel === item.value ? 'primary' : 'default'}
                  onClick={() => updateUserSettings({ activityLevel: item.value })}
                >
                  {item.label}
                </Button>
              ))}
            </Space>
          </div>

          <div>
            <Text style={{ display: 'block', marginBottom: '8px' }}>目标设定日期</Text>
            <DatePicker
              style={{ width: '100%', height: '40px' }}
              value={userSettings.targetSetDate ? dayjs(userSettings.targetSetDate) : undefined}
              onChange={(date) => {
                if (date) {
                  updateUserSettings({ targetSetDate: date.format('YYYY-MM-DD') });
                }
              }}
              placeholder="选择目标设定日期"
            />
          </div>

          <div>
            <Text style={{ display: 'block', marginBottom: '8px' }}>目标达成日期</Text>
            <DatePicker
              style={{ width: '100%', height: '40px' }}
              value={userSettings.targetAchievementDate ? dayjs(userSettings.targetAchievementDate) : undefined}
              onChange={(date) => {
                if (date) {
                  updateUserSettings({ targetAchievementDate: date.format('YYYY-MM-DD') });
                }
              }}
              placeholder="选择目标达成日期"
            />
          </div>

          <Button type="primary" block size="large" onClick={() => setShowSettings(false)}>
            保存设置
          </Button>
        </Space>
      </Modal>
    </div>
  );
}
