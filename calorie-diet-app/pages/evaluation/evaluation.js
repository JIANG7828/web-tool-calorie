const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');
const calorie = require('../../utils/calorie');
const aiSuggestion = require('../../services/ai-suggestion');

Page({
  data: {
    bmiScore: 0,
    bmiInfo: { label: '', color: '' },
    dietScore: 0,
    exerciseScore: 0,
    waterScore: 0,
    totalScore: 0,
    rating: '',
    ratingColor: '',
    pros: [],
    cons: [],
    suggestions: [],
    nextMealSuggestion: '',
    weekData: [],
    loading: false,
    lastMealType: '',
    lastMealCalories: 0,
    lastMealProtein: 0,
    lastMealFat: 0,
    lastMealCarbs: 0
  },

  onLoad: function() {
    this.loadEvaluation();
  },

  onShow: function() {
    this.loadEvaluation();
  },

  loadEvaluation: function() {
    var page = this;
    page.setData({ loading: true });

    var settings = dataStore.getUserSettings();
    var today = format.formatDate(new Date());
    var todayRecords = dataStore.getRecordsByDate(today);
    var todayCalories = todayRecords.reduce(function(sum, r) { return sum + (r.calorie || 0); }, 0);
    var todayMacro = dataStore.getTodayMacroSummary();

    var weekData = [];
    var todayDate = new Date();
    for (var i = 6; i >= 0; i--) {
      var d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      var dateStr = format.formatDate(d);
      var records = dataStore.getRecordsByDate(dateStr);
      var dayCal = records.reduce(function(sum, r) { return sum + (r.calorie || 0); }, 0);
      weekData.push({
        date: dateStr,
        calories: dayCal,
        dayName: format.getDayName(dateStr),
        isToday: format.isToday(dateStr)
      });
    }

    var lastMeal = this.getLastMeal(todayRecords);

    var bmi = format.calculateBMI(settings.weight, settings.height);
    var bmiInfo = format.getBMICategory(bmi);
    var bmiScore = this.calcBMIScore(bmi);

    var goal = settings.dailyCalorieGoal || 1600;
    var dietScore = this.calcDietScore(todayCalories, goal, todayMacro);
    var exerciseScore = this.calcExerciseScore(today);
    var waterScore = this.calcWaterScore();

    var totalScore = Math.round(bmiScore * 0.3 + dietScore * 0.3 + exerciseScore * 0.2 + waterScore * 0.2);

    var rating = this.getRating(totalScore);
    var evaluation = this.generateEvaluation(totalScore, bmiScore, dietScore, exerciseScore, waterScore, todayMacro, goal, settings);

    this.setData({
      bmiScore: Math.round(bmiScore),
      bmiInfo: bmiInfo,
      dietScore: Math.round(dietScore),
      exerciseScore: Math.round(exerciseScore),
      waterScore: Math.round(waterScore),
      totalScore: totalScore,
      rating: rating.label,
      ratingColor: rating.color,
      pros: evaluation.pros,
      cons: evaluation.cons,
      suggestions: evaluation.suggestions,
      nextMealSuggestion: evaluation.nextMealSuggestion,
      weekData: weekData,
      loading: false,
      lastMealType: lastMeal.type,
      lastMealCalories: lastMeal.calories,
      lastMealProtein: lastMeal.protein,
      lastMealFat: lastMeal.fat,
      lastMealCarbs: lastMeal.carbs
    });
  },

  getLastMeal: function(todayRecords) {
    if (todayRecords.length === 0) {
      return { type: '', calories: 0, protein: 0, fat: 0, carbs: 0 };
    }

    var mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    var mealNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' };
    var lastMealType = '';

    for (var i = mealTypes.length - 1; i >= 0; i--) {
      var found = todayRecords.some(function(r) { return r.mealType === mealTypes[i]; });
      if (found) {
        lastMealType = mealNames[mealTypes[i]];
        break;
      }
    }

    var calories = todayRecords.reduce(function(sum, r) { return sum + (r.calorie || 0); }, 0);
    var protein = todayRecords.reduce(function(sum, r) { return sum + (r.macro ? r.macro.protein || 0 : 0); }, 0);
    var fat = todayRecords.reduce(function(sum, r) { return sum + (r.macro ? r.macro.fat || 0 : 0); }, 0);
    var carbs = todayRecords.reduce(function(sum, r) { return sum + (r.macro ? r.macro.carbs || 0 : 0); }, 0);

    return { type: lastMealType, calories: calories, protein: protein, fat: fat, carbs: carbs };
  },

  calcBMIScore: function(bmi) {
    if (bmi >= 18.5 && bmi < 24) {
      return 100;
    } else if (bmi >= 17 && bmi < 18.5 || bmi >= 24 && bmi < 28) {
      return 75;
    } else if (bmi >= 16 && bmi < 17 || bmi >= 28 && bmi < 35) {
      return 50;
    } else {
      return 25;
    }
  },

  calcDietScore: function(todayCalories, goal, macro) {
    var score = 100;
    var ratio = todayCalories / goal;

    if (ratio > 1.2) {
      score -= 30;
    } else if (ratio > 1.0) {
      score -= 10;
    } else if (ratio < 0.6) {
      score -= 20;
    }

    var totalMacro = macro.protein + macro.fat + macro.carbs;
    if (totalMacro > 0) {
      var proteinRatio = macro.protein / totalMacro;
      if (proteinRatio < 0.15) {
        score -= 10;
      } else if (proteinRatio >= 0.15 && proteinRatio <= 0.35) {
        score += 5;
      }

      var fatRatio = macro.fat / totalMacro;
      if (fatRatio > 0.35) {
        score -= 10;
      }
    }

    return Math.max(0, Math.min(100, score));
  },

  calcExerciseScore: function(today) {
    var exerciseRecords = wx.getStorageSync('exercise_records') || [];
    var todayExercise = exerciseRecords.filter(function(r) { return r.date === today; });
    var totalCal = todayExercise.reduce(function(sum, r) { return sum + (r.calories || 0); }, 0);

    if (totalCal >= 300) return 100;
    if (totalCal >= 200) return 85;
    if (totalCal >= 100) return 70;
    if (totalCal > 0) return 50;
    return 0;
  },

  calcWaterScore: function() {
    var waterCount = dataStore.getTodayWaterCount();
    if (waterCount >= 8) return 100;
    if (waterCount >= 6) return 75;
    if (waterCount >= 4) return 50;
    if (waterCount >= 2) return 25;
    return 0;
  },

  getRating: function(score) {
    if (score >= 90) return { label: '优秀', color: '#4CAF50' };
    if (score >= 75) return { label: '良好', color: '#8BC34A' };
    if (score >= 60) return { label: '一般', color: '#FFC107' };
    if (score >= 40) return { label: '超标', color: '#FF9800' };
    return { label: '需改善', color: '#F44336' };
  },

  generateEvaluation: function(totalScore, bmiScore, dietScore, exerciseScore, waterScore, macro, goal, settings) {
    var pros = [];
    var cons = [];
    var suggestions = [];

    if (bmiScore >= 90) {
      pros.push('BMI 指数在健康范围内');
    } else if (bmiScore < 60) {
      cons.push('BMI 指数偏' + (bmiScore < 40 ? '高' : '低'));
      suggestions.push('建议调整饮食结构，逐步调整体重');
    }

    if (dietScore >= 80) {
      pros.push('今日饮食控制良好');
    } else if (dietScore < 50) {
      cons.push('今日热量摄入超出目标较多');
      suggestions.push('建议减少高热量食物，增加蔬菜摄入');
    }

    if (exerciseScore >= 70) {
      pros.push('今日运动量充足');
    } else if (exerciseScore < 30) {
      cons.push('今日运动不足');
      suggestions.push('建议增加日常活动，如步行、爬楼梯等');
    }

    if (waterScore >= 75) {
      pros.push('饮水充足');
    } else {
      cons.push('饮水量不足');
      suggestions.push('建议每天至少喝 6-8 杯水');
    }

    if (macro.protein + macro.fat + macro.carbs > 0) {
      var proteinRatio = macro.protein / (macro.protein + macro.fat + macro.carbs);
      if (proteinRatio < 0.15) {
        cons.push('蛋白质摄入偏低');
        suggestions.push('建议增加鸡胸肉、鸡蛋、豆制品等高蛋白食物');
      }
    }

    var nextMealSuggestion = this.generateNextMealSuggestion(goal, macro, settings);

    return {
      pros: pros,
      cons: cons,
      suggestions: suggestions,
      nextMealSuggestion: nextMealSuggestion
    };
  },

  generateNextMealSuggestion: function(goal, macro, settings) {
    var remaining = goal - (macro.protein * 4 + macro.fat * 9 + macro.carbs * 4);

    if (remaining < 100) {
      return '今日热量已接近目标，建议下一餐选择低卡食物，如蔬菜沙拉、清汤等。';
    }

    if (macro.protein < 30) {
      return '建议下一餐补充高蛋白食物：鸡胸肉（150千卡/100g）、水煮蛋（155千卡/个）或清蒸鱼（120千卡/100g）。';
    }

    if (macro.fat > 40) {
      return '今日脂肪摄入偏高，建议下一餐选择清蒸、水煮等少油烹饪方式，避免煎炸食物。';
    }

    return '建议下一餐保持均衡营养，搭配主食、蛋白质和蔬菜，控制总热量在' + Math.round(remaining * 0.6) + '千卡以内。';
  },

  onGoToExercise: function() {
    wx.switchTab({ url: '/pages/exercise/exercise' });
  },

  onGoToRecords: function() {
    wx.switchTab({ url: '/pages/records/records' });
  },

  onRefresh: function() {
    this.loadEvaluation();
  }
});
