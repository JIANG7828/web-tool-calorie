const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');
const calorie = require('../../utils/calorie');
const activities = require('../../utils/activities');

Page({
  data: {
    allActivities: [],
    filteredActivities: [],
    searchKeyword: '',
    selectedActivity: null,
    duration: '',
    exerciseCalories: 0,
    todayRecords: [],
    todayTotalCalories: 0,
    categories: ['全部'],
    currentCategory: '全部',
    showRecordInput: false
  },

  onLoad: function() {
    this.initActivities();
    this.loadTodayRecords();
  },

  onShow: function() {
    this.loadTodayRecords();
  },

  initActivities: function() {
    var daily = activities.getDailyActivities();
    var exercises = activities.getExercises();
    var cats = activities.getExerciseCategories();
    var all = daily.concat(exercises);
    this.setData({
      allActivities: all,
      filteredActivities: all,
      categories: cats
    });
  },

  loadTodayRecords: function() {
    var today = format.formatDate(new Date());
    var records = dataStore.getExerciseRecords().filter(function(r) { return r.date === today; });
    var total = records.reduce(function(sum, r) { return sum + (r.calories || 0); }, 0);
    records.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    this.setData({ todayRecords: records, todayTotalCalories: total });
  },

  onSearch: function(e) {
    var keyword = e.detail.value;
    var all = this.data.allActivities;
    if (!keyword || keyword.trim() === '') {
      this.setData({ searchKeyword: '', filteredActivities: all });
    } else {
      var filtered = all.filter(function(a) {
        return a.name.indexOf(keyword) !== -1 || (a.desc && a.desc.indexOf(keyword) !== -1);
      });
      this.setData({ searchKeyword: keyword, filteredActivities: filtered });
    }
  },

  onCategoryChange: function(e) {
    var cat = e.currentTarget.dataset.category;
    var all = this.data.allActivities;
    if (cat === '全部') {
      this.setData({ currentCategory: '全部', filteredActivities: all });
    } else {
      var filtered = all.filter(function(a) { return a.category === cat; });
      this.setData({ currentCategory: cat, filteredActivities: filtered });
    }
  },

  onSelectActivity: function(e) {
    var activity = e.currentTarget.dataset.item;
    this.setData({ selectedActivity: activity, duration: '', exerciseCalories: 0, showRecordInput: true });
  },

  onDurationInput: function(e) {
    var duration = parseInt(e.detail.value) || 0;
    var act = this.data.selectedActivity;
    var settings = dataStore.getUserSettings();
    var cal = 0;
    if (act && act.met && settings.weight) {
      cal = calorie.calculateExerciseCalories(act.met, settings.weight, duration);
    }
    this.setData({ duration: duration, exerciseCalories: cal });
  },

  onSaveExercise: function() {
    var act = this.data.selectedActivity;
    var duration = this.data.duration;
    if (!act || !duration || duration <= 0) {
      wx.showToast({ title: '请输入运动时长', icon: 'none' });
      return;
    }
    var record = {
      id: format.generateId(),
      date: format.formatDate(new Date()),
      activityId: act.id,
      activityName: act.name,
      met: act.met,
      icon: act.icon || '',
      duration: duration,
      calories: this.data.exerciseCalories,
      createdAt: Date.now()
    };
    dataStore.addExerciseRecord(record);
    this.setData({ selectedActivity: null, duration: '', exerciseCalories: 0, showRecordInput: false });
    this.loadTodayRecords();
    wx.showToast({ title: '记录成功', icon: 'success', duration: 1500 });
  },

  onCancelInput: function() {
    this.setData({ selectedActivity: null, duration: '', exerciseCalories: 0, showRecordInput: false });
  },

  onDeleteRecord: function(e) {
    var id = e.currentTarget.dataset.id;
    var page = this;
    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条运动记录吗？',
      success: function(res) {
        if (res.confirm) {
          var records = dataStore.getExerciseRecords().filter(function(r) { return r.id !== id; });
          wx.setStorageSync('exercise_records', records);
          page.loadTodayRecords();
          wx.showToast({ title: '已删除', icon: 'success', duration: 1500 });
        }
      }
    });
  }
});
