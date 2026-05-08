export interface DailyActivity {
  id: string;
  name: string;
  met: number;
  icon: string;
}

export interface Exercise {
  id: string;
  name: string;
  met: number;
  icon: string;
}

export const DAILY_ACTIVITIES: DailyActivity[] = [
  { id: '1', name: '久坐办公', met: 1.2, icon: '💻' },
  { id: '2', name: '站立上班', met: 2.0, icon: '🧍' },
  { id: '3', name: '慢走散步', met: 3.0, icon: '🚶' },
  { id: '4', name: '做家务', met: 3.5, icon: '🧹' },
  { id: '5', name: '做饭', met: 3.3, icon: '🍳' },
  { id: '6', name: '带娃', met: 3.8, icon: '👶' },
  { id: '7', name: '逛街', met: 3.5, icon: '🛍️' },
  { id: '8', name: '爬楼梯', met: 5.0, icon: '🪜' },
];

export const EXERCISES: Exercise[] = [
  { id: '1', name: '快走', met: 3.5, icon: '🚶‍♂️' },
  { id: '2', name: '慢跑', met: 6.0, icon: '🏃' },
  { id: '3', name: '跳绳', met: 8.0, icon: '🪢' },
  { id: '4', name: '瑜伽', met: 3.0, icon: '🧘' },
  { id: '5', name: '居家健身', met: 4.5, icon: '🏋️' },
  { id: '6', name: '骑行', met: 6.0, icon: '🚴' },
  { id: '7', name: '羽毛球', met: 4.5, icon: '🏸' },
  { id: '8', name: '篮球', met: 8.0, icon: '🏀' },
  { id: '9', name: '健身操', met: 4.5, icon: '💪' },
  { id: '10', name: '平板支撑', met: 3.5, icon: '🤸' },
];
