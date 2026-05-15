const DAILY_ACTIVITIES = [
  { id: 'sedentary', name: '久坐办公', met: 1.2, icon: '🪑', desc: '办公室工作，几乎不活动' },
  { id: 'light_office', name: '轻度办公', met: 1.5, icon: '💼', desc: '站立走动较少的工作' },
  { id: 'walking', name: '散步', met: 3.5, icon: '🚶', desc: '慢速散步，休闲步行' },
  { id: 'housework', name: '家务', met: 3.0, icon: '🧹', desc: '打扫、洗衣等家务活动' },
  { id: 'shopping', name: '逛街', met: 3.0, icon: '🛍️', desc: '购物、逛商场' },
  { id: 'cooking', name: '做饭', met: 2.5, icon: '👨‍🍳', desc: '厨房烹饪活动' },
  { id: 'stairs', name: '爬楼梯', met: 5.0, icon: '🪜', desc: '上下楼梯' },
  { id: 'cycling_commute', name: '骑车通勤', met: 4.0, icon: '🚲', desc: '骑自行车上下班' },
  { id: 'gardening', name: '园艺', met: 4.0, icon: '🌱', desc: '种花种菜等园艺活动' },
  { id: 'playing_kids', name: '陪孩子玩', met: 3.5, icon: '👶', desc: '陪孩子游戏活动' },
];

const EXERCISES = [
  { id: 'running_slow', name: '慢跑', met: 6.0, icon: '🏃', desc: '配速8-10分钟/公里', category: '有氧' },
  { id: 'running_fast', name: '快跑', met: 10.0, icon: '🏃‍♂️', desc: '配速5-6分钟/公里', category: '有氧' },
  { id: 'cycling', name: '骑行', met: 7.0, icon: '🚴', desc: '中等速度骑行', category: '有氧' },
  { id: 'swimming', name: '游泳', met: 7.0, icon: '🏊', desc: '中等速度游泳', category: '有氧' },
  { id: 'yoga', name: '瑜伽', met: 3.0, icon: '🧘', desc: '基础瑜伽练习', category: '拉伸' },
  { id: 'hiit', name: 'HIIT', met: 10.0, icon: '⚡', desc: '高强度间歇训练', category: '力量' },
  { id: 'stretching', name: '拉伸', met: 2.5, icon: '🤸', desc: '全身拉伸放松', category: '拉伸' },
  { id: 'strength', name: '力量训练', met: 5.0, icon: '🏋️', desc: '器械/自重力量训练', category: '力量' },
  { id: 'jump_rope', name: '跳绳', met: 10.0, icon: '🤾', desc: '中等速度跳绳', category: '有氧' },
  { id: 'dance', name: '跳舞', met: 5.5, icon: '💃', desc: '有氧舞蹈', category: '有氧' },
  { id: 'basketball', name: '篮球', met: 7.0, icon: '🏀', desc: '半场/全场篮球', category: '球类' },
  { id: 'football', name: '足球', met: 7.5, icon: '⚽', desc: '足球比赛', category: '球类' },
  { id: 'badminton', name: '羽毛球', met: 5.5, icon: '🏸', desc: '羽毛球运动', category: '球类' },
  { id: 'tennis', name: '网球', met: 7.0, icon: '🎾', desc: '网球运动', category: '球类' },
  { id: 'table_tennis', name: '乒乓球', met: 4.5, icon: '🏓', desc: '乒乓球运动', category: '球类' },
  { id: 'boxing', name: '拳击', met: 8.0, icon: '🥊', desc: '拳击训练', category: '力量' },
  { id: 'climbing', name: '攀岩', met: 7.5, icon: '🧗', desc: '室内攀岩', category: '力量' },
  { id: 'rowing', name: '划船', met: 6.0, icon: '🚣', desc: '划船机训练', category: '有氧' },
  { id: 'elliptical', name: '椭圆机', met: 5.5, icon: '🏃‍♀️', desc: '椭圆机有氧', category: '有氧' },
  { id: 'treadmill', name: '跑步机', met: 7.0, icon: '🏃', desc: '跑步机训练', category: '有氧' },
];

const getDailyActivities = () => DAILY_ACTIVITIES;

const getExercises = () => EXERCISES;

const getExercisesByCategory = (category) => {
  if (!category) return EXERCISES;
  return EXERCISES.filter(e => e.category === category);
};

const getExerciseCategories = () => {
  const categories = [...new Set(EXERCISES.map(e => e.category))];
  return ['全部', ...categories];
};

const searchExercise = (keyword) => {
  if (!keyword || keyword.trim() === '') return EXERCISES;
  const lower = keyword.toLowerCase();
  return EXERCISES.filter(e => 
    e.name.toLowerCase().includes(lower) || 
    e.desc.toLowerCase().includes(lower)
  );
};

module.exports = {
  DAILY_ACTIVITIES,
  EXERCISES,
  getDailyActivities,
  getExercises,
  getExercisesByCategory,
  getExerciseCategories,
  searchExercise
};
