export interface CheckIn {
  id: string;
  date: string;
  completed: boolean;
  calorie: number;
  target: number;
  exerciseCal?: number;
  waterCount?: number;
  waterTarget?: number;
  exerciseTarget?: number;
}

export interface AchievementStats {
  type: 'calorie' | 'exercise' | 'water';
  name: string;
  icon: string;
  totalDays: number;
  successDays: number;
  successRate: number;
}

export interface WeeklyAchievementRank {
  type: 'calorie' | 'exercise' | 'water';
  name: string;
  icon: string;
  weekSuccessDays: number;
  rank: number;
  totalTypes: number;
}

export function calculateStreak(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0;

  const sortedCheckIns = [...checkIns].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedCheckIns.length; i++) {
    const checkIn = sortedCheckIns[i];
    const checkInDate = new Date(checkIn.date);
    checkInDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (checkInDate.getTime() === expectedDate.getTime() && checkIn.completed) {
      streak++;
    } else if (i === 0 && checkInDate.getTime() === expectedDate.getTime() - 86400000 && checkIn.completed) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateAchievementStats(
  checkIns: CheckIn[],
  startDate: Date
): AchievementStats[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const calorieSuccessDays = checkIns.filter(c => c.calorie <= c.target).length;
  
  const exerciseSuccessDays = checkIns.filter(c => c.exerciseCal && c.exerciseCal > 0).length;
  
  const waterTarget = 8;
  const waterSuccessDays = checkIns.filter(c => c.waterCount && c.waterCount >= waterTarget).length;

  return [
    {
      type: 'calorie',
      name: '热量达标',
      icon: '',
      totalDays,
      successDays: calorieSuccessDays,
      successRate: totalDays > 0 ? Math.round((calorieSuccessDays / totalDays) * 100) : 0,
    },
    {
      type: 'exercise',
      name: '运动消耗',
      icon: '',
      totalDays,
      successDays: exerciseSuccessDays,
      successRate: totalDays > 0 ? Math.round((exerciseSuccessDays / totalDays) * 100) : 0,
    },
    {
      type: 'water',
      name: '喝水达标',
      icon: '',
      totalDays,
      successDays: waterSuccessDays,
      successRate: totalDays > 0 ? Math.round((waterSuccessDays / totalDays) * 100) : 0,
    },
  ];
}

export function getWeeklyAchievementRankings(checkIns: CheckIn[]): WeeklyAchievementRank[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weekCheckIns = checkIns.filter(checkIn => {
    const checkInDate = new Date(checkIn.date);
    return checkInDate >= startOfWeek;
  });

  const calorieDays = weekCheckIns.filter(c => c.calorie <= c.target).length;
  const exerciseDays = weekCheckIns.filter(c => c.exerciseCal && c.exerciseCal > 0).length;
  const waterDays = weekCheckIns.filter(c => c.waterCount && c.waterCount >= 8).length;

  const rankings = [
    { type: 'calorie' as const, name: '热量达标', icon: '', weekSuccessDays: calorieDays },
    { type: 'exercise' as const, name: '运动消耗', icon: '', weekSuccessDays: exerciseDays },
    { type: 'water' as const, name: '喝水达标', icon: '', weekSuccessDays: waterDays },
  ].sort((a, b) => b.weekSuccessDays - a.weekSuccessDays);

  return rankings.map((item, index) => ({
    ...item,
    rank: index + 1,
    totalTypes: rankings.length,
  }));
}

export function getChallenges(checkIns: CheckIn[]): { name: string; completed: boolean; progress: number }[] {
  const streak = calculateStreak(checkIns);
  
  return [
    { name: '7天连续打卡', completed: streak >= 7, progress: Math.min(streak, 7) },
    { name: '30天连续打卡', completed: streak >= 30, progress: Math.min(streak, 30) },
    { name: '100天连续打卡', completed: streak >= 100, progress: Math.min(streak, 100) },
  ];
}

export function getWeeklyStats(checkIns: CheckIn[]): { weekCheckIns: number; weekStreak: number } {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weekCheckIns = checkIns.filter(checkIn => {
    const checkInDate = new Date(checkIn.date);
    return checkInDate >= startOfWeek && checkIn.completed;
  }).length;

  return {
    weekCheckIns,
    weekStreak: calculateStreak(checkIns),
  };
}
