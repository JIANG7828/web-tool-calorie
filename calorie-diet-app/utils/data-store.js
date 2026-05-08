const constants = require('./constants');
const format = require('./format');

class DataStore {
  getUserSettings() {
    return wx.getStorageSync(constants.STORAGE_KEYS.USER_SETTINGS) || {
      dailyCalorieGoal: constants.DEFAULT_CALORIE_GOAL,
      gender: 'female',
      height: 165,
      weight: 55
    };
  }

  setUserSettings(settings) {
    wx.setStorageSync(constants.STORAGE_KEYS.USER_SETTINGS, settings);
  }

  getAllRecords() {
    return wx.getStorageSync(constants.STORAGE_KEYS.DIET_RECORDS) || {};
  }

  getRecordsByDate(date) {
    const records = this.getAllRecords();
    return records[date] || [];
  }

  addRecord(record) {
    const records = this.getAllRecords();
    const date = record.date;

    if (!records[date]) {
      records[date] = [];
    }

    records[date].push(record);
    wx.setStorageSync(constants.STORAGE_KEYS.DIET_RECORDS, records);

    this.updateLastFoods(record.foodName);

    return record;
  }

  updateRecord(date, recordId, updates) {
    const records = this.getAllRecords();
    const dateRecords = records[date] || [];
    const index = dateRecords.findIndex(r => r.id === recordId);

    if (index !== -1) {
      dateRecords[index] = { ...dateRecords[index], ...updates };
      records[date] = dateRecords;
      wx.setStorageSync(constants.STORAGE_KEYS.DIET_RECORDS, records);
      return dateRecords[index];
    }
    return null;
  }

  deleteRecord(date, recordId) {
    const records = this.getAllRecords();
    const dateRecords = records[date] || [];
    const index = dateRecords.findIndex(r => r.id === recordId);

    if (index !== -1) {
      dateRecords.splice(index, 1);
      records[date] = dateRecords;
      wx.setStorageSync(constants.STORAGE_KEYS.DIET_RECORDS, records);
      return true;
    }
    return false;
  }

  getTodayTotalCalories() {
    const today = format.formatDate(new Date());
    const records = this.getRecordsByDate(today);
    return records.reduce((sum, record) => sum + record.calorie, 0);
  }

  getDateRangeCalories(startDate, endDate) {
    const records = this.getAllRecords();
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = format.formatDate(d);
      const dayRecords = records[dateStr] || [];
      const total = dayRecords.reduce((sum, record) => sum + record.calorie, 0);
      dates.push({
        date: dateStr,
        calories: total
      });
    }

    return dates;
  }

  getWeekCalories(weekStartDate) {
    const weekDates = format.getWeekDates(weekStartDate);
    return this.getDateRangeCalories(weekDates[0], weekDates[6]);
  }

  getMonthCalories(year, month) {
    const records = this.getAllRecords();
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const result = [];

    for (const date in records) {
      if (date.startsWith(monthStr)) {
        const total = records[date].reduce((sum, record) => sum + record.calorie, 0);
        result.push({
          date,
          calories: total
        });
      }
    }

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }

  getLastFoods() {
    return wx.getStorageSync(constants.STORAGE_KEYS.LAST_FOODS) || [];
  }

  updateLastFoods(foodName) {
    let lastFoods = this.getLastFoods();
    lastFoods = lastFoods.filter(f => f !== foodName);
    lastFoods.unshift(foodName);
    lastFoods = lastFoods.slice(0, 10);
    wx.setStorageSync(constants.STORAGE_KEYS.LAST_FOODS, lastFoods);
  }

  getCustomFoods() {
    return wx.getStorageSync(constants.STORAGE_KEYS.CUSTOM_FOODS) || [];
  }

  addCustomFood(food) {
    const foods = this.getCustomFoods();
    foods.push(food);
    wx.setStorageSync(constants.STORAGE_KEYS.CUSTOM_FOODS, foods);
    return food;
  }

  clearAllData() {
    wx.removeStorageSync(constants.STORAGE_KEYS.DIET_RECORDS);
    wx.removeStorageSync(constants.STORAGE_KEYS.CUSTOM_FOODS);
    wx.removeStorageSync(constants.STORAGE_KEYS.LAST_FOODS);
  }

  exportData() {
    return {
      settings: this.getUserSettings(),
      records: this.getAllRecords(),
      customFoods: this.getCustomFoods(),
      exportTime: Date.now()
    };
  }
}

module.exports = new DataStore();
