var tongyi = require('./tongyi');

var PROTEIN_FOODS = ['鸡胸肉', '牛肉', '鱼', '虾', '鸡蛋', '豆腐', '牛奶', '酸奶'];
var VEG_FOODS = ['西兰花', '菠菜', '生菜', '西红柿', '黄瓜', '胡萝卜', '白菜', '蔬菜'];
var CARB_FOODS = ['米饭', '面条', '馒头', '面包', '粥', '红薯', '玉米'];

var MEAL_TYPE_LABELS = {
  'breakfast': '早餐',
  'lunch': '午餐',
  'dinner': '晚餐',
  'snack': '加餐'
};

var TARGET_LABELS = {
  'fat': '减脂',
  'keep': '维持体重',
  'muscle': '增肌'
};

function getNextMealLabel(mealType) {
  switch (mealType) {
    case 'breakfast': return '午餐';
    case 'lunch': return '晚餐';
    case 'dinner':
    case 'snack': return '';
    default: return '';
  }
}

function getNextMealTarget(targetCal, target, nextMeal) {
  if (nextMeal === '午餐') {
    return Math.round(targetCal * 0.4);
  } else if (nextMeal === '晚餐') {
    return Math.round(targetCal * 0.25);
  }
  return 0;
}

function getLastMealSummary(records) {
  var todayStr = new Date().toISOString().split('T')[0];
  var todayRecords = records.filter(function(r) { return r.date === todayStr; });

  if (todayRecords.length === 0) {
    return {
      mealType: 'breakfast',
      foods: [],
      totalCalorie: 0,
      time: ''
    };
  }

  var mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  var lastMealType = 'breakfast';
  var lastMealTime = '';

  for (var i = 0; i < mealOrder.length; i++) {
    var meal = mealOrder[i];
    var mealRecords = todayRecords.filter(function(r) { return r.mealType === meal; });
    if (mealRecords.length > 0) {
      lastMealType = meal;
      var latest = mealRecords[mealRecords.length - 1];
      lastMealTime = latest.time;
    }
  }

  mealRecords = todayRecords.filter(function(r) { return r.mealType === lastMealType; });
  var foods = mealRecords.map(function(r) { return { name: r.name, calorie: r.calorie }; });
  var totalCalorie = foods.reduce(function(sum, f) { return sum + f.calorie; }, 0);

  return {
    mealType: lastMealType,
    foods: foods,
    totalCalorie: totalCalorie,
    time: lastMealTime
  };
}

function hasProteinToday(foodNames) {
  return foodNames.some(function(n) {
    return PROTEIN_FOODS.some(function(p) { return n.indexOf(p) !== -1; });
  });
}

function hasVegToday(foodNames) {
  return foodNames.some(function(n) {
    return VEG_FOODS.some(function(v) { return n.indexOf(v) !== -1; });
  });
}

function hasCarbToday(foodNames) {
  return foodNames.some(function(n) {
    return CARB_FOODS.some(function(c) { return n.indexOf(c) !== -1; });
  });
}

function generateMealSuggestion(mealHistory, profile) {
  var mealType = mealHistory.mealType;
  var totalCalorie = mealHistory.totalCalorie;
  var foods = mealHistory.foods;
  var target = profile.target;
  var targetCal = profile.targetCal;
  var currentCal = profile.currentCal;
  var todayExerciseCal = profile.todayExerciseCal;
  var remaining = targetCal - currentCal;

  var currentMealLabel = MEAL_TYPE_LABELS[mealType] || mealType;
  var nextMealLabel = getNextMealLabel(mealType);

  var systemPrompt = {
    role: 'system',
    content: '你是一个专业的营养师 AI 助手。请根据用户上一餐的进食情况和身体数据，给出专业的饮食建议和下一餐推荐。请严格按照 JSON 格式返回，不要添加任何其他内容。返回格式：\n{\n  "suggestion": "对上一餐的评价（30字以内）",\n  "nextMealRecommendation": "下一餐的详细建议（50字以内）",\n  "recommendedFoods": ["推荐食物1", "推荐食物2", "推荐食物3", "推荐食物4", "推荐食物5"],\n  "exerciseTips": ["运动建议1", "运动建议2"]\n}\n要求：\n1. 建议要具体、实用、有针对性\n2. 考虑用户的目标（减脂/维持/增肌）和剩余热量\n3. 推荐食物要具体，如"香煎鸡胸肉"而不是"肉类"\n4. 运动建议要简单可行'
  };

  var foodsDesc = foods.map(function(f) { return f.name + '(' + f.calorie + '千卡)'; }).join('、') || '无';

  var userPrompt = {
    role: 'user',
    content: '用户信息：\n- 目标：' + TARGET_LABELS[target] + '\n- 每日目标热量：' + targetCal + ' 千卡\n- 今日已摄入：' + currentCal + ' 千卡\n- 剩余可摄入：' + remaining + ' 千卡\n- 身高：' + profile.height + 'cm\n- 体重：' + profile.weight + 'kg\n- 年龄：' + profile.age + '岁\n- 性别：' + (profile.gender === 'male' ? '男' : '女') + '\n- 今日运动消耗：' + todayExerciseCal + ' 千卡\n\n上一餐（' + currentMealLabel + '）记录：\n- 总热量：' + totalCalorie + ' 千卡\n- 食物：' + foodsDesc + '\n\n请根据以上信息，给出专业的饮食建议，并推荐下一餐（' + (nextMealLabel || '今日已结束') + '）的饮食方案。'
  };

  return tongyi.callTongyi([systemPrompt, userPrompt]).then(function(response) {
    var parsed = tongyi.parseAIResponse(response);

    if (parsed) {
      return {
        suggestion: parsed.suggestion || '',
        nextMealRecommendation: parsed.nextMealRecommendation || '',
        recommendedFoods: parsed.recommendedFoods || [],
        exerciseTips: parsed.exerciseTips || []
      };
    }

    return fallbackRuleBasedSuggestion(mealHistory, profile);
  });
}

function fallbackRuleBasedSuggestion(mealHistory, profile) {
  var mealType = mealHistory.mealType;
  var totalCalorie = mealHistory.totalCalorie;
  var foods = mealHistory.foods;
  var target = profile.target;
  var targetCal = profile.targetCal;
  var currentCal = profile.currentCal;
  var remaining = targetCal - currentCal;

  var isLow = totalCalorie < 300;
  var isHigh = totalCalorie > 500;
  var isBalanced = !isLow && !isHigh;

  var proteinFoods = foods.filter(function(f) { return PROTEIN_FOODS.indexOf(f.name) !== -1; });
  var hasProtein = proteinFoods.length > 0;

  var vegFoods = foods.filter(function(f) { return VEG_FOODS.indexOf(f.name) !== -1; });
  var hasVeg = vegFoods.length > 0;

  var carbFoods = foods.filter(function(f) { return CARB_FOODS.indexOf(f.name) !== -1; });
  var hasCarb = carbFoods.length > 0;

  var nextMeal = getNextMealLabel(mealType);
  var nextMealTarget = getNextMealTarget(targetCal, target, nextMeal);

  var suggestion = '';
  var nextMealRecommendation = '';
  var recommendedFoods = [];
  var exerciseTips = [];

  if (isLow) {
    suggestion = '上一餐摄入偏少';
    if (!hasProtein) suggestion += '，缺乏蛋白质';
    if (!hasVeg) suggestion += '，缺少蔬菜';
    suggestion += '。';
  } else if (isHigh) {
    suggestion = '上一餐摄入偏多';
    if (foods.length > 5) suggestion += '，食物种类较多';
    suggestion += '。';
  } else {
    suggestion = '上一餐热量适中';
    if (hasProtein && hasVeg && hasCarb) suggestion += '，营养搭配均衡';
    suggestion += '。';
  }

  if (nextMeal === '午餐') {
    if (remaining < nextMealTarget * 0.5) {
      nextMealRecommendation = '午餐热量余量较少（剩余' + remaining + '千卡），建议选择清淡低卡的食物，以蔬菜和蛋白质为主，减少主食摄入。';
      recommendedFoods = ['蔬菜沙拉', '清蒸鱼', '豆腐', '黄瓜', '小番茄'];
      exerciseTips = ['上午适当走动促进消化', '饭后散步15分钟'];
    } else {
      nextMealRecommendation = '午餐热量余量充足（剩余' + remaining + '千卡），建议：优质蛋白+蔬菜+适量主食，七分饱即可。';
      if (target === 'fat') {
        recommendedFoods = ['鸡胸肉', '西兰花', '糙米饭', '番茄', '紫菜汤'];
      } else if (target === 'muscle') {
        recommendedFoods = ['鸡胸肉', '牛肉', '糙米饭', '西兰花', '鸡蛋'];
      } else {
        recommendedFoods = ['蒸鱼', '蔬菜', '杂粮饭', '豆腐'];
      }
      exerciseTips = ['饭后散步15分钟'];
    }
  } else if (nextMeal === '晚餐') {
    if (remaining < nextMealTarget * 0.6) {
      nextMealRecommendation = '目前热量余量较少（剩余' + remaining + '千卡），晚餐建议以蔬菜为主，减少主食，或者考虑轻食。';
      recommendedFoods = ['蔬菜沙拉', '黄瓜', '小番茄', '清汤'];
      exerciseTips = ['下午多走路少坐多站', '晚餐后散步20分钟'];
    } else {
      nextMealRecommendation = '目前热量余量充足（剩余' + remaining + '千卡），晚餐建议19点前吃，以蔬菜和蛋白质为主，主食减半。';
      recommendedFoods = ['蒸鱼', '蔬菜沙拉', '豆腐', '紫菜汤', '杂粮粥'];
      exerciseTips = ['晚餐后散步20分钟', '睡前做简单拉伸'];
    }
  } else {
    nextMealRecommendation = '今日餐饮已结束';
    recommendedFoods = [];
    exerciseTips = ['饭后适当散步', '睡前做拉伸放松'];
  }

  if (target === 'fat') {
    exerciseTips.push('尽量走楼梯代替电梯');
    exerciseTips.push('多做家务活动身体');
  } else if (target === 'muscle') {
    exerciseTips.push('适当力量训练');
    exerciseTips.push('注意蛋白质补充');
  }

  return {
    suggestion: suggestion,
    nextMealRecommendation: nextMealRecommendation,
    recommendedFoods: recommendedFoods,
    exerciseTips: exerciseTips
  };
}

function generateRecipeRecommendations(todayRecords, profile, allRecipes) {
  var target = profile.target;
  var targetCal = profile.targetCal;
  var currentCal = profile.currentCal;
  var remaining = targetCal - currentCal;
  var todayStr = new Date().toISOString().split('T')[0];
  var todayRecordsFiltered = todayRecords.filter(function(r) { return r.date === todayStr; });

  var mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  var lastMealType = 'breakfast';
  for (var i = 0; i < mealOrder.length; i++) {
    var meal = mealOrder[i];
    var mealRecords = todayRecordsFiltered.filter(function(r) { return r.mealType === meal; });
    if (mealRecords.length > 0) {
      lastMealType = meal;
    }
  }

  var todayTotalProtein = todayRecordsFiltered.reduce(function(sum, r) { return sum + (r.macro ? r.macro.protein : 0); }, 0);
  var todayTotalFat = todayRecordsFiltered.reduce(function(sum, r) { return sum + (r.macro ? r.macro.fat : 0); }, 0);
  var todayTotalCarbs = todayRecordsFiltered.reduce(function(sum, r) { return sum + (r.macro ? r.macro.carbs : 0); }, 0);

  var systemPrompt = {
    role: 'system',
    content: '你是一个专业的营养师 AI 助手。请根据用户的身体数据、运动目标、今日进食记录和剩余热量，推荐最适合的菜谱。请严格按照 JSON 格式返回，不要添加任何其他内容。返回格式：\n{\n  "analysis": "对用户今日饮食情况的简短分析（50字以内）",\n  "recipes": [\n    {\n      "name": "菜谱名称",\n      "calorie": 热量(千卡),\n      "protein": 蛋白质(克),\n      "fat": 脂肪(克),\n      "carbs": 碳水(克),\n      "category": "分类(蛋白质/蔬菜/主食/汤类)",\n      "reason": "推荐理由(20字以内)"\n    }\n  ]\n}\n要求：\n1. 推荐 5-8 道菜谱\n2. 每道菜的热量不超过剩余热量的 40%\n3. 根据用户目标调整推荐（减脂推荐低卡高蛋白，增肌推荐高蛋白）\n4. 如果用户今日蛋白质或蔬菜摄入不足，优先推荐相关菜谱\n5. 菜谱名称要具体，如"香煎鸡胸肉配西兰花"而不是"鸡胸肉"\n6. 所有数值必须是数字类型'
  };

  var recordsDesc = todayRecordsFiltered.map(function(r) {
    return '- ' + r.name + ': ' + r.calorie + '千卡 (蛋白质' + (r.macro ? r.macro.protein : 0) + 'g, 脂肪' + (r.macro ? r.macro.fat : 0) + 'g, 碳水' + (r.macro ? r.macro.carbs : 0) + 'g)';
  }).join('\n') || '暂无记录';

  var userPrompt = {
    role: 'user',
    content: '用户信息：\n- 目标：' + TARGET_LABELS[target] + '\n- 每日目标热量：' + targetCal + ' 千卡\n- 今日已摄入：' + currentCal + ' 千卡\n- 剩余可摄入：' + remaining + ' 千卡\n- 身高：' + profile.height + 'cm\n- 体重：' + profile.weight + 'kg\n- 年龄：' + profile.age + '岁\n- 性别：' + (profile.gender === 'male' ? '男' : '女') + '\n- 今日运动消耗：' + profile.todayExerciseCal + ' 千卡\n\n今日已进食记录（截至' + (MEAL_TYPE_LABELS[lastMealType] || '当前') + '）：\n' + recordsDesc + '\n\n今日营养总计：\n- 蛋白质：' + todayTotalProtein.toFixed(1) + 'g\n- 脂肪：' + todayTotalFat.toFixed(1) + 'g\n- 碳水：' + todayTotalCarbs.toFixed(1) + 'g\n\n请根据以上信息，推荐最适合的菜谱。'
  };

  return tongyi.callTongyi([systemPrompt, userPrompt]).then(function(response) {
    var parsed = tongyi.parseAIResponse(response);

    if (parsed && parsed.recipes && parsed.recipes.length > 0) {
      var recommendations = parsed.recipes.map(function(recipe, index) {
        return {
          id: 'ai-' + Date.now() + '-' + index,
          name: recipe.name,
          calorie: recipe.calorie,
          protein: recipe.protein,
          fat: recipe.fat,
          carbs: recipe.carbs,
          category: recipe.category,
          reason: recipe.reason
        };
      });

      return {
        recipes: recommendations,
        analysis: parsed.analysis || 'AI 分析中...'
      };
    }

    return fallbackRuleBasedRecommendation(todayRecordsFiltered, profile, allRecipes);
  });
}

function fallbackRuleBasedRecommendation(todayRecordsFiltered, profile, allRecipes) {
  var target = profile.target;
  var targetCal = profile.targetCal;
  var currentCal = profile.currentCal;
  var remaining = targetCal - currentCal;

  var todayTotalProtein = todayRecordsFiltered.reduce(function(sum, r) { return sum + (r.macro ? r.macro.protein : 0); }, 0);
  var todayTotalFat = todayRecordsFiltered.reduce(function(sum, r) { return sum + (r.macro ? r.macro.fat : 0); }, 0);
  var todayTotalCarbs = todayRecordsFiltered.reduce(function(sum, r) { return sum + (r.macro ? r.macro.carbs : 0); }, 0);

  var todayFoodNames = todayRecordsFiltered.map(function(r) { return r.name.toLowerCase(); });
  var hasProtein = hasProteinToday(todayFoodNames);
  var hasVeg = hasVegToday(todayFoodNames);

  var analysis = '今日已摄入 ' + currentCal + ' 千卡，剩余 ' + remaining + ' 千卡。';
  if (!hasProtein) analysis += ' 蛋白质摄入不足。';
  if (!hasVeg) analysis += ' 蔬菜摄入不足。';

  var filteredRecipes = allRecipes
    .filter(function(r) { return r.calorie <= remaining + 50 && r.suitableTarget && r.suitableTarget.indexOf(target) !== -1; })
    .sort(function(a, b) { return Math.abs(a.calorie - remaining * 0.3) - Math.abs(b.calorie - remaining * 0.3); })
    .slice(0, 8);

  var recommendations = filteredRecipes.map(function(recipe) {
    var reason = '';
    if (!hasProtein && ['蛋白质'].indexOf(recipe.category) !== -1) {
      reason = '今日蛋白质不足，优先补充';
    } else if (!hasVeg && ['蔬菜'].indexOf(recipe.category) !== -1) {
      reason = '今日蔬菜不足，建议多吃蔬菜';
    } else if (recipe.calorie <= remaining * 0.3) {
      reason = '热量适中，适合当前额度';
    } else if (target === 'fat' && recipe.calorie <= 200) {
      reason = '低卡健康，减脂首选';
    } else if (target === 'muscle' && recipe.protein >= 20) {
      reason = '高蛋白，增肌推荐';
    } else {
      reason = '营养均衡，适合搭配';
    }

    return {
      id: recipe.id,
      name: recipe.name,
      calorie: recipe.calorie,
      protein: recipe.protein,
      fat: recipe.fat,
      carbs: recipe.carbs,
      category: recipe.category,
      reason: reason
    };
  });

  return { recipes: recommendations, analysis: analysis };
}

module.exports = {
  generateMealSuggestion: generateMealSuggestion,
  generateRecipeRecommendations: generateRecipeRecommendations,
  getLastMealSummary: getLastMealSummary,
  fallbackRuleBasedSuggestion: fallbackRuleBasedSuggestion,
  fallbackRuleBasedRecommendation: fallbackRuleBasedRecommendation,
  getNextMealLabel: getNextMealLabel
};
