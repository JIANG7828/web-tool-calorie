import { Typography, Card, Button } from 'antd';
import { ArrowLeftOutlined, BarChartOutlined, FireOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface DataStatisticsPageProps {
  checkIns: any[];
  targetCal: number;
  onBack?: () => void;
}

export default function DataStatisticsPage({ checkIns, targetCal, onBack }: DataStatisticsPageProps) {
  const getWeekData = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const checkIn = checkIns.find(c => c.date === dateStr);
      
      weekData.push({
        date: `${date.getMonth() + 1}.${date.getDate()}`,
        calorie: checkIn?.calorie || 0,
        exerciseCal: checkIn?.exerciseCal || 0,
        deficit: checkIn ? Math.max(0, (checkIn.target || targetCal) - checkIn.calorie) : 0,
        mealHours: checkIn?.mealHours || 0,
      });
    }
    
    return weekData;
  };

  const weekData = getWeekData();

  const avgDeficit = Math.round(weekData.reduce((sum, d) => sum + d.deficit, 0) / Math.max(1, weekData.filter(d => d.deficit > 0).length));
  const avgCalorie = Math.round(weekData.reduce((sum, d) => sum + d.calorie, 0) / Math.max(1, weekData.filter(d => d.calorie > 0).length));
  const avgExercise = Math.round(weekData.reduce((sum, d) => sum + d.exerciseCal, 0) / Math.max(1, weekData.filter(d => d.exerciseCal > 0).length));
  const avgMealHours = (weekData.reduce((sum, d) => sum + d.mealHours, 0) / Math.max(1, weekData.filter(d => d.mealHours > 0).length)).toFixed(2);

  const maxDeficit = Math.max(...weekData.map(d => d.deficit), 500);
  const maxCalorie = Math.max(...weekData.map(d => d.calorie), 1500);
  const maxExercise = Math.max(...weekData.map(d => d.exerciseCal), 500);
  const maxMealHours = Math.max(...weekData.map(d => d.mealHours), 8);

  const recommendedDeficit = 110;
  const recommendedCalorie = 1354;
  const recommendedMealHours = 8;

  const renderBarChart = (data: { date: string; value: number }[], maxValue: number, color: string, title: string, unit: string, recommended?: number) => {
    const chartHeight = 120;
    
    return (
      <Card style={{ borderRadius: '8px', marginBottom: '24px' }} styles={{ body: { padding: '16px' } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>{title}</span>
          <span style={{ fontSize: '16px', fontWeight: 600, color: color }}>
            {data.reduce((sum, d) => sum + d.value, 0) > 0 
              ? Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.filter(d => d.value > 0).length) 
              : 0}{unit}
          </span>
        </div>
        
        <div style={{ height: chartHeight, position: 'relative', marginLeft: '30px' }}>
          <div style={{ position: 'absolute', left: '-30px', top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '8px' }}>
            <Text style={{ fontSize: '10px', color: '#999' }}>{maxValue}</Text>
            <Text style={{ fontSize: '10px', color: '#999' }}>{Math.round(maxValue * 0.5)}</Text>
            <Text style={{ fontSize: '10px', color: '#999' }}>0</Text>
          </div>
          
          {recommended !== undefined && (
            <div 
              style={{ 
                position: 'absolute', 
                left: 0, 
                right: 0, 
                top: chartHeight - (recommended / maxValue) * chartHeight,
                borderTop: '2px dashed #FAAD14',
              }}
            />
          )}
          
          <div style={{ height: '100%', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            {data.map((item, index) => {
              const height = (item.value / maxValue) * chartHeight;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div 
                    style={{ 
                      width: '100%', 
                      maxWidth: '32px',
                      backgroundColor: color,
                      borderRadius: '4px 4px 0 0',
                      height: `${Math.max(height, 4)}px`,
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <Text style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>{item.date}</Text>
                </div>
              );
            })}
          </div>
        </div>
        
        {recommended !== undefined && (
          <div style={{ position: 'absolute', right: '16px', fontSize: '10px', color: '#FAAD14' }}>
            推荐 {recommended}{unit}
          </div>
        )}
      </Card>
    );
  };

  const dateRange = `${new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })} - ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })}`;

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      {/* Clean white header */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onBack && (
              <Button
                onClick={onBack}
                type="text"
                icon={<ArrowLeftOutlined />}
                style={{ color: '#333', fontSize: '18px' }}
              />
            )}
            <Title level={4} style={{ margin: 0, color: '#333' }}>本周数据统计</Title>
          </div>
          <div style={{ fontSize: '24px' }}>📊</div>
        </div>
        <Text style={{ color: '#666', fontSize: '14px' }}>
          {dateRange}
        </Text>
      </div>
      
      {/* Content */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ marginBottom: '20px' }}>
          {renderBarChart(
            weekData.map(d => ({ date: d.date, value: d.deficit })),
            maxDeficit,
            '#52C41A',
            '日均热量缺口',
            '千卡',
            recommendedDeficit
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          {renderBarChart(
            weekData.map(d => ({ date: d.date, value: d.calorie })),
            maxCalorie,
            '#FA8C16',
            '日均饮食摄入',
            '千卡',
            recommendedCalorie
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          {renderBarChart(
            weekData.map(d => ({ date: d.date, value: d.exerciseCal })),
            maxExercise,
            '#1677FF',
            '日运动消耗',
            '千卡'
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          {renderBarChart(
            weekData.map(d => ({ date: d.date, value: d.mealHours })),
            maxMealHours,
            '#722ED1',
            '日均轻断食用餐时长',
            '小时',
            recommendedMealHours
          )}
        </div>

        <Card style={{ borderRadius: '8px' }} styles={{ body: { padding: '16px' } }}>
          <Title level={5} style={{ marginBottom: '16px' }}>本周摘要</Title>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ background: '#F6FFED', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <BarChartOutlined style={{ fontSize: '20px', color: '#52C41A', marginBottom: '4px' }} />
              <Text strong style={{ fontSize: '18px', color: '#52C41A', display: 'block' }}>{avgDeficit}</Text>
              <Text style={{ fontSize: '11px', color: '#999', display: 'block' }}>日均热量缺口(千卡)</Text>
            </div>
            <div style={{ background: '#FFF7E6', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <FireOutlined style={{ fontSize: '20px', color: '#FA8C16', marginBottom: '4px' }} />
              <Text strong style={{ fontSize: '18px', color: '#FA8C16', display: 'block' }}>{avgCalorie}</Text>
              <Text style={{ fontSize: '11px', color: '#999', display: 'block' }}>日均饮食摄入(千卡)</Text>
            </div>
            <div style={{ background: '#E6F4FF', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <BarChartOutlined style={{ fontSize: '20px', color: '#1677FF', marginBottom: '4px' }} />
              <Text strong style={{ fontSize: '18px', color: '#1677FF', display: 'block' }}>{avgExercise}</Text>
              <Text style={{ fontSize: '11px', color: '#999', display: 'block' }}>日均运动消耗(千卡)</Text>
            </div>
            <div style={{ background: '#F9F0FF', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <ClockCircleOutlined style={{ fontSize: '20px', color: '#722ED1', marginBottom: '4px' }} />
              <Text strong style={{ fontSize: '18px', color: '#722ED1', display: 'block' }}>{avgMealHours}</Text>
              <Text style={{ fontSize: '11px', color: '#999', display: 'block' }}>日均用餐时长(小时)</Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}