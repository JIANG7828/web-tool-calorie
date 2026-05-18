const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');
const calorie = require('../../utils/calorie');
const constants = require('../../utils/constants');
const aiSuggestion = require('../../services/ai-suggestion');

Page({
  data: {
    todayTotal: 0,
    goal: 1600,
    remaining: 1600,
    percentage: 0,
    records: [],
    groupedRecords: {},
    today: format.formatDate(new Date()),
    mealTypes: constants.MEAL_TYPES,
    isOverGoal: false,
    macros: { protein: 0, fat: 0, carbs: 0 },
    waterCount: 0,
    waterGoal: 8,
    exerciseCalories: 0,
    aiSuggestion: null,
    aiLoading: false,
    streak: 0,
    nickname: '',
    weekDates: [],
    weekStart: '',
    currentWeekStart: '',
    targetMode: '',
    targetModeText: '',
    bmr: 0,
    tdee: 0,
    calorieGap: 0,
    showWeekNav: false,
    baseCalorie: 0
  },

  onLoad: function() {
    this.initWeekDates();
    this.loadTodayData();
  },

  onShow: function() {
    this.loadTodayData();
    this.loadAiSuggestion();
  },

  initWeekDates: function() {
    var today = new Date();
    var dayOfWeek = today.getDay();
    var diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    var startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - diff);

    var weekDates = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      var dateStr = format.formatDate(d);
      var dayName = format.getDayName(dateStr);
      weekDates.push({
        date: dateStr,
        dayName: dayName,
        dayNum: d.getDate(),
        isToday: format.isToday(dateStr)
      });
    }

    this.setData({
      weekDates: weekDates,
      weekStart: format.formatDate(startOfWeek),
      currentWeekStart: format.formatDate(startOfWeek)
    });
  },

  goPrevWeek: function() {
    var currentStart = new Date(this.data.currentWeekStart);
    currentStart.setDate(currentStart.getDate() - 7);
    this.updateWeekDates(currentStart);
  },

  goNextWeek: function() {
    var currentStart = new Date(this.data.currentWeekStart);
    currentStart.setDate(currentStart.getDate() + 7);
    var today = new Date();
    if (currentStart > today) return;
    this.updateWeekDates(currentStart);
  },

  updateWeekDates: function(startOfWeek) {
    var weekDates = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      var dateStr = format.formatDate(d);
      var dayName = format.getDayName(dateStr);
      weekDates.push({
        date: dateStr,
        dayName: dayName,
        dayNum: d.getDate(),
        isToday: format.isToday(dateStr)
      });
    }

    this.setData({
      weekDates: weekDates,
      currentWeekStart: format.formatDate(startOfWeek)
    });
  },

  selectDate: function(e) {
    var date = e.currentTarget.dataset.date;
    this.setData({ today: date });
    this.loadTodayData();
  },

  loadTodayData: function() {
    var settings = dataStore.getUserSettings();
    var today = this.data.today;
    var records = dataStore.getRecordsByDate(today);
    var macroSummary = dataStore.getTodayMacroSummary();
    var waterCount = dataStore.getTodayWaterCount();
    var exerciseCal = dataStore.getTodayExerciseCalories();
    var streak = dataStore.getCheckInStreak();

    var total = records.reduce(function(sum, record) { return sum + record.calorie; }, 0);
    var goal = settings.dailyCalorieGoal;
    var remaining = Math.max(goal - total, 0);
    var percentage = Math.min((total / goal) * 100, 100);

    var grouped = this.groupRecordsByMeal(records);

    var bmr = calorie.calculateBMR(settings.gender || 'female', settings.weight || 55, settings.height || 160, settings.age || 25);
    var tdee = calorie.calculateTDEE(bmr, settings.activityLevel || 1.2);
    var calorieGap = tdee - total;

    var targetMap = { fat: '减脂模式', keep: '维持模式', muscle: '增肌模式' };

    this.setData({
      todayTotal: format.formatCalories(total),
      goal: goal,
      remaining: format.formatCalories(remaining),
      percentage: percentage,
      records: records,
      groupedRecords: grouped,
      today: today,
      isOverGoal: total > goal,
      macros: macroSummary,
      waterCount: waterCount,
      waterGoal: settings.waterGoal || constants.DEFAULT_WATER_GOAL,
      exerciseCalories: exerciseCal,
      streak: streak,
      nickname: settings.nickname || '',
      targetMode: settings.target || 'keep',
      targetModeText: targetMap[settings.target] || '维持模式',
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calorieGap: Math.round(calorieGap),
      baseCalorie: Math.round(tdee)
    });

    this.drawRing(percentage);
  },

  loadAiSuggestion: function() {
    var settings = dataStore.getUserSettings();
    var records = dataStore.getAllRecords();
    var allRecords = [];
    for (var date in records) {
      allRecords = allRecords.concat(records[date]);
    }
    var mealHistory = aiSuggestion.getLastMealSummary(allRecords);

    var profile = {
      target: settings.target || 'keep',
      targetCal: settings.dailyCalorieGoal || 1600,
      currentCal: dataStore.getTodayTotalCalories(),
      height: settings.height || 160,
      weight: settings.weight || 55,
      age: settings.age || 25,
      gender: settings.gender || 'female',
      todayExerciseCal: dataStore.getTodayExerciseCalories()
    };

    var page = this;
    page.setData({ aiLoading: true });

    aiSuggestion.generateMealSuggestion(mealHistory, profile).then(function(suggestion) {
      page.setData({ aiSuggestion: suggestion, aiLoading: false });
    }).catch(function() {
      page.setData({ aiLoading: false });
    });
  },

  drawRing: function(percentage) {
    var query = wx.createSelectorQuery();
    query.select('#calorieRing').fields({ node: true, size: true }).exec(function(res) {
      if (!res[0] || !res[0].node) return;
      var canvas = res[0].node;
      var ctx = canvas.getContext('2d');
      var dpr = wx.getSystemInfoSync().pixelRatio;
      var w = res[0].width;
      var h = res[0].height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      var cx = w / 2;
      var cy = h / 2;
      var radius = Math.min(w, h) / 2 - 12;
      var lineWidth = 16;

      ctx.clearRect(0, 0, w, h);

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      var progress = Math.min(percentage / 100, 1);
      var startAngle = -Math.PI / 2;
      var endAngle = startAngle + Math.PI * 2 * progress;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      var color = percentage > 100 ? '#FFE082' : '#ffffff';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  },

  groupRecordsByMeal: function(records) {
    var grouped = {};
    var mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

    mealOrder.forEach(function(meal) {
      grouped[meal] = records.filter(function(r) { return r.mealType === meal; });
    });

    return grouped;
  },

  getMealTotal: function(mealType) {
    var records = this.data.groupedRecords[mealType] || [];
    return records.reduce(function(sum, record) { return sum + record.calorie; }, 0);
  },

  addFood: function(e) {
    var mealType = e.currentTarget.dataset.meal;
    wx.navigateTo({
      url: '/pages/add-food/add-food?mealType=' + mealType + '&date=' + this.data.today
    });
  },

  deleteRecord: function(e) {
    var recordId = e.currentTarget.dataset.id;
    var date = this.data.today;

    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条记录吗？',
      success: function(res) {
        if (res.confirm) {
          dataStore.deleteRecord(date, recordId);
          this.loadTodayData();
          wx.showToast({ title: '已删除', icon: 'success', duration: 1500 });
        }
      }.bind(this)
    });
  },

  addWater: function() {
    var record = {
      id: format.generateId(),
      date: this.data.today,
      count: 1,
      createdAt: Date.now()
    };
    dataStore.addWaterRecord(record);
    this.setData({ waterCount: this.data.waterCount + 1 });
    wx.showToast({ title: '已记录', icon: 'success', duration: 1000 });
  },

  goToAddFood: function() {
    wx.navigateTo({ url: '/pages/add-food/add-food' });
  },

  goToProfile: function() {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  goToExercise: function() {
    wx.navigateTo({ url: '/pages/exercise/exercise' });
  },

  goToWeight: function() {
    wx.navigateTo({ url: '/pages/weight/weight' });
  },

  goToRecords: function() {
    wx.switchTab({ url: '/pages/records/records' });
  },

  goToStatistics: function() {
    wx.navigateTo({ url: '/pages/statistics/statistics' });
  },

  goToRecipe: function() {
    wx.navigateTo({ url: '/pages/recipe/recipe' });
  },

  goFoodRecognition: function() {
    wx.switchTab({ url: '/pages/food-recognition/food-recognition' });
  },

  goToEvaluation: function() {
    wx.navigateTo({ url: '/pages/evaluation/evaluation' });
  },

  goToCheckin: function() {
    wx.navigateTo({ url: '/pages/checkin/checkin' });
  },

  goToFoodDatabase: function() {
    wx.navigateTo({ url: '/pages/food-database/food-database' });
  }
});
