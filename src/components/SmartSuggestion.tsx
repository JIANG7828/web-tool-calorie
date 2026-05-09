import { getMealAfterSuggestion } from '../utils/dietPlan';
import { Card, Space, Tag, Typography, Button } from 'antd';
import {
  CoffeeOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  AppstoreOutlined,
  BulbOutlined,
  CloseOutlined,
  FireOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface SmartSuggestionProps {
  currentCal: number;
  targetCal: number;
  mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
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

export default function SmartSuggestion({ currentCal, targetCal, mealTime, onClose }: SmartSuggestionProps) {
  const suggestion = getMealAfterSuggestion(currentCal, targetCal, mealTime);

  const getStatusColor = () => {
    switch (suggestion.status) {
      case '不足': return 'warning';
      case '超标': return 'error';
      default: return 'success';
    }
  };

  const getStatusBg = () => {
    switch (suggestion.status) {
      case '不足': return '#FFFBE6';
      case '超标': return '#FFF1F0';
      default: return '#F6FFED';
    }
  };

  return (
    <Card
      style={{ borderRadius: '8px', position: 'relative' }}
      styles={{ body: { padding: '16px' } }}
      extra={
        <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
      }
    >
      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
        {/* 进食后建议 */}
        <Card style={{ borderRadius: '8px', background: getStatusBg(), border: 'none' }}>
          <Space orientation="vertical" size={8} style={{ width: '100%' }}>
            <Space>
              <span style={{ fontSize: '18px', color: '#666' }}>{MEAL_ICONS[mealTime]}</span>
              <Text strong>{MEAL_NAMES[mealTime]}后建议</Text>
            </Space>
            <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>{suggestion.suggestion}</Text>
          </Space>
        </Card>

        {/* 推荐食物 */}
        {suggestion.food.length > 0 && (
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              <TrophyOutlined style={{ marginRight: '4px' }} />推荐食物
            </Text>
            <Space size={8} wrap>
              {suggestion.food.map((food, index) => (
                <Tag key={index} color="blue">{food}</Tag>
              ))}
            </Space>
          </div>
        )}

        {/* 运动建议 */}
        {suggestion.exercise.length > 0 && (
          <Card style={{ borderRadius: '8px', background: '#FFF7E6', border: 'none' }}>
            <Space orientation="vertical" size={8} style={{ width: '100%' }}>
              <Text strong>
                <FireOutlined style={{ marginRight: '4px' }} />运动建议
              </Text>
              <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                {suggestion.exercise.map((ex, index) => (
                  <Text key={index} style={{ fontSize: '14px', lineHeight: '1.6', display: 'block' }}>
                    <span style={{ marginRight: '8px' }}>{ex.emoji}</span>
                    {ex.text}
                  </Text>
                ))}
              </Space>
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
}
