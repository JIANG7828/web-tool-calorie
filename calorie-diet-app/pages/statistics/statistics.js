const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');

Page({
  data: {
    mode: '14days',
    weekData: [],
    twoWeekData: [],
    monthData: [],
    weekTotal: 0,
    weekAvg: 0,
    twoWeekTotal: 0,
    twoWeekAvg: 0,
    monthTotal: 0,
    monthAvg: 0,
    goal: 1600,
    macroDistribution: { protein: 0, fat: 0, carbs: 0 },
    weekMacroData: [],
    today: format.formatDate(new Date()),
    currentMonth: '',
    exerciseStats: {
      totalSessions: 0,
      totalCalories: 0,
      avgCalories: 0,
      totalDuration: 0,
      topActivities: []
    },
    achievementRate: {
      calorieRate: 0,
      exerciseRate: 0,
      waterRate: 0,
      totalDays: 0,
      achievedDays: 0
    },
    showExportModal: false
  },

  onLoad: function() {
    var settings = dataStore.getUserSettings();
    this.setData({ goal: settings.dailyCalorieGoal || 1600 });
    this.loadTwoWeekData();
  },

  onShow: function() {
    this.loadData();
  },

  loadData: function() {
    if (this.data.mode === '14days') {
      this.loadTwoWeekData();
    } else if (this.data.mode === 'week') {
      this.loadWeekData();
    } else {
      this.loadMonthData();
    }
    this.loadExerciseStats();
    this.loadAchievementRate();
  },

  switchMode: function(e) {
    var mode = e.currentTarget.dataset.mode;
    this.setData({ mode: mode }, function() { this.loadData(); });
  },

  loadWeekData: function() {
    var today = new Date();
    var startOfWeek = new Date(today);
    var dayOfWeek = today.getDay();
    var diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    var weekDates = format.getWeekDates(format.formatDate(startOfWeek));
    var weekData = [];
    var weekTotal = 0;
    var weekMacroData = [];
    var totalProtein = 0, totalFat = 0, totalCarbs = 0;

    for (var i = 0; i < weekDates.length; i++) {
      var dateStr = weekDates[i];
      var records = dataStore.getRecordsByDate(dateStr);
      var dayCal = records.reduce(function(sum, r) { return sum + r.calorie; }, 0);
      var dayMacro = dataStore.getDateMacroSummary(dateStr);
      weekTotal += dayCal;
      totalProtein += dayMacro.protein;
      totalFat += dayMacro.fat;
      totalCarbs += dayMacro.carbs;
      var dayName = format.getDayName(dateStr);

      weekData.push({
        date: dateStr,
        dayName: dayName,
        calories: dayCal,
        isToday: format.isToday(dateStr)
      });

      weekMacroData.push({
        date: dateStr,
        dayName: dayName,
        protein: dayMacro.protein,
        fat: dayMacro.fat,
        carbs: dayMacro.carbs
      });
    }

    this.setData({
      weekData: weekData,
      weekTotal: weekTotal,
      weekAvg: Math.round(weekTotal / 7),
      macroDistribution: { protein: totalProtein, fat: totalFat, carbs: totalCarbs },
      weekMacroData: weekMacroData,
      weekStart: format.formatDate(startOfWeek)
    });

    var page = this;
    setTimeout(function() { page.drawBarChart(); }, 100);
  },

  loadTwoWeekData: function() {
    var today = new Date();
    var twoWeekData = [];
    var twoWeekTotal = 0;
    var totalProtein = 0, totalFat = 0, totalCarbs = 0;

    for (var i = 13; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var dateStr = format.formatDate(d);
      var records = dataStore.getRecordsByDate(dateStr);
      var dayCal = records.reduce(function(sum, r) { return sum + r.calorie; }, 0);
      var dayMacro = dataStore.getDateMacroSummary(dateStr);
      twoWeekTotal += dayCal;
      totalProtein += dayMacro.protein;
      totalFat += dayMacro.fat;
      totalCarbs += dayMacro.carbs;

      var month = d.getMonth() + 1;
      var day = d.getDate();
      var dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      var dayName = dayNames[d.getDay()];

      twoWeekData.push({
        date: dateStr,
        dayName: dayName,
        shortLabel: month + '/' + day,
        calories: dayCal,
        isToday: format.isToday(dateStr)
      });
    }

    this.setData({
      twoWeekData: twoWeekData,
      twoWeekTotal: twoWeekTotal,
      twoWeekAvg: Math.round(twoWeekTotal / 14),
      macroDistribution: { protein: totalProtein, fat: totalFat, carbs: totalCarbs }
    });

    var page = this;
    setTimeout(function() { page.drawBarChart(); }, 100);
  },

  loadMonthData: function() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var currentMonth = year + '-' + String(month).padStart(2, '0');
    var monthData = dataStore.getMonthCalories(year, month);
    var monthTotal = monthData.reduce(function(sum, d) { return sum + d.calories; }, 0);
    var daysInMonth = new Date(year, month, 0).getDate();
    var daysWithRecords = monthData.length;

    this.setData({
      monthData: monthData,
      monthTotal: monthTotal,
      monthAvg: daysWithRecords > 0 ? Math.round(monthTotal / daysWithRecords) : 0,
      currentMonth: currentMonth
    });

    var page = this;
    setTimeout(function() { page.drawBarChart(); }, 100);
  },

  loadExerciseStats: function() {
    var exerciseRecords = wx.getStorageSync('exercise_records') || [];
    var today = new Date();
    var twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 13);
    var startDate = format.formatDate(twoWeeksAgo);

    var recentExercise = exerciseRecords.filter(function(r) { return r.date >= startDate; });
    var totalSessions = recentExercise.length;
    var totalCal = recentExercise.reduce(function(sum, r) { return sum + (r.calories || 0); }, 0);
    var totalDuration = recentExercise.reduce(function(sum, r) { return sum + (r.duration || 0); }, 0);
    var avgCal = totalSessions > 0 ? Math.round(totalCal / totalSessions) : 0;

    var activityCount = {};
    recentExercise.forEach(function(r) {
      activityCount[r.activityName] = (activityCount[r.activityName] || 0) + 1;
    });

    var topActivities = Object.keys(activityCount)
      .map(function(name) { return { name: name, count: activityCount[name] }; })
      .sort(function(a, b) { return b.count - a.count; })
      .slice(0, 5);

    this.setData({
      exerciseStats: {
        totalSessions: totalSessions,
        totalCalories: totalCal,
        avgCalories: avgCal,
        totalDuration: totalDuration,
        topActivities: topActivities
      }
    });
  },

  loadAchievementRate: function() {
    var today = new Date();
    var settings = dataStore.getUserSettings();
    var goal = settings.dailyCalorieGoal || 1600;
    var achievedDays = 0;
    var exerciseDays = 0;
    var waterDays = 0;
    var totalDays = 14;

    for (var i = 0; i < 14; i++) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var dateStr = format.formatDate(d);

      var records = dataStore.getRecordsByDate(dateStr);
      var dayCal = records.reduce(function(sum, r) { return sum + r.calorie; }, 0);
      if (dayCal > 0 && dayCal <= goal * 1.1) {
        achievedDays++;
      }

      var exerciseRecords = wx.getStorageSync('exercise_records') || [];
      var hasExercise = exerciseRecords.some(function(r) { return r.date === dateStr && r.calories > 0; });
      if (hasExercise) {
        exerciseDays++;
      }

      var waterRecords = wx.getStorageSync('water_records') || [];
      var dayWater = waterRecords.filter(function(r) { return r.date === dateStr; }).length;
      if (dayWater >= 8) {
        waterDays++;
      }
    }

    this.setData({
      achievementRate: {
        calorieRate: Math.round(achievedDays / totalDays * 100),
        exerciseRate: Math.round(exerciseDays / totalDays * 100),
        waterRate: Math.round(waterDays / totalDays * 100),
        totalDays: totalDays,
        achievedDays: achievedDays
      }
    });
  },

  drawBarChart: function() {
    var query = wx.createSelectorQuery();
    query.select('#barChart').fields({ node: true, size: true }).exec(function(res) {
      if (!res[0] || !res[0].node) return;
      var canvas = res[0].node;
      var ctx = canvas.getContext('2d');
      var dpr = wx.getSystemInfoSync().pixelRatio;
      var w = res[0].width;
      var h = res[0].height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      var padding = { top: 30, right: 20, bottom: 50, left: 50 };
      var chartWidth = w - padding.left - padding.right;
      var chartHeight = h - padding.top - padding.bottom;

      ctx.clearRect(0, 0, w, h);

      var data = this.data.mode === 'week' ? this.data.weekData : 
                 this.data.mode === '14days' ? this.data.twoWeekData : 
                 this.data.monthData;
      if (data.length === 0) return;

      var values = data.map(function(d) { return d.calories; });
      var maxVal = Math.max.apply(null, values.concat([this.data.goal]));
      maxVal = Math.ceil(maxVal / 100) * 100;

      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      for (var i = 0; i <= 4; i++) {
        var y = padding.top + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        var val = Math.round(maxVal - (maxVal / 4) * i);
        ctx.fillStyle = '#999999';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val, padding.left - 10, y + 6);
      }

      var goalY = padding.top + ((maxVal - this.data.goal) / maxVal) * chartHeight;
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(padding.left, goalY);
      ctx.lineTo(w - padding.right, goalY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#999999';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('目标线', w - padding.right - 60, goalY - 8);

      var barCount = data.length;
      var barGap = Math.min(12, chartWidth / (barCount * 3));
      var barWidth = Math.max(6, (chartWidth - barGap * (barCount + 1)) / barCount);

      for (var j = 0; j < barCount; j++) {
        var barH = (data[j].calories / maxVal) * chartHeight;
        var x = padding.left + barGap + j * (barWidth + barGap);
        var y = padding.top + chartHeight - barH;

        var gradient = ctx.createLinearGradient(0, y, 0, y + barH);
        if (data[j].calories > this.data.goal) {
          gradient.addColorStop(0, '#FF6B6B');
          gradient.addColorStop(1, '#FF8E8E');
        } else {
          gradient.addColorStop(0, '#4CAF50');
          gradient.addColorStop(1, '#81C784');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        var radius = Math.min(6, barWidth / 2);
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, padding.top + chartHeight);
        ctx.lineTo(x, padding.top + chartHeight);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();

        if (data[j].calories > 0) {
          ctx.fillStyle = '#666666';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(data[j].calories, x + barWidth / 2, y - 6);
        }

        ctx.fillStyle = data[j].isToday ? '#4CAF50' : '#999999';
        ctx.font = data[j].isToday ? 'bold 18px sans-serif' : '16px sans-serif';
        ctx.textAlign = 'center';

        var label = data[j].dayName || data[j].shortLabel || '';
        if (this.data.mode === 'month') {
          var parts = data[j].date.split('-');
          label = parseInt(parts[2]) + '日';
        }
        ctx.fillText(label, x + barWidth / 2, h - padding.bottom + 20);
      }
    }.bind(this));
  },

  onExportData: function() {
    var page = this;
    wx.showActionSheet({
      itemList: ['导出CSV', '导出JSON'],
      success: function(res) {
        if (res.tapIndex === 0) {
          page.exportCSV();
        } else {
          page.exportJSON();
        }
      }
    });
  },

  exportCSV: function() {
    var data = this.data.mode === '14days' ? this.data.twoWeekData : this.data.weekData;
    var csv = '日期,热量,蛋白质,脂肪,碳水\n';

    data.forEach(function(d) {
      var macro = dataStore.getDateMacroSummary(d.date);
      csv += d.date + ',' + d.calories + ',' + macro.protein + ',' + macro.fat + ',' + macro.carbs + '\n';
    });

    var fs = wx.getFileSystemManager();
    var filePath = wx.env.USER_DATA_PATH + '/calorie_report.csv';
    fs.writeFileSync(filePath, csv, 'utf8');

    wx.showToast({ title: '已导出到本地', icon: 'success' });
  },

  exportJSON: function() {
    var data = this.data.mode === '14days' ? this.data.twoWeekData : this.data.weekData;
    var exportData = data.map(function(d) {
      var macro = dataStore.getDateMacroSummary(d.date);
      return {
        date: d.date,
        calories: d.calories,
        protein: macro.protein,
        fat: macro.fat,
        carbs: macro.carbs
      };
    });

    var json = JSON.stringify(exportData, null, 2);
    var fs = wx.getFileSystemManager();
    var filePath = wx.env.USER_DATA_PATH + '/calorie_report.json';
    fs.writeFileSync(filePath, json, 'utf8');

    wx.showToast({ title: '已导出到本地', icon: 'success' });
  }
});
