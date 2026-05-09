import { useState, useEffect } from 'react';

interface WeightRecord {
  id: string;
  date: string;
  weight: number;
}

interface WeightChartProps {
  records: WeightRecord[];
  targetWeight?: number;
}

export default function WeightChart({ records, targetWeight = 60 }: WeightChartProps) {
  const [chartData, setChartData] = useState<{ date: string; weight: number }[]>([]);

  useEffect(() => {
    // 取最近7天的数据
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ).slice(-7);
    
    setChartData(sortedRecords);
  }, [records]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 体重曲线</h3>
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">⚖️</div>
          <div>暂无体重记录</div>
          <div className="text-sm mt-1">记录体重，追踪变化</div>
        </div>
      </div>
    );
  }

  const weights = chartData.map(d => d.weight);
  const maxWeight = Math.max(...weights) + 2;
  const minWeight = Math.min(...weights) - 2;
  const range = maxWeight - minWeight;

  const getLinePath = () => {
    if (chartData.length < 2) return '';
    
    const width = 100;
    const height = 80;
    const padding = 10;
    
    const points = chartData.map((d, i) => {
      const x = padding + (i / (chartData.length - 1)) * (width - padding * 2);
      const y = height - padding - ((d.weight - minWeight) / range) * (height - padding * 2);
      return { x, y };
    });

    return points.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ');
  };

  const currentWeight = chartData[chartData.length - 1]?.weight || 0;
  const startWeight = chartData[0]?.weight || 0;
  const weightChange = currentWeight - startWeight;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">📈 体重曲线</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{currentWeight} kg</div>
          {weightChange !== 0 && (
            <div className={`text-sm ${weightChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
              {weightChange > 0 ? '↑' : '↓'} {Math.abs(weightChange).toFixed(1)} kg
            </div>
          )}
        </div>
      </div>

      {/* 简化图表 */}
      <div className="relative h-40 mb-4">
        <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          {/* 目标线 */}
          {targetWeight && (
            <line 
              x1="10" 
              y1={100 - 10 - ((targetWeight - minWeight) / range) * 80}
              x2="190" 
              y2={100 - 10 - ((targetWeight - minWeight) / range) * 80}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.5"
            />
          )}
          
          {/* 数据线 */}
          {chartData.length >= 2 && (
            <path
              d={getLinePath()}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {/* 数据点 */}
          {chartData.map((d, i) => {
            const x = 10 + (i / (chartData.length - 1)) * 180;
            const y = 100 - 10 - ((d.weight - minWeight) / range) * 80;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Y轴标签 */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 py-2">
          <span>{maxWeight.toFixed(0)}</span>
          <span>{((maxWeight + minWeight) / 2).toFixed(0)}</span>
          <span>{minWeight.toFixed(0)}</span>
        </div>
      </div>

      {/* 日期标签 */}
      <div className="flex justify-between text-xs text-gray-400 px-4">
        {chartData.map((d, i) => (
          <span key={i}>
            {new Date(d.date).getMonth() + 1}/{new Date(d.date).getDate()}
          </span>
        ))}
      </div>

      {/* 目标提示 */}
      {targetWeight && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-700">
          🎯 目标体重: {targetWeight} kg
          {currentWeight <= targetWeight && <span className="ml-2">✅ 已达标！</span>}
        </div>
      )}
    </div>
  );
}
