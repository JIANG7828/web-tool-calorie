const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');
const constants = require('../../utils/constants');

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
    isOverGoal: false
  },

  onLoad: function() {
    this.loadTodayData();
  },

  onShow: function() {
    this.loadTodayData();
  },

  loadTodayData: function() {
    const settings = dataStore.getUserSettings();
    const today = format.formatDate(new Date());
    const records = dataStore.getRecordsByDate(today);

    const total = records.reduce((sum, record) => sum + record.calorie, 0);
    const goal = settings.dailyCalorieGoal;
    const remaining = Math.max(goal - total, 0);
    const percentage = Math.min((total / goal) * 100, 100);

    const grouped = this.groupRecordsByMeal(records);

    this.setData({
      todayTotal: format.formatCalories(total),
      goal: goal,
      remaining: format.formatCalories(remaining),
      percentage: percentage,
      records: records,
      groupedRecords: grouped,
      today: today,
      isOverGoal: total > goal
    });
  },

  groupRecordsByMeal: function(records) {
    const grouped = {};
    const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

    mealOrder.forEach(meal => {
      grouped[meal] = records.filter(r => r.mealType === meal);
    });

    return grouped;
  },

  getMealTotal: function(mealType) {
    const records = this.data.groupedRecords[mealType] || [];
    return records.reduce((sum, record) => sum + record.calorie, 0);
  },

  addFood: function(e) {
    const mealType = e.currentTarget.dataset.meal;
    wx.navigateTo({
      url: '/pages/add-food/add-food?mealType=' + mealType + '&date=' + this.data.today
    });
  },

  deleteRecord: function(e) {
    const recordId = e.currentTarget.dataset.id;
    const date = this.data.today;

    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          dataStore.deleteRecord(date, recordId);
          this.loadTodayData();
          wx.showToast({
            title: '已删除',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  goToAddFood: function() {
    wx.switchTab({
      url: '/pages/add-food/add-food'
    });
  }
});
