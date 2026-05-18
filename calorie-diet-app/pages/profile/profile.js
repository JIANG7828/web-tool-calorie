const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');
const calorie = require('../../utils/calorie');
const constants = require('../../utils/constants');

Page({
  data: {
    nickname: '',
    gender: 'female',
    age: 25,
    height: 160,
    weight: 55,
    target: 'keep',
    activityLevel: 1.2,
    dailyCalorieGoal: 1600,
    bmi: 0,
    bmiInfo: { label: '', color: '' },
    weekStats: [],
    weekTotal: 0,
    weekAvg: 0,
    targets: [
      { value: 'fat', label: '减脂', icon: '🔥' },
      { value: 'keep', label: '维持', icon: '⚖️' },
      { value: 'muscle', label: '增肌', icon: '💪' }
    ],
    activityLevels: constants.ACTIVITY_LEVELS,
    showSaved: false,
    totalRecords: 0,
    healthyDays: 0,
    totalWeightLoss: 0,
    achievementRate: {
      calorieRate: 0,
      exerciseRate: 0,
      waterRate: 0
    }
  },

  onLoad: function() {
    this.loadUserData();
  },

  onShow: function() {
    this.loadUserData();
    this.loadStats();
    this.drawMiniRings();
  },

  loadUserData: function() {
    var settings = dataStore.getUserSettings();
    var bmi = format.calculateBMI(settings.weight, settings.height);
    var bmiInfo = format.getBMICategory(bmi);
    var weekStats = this.getWeekStats();

    this.setData({
      nickname: settings.nickname || '',
      gender: settings.gender || 'female',
      age: settings.age || 25,
      height: settings.height || 160,
      weight: settings.weight || 55,
      target: settings.target || 'keep',
      activityLevel: settings.activityLevel || 1.2,
      dailyCalorieGoal: settings.dailyCalorieGoal || constants.DEFAULT_CALORIE_GOAL,
      bmi: bmi,
      bmiInfo: bmiInfo,
      weekStats: weekStats.list,
      weekTotal: weekStats.total,
      weekAvg: weekStats.avg
    });
  },

  loadStats: function() {
    var allRecords = wx.getStorageSync('food_records') || {};
    var totalRecords = 0;
    for (var date in allRecords) {
      totalRecords += allRecords[date].length;
    }

    var today = new Date();
    var goal = this.data.dailyCalorieGoal;
    var healthyDays = 0;
    var waterDays = 0;
    var exerciseDays = 0;

    for (var i = 0; i < 14; i++) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var dateStr = format.formatDate(d);
      var records = dataStore.getRecordsByDate(dateStr);
      var dayCal = records.reduce(function(sum, r) { return sum + r.calorie; }, 0);
      if (dayCal > 0 && dayCal <= goal * 1.1) {
        healthyDays++;
      }

      var waterRecords = wx.getStorageSync('water_records') || [];
      var dayWater = waterRecords.filter(function(r) { return r.date === dateStr; }).length;
      if (dayWater >= 8) {
        waterDays++;
      }

      var exerciseRecords = wx.getStorageSync('exercise_records') || [];
      var hasExercise = exerciseRecords.some(function(r) { return r.date === dateStr && r.calories > 0; });
      if (hasExercise) {
        exerciseDays++;
      }
    }

    var weightRecords = dataStore.getWeightRecords();
    var totalWeightLoss = 0;
    if (weightRecords.length >= 2) {
      var sorted = weightRecords.slice().sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
      totalWeightLoss = ((sorted[0].weight - sorted[sorted.length - 1].weight) * 2).toFixed(1);
    }

    this.setData({
      totalRecords: totalRecords,
      healthyDays: healthyDays,
      totalWeightLoss: totalWeightLoss,
      achievementRate: {
        calorieRate: Math.round(healthyDays / 14 * 100),
        exerciseRate: Math.round(exerciseDays / 14 * 100),
        waterRate: Math.round(waterDays / 14 * 100)
      }
    });
  },

  getWeekStats: function() {
    var today = new Date();
    var list = [];
    var total = 0;

    for (var i = 6; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var dateStr = format.formatDate(d);
      var dayName = format.getDayName(dateStr);
      var records = dataStore.getRecordsByDate(dateStr);
      var dayCal = records.reduce(function(sum, r) { return sum + r.calorie; }, 0);
      total += dayCal;
      list.push({ date: dateStr, dayName: dayName, calories: dayCal, isToday: format.isToday(dateStr) });
    }

    return { list: list, total: total, avg: Math.round(total / 7) };
  },

  onNicknameInput: function(e) {
    this.setData({ nickname: e.detail.value });
  },

  onGenderChange: function(e) {
    this.setData({ gender: e.detail.value });
  },

  onAgeInput: function(e) {
    this.setData({ age: parseInt(e.detail.value) || 25 });
  },

  onHeightInput: function(e) {
    this.setData({ height: parseInt(e.detail.value) || 160 });
  },

  onWeightInput: function(e) {
    this.setData({ weight: parseInt(e.detail.value) || 55 });
  },

  onTargetChange: function(e) {
    this.setData({ target: e.currentTarget.dataset.value });
  },

  onActivityChange: function(e) {
    this.setData({ activityLevel: parseFloat(e.currentTarget.dataset.value) });
  },

  onSave: function() {
    var s = this.data;
    var bmr = calorie.calculateBMR(s.gender, s.weight, s.height, s.age);
    var tdee = calorie.calculateTDEE(bmr, s.activityLevel);
    var goal = calorie.calculateTargetCalories(tdee, s.target);

    var settings = {
      nickname: s.nickname,
      gender: s.gender,
      age: s.age,
      height: s.height,
      weight: s.weight,
      target: s.target,
      activityLevel: s.activityLevel,
      dailyCalorieGoal: goal,
      waterGoal: constants.DEFAULT_WATER_GOAL,
      exerciseTarget: constants.DEFAULT_EXERCISE_TARGET
    };

    dataStore.setUserSettings(settings);

    var bmi = format.calculateBMI(s.weight, s.height);
    var bmiInfo = format.getBMICategory(bmi);

    this.setData({
      dailyCalorieGoal: goal,
      bmi: bmi,
      bmiInfo: bmiInfo,
      showSaved: true
    });

    var page = this;
    setTimeout(function() {
      page.setData({ showSaved: false });
    }, 2000);

    wx.showToast({ title: '保存成功', icon: 'success', duration: 1500 });
  },

  drawMiniRings: function() {
    var page = this;
    setTimeout(function() {
      page.drawRing('calorieRing', page.data.achievementRate.calorieRate, '#4CAF50');
      page.drawRing('exerciseRing', page.data.achievementRate.exerciseRate, '#2196F3');
      page.drawRing('waterRing', page.data.achievementRate.waterRate, '#FF9800');
    }, 200);
  },

  drawRing: function(canvasId, percentage, color) {
    var query = wx.createSelectorQuery().in(this);
    query.select('#' + canvasId).fields({ node: true, size: true }).exec(function(res) {
      if (!res[0] || !res[0].node) return;
      var canvas = res[0].node;
      var ctx = canvas.getContext('2d');
      var dpr = wx.getSystemInfoSync().pixelRatio;
      canvas.width = 60 * dpr;
      canvas.height = 60 * dpr;
      ctx.scale(dpr, dpr);

      var cx = 30, cy = 30, r = 24, lineWidth = 5;
      ctx.clearRect(0, 0, 60, 60);
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.stroke();

      var angle = (percentage / 100) * 2 * Math.PI;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + angle);
      ctx.stroke();
    });
  },

  goToStatistics: function() {
    wx.navigateTo({ url: '/pages/statistics/statistics' });
  },

  goToWeight: function() {
    wx.navigateTo({ url: '/pages/weight/weight' });
  },

  goToEvaluation: function() {
    wx.navigateTo({ url: '/pages/evaluation/evaluation' });
  },

  goToCheckin: function() {
    wx.navigateTo({ url: '/pages/checkin/checkin' });
  }
});
