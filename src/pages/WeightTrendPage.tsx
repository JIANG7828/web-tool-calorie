import { useState } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { Card, Typography, Button, Input, Modal, Statistic } from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Simple line chart component for weight trend
function WeightChart({ data, targetWeight }: { data: { date: string; weight: number }[]; targetWeight?: number }) {
  if (data.length === 0) {
    return (
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text type="secondary">暂无数据</Text>
      </div>
    );
  }

  const weights = data.map(d => d.weight * 2); // Convert kg to jin
  const maxWeight = Math.max(...weights, targetWeight ? targetWeight * 2 : 0, 100);
  const minWeight = Math.min(...weights, targetWeight ? targetWeight * 2 : 100) * 0.9;
  const range = Math.max(maxWeight - minWeight, 1);

  const chartWidth = 300;
  const chartHeight = 180;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = data.length > 1 ? padding + (i / (data.length - 1)) * (chartWidth - padding * 2) : chartWidth / 2;
    const y = chartHeight - padding - ((d.weight * 2 - minWeight) / range) * (chartHeight - padding * 2);
    return { x, y, date: d.date, weight: d.weight * 2 };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const targetY = targetWeight
    ? chartHeight - padding - ((targetWeight * 2 - minWeight) / range) * (chartHeight - padding * 2)
    : null;

  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const y = chartHeight - padding - (i / 4) * (chartHeight - padding * 2);
    const value = Math.round(maxWeight - (i / 4) * range);
    gridLines.push(
      <g key={i}>
        <line
          x1={padding}
          y1={y}
          x2={chartWidth - padding}
          y2={y}
          stroke="#E8E8E8"
          strokeDasharray="4,4"
        />
        <text x={padding - 8} y={y + 4} fontSize="10" fill="#999" textAnchor="end">
          {value}
        </text>
      </g>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {gridLines}

        {/* Target line */}
        {targetY !== null && (
          <>
            <line
              x1={padding}
              y1={targetY}
              x2={chartWidth - padding}
              y2={targetY}
              stroke="#52C41A"
              strokeDasharray="8,4"
              strokeWidth="1.5"
            />
            <text
              x={chartWidth - padding + 5}
              y={targetY + 4}
              fontSize="10"
              fill="#52C41A"
              textAnchor="start"
            >
              目标
            </text>
          </>
        )}

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#1677FF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Area under line */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
          fill="url(#gradient)"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1677FF" />
            <stop offset="100%" stopColor="#E6F7FF" />
          </linearGradient>
        </defs>

        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#1677FF" />
            <circle cx={p.x} cy={p.y} r="3" fill="#FFF" />
          </g>
        ))}

        {/* X-axis labels */}
        <text
          x={chartWidth / 2}
          y={chartHeight - 5}
          fontSize="10"
          fill="#999"
          textAnchor="middle"
        >
          {data.length > 1 ? `${data[0].date} - ${data[data.length - 1].date}` : data[0].date}
        </text>
      </svg>
    </div>
  );
}

interface WeightTrendPageProps {
  onBack?: () => void;
}

export default function WeightTrendPage({ onBack }: WeightTrendPageProps) {
  const { userSettings, weightRecords, addWeightRecord, getInitialWeight } = useCalorieStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const initialWeight = getInitialWeight();
  const currentWeight = weightRecords[0]?.weight || userSettings.weight || 55;
  const targetWeight = userSettings.targetWeight;
  const totalLoss = initialWeight ? Math.max(0, (initialWeight - currentWeight) * 2) : 0;

  // Format weight records for chart (last 30 days)
  const chartData = weightRecords.slice(0, 30).reverse().map(record => ({
    date: record.date,
    weight: record.weight,
  }));

  const handleAddWeight = () => {
    if (newWeight) {
      addWeightRecord(Number(newWeight));
      setNewWeight('');
      setShowAddModal(false);
    }
  };

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
            <Title level={4} style={{ margin: 0, color: '#333' }}>体重管理</Title>
          </div>
          <div style={{ fontSize: '24px' }}>🏋️</div>
        </div>
        <Text style={{ color: '#666', fontSize: '14px' }}>
          {weightRecords.length > 0 ? `共记录 ${weightRecords.length} 次体重` : '开始记录您的体重变化'}
        </Text>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <Card style={{ borderRadius: '8px', marginBottom: '16px' }} styles={{ body: { padding: '16px' } }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>初始体重</Text>
              <Title level={3} style={{ margin: 0, color: '#1890FF' }}>
                {initialWeight ? (initialWeight * 2).toFixed(0) : '-'}斤
              </Title>
            </div>
            <div style={{ borderLeft: '1px solid #F0F0F0', paddingLeft: '24px' }}>
              <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>当前体重</Text>
              <Title level={3} style={{ margin: 0, color: '#52C41A' }}>
                {(currentWeight * 2).toFixed(0)}斤
              </Title>
            </div>
            <div style={{ borderLeft: '1px solid #F0F0F0', paddingLeft: '24px' }}>
              <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>目标体重</Text>
              <Title level={3} style={{ margin: 0, color: '#FA8C16' }}>
                {targetWeight ? (targetWeight * 2).toFixed(0) : '-'}斤
              </Title>
            </div>
          </div>
        </Card>

        <Card style={{ borderRadius: '8px', marginBottom: '16px' }} styles={{ body: { padding: '16px' } }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Title level={5} style={{ margin: 0, color: '#1890FF' }}>体重趋势</Title>
            <Text style={{ color: '#999', fontSize: '12px', marginLeft: '8px' }}>(斤)</Text>
            {targetWeight && (
              <Text style={{ color: '#52C41A', fontSize: '12px', marginLeft: '8px' }}>
                目标: {(targetWeight * 2).toFixed(0)}斤
              </Text>
            )}
          </div>
          <WeightChart data={chartData} targetWeight={targetWeight} />
        </Card>

        {weightRecords.length > 0 && (
          <Card title="近期记录" styles={{ body: { padding: '12px' } }} style={{ borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              {weightRecords.slice(0, 7).map((record, index) => {
                const prevWeight = weightRecords[index + 1]?.weight;
                const diff = prevWeight !== undefined ? ((record.weight - prevWeight) * 2).toFixed(1) : null;

                return (
                  <div
                    key={record.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#FAFAFA',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <Text strong>{(record.weight * 2).toFixed(1)} 斤</Text>
                      <Text style={{ color: '#999', fontSize: '12px', marginLeft: '8px' }}>
                        {record.date} {record.time}
                      </Text>
                    </div>
                    {diff !== null && (
                      <Text
                        strong
                        style={{
                          color: parseFloat(diff) >= 0 ? '#FF4D4F' : '#52C41A',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {parseFloat(diff) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        {Math.abs(parseFloat(diff))}斤
                      </Text>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <div style={{ padding: '0 16px' }}>
          <Button
            type="primary"
            block
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#1677FF',
              borderRadius: '24px',
              height: '52px',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            +记录体重
          </Button>
        </div>
      </div>

      {/* Add Weight Modal */}
      <Modal
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        styles={{ body: { padding: '16px' } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <Title level={4} style={{ margin: 0 }}>记录体重</Title>

          <Input
            type="number"
            placeholder="输入体重(kg)"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            style={{ height: '48px', fontSize: '20px', textAlign: 'center' }}
          />

          <Text style={{ color: '#999', fontSize: '12px', textAlign: 'center' }}>
            当前时间：{new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          <Button type="primary" block size="large" onClick={handleAddWeight}>
            保存
          </Button>
        </div>
      </Modal>
    </div>
  );
}
