export interface DailyActivity {
  id: string;
  name: string;
  met: number;
  icon: string;
  description?: string;
}

export interface Exercise {
  id: string;
  name: string;
  met: number;
  icon: string;
  description?: string;
}

export const DAILY_ACTIVITIES: DailyActivity[] = [
  { id: '1', name: '久坐办公', met: 1.2, icon: '🖥️' },
  { id: '2', name: '站立办公', met: 2.0, icon: '🧍' },
  { id: '3', name: '慢走散步', met: 3.0, icon: '🚶' },
  { id: '4', name: '做家务', met: 3.5, icon: '🧹' },
  { id: '5', name: '做饭', met: 3.3, icon: '🍳' },
  { id: '6', name: '带娃', met: 3.8, icon: '👶' },
  { id: '7', name: '逛街购物', met: 3.5, icon: '🛍️' },
  { id: '8', name: '爬楼梯', met: 5.0, icon: '🪜' },
  { id: '9', name: '遛狗', met: 3.0, icon: '🐕' },
  { id: '10', name: '园艺', met: 4.0, icon: '🌱' },
];

export const EXERCISES: Exercise[] = [
  { id: '1', name: '快走', met: 3.5, icon: '🚶', description: '每小时约5-6公里' },
  { id: '2', name: '慢跑', met: 6.0, icon: '🏃', description: '每小时约8公里' },
  { id: '3', name: '跑步', met: 8.0, icon: '🏃‍♂️', description: '每小时约10公里' },
  { id: '4', name: '跳绳', met: 10.0, icon: '🪢', description: '中高强度有氧运动' },
  { id: '5', name: '瑜伽', met: 3.0, icon: '🧘', description: '伸展身心，放松减压' },
  { id: '6', name: '居家健身', met: 4.5, icon: '🏠', description: '无器械居家训练' },
  { id: '7', name: '骑行', met: 6.0, icon: '🚴', description: '中等速度骑行' },
  { id: '8', name: '游泳', met: 7.0, icon: '🏊', description: '全身运动，低冲击' },
  { id: '9', name: '羽毛球', met: 4.5, icon: '🏸', description: '有趣的双人运动' },
  { id: '10', name: '篮球', met: 8.0, icon: '🏀', description: '高强度团队运动' },
  { id: '11', name: '足球', met: 7.0, icon: '⚽', description: '跑动频繁的有氧运动' },
  { id: '12', name: '网球', met: 7.0, icon: '🎾', description: '锻炼反应和敏捷性' },
  { id: '13', name: '健身操', met: 5.0, icon: '💃', description: '跟着音乐一起跳动' },
  { id: '14', name: '平板支撑', met: 3.5, icon: '🤸', description: '核心力量训练' },
  { id: '15', name: '力量训练', met: 5.0, icon: '🏋️', description: '举铁增肌' },
  { id: '16', name: 'HIIT', met: 8.0, icon: '🔥', description: '高强度间歇训练' },
  { id: '17', name: '攀岩', met: 8.0, icon: '🧗', description: '挑战自我的运动' },
  { id: '18', name: '跳舞', met: 5.5, icon: '💃', description: '快乐燃脂的舞蹈' },
  { id: '19', name: '太极拳', met: 3.0, icon: '🥋', description: '传统养生运动' },
  { id: '20', name: '划船机', met: 6.0, icon: '🚣', description: '全身协调运动' },
];

export const SPORT_ACTIVITIES = EXERCISES;
