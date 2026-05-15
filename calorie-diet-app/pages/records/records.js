const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');

Page({
  data: {
    selectedDate: '',
    records: [],
    groupedRecords: {},
    mealOrder: ['breakfast', 'lunch', 'dinner', 'snack'],
    mealTypeLabels: { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' },
    totalCalories: 0,
    macros: { protein: 0, fat: 0, carbs: 0 },
    isToday: true,
    editRecord: null,
    editWeight: '',
    showEditModal: false
  },

  onLoad: function() {
    var today = format.formatDate(new Date());
    this.setData({ selectedDate: today });
    this.loadData();
  },

  onShow: function() {
    this.loadData();
  },

  loadData: function() {
    var dateStr = this.data.selectedDate;
    var records = dataStore.getRecordsByDate(dateStr);
    var grouped = {};
    var total = 0;
    var macros = { protein: 0, fat: 0, carbs: 0 };

    this.data.mealOrder.forEach(function(meal) {
      grouped[meal] = records.filter(function(r) { return r.mealType === meal; });
    });

    records.forEach(function(r) {
      total += r.calorie || 0;
      if (r.macro) {
        macros.protein += r.macro.protein || 0;
        macros.fat += r.macro.fat || 0;
        macros.carbs += r.macro.carbs || 0;
      }
    });

    this.setData({
      records: records,
      groupedRecords: grouped,
      totalCalories: total,
      macros: macros,
      isToday: format.isToday(dateStr)
    });
  },

  goPrevDay: function() {
    var prev = format.subtractDays(this.data.selectedDate, 1);
    this.setData({ selectedDate: prev }, function() { this.loadData(); });
  },

  goNextDay: function() {
    var next = format.addDays(this.data.selectedDate, 1);
    var today = format.formatDate(new Date());
    if (next > today) return;
    this.setData({ selectedDate: next }, function() { this.loadData(); });
  },

  pickDate: function() {
    var page = this;
    wx.showDatePickerActionSheet({
      format: 'yyyy-MM-dd',
      startTime: '2020-01-01',
      endTime: format.formatDate(new Date()),
      success: function(res) {
        page.setData({ selectedDate: res.timestamp }, function() { page.loadData(); });
      }
    });
  },

  getMealTotal: function(mealType) {
    var records = this.data.groupedRecords[mealType] || [];
    return records.reduce(function(sum, r) { return sum + (r.calorie || 0); }, 0);
  },

  onDeleteRecord: function(e) {
    var id = e.currentTarget.dataset.id;
    var page = this;
    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条食物记录吗？',
      success: function(res) {
        if (res.confirm) {
          dataStore.deleteRecord(page.data.selectedDate, id);
          page.loadData();
          wx.showToast({ title: '已删除', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  onEditRecord: function(e) {
    var record = e.currentTarget.dataset.item;
    this.setData({
      editRecord: record,
      editWeight: record.portion || 100,
      showEditModal: true
    });
  },

  onEditWeightInput: function(e) {
    this.setData({ editWeight: parseInt(e.detail.value) || 100 });
  },

  onCancelEdit: function() {
    this.setData({ editRecord: null, showEditModal: false });
  },

  onSaveEdit: function() {
    var record = this.data.editRecord;
    var newWeight = this.data.editWeight;

    if (!record || !newWeight) return;

    var foodDb = require('../../utils/food-database');
    var matchedFood = foodDb.searchFood(record.foodName);
    var calPerHundred = 150;
    var macro = { protein: 0, fat: 0, carbs: 0 };

    if (matchedFood.length > 0) {
      calPerHundred = matchedFood[0].caloriePerHundred;
      macro = foodDb.calculateMacro(matchedFood[0].id, newWeight);
    }

    var newCal = Math.round((calPerHundred * newWeight) / 100);

    dataStore.updateRecord(this.data.selectedDate, record.id, {
      portion: newWeight,
      calorie: newCal,
      macro: macro
    });

    this.setData({ editRecord: null, showEditModal: false });
    this.loadData();
    wx.showToast({ title: '已更新', icon: 'success', duration: 1500 });
  }
});
