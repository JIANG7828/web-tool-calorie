import { Card, Space, Button, Tag, Empty, DatePicker, Segmented } from 'antd';
import { LeftOutlined, DeleteOutlined, CoffeeOutlined, ThunderboltOutlined, CloudOutlined, AppstoreOutlined, CalendarOutlined } from '@ant-design/icons';
import { useCalorieStore, FoodRecord } from '../store/calorieStore';
import { useState } from 'react';
import dayjs from 'dayjs';

const MEAL_TYPES = [
  { key: 'all', label: '全部', icon: null, color: '#666' },
  { key: 'breakfast', label: '早餐', icon: <CoffeeOutlined />, color: '#FAAD14' },
  { key: 'lunch', label: '午餐', icon: <ThunderboltOutlined />, color: '#52C41A' },
  { key: 'dinner', label: '晚餐', icon: <CloudOutlined />, color: '#1677FF' },
  { key: 'snack', label: '加餐', icon: <AppstoreOutlined />, color: '#FF4D4F' },
];

const MEAL_LABELS: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

export default function FoodRecordsPage() {
  const { allFoodRecords, removeFoodRecord } = useCalorieStore();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [filterMealType, setFilterMealType] = useState<string>('all');

  const filteredRecords = allFoodRecords
    .filter((r) => {
      if (selectedDate) {
        return r.date === selectedDate.format('YYYY-MM-DD');
      }
      return true;
    })
    .filter((r) => {
      if (filterMealType === 'all') return true;
      return r.mealType === filterMealType;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  const totalCalories = filteredRecords.reduce((sum, r) => sum + r.calorie, 0);

  const dateLabel = selectedDate ? selectedDate.format('YYYY年MM月DD日') : '全部日期';

  const handleDelete = (id: string) => {
    removeFoodRecord(id);
  };

  const handleGoBack = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'home' } }));
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={handleGoBack}
          style={{ padding: '4px 8px', marginRight: '12px' }}
        />
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#333' }}>食物记录</h1>
      </div>

      {/* Date Picker */}
      <Card style={{ marginBottom: '16px', borderRadius: '8px' }} styles={{ body: { padding: '12px 16px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarOutlined style={{ color: '#1677FF', fontSize: '18px' }} />
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            style={{ flex: 1 }}
            allowClear={false}
          />
          <Button
            size="small"
            type="text"
            onClick={() => setSelectedDate(dayjs())}
            style={{ color: '#1677FF' }}
          >
            今天
          </Button>
        </div>
      </Card>

      {/* Meal Type Filter */}
      <div style={{ marginBottom: '16px' }}>
        <Segmented
          value={filterMealType}
          onChange={(val) => setFilterMealType(val as string)}
          options={MEAL_TYPES.map((m) => ({
            label: m.label,
            value: m.key,
          }))}
          block
        />
      </div>

      {/* Summary */}
      <Card style={{ marginBottom: '16px', borderRadius: '8px', background: '#F5F7FA', border: 'none' }} styles={{ body: { padding: '16px' } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>共 {filteredRecords.length} 条记录</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#333', margin: 0 }}>{totalCalories} 千卡</p>
          </div>
          <Tag color="blue" style={{ fontSize: '12px', padding: '4px 12px' }}>{dateLabel}</Tag>
        </div>
      </Card>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <Empty
          description="暂无食物记录"
          style={{ marginTop: '40px' }}
        />
      ) : (
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          {filteredRecords.map((record) => {
            const mealTypeConfig = MEAL_TYPES.find((m) => m.key === record.mealType);
            return (
              <Card key={record.id} size="small" style={{ borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: `${mealTypeConfig?.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      color: mealTypeConfig?.color,
                    }}>
                      {mealTypeConfig?.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', margin: '0 0 4px 0' }}>
                        {record.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                        {record.time} · {MEAL_LABELS[record.mealType] || record.mealType}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag color="orange" style={{ margin: 0 }}>{record.calorie} 千卡</Tag>
                    {record.macro && (
                      <span style={{ fontSize: '11px', color: '#999' }}>
                        蛋白质{record.macro.protein}g 脂肪{record.macro.fat}g 碳水{record.macro.carbs}g
                      </span>
                    )}
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(record.id)}
                      style={{ padding: '4px' }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </Space>
      )}
    </div>
  );
}