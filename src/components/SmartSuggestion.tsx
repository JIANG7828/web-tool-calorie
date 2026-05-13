import { useState, useEffect } from 'react';
import { generateMealSuggestion, AISuggestion, getLastMealSummary, MealHistory } from '../utils/aiSuggestion';
import { UserProfile } from '../utils/aiSuggestion';
import { Card, Space, Tag, Typography, Button, Skeleton, Spin } from 'antd';
import { CoffeeOutlined, ThunderboltOutlined, CloudOutlined, AppstoreOutlined, BulbOutlined, CloseOutlined, FireOutlined, TrophyOutlined, RobotOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface SmartSuggestionProps {
  currentCal: number;
  targetCal: number;
  mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  todayExerciseCal: number;
  todayRecords: any[];
  userProfile: {
    weight: number;
    height: number;
    age: number;
    gender: string;
    target: 'fat' | 'keep' | 'muscle';
  };
  onClose: () => void;
}

const MEAL_NAMES: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

const MEAL_ICONS: Record<string, JSX.Element> = {
  breakfast: <CoffeeOutlined />,
  lunch: <ThunderboltOutlined />,
  dinner: <CloudOutlined />,
  snack: <AppstoreOutlined />,
};

const MEAL_TARGET_RATIO: Record<string, number> = {
  breakfast: 0.3,
  lunch: 0.4,
  dinner: 0.25,
  snack: 0.05,
};

export default function SmartSuggestion({
  currentCal,
  targetCal,
  mealTime,
  todayExerciseCal,
  todayRecords,
  userProfile,
  onClose,
}: SmartSuggestionProps) {
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setLoading(true);
      try {
        // 获取上一餐记录
        const lastMeal = getLastMealSummary(todayRecords);
        
        // 构建用户资料
        const profile: UserProfile = {
          weight: userProfile.weight,
          height: userProfile.height,
          age: userProfile.age,
          gender: userProfile.gender,
          target: userProfile.target,
          targetCal,
          currentCal,
          todayExerciseCal,
        };

        // 调用 AI 建议服务
        const result = await generateMealSuggestion(lastMeal, profile);
        setSuggestion(result);
      } catch (error) {
        console.error('获取 AI 建议失败:', error);
        // 降级使用默认建议
        setSuggestion({
          suggestion: '上一餐热量适中',
          nextMealRecommendation: '下一餐注意营养均衡',
          recommendedFoods: [],
          exerciseTips: ['饭后适当散步'],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, [mealTime, todayRecords.length]);

  // 计算热量状态
  const mealTarget = targetCal * MEAL_TARGET_RATIO[mealTime];
  const mealCal = currentCal;
  const isLow = mealCal < mealTarget * 0.5;
  const isHigh = mealCal > mealTarget * 1.2;

  const getStatusColor = () => {
    if (isLow) return 'warning';
    if (isHigh) return 'error';
    return 'success';
  };

  const getStatusBg = () => {
    if (isLow) return '#FFFBE6';
    if (isHigh) return '#FFF1F0';
    return '#F6FFED';
  };

  const getStatusText = () => {
    if (isLow) return '偏少';
    if (isHigh) return '偏多';
    return '适中';
  };

  if (loading) {
    return (
      <Card
        style={{ borderRadius: '8px' }}
        styles={{ body: { padding: '16px' } }}
        extra={
          <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
        }
      >
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <Spin />
          <Text style={{ display: 'block', marginTop: '8px', color: '#999' }}>AI 正在分析您的饮食记录...</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card
      style={{ borderRadius: '8px', position: 'relative' }}
      styles={{ body: { padding: '16px' } }}
      extra={
        <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
      }
    >
      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
        {/* 餐后建议标题 */}
        <Space>
          <span style={{ fontSize: '18px', color: '#666' }}>{MEAL_ICONS[mealTime]}</span>
          <Text strong style={{ fontSize: '16px' }}>{MEAL_NAMES[mealTime]}后建议</Text>
          <Tag color={getStatusColor()} style={{ margin: 0 }}>{getStatusText()}</Tag>
        </Space>

        {/* AI 分析结果 */}
        {suggestion && (
          <>
            {/* 上一餐评估 */}
            <Card style={{ borderRadius: '8px', background: '#F5F7FA', border: 'none' }}>
              <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                <Space>
                  <RobotOutlined style={{ color: '#1677FF' }} />
                  <Text strong>AI 分析</Text>
                </Space>
                <Text style={{ fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
                  {suggestion.suggestion}
                </Text>
              </Space>
            </Card>

            {/* 下一餐推荐 */}
            {suggestion.nextMealRecommendation && (
              <Card style={{ borderRadius: '8px', background: getStatusBg(), border: 'none' }}>
                <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                  <Text strong>
                    <BulbOutlined style={{ marginRight: '4px', color: '#1677FF' }} />下一餐推荐
                  </Text>
                  <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {suggestion.nextMealRecommendation}
                  </Text>
                </Space>
              </Card>
            )}

            {/* 推荐食物 */}
            {suggestion.recommendedFoods.length > 0 && (
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  <TrophyOutlined style={{ marginRight: '4px', color: '#52C41A' }} />推荐食物
                </Text>
                <Space size={8} wrap>
                  {suggestion.recommendedFoods.map((food, index) => (
                    <Tag key={index} color="blue" style={{ padding: '4px 12px' }}>{food}</Tag>
                  ))}
                </Space>
              </div>
            )}


          </>
        )}
      </Space>
    </Card>
  );
}
