const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');
const constants = require('../../utils/constants');

Page({
  data: {
    today: format.formatDate(new Date()),
    records: [],
    filteredRecords: [],
    todayCal: 0,
    todayProtein: 0,
    todayFat: 0,
    todayCarbs: 0,
    dateLabel: '今天',
    mealFilter: 'all',
    mealTypeNames: { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' },
    hasBreakfast: false,
    hasLunch: false,
    hasDinner: false,
    hasSnack: false
  },

  onLoad: function() {
    this.loadTodayData();
  },

  onShow: function() {
    this.loadTodayData();
  },

  loadTodayData: function() {
    var records = dataStore.getRecordsByDate(this.data.today);
    var total = 0, protein = 0, fat = 0, carbs = 0;

    records.forEach(function(r) {
      total += r.calorie;
      protein += r.macro ? r.macro.protein : 0;
      fat += r.macro ? r.macro.fat : 0;
      carbs += r.macro ? r.macro.carbs : 0;
    });

    var hasBreakfast = records.some(function(r) { return r.mealType === 'breakfast'; });
    var hasLunch = records.some(function(r) { return r.mealType === 'lunch'; });
    var hasDinner = records.some(function(r) { return r.mealType === 'dinner'; });
    var hasSnack = records.some(function(r) { return r.mealType === 'snack'; });

    var dateLabel = format.isToday(this.data.today) ? '今天' : this.data.today;

    this.setData({
      records: records,
      todayCal: total,
      todayProtein: protein,
      todayFat: fat,
      todayCarbs: carbs,
      dateLabel: dateLabel,
      hasBreakfast: hasBreakfast,
      hasLunch: hasLunch,
      hasDinner: hasDinner,
      hasSnack: hasSnack
    });

    this.applyFilter();
  },

  applyFilter: function() {
    var records = this.data.records;
    var filter = this.data.mealFilter;
    var filtered = filter === 'all' ? records : records.filter(function(r) { return r.mealType === filter; });

    filtered.sort(function(a, b) { return b.timestamp - a.timestamp; });

    this.setData({ filteredRecords: filtered });
  },

  onMealFilterChange: function(e) {
    var meal = e.currentTarget.dataset.meal;
    this.setData({ mealFilter: meal }, this.applyFilter);
  },

  onRecordDelete: function(e) {
    var id = e.currentTarget.dataset.id;
    var page = this;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: function(res) {
        if (res.confirm) {
          dataStore.removeRecord(id);
          page.loadTodayData();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  goToAddFood: function() {
    wx.navigateTo({ url: '/pages/add-food/add-food' });
  }
});
