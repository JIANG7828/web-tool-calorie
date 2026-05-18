const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');
const calorie = require('../../utils/calorie');
const constants = require('../../utils/constants');

var BADGES = [
  { id: 'first_checkin', name: '初次打卡', icon: '🎉', desc: '完成第一次打卡', condition: function(stats) { return stats.totalDays >= 1; } },
  { id: 'streak_3', name: '三日连续', icon: '🔥', desc: '连续打卡3天', condition: function(stats) { return stats.streak >= 3; } },
  { id: 'streak_7', name: '一周达人', icon: '💪', desc: '连续打卡7天', condition: function(stats) { return stats.streak >= 7; } },
  { id: 'streak_14', name: '两周坚持', icon: '⭐', desc: '连续打卡14天', condition: function(stats) { return stats.streak >= 14; } },
  { id: 'streak_30', name: '月度冠军', icon: '🏆', desc: '连续打卡30天', condition: function(stats) { return stats.streak >= 30; } },
  { id: 'points_100', name: '百分达人', icon: '💯', desc: '累计积分达到100', condition: function(stats) { return stats.totalPoints >= 100; } },
  { id: 'points_500', name: '积分达人', icon: '🌟', desc: '累计积分达到500', condition: function(stats) { return stats.totalPoints >= 500; } },
  { id: 'water_master', name: '饮水达人', icon: '💧', desc: '单日饮水达到8杯', condition: function(stats) { return stats.todayWater >= 8; } },
  { id: 'exercise_5', name: '运动新手', icon: '🏃', desc: '累计运动5次', condition: function(stats) { return stats.totalExercise >= 5; } },
  { id: 'exercise_20', name: '运动达人', icon: '🏋️', desc: '累计运动20次', condition: function(stats) { return stats.totalExercise >= 20; } },
  { id: 'calorie_goal', name: '目标达成', icon: '🎯', desc: '单日热量达标', condition: function(stats) { return stats.todayGoalMet; } },
  { id: 'record_50', name: '记录达人', icon: '📝', desc: '累计记录50次', condition: function(stats) { return stats.totalRecords >= 50; } }
];

Page({
  data: {
    streak: 0,
    totalPoints: 0,
    totalDays: 0,
    todayChecked: false,
    todayWater: 0,
    todayGoalMet: false,
    totalExercise: 0,
    totalRecords: 0,
    badges: [],
    unlockedBadges: [],
    checkinHistory: [],
    pointsHistory: []
  },

  onLoad: function() {
    this.loadData();
  },

  onShow: function() {
    this.loadData();
  },

  loadData: function() {
    var checkins = wx.getStorageSync('checkin_records') || [];
    var pointsHistory = wx.getStorageSync('points_history') || [];
    var unlockedBadges = wx.getStorageSync('unlocked_badges') || [];

    var today = format.formatDate(new Date());
    var todayChecked = checkins.some(function(c) { return c.date === today; });

    var stats = this.calcStats(checkins, pointsHistory, today);

    this.setData({
      streak: stats.streak,
      totalPoints: stats.totalPoints,
      totalDays: stats.totalDays,
      todayChecked: todayChecked,
      todayWater: stats.todayWater,
      todayGoalMet: stats.todayGoalMet,
      totalExercise: stats.totalExercise,
      totalRecords: stats.totalRecords,
      badges: BADGES,
      unlockedBadges: unlockedBadges,
      checkinHistory: checkins.slice(-14).reverse(),
      pointsHistory: pointsHistory.slice(-20).reverse()
    });

    this.checkNewBadges(stats, unlockedBadges);
  },

  calcStats: function(checkins, pointsHistory, today) {
    var totalDays = checkins.length;
    var totalPoints = pointsHistory.reduce(function(sum, p) { return sum + p.points; }, 0);

    var streak = 0;
    var d = new Date();
    for (var i = 0; i < 365; i++) {
      var dateStr = format.formatDate(d);
      var found = checkins.some(function(c) { return c.date === dateStr; });
      if (found) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        if (i === 0) {
          d.setDate(d.getDate() - 1);
          continue;
        }
        break;
      }
    }

    var todayRecords = dataStore.getRecordsByDate(today);
    var todayCal = todayRecords.reduce(function(sum, r) { return sum + (r.calorie || 0); }, 0);
    var settings = dataStore.getUserSettings();
    var goal = settings.dailyCalorieGoal || constants.DEFAULT_CALORIE_GOAL;
    var todayGoalMet = todayCal > 0 && todayCal <= goal * 1.1;

    var todayWater = dataStore.getTodayWaterCount();
    var allExercise = wx.getStorageSync('exercise_records') || [];
    var totalExercise = allExercise.length;
    var totalRecords = wx.getStorageSync('food_records') ? Object.values(wx.getStorageSync('food_records')).reduce(function(sum, arr) { return sum + arr.length; }, 0) : 0;

    return {
      streak: streak,
      totalDays: totalDays,
      totalPoints: totalPoints,
      todayWater: todayWater,
      todayGoalMet: todayGoalMet,
      totalExercise: totalExercise,
      totalRecords: totalRecords
    };
  },

  checkNewBadges: function(stats, unlockedBadges) {
    var newUnlocked = [];
    BADGES.forEach(function(badge) {
      if (unlockedBadges.indexOf(badge.id) === -1 && badge.condition(stats)) {
        newUnlocked.push(badge.id);
      }
    });

    if (newUnlocked.length > 0) {
      var all = unlockedBadges.concat(newUnlocked);
      wx.setStorageSync('unlocked_badges', all);
      this.setData({ unlockedBadges: all });

      newUnlocked.forEach(function(id) {
        var badge = BADGES.find(function(b) { return b.id === id; });
        if (badge) {
          wx.showToast({
            title: '解锁徽章: ' + badge.name,
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  },

  onCheckin: function() {
    if (this.data.todayChecked) {
      wx.showToast({ title: '今天已打卡', icon: 'none' });
      return;
    }

    var today = format.formatDate(new Date());
    var checkin = {
      id: 'checkin_' + Date.now(),
      date: today,
      points: 10,
      createdAt: Date.now()
    };

    var checkins = wx.getStorageSync('checkin_records') || [];
    checkins.push(checkin);
    wx.setStorageSync('checkin_records', checkins);

    var pointsRecord = {
      id: 'points_' + Date.now(),
      date: today,
      type: '打卡',
      points: 10,
      createdAt: Date.now()
    };
    var pointsHistory = wx.getStorageSync('points_history') || [];
    pointsHistory.push(pointsRecord);
    wx.setStorageSync('points_history', pointsHistory);

    this.setData({ todayChecked: true, totalPoints: this.data.totalPoints + 10 });
    this.loadData();

    wx.showToast({ title: '打卡成功 +10积分', icon: 'success' });
  },

  addWaterPoints: function() {
    var today = format.formatDate(new Date());
    var waterCount = dataStore.getTodayWaterCount();

    if (waterCount === 8) {
      var pointsHistory = wx.getStorageSync('points_history') || [];
      var alreadyEarned = pointsHistory.some(function(p) { return p.date === today && p.type === '饮水达标'; });

      if (!alreadyEarned) {
        pointsHistory.push({
          id: 'points_' + Date.now(),
          date: today,
          type: '饮水达标',
          points: 5,
          createdAt: Date.now()
        });
        wx.setStorageSync('points_history', pointsHistory);
        this.setData({ totalPoints: this.data.totalPoints + 5 });
        wx.showToast({ title: '饮水达标 +5积分', icon: 'success' });
      }
    }
  },

  addExercisePoints: function() {
    var today = format.formatDate(new Date());
    var exerciseRecords = wx.getStorageSync('exercise_records') || [];
    var todayExercise = exerciseRecords.filter(function(r) { return r.date === today; });

    if (todayExercise.length > 0) {
      var totalCal = todayExercise.reduce(function(sum, r) { return sum + (r.calories || 0); }, 0);
      var points = totalCal >= 200 ? 15 : (totalCal >= 100 ? 10 : 5);

      var pointsHistory = wx.getStorageSync('points_history') || [];
      var alreadyEarned = pointsHistory.some(function(p) { return p.date === today && p.type === '运动奖励'; });

      if (!alreadyEarned) {
        pointsHistory.push({
          id: 'points_' + Date.now(),
          date: today,
          type: '运动奖励',
          points: points,
          createdAt: Date.now()
        });
        wx.setStorageSync('points_history', pointsHistory);
        this.setData({ totalPoints: this.data.totalPoints + points });
        wx.showToast({ title: '运动奖励 +' + points + '积分', icon: 'success' });
      }
    }
  }
});
