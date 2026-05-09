/**
 * 懒人减脂方案系统
 * 不用运动，不用特意节食，合理轻食搭配
 */

export interface MealPlan {
  id: string;
  name: string;
  calorie: number;
  foods: {
    name: string;
    amount: string;
    calorie: number;
  }[];
  tips: string;
}

export interface DietSuggestion {
  time: 'breakfast' | 'lunch' | 'dinner';
  title: string;
  suggestions: string[];
  avoid: string[];
}

// 懒人减脂三餐模板
export const DIET_PLANS = {
  // 早餐模板（300-400千卡）
  breakfast: {
    name: '活力早餐',
    calorie: 350,
    template: [
      { food: '鸡蛋', amount: '1个', calorie: 72 },
      { food: '牛奶', amount: '250ml', calorie: 135 },
      { food: '全麦面包', amount: '2片', calorie: 120 },
      { food: '苹果', amount: '1个', calorie: 52 },
    ],
    tips: '优质蛋白+碳水+维生素，开启活力一天',
  },

  // 午餐模板（500-600千卡）
  lunch: {
    name: '轻食午餐',
    calorie: 550,
    template: [
      { food: '糙米饭', amount: '150g', calorie: 174 },
      { food: '鸡胸肉', amount: '150g', calorie: 200 },
      { food: '西兰花', amount: '200g', calorie: 54 },
      { food: '西红柿', amount: '1个', calorie: 30 },
    ],
    tips: '主食+蛋白+蔬菜，七分饱即可',
  },

  // 晚餐模板（400-500千卡）
  dinner: {
    name: '清淡晚餐',
    calorie: 450,
    template: [
      { food: '蔬菜沙拉', amount: '1份', calorie: 80 },
      { food: '蒸鱼', amount: '150g', calorie: 135 },
      { food: '豆腐', amount: '100g', calorie: 81 },
      { food: '紫菜汤', amount: '1碗', calorie: 22 },
    ],
    tips: '早点吃，多蔬菜少主食，睡前4小时不进食',
  },
};

// 低卡替代食谱
export const LOW_CALORIE_ALTERNATIVES: Record<string, { original: string; alternative: string; saveCalorie: number }[]> = {
  '主食替代': [
    { original: '白米饭', alternative: '糙米饭', saveCalorie: 20 },
    { original: '白米饭', alternative: '藜麦饭', saveCalorie: 30 },
    { original: '普通面条', alternative: '荞麦面', saveCalorie: 50 },
    { original: '白面包', alternative: '全麦面包', saveCalorie: 30 },
    { original: '油条', alternative: '燕麦粥', saveCalorie: 250 },
  ],
  '肉类替代': [
    { original: '五花肉', alternative: '鸡胸肉', saveCalorie: 250 },
    { original: '炸鸡', alternative: '蒸鸡胸', saveCalorie: 200 },
    { original: '红烧肉', alternative: '清蒸鱼', saveCalorie: 350 },
    { original: '香肠', alternative: '鸡胸肉肠', saveCalorie: 150 },
  ],
  '饮品替代': [
    { original: '奶茶', alternative: '柠檬水', saveCalorie: 200 },
    { original: '可乐', alternative: '苏打水', saveCalorie: 180 },
    { original: '果汁', alternative: '水果茶', saveCalorie: 100 },
    { original: '啤酒', alternative: '无糖苏打水', saveCalorie: 150 },
  ],
  '零食替代': [
    { original: '薯片', alternative: '海苔', saveCalorie: 350 },
    { original: '饼干', alternative: '坚果（适量）', saveCalorie: 200 },
    { original: '冰淇淋', alternative: '酸奶水果杯', saveCalorie: 150 },
    { original: '巧克力', alternative: '黑巧克力（适量）', saveCalorie: 200 },
  ],
};

// 根据目标生成每日推荐
export function getDailyRecommendation(targetCal: number, target: 'fat' | 'keep' | 'muscle') {
  if (target === 'fat') {
    return {
      total: targetCal,
      breakfast: Math.round(targetCal * 0.3),
      lunch: Math.round(targetCal * 0.4),
      dinner: Math.round(targetCal * 0.25),
      snack: Math.round(targetCal * 0.05),
    };
  } else if (target === 'muscle') {
    return {
      total: targetCal,
      breakfast: Math.round(targetCal * 0.3),
      lunch: Math.round(targetCal * 0.35),
      dinner: Math.round(targetCal * 0.25),
      snack: Math.round(targetCal * 0.1),
    };
  } else {
    return {
      total: targetCal,
      breakfast: Math.round(targetCal * 0.3),
      lunch: Math.round(targetCal * 0.4),
      dinner: Math.round(targetCal * 0.3),
    };
  }
}

// 智能饮食建议
export function getSmartDietSuggestion(currentCal: number, targetCal: number, time: 'breakfast' | 'lunch' | 'dinner') {
  const diff = currentCal - targetCal;
  const percentage = Math.round((currentCal / targetCal) * 100);

  if (time === 'breakfast') {
    if (percentage < 50) {
      return {
        status: '不足',
        suggestion: '早餐吃得有点少，建议加个鸡蛋或牛奶补充蛋白质',
        food: ['水煮蛋', '牛奶', '全麦面包', '坚果'],
      };
    } else if (percentage > 120) {
      return {
        status: '超标',
        suggestion: '早餐吃太多了，建议减少主食或高热量食物',
        food: ['蔬菜沙拉', '清汤'],
      };
    } else {
      return {
        status: '合适',
        suggestion: '早餐搭配合理，继续保持！',
        food: [],
      };
    }
  } else if (time === 'lunch') {
    if (percentage < 50) {
      return {
        status: '不足',
        suggestion: '午餐吃得较少，下午可能会饿，建议加个水果',
        food: ['苹果', '香蕉', '酸奶'],
      };
    } else if (percentage > 130) {
      return {
        status: '超标',
        suggestion: '午餐吃太多了！建议：1.少油少盐 2.多蔬菜 3.饭后散步',
        food: ['普洱茶', '山楂茶'],
      };
    } else {
      return {
        status: '合适',
        suggestion: '午餐控制得不错！建议晚饭早点吃，减少主食',
        food: [],
      };
    }
  } else {
    // dinner
    if (percentage < 50) {
      return {
        status: '不足',
        suggestion: '晚餐有点少，可以喝杯牛奶或吃些蔬菜',
        food: ['牛奶', '小番茄', '黄瓜'],
      };
    } else if (percentage > 120) {
      return {
        status: '超标',
        suggestion: '晚餐吃太多了！明天建议：1.早点吃（19点前）2.多蔬菜 3.少主食',
        food: ['普洱茶', '消食片'],
      };
    } else {
      return {
        status: '合适',
        suggestion: '晚餐搭配合理！建议睡前4小时不要进食',
        food: [],
      };
    }
  }
}

export interface ExerciseTip {
  emoji: string;
  text: string;
}

export interface MealAfterSuggestion {
  status: '不足' | '超标' | '合适';
  suggestion: string;
  food: string[];
  exercise: ExerciseTip[];
}

// 进食后建议：根据当前餐次和热量，推荐下一餐吃什么 + 运动建议
export function getMealAfterSuggestion(currentCal: number, targetCal: number, currentMeal: 'breakfast' | 'lunch' | 'dinner' | 'snack'): MealAfterSuggestion {
  const remaining = targetCal - currentCal;
  const percentage = Math.round((currentCal / targetCal) * 100);

  // 早餐吃完 → 推荐午餐
  if (currentMeal === 'breakfast') {
    if (percentage > 120) {
      return {
        status: '超标',
        suggestion: '早餐吃太多了！建议午餐选择清淡低卡的食物，控制全天热量不超标',
        food: ['蔬菜沙拉', '清蒸鱼', '豆腐', '紫菜汤'],
        exercise: [
          { emoji: '', text: '上午适当走动，促进消化' },
          { emoji: '🪜', text: '尽量走楼梯代替电梯' },
          { emoji: '🧹', text: '做点家务活动身体' },
        ],
      };
    } else if (percentage < 30) {
      return {
        status: '不足',
        suggestion: '早餐吃得有点少，午餐可以适当多吃点，补充蛋白质和优质碳水',
        food: ['鸡胸肉', '糙米饭', '西兰花', '鸡蛋', '牛奶'],
        exercise: [
          { emoji: '🚶', text: '午餐后散步15分钟' },
        ],
      };
    } else {
      return {
        status: '合适',
        suggestion: '早餐搭配合理！午餐建议：优质蛋白+蔬菜+适量主食，七分饱即可',
        food: ['鸡胸肉', '西兰花', '糙米饭', '番茄'],
        exercise: [
          { emoji: '🚶', text: '午餐后散步15分钟' },
        ],
      };
    }
  }

  // 午餐吃完 → 推荐晚餐
  if (currentMeal === 'lunch') {
    if (percentage > 130) {
      return {
        status: '超标',
        suggestion: '午餐吃太多了！建议晚餐以蔬菜为主，减少主食摄入，或者考虑不吃晚餐',
        food: ['蔬菜沙拉', '黄瓜', '小番茄', '清汤'],
        exercise: [
          { emoji: '🚶', text: '下午多走路，少坐多站' },
          { emoji: '🪜', text: '爬楼梯代替坐电梯' },
          { emoji: '🧹', text: '做家务消耗热量' },
          { emoji: '🏃', text: '傍晚慢跑或快走30分钟' },
        ],
      };
    } else if (percentage < 40) {
      return {
        status: '不足',
        suggestion: '目前摄入偏少，晚餐可以正常吃，注意营养均衡',
        food: ['蒸鱼', '蔬菜', '豆腐', '杂粮饭'],
        exercise: [
          { emoji: '🚶', text: '晚餐后散步20分钟' },
        ],
      };
    } else {
      return {
        status: '合适',
        suggestion: '目前热量控制得不错！晚餐建议早点吃（19点前），以蔬菜和蛋白质为主',
        food: ['蒸鱼', '蔬菜沙拉', '豆腐', '紫菜汤'],
        exercise: [
          { emoji: '🚶', text: '晚餐后散步20分钟' },
        ],
      };
    }
  }

  // 晚餐吃完 → 不再推荐食物，只推荐运动
  if (currentMeal === 'dinner') {
    if (percentage > 120) {
      return {
        status: '超标',
        suggestion: '今天热量超标了，建议增加运动量消耗多余热量，明天注意控制饮食',
        food: [],
        exercise: [
          { emoji: '', text: '饭后散步30分钟' },
          { emoji: '🪜', text: '多做家务活动' },
          { emoji: '🏃', text: '慢跑或快走20分钟' },
        ],
      };
    } else {
      return {
        status: '合适',
        suggestion: '今天热量控制得很好！建议饭后适当活动，帮助消化',
        food: [],
        exercise: [
          { emoji: '🚶', text: '饭后散步15分钟' },
          { emoji: '', text: '睡前做简单的拉伸放松' },
        ],
      };
    }
  }

  // 加餐吃完 → 推荐晚餐
  if (currentMeal === 'snack') {
    if (percentage > 130) {
      return {
        status: '超标',
        suggestion: '加餐吃太多了！建议晚餐尽量少吃，以蔬菜为主',
        food: ['黄瓜', '小番茄', '蔬菜汤'],
        exercise: [
          { emoji: '🚶', text: '多走路消耗热量' },
          { emoji: '🪜', text: '做点家务活动' },
        ],
      };
    } else {
      return {
        status: '合适',
        suggestion: '加餐适量，晚餐正常吃，注意清淡为主',
        food: ['蒸鱼', '蔬菜', '豆腐'],
        exercise: [
          { emoji: '', text: '晚餐后散步20分钟' },
        ],
      };
    }
  }

  return {
    status: '合适',
    suggestion: '继续保持健康的饮食习惯！',
    food: [],
    exercise: [
      { emoji: '🚶', text: '饭后适当散步' },
    ],
  };
}

// 获取生活化运动建议（不用特意运动）
export function getDailyLifeExerciseTips(currentCal: number, targetCal: number) {
  const diff = currentCal - targetCal;

  if (diff > 300) {
    return [
      '今天热量超标较多，建议：',
      '1. 多走路：下班提前一站下车，走路回家',
      '2. 多站立：看电视时站起来活动',
      '3. 做家务：拖地、洗碗都是好运动',
      '4. 爬楼梯：少坐电梯，多爬楼梯',
    ];
  } else if (diff > 100) {
    return [
      '今天稍微超标，可以这样抵消：',
      '1. 散步30分钟（约150千卡）',
      '2. 站立工作1小时（约50千卡）',
      '3. 快走15分钟（约100千卡）',
    ];
  } else if (diff < -200) {
    return [
      '今天摄入偏少，适合轻松运动：',
      '1. 散步20分钟（约80千卡）',
      '2. 拉伸放松10分钟',
      '3. 瑜伽舒缓练习',
    ];
  } else {
    return [
      '今天热量控制得很好！',
      '1. 散步15分钟帮助消化',
      '2. 简单拉伸放松身体',
    ];
  }
}
