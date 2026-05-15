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
    showSaved: false
  },

  onLoad: function() {
    this.loadUserData();
  },

  onShow: function() {
    this.loadUserData();
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
  }
});
