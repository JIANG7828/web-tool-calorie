const constants = require('./constants');
const format = require('./format');

class DataStore {
  getUserSettings() {
    return wx.getStorageSync(constants.STORAGE_KEYS.USER_SETTINGS) || {
      dailyCalorieGoal: constants.DEFAULT_CALORIE_GOAL,
      gender: 'female',
      height: 165,
      weight: 55,
      target: 'keep',
      age: 25,
      activityLevel: 1.2,
      waterGoal: constants.DEFAULT_WATER_GOAL,
      exerciseTarget: constants.DEFAULT_EXERCISE_TARGET
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

  getTodayMacroSummary() {
    const today = format.formatDate(new Date());
    const records = this.getRecordsByDate(today);
    return records.reduce(
      (sum, r) => ({
        protein: sum.protein + (r.macro?.protein || 0),
        fat: sum.fat + (r.macro?.fat || 0),
        carbs: sum.carbs + (r.macro?.carbs || 0),
        calories: sum.calories + (r.calorie || 0)
      }),
      { protein: 0, fat: 0, carbs: 0, calories: 0 }
    );
  }

  getDateMacroSummary(date) {
    const records = this.getRecordsByDate(date);
    return records.reduce(
      (sum, r) => ({
        protein: sum.protein + (r.macro?.protein || 0),
        fat: sum.fat + (r.macro?.fat || 0),
        carbs: sum.carbs + (r.macro?.carbs || 0),
        calories: sum.calories + (r.calorie || 0)
      }),
      { protein: 0, fat: 0, carbs: 0, calories: 0 }
    );
  }

  addWeightRecord(record) {
    const records = this.getWeightRecords();
    records.push(record);
    wx.setStorageSync(constants.STORAGE_KEYS.WEIGHT_RECORDS, records);
    return record;
  }

  getWeightRecords() {
    return wx.getStorageSync(constants.STORAGE_KEYS.WEIGHT_RECORDS) || [];
  }

  getLatestWeight() {
    const records = this.getWeightRecords();
    if (records.length === 0) return null;
    return records[records.length - 1];
  }

  getWeightTrend(days) {
    const records = this.getWeightRecords();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return records.filter(r => new Date(r.date) >= cutoff);
  }

  deleteWeightRecord(recordId) {
    let records = this.getWeightRecords();
    records = records.filter(r => r.id !== recordId);
    wx.setStorageSync(constants.STORAGE_KEYS.WEIGHT_RECORDS, records);
    return records;
  }

  addWaterRecord(record) {
    const records = this.getWaterRecords();
    records.push(record);
    wx.setStorageSync(constants.STORAGE_KEYS.WATER_INTAKE, records);
    return record;
  }

  getWaterRecords() {
    return wx.getStorageSync(constants.STORAGE_KEYS.WATER_INTAKE) || [];
  }

  getTodayWaterCount() {
    const today = format.formatDate(new Date());
    return this.getWaterRecords()
      .filter(r => r.date === today)
      .reduce((sum, r) => sum + (r.count || 1), 0);
  }

  getWaterGoal() {
    const settings = this.getUserSettings();
    return settings.waterGoal || constants.DEFAULT_WATER_GOAL;
  }

  addExerciseRecord(record) {
    const records = this.getExerciseRecords();
    records.push(record);
    wx.setStorageSync(constants.STORAGE_KEYS.EXERCISE_RECORDS, records);
    return record;
  }

  getExerciseRecords() {
    return wx.getStorageSync(constants.STORAGE_KEYS.EXERCISE_RECORDS) || [];
  }

  getTodayExerciseCalories() {
    const today = format.formatDate(new Date());
    return this.getExerciseRecords()
      .filter(r => r.date === today)
      .reduce((sum, r) => sum + (r.calories || 0), 0);
  }

  getExerciseTemplates() {
    return wx.getStorageSync(constants.STORAGE_KEYS.EXERCISE_TEMPLATES) || [
      { id: 'walk', name: '散步', caloriesPerMinute: 3, icon: '🚶' },
      { id: 'run', name: '跑步', caloriesPerMinute: 10, icon: '🏃' },
      { id: 'cycle', name: '骑行', caloriesPerMinute: 7, icon: '🚴' },
      { id: 'swim', name: '游泳', caloriesPerMinute: 8, icon: '🏊' },
      { id: 'yoga', name: '瑜伽', caloriesPerMinute: 3, icon: '🧘' },
      { id: 'hiit', name: 'HIIT', caloriesPerMinute: 12, icon: '💪' },
    ];
  }

  addCheckIn(checkIn) {
    const records = this.getCheckIns();
    records.push(checkIn);
    wx.setStorageSync(constants.STORAGE_KEYS.CHECK_INS, records);
    return checkIn;
  }

  getCheckIns() {
    return wx.getStorageSync(constants.STORAGE_KEYS.CHECK_INS) || [];
  }

  hasCheckedInToday() {
    const today = format.formatDate(new Date());
    return this.getCheckIns().some(c => c.date === today && c.completed);
  }

  getCheckInStreak() {
    const checkIns = this.getCheckIns();
    if (checkIns.length === 0) return 0;

    const sorted = [...checkIns]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
      const checkIn = sorted[i];
      const checkInDate = new Date(checkIn.date);
      checkInDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
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

  getMemberLevel() {
    return wx.getStorageSync(constants.STORAGE_KEYS.MEMBER_LEVEL) || {
      level: 'free',
      expireDate: null,
      points: 0
    };
  }

  setMemberLevel(levelData) {
    wx.setStorageSync(constants.STORAGE_KEYS.MEMBER_LEVEL, levelData);
  }

  addMemberPoints(points) {
    const level = this.getMemberLevel();
    level.points = (level.points || 0) + points;
    this.setMemberLevel(level);
    return level;
  }

  getTodaySummary() {
    const today = format.formatDate(new Date());
    return {
      date: today,
      calories: this.getTodayTotalCalories(),
      macros: this.getTodayMacroSummary(),
      waterCount: this.getTodayWaterCount(),
      waterGoal: this.getWaterGoal(),
      exerciseCalories: this.getTodayExerciseCalories(),
      hasCheckedIn: this.hasCheckedInToday(),
      streak: this.getCheckInStreak(),
      memberLevel: this.getMemberLevel()
    };
  }

  clearAllData() {
    wx.removeStorageSync(constants.STORAGE_KEYS.DIET_RECORDS);
    wx.removeStorageSync(constants.STORAGE_KEYS.CUSTOM_FOODS);
    wx.removeStorageSync(constants.STORAGE_KEYS.LAST_FOODS);
    wx.removeStorageSync(constants.STORAGE_KEYS.WEIGHT_RECORDS);
    wx.removeStorageSync(constants.STORAGE_KEYS.WATER_INTAKE);
    wx.removeStorageSync(constants.STORAGE_KEYS.EXERCISE_RECORDS);
    wx.removeStorageSync(constants.STORAGE_KEYS.CHECK_INS);
    wx.removeStorageSync(constants.STORAGE_KEYS.MEMBER_LEVEL);
  }

  exportData() {
    return {
      settings: this.getUserSettings(),
      records: this.getAllRecords(),
      customFoods: this.getCustomFoods(),
      weightRecords: this.getWeightRecords(),
      waterRecords: this.getWaterRecords(),
      exerciseRecords: this.getExerciseRecords(),
      checkIns: this.getCheckIns(),
      memberLevel: this.getMemberLevel(),
      exportTime: Date.now()
    };
  }
}

module.exports = new DataStore();
