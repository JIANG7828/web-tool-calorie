import { useState } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { Card, Space, Typography, Button, Input, Modal, Statistic } from 'antd';
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
  const range = maxWeight - minWeight;

  const chartWidth = 300;
  const chartHeight = 180;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2);
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

export default function WeightTrendPage() {
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
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #52C41A 0%, #73D13D 100%)',
        padding: '48px 20px 32px',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
      }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: '#FFF', fontSize: '18px' }} />
          <Title level={4} style={{ margin: 0, color: '#FFF' }}>减脂趋势</Title>
          <Button type="text" style={{ color: '#FFF', fontSize: '18px' }} />
        </Space>

        <Card
          style={{
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>累计减重</Text>
            <Title level={1} style={{ margin: 0, color: '#FFF', fontSize: '48px' }}>
              {totalLoss.toFixed(1)}
              <span style={{ fontSize: '20px', fontWeight: 'normal' }}>斤</span>
            </Title>

            <Space style={{ width: '100%', justifyContent: 'space-around', marginTop: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', display: 'block' }}>初始体重</Text>
                <Title level={3} style={{ margin: 4, color: '#FFF' }}>
                  {initialWeight ? (initialWeight * 2).toFixed(0) : '-'}斤
                </Title>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', display: 'block' }}>当前体重</Text>
                <Title level={3} style={{ margin: 4, color: '#FFF' }}>
                  {(currentWeight * 2).toFixed(0)}斤
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>今日更新</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', display: 'block' }}>目标体重</Text>
                <Title level={3} style={{ margin: 4, color: '#FFF' }}>
                  {targetWeight ? (targetWeight * 2).toFixed(0) : '-'}斤
                </Title>
              </div>
            </Space>
          </Space>
        </Card>
      </div>

      {/* Weight Chart */}
      <div style={{ padding: '16px' }}>
        <Card style={{ borderRadius: '12px', borderColor: '#B7EB8F', borderWidth: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Title level={5} style={{ margin: 0, color: '#52C41A' }}>体重</Title>
            <Text style={{ color: '#999', fontSize: '12px', marginLeft: '8px' }}>(斤)</Text>
            {targetWeight && (
              <Text style={{ color: '#52C41A', fontSize: '12px', marginLeft: '8px' }}>
                目标: {(targetWeight * 2).toFixed(0)}斤
              </Text>
            )}
          </div>
          <WeightChart data={chartData} targetWeight={targetWeight} />
        </Card>
      </div>

      {/* Recent Records */}
      {weightRecords.length > 0 && (
        <div style={{ padding: '0 16px' }}>
          <Card title="近期记录" styles={{ body: { padding: '12px' } }} style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
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
            </Space>
          </Card>
        </div>
      )}

      {/* Add Button */}
      <div style={{ padding: '24px 16px', paddingBottom: '48px' }}>
        <Button
          type="primary"
          block
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'linear-gradient(90deg, #52C41A, #73D13D)',
            borderRadius: '24px',
            height: '52px',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          +记录体重
        </Button>
      </div>

      {/* Add Weight Modal */}
      <Modal
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        styles={{ body: { padding: '16px' } }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
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
        </Space>
      </Modal>
    </div>
  );
}
