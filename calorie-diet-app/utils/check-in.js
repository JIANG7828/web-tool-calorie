var dataStore = require('./data-store');
var format = require('./format');

function calculateStreak(checkIns) {
  if (checkIns.length === 0) return 0;

  var sortedCheckIns = checkIns.slice().sort(function(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  var streak = 0;
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var i = 0; i < sortedCheckIns.length; i++) {
    var checkIn = sortedCheckIns[i];
    var checkInDate = new Date(checkIn.date);
    checkInDate.setHours(0, 0, 0, 0);

    var expectedDate = new Date(today);
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

function calculateAchievementStats(checkIns, startDate) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  var calorieSuccessDays = checkIns.filter(function(c) { return c.calorie <= c.target; }).length;
  var exerciseSuccessDays = checkIns.filter(function(c) { return c.exerciseCal && c.exerciseCal > 0; }).length;
  var waterTarget = 8;
  var waterSuccessDays = checkIns.filter(function(c) { return c.waterCount && c.waterCount >= waterTarget; }).length;

  return [
    {
      type: 'calorie',
      name: '热量达标',
      icon: '🔥',
      totalDays: totalDays,
      successDays: calorieSuccessDays,
      successRate: totalDays > 0 ? Math.round((calorieSuccessDays / totalDays) * 100) : 0
    },
    {
      type: 'exercise',
      name: '运动消耗',
      icon: '🏃',
      totalDays: totalDays,
      successDays: exerciseSuccessDays,
      successRate: totalDays > 0 ? Math.round((exerciseSuccessDays / totalDays) * 100) : 0
    },
    {
      type: 'water',
      name: '喝水达标',
      icon: '💧',
      totalDays: totalDays,
      successDays: waterSuccessDays,
      successRate: totalDays > 0 ? Math.round((waterSuccessDays / totalDays) * 100) : 0
    }
  ];
}

function getWeeklyAchievementRankings(checkIns) {
  var today = new Date();
  var startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  var weekCheckIns = checkIns.filter(function(checkIn) {
    var checkInDate = new Date(checkIn.date);
    return checkInDate >= startOfWeek;
  });

  var calorieDays = weekCheckIns.filter(function(c) { return c.calorie <= c.target; }).length;
  var exerciseDays = weekCheckIns.filter(function(c) { return c.exerciseCal && c.exerciseCal > 0; }).length;
  var waterDays = weekCheckIns.filter(function(c) { return c.waterCount && c.waterCount >= 8; }).length;

  var rankings = [
    { type: 'calorie', name: '热量达标', icon: '🔥', weekSuccessDays: calorieDays },
    { type: 'exercise', name: '运动消耗', icon: '🏃', weekSuccessDays: exerciseDays },
    { type: 'water', name: '喝水达标', icon: '💧', weekSuccessDays: waterDays }
  ].sort(function(a, b) { return b.weekSuccessDays - a.weekSuccessDays; });

  return rankings.map(function(item, index) {
    return {
      type: item.type,
      name: item.name,
      icon: item.icon,
      weekSuccessDays: item.weekSuccessDays,
      rank: index + 1,
      totalTypes: rankings.length
    };
  });
}

function getChallenges(checkIns) {
  var streak = calculateStreak(checkIns);

  return [
    { name: '7天连续打卡', completed: streak >= 7, progress: Math.min(streak, 7) },
    { name: '30天连续打卡', completed: streak >= 30, progress: Math.min(streak, 30) },
    { name: '100天连续打卡', completed: streak >= 100, progress: Math.min(streak, 100) }
  ];
}

function getWeeklyStats(checkIns) {
  var today = new Date();
  var startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  var weekCheckIns = checkIns.filter(function(checkIn) {
    var checkInDate = new Date(checkIn.date);
    return checkInDate >= startOfWeek && checkIn.completed;
  }).length;

  return {
    weekCheckIns: weekCheckIns,
    weekStreak: calculateStreak(checkIns)
  };
}

function buildCheckIn(dateStr) {
  dateStr = dateStr || format.formatDate(new Date());

  var settings = dataStore.getUserSettings();
  var records = dataStore.getRecordsByDate(dateStr);
  var totalCalories = records.reduce(function(sum, r) { return sum + (r.calorie || 0); }, 0);
  var exerciseCalories = dataStore.getExerciseRecords()
    .filter(function(r) { return r.date === dateStr; })
    .reduce(function(sum, r) { return sum + (r.calories || 0); }, 0);
  var waterCount = dataStore.getWaterRecords()
    .filter(function(r) { return r.date === dateStr; })
    .reduce(function(sum, r) { return sum + (r.count || 1); }, 0);

  return {
    id: format.generateId(),
    date: dateStr,
    completed: false,
    calorie: totalCalories,
    target: settings.dailyCalorieGoal || 1600,
    exerciseCal: exerciseCalories,
    waterCount: waterCount,
    waterTarget: settings.waterGoal || 8,
    exerciseTarget: settings.exerciseTarget || 300
  };
}

function performCheckIn(dateStr) {
  dateStr = dateStr || format.formatDate(new Date());

  if (dataStore.hasCheckedInToday()) {
    return { success: false, message: '今日已打卡' };
  }

  var checkIn = buildCheckIn(dateStr);
  checkIn.completed = true;
  dataStore.addCheckIn(checkIn);
  dataStore.addMemberPoints(10);

  return { success: true, checkIn: checkIn, message: '打卡成功，获得 10 积分' };
}

function getTodayCheckInStatus() {
  var today = format.formatDate(new Date());
  var checkIns = dataStore.getCheckIns();
  var todayCheckIn = checkIns.find(function(c) { return c.date === today; });

  if (todayCheckIn) {
    return todayCheckIn;
  }

  return buildCheckIn(today);
}

function getMonthSummary(year, month) {
  var checkIns = dataStore.getCheckIns();
  var monthStr = year + '-' + String(month).padStart(2, '0');

  var monthCheckIns = checkIns.filter(function(c) { return c.date.indexOf(monthStr) === 0; });
  var completedDays = monthCheckIns.filter(function(c) { return c.completed; }).length;
  var calorieSuccess = monthCheckIns.filter(function(c) { return c.calorie <= c.target; }).length;

  var daysInMonth = new Date(year, month, 0).getDate();

  return {
    totalDays: daysInMonth,
    completedDays: completedDays,
    completionRate: daysInMonth > 0 ? Math.round((completedDays / daysInMonth) * 100) : 0,
    calorieSuccessDays: calorieSuccess,
    streak: calculateStreak(checkIns)
  };
}

module.exports = {
  calculateStreak: calculateStreak,
  calculateAchievementStats: calculateAchievementStats,
  getWeeklyAchievementRankings: getWeeklyAchievementRankings,
  getChallenges: getChallenges,
  getWeeklyStats: getWeeklyStats,
  buildCheckIn: buildCheckIn,
  performCheckIn: performCheckIn,
  getTodayCheckInStatus: getTodayCheckInStatus,
  getMonthSummary: getMonthSummary
};
