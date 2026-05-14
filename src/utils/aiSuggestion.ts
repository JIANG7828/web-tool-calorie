/**
 * AI 饮食建议服务 - 通义千问版
 * 根据用户上一餐记录和身体数据，通过通义千问 AI 生成下一餐的个性化建议
 */

import { callTongyi, parseAIResponse, TongyiMessage } from './tongyiService';

export interface AISuggestion {
  suggestion: string;
  nextMealRecommendation: string;
  recommendedFoods: string[];
  exerciseTips: string[];
}

export interface MealHistory {
  mealType: string;
  foods: { name: string; calorie: number }[];
  totalCalorie: number;
  time: string;
}

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: string;
  target: 'fat' | 'keep' | 'muscle';
  targetCal: number;
  currentCal: number;
  todayExerciseCal: number;
}

export interface RecommendedRecipe {
  id: string;
  name: string;
  calorie: number;
  protein: number;
  fat: number;
  carbs: number;
  category: string;
  reason: string;
  method?: string;
}

export interface AIRecipeRecommendation {
  recipes: RecommendedRecipe[];
  analysis: string;
}

interface AIRecipeResponse {
  analysis: string;
  recipes: Array<{
    name: string;
    calorie: number;
    protein: number;
    fat: number;
    carbs: number;
    category: string;
    reason: string;
  }>;
}

interface AISuggestionResponse {
  suggestion: string;
  nextMealRecommendation: string;
  recommendedFoods: string[];
  exerciseTips: string[];
}

/**
 * AI 智能菜谱推荐 - 通义千问版
 * 根据用户目标、今日进食记录、剩余热量，动态推荐最合适的菜谱
 */
export async function generateRecipeRecommendations(
  todayRecords: any[],
  profile: UserProfile,
  allRecipes: any[]
): Promise<AIRecipeRecommendation> {
  const { target, targetCal, currentCal } = profile;
  const remaining = targetCal - currentCal;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecordsFiltered = todayRecords.filter(r => r.date === todayStr);
  
  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  let lastMealType = 'breakfast';
  for (const meal of mealOrder) {
    const mealRecords = todayRecordsFiltered.filter(r => r.mealType === meal);
    if (mealRecords.length > 0) {
      lastMealType = meal;
    }
  }
  
  const todayTotalProtein = todayRecordsFiltered.reduce((sum, r) => sum + (r.macro?.protein || 0), 0);
  const todayTotalFat = todayRecordsFiltered.reduce((sum, r) => sum + (r.macro?.fat || 0), 0);
  const todayTotalCarbs = todayRecordsFiltered.reduce((sum, r) => sum + (r.macro?.carbs || 0), 0);
  
  const todayFoodNames = todayRecordsFiltered.map(r => r.name.toLowerCase());
  
  const mealTypeLabels: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐',
  };
  
  const targetLabels: Record<string, string> = {
    fat: '减脂',
    keep: '维持体重',
    muscle: '增肌',
  };
  
  const systemPrompt: TongyiMessage = {
    role: 'system',
    content: `你是一个专业的营养师 AI 助手。请根据用户的身体数据、运动目标、今日进食记录和剩余热量，推荐最适合的菜谱。请严格按照 JSON 格式返回，不要添加任何其他内容。返回格式：
{
  "analysis": "对用户今日饮食情况的简短分析（50字以内）",
  "recipes": [
    {
      "name": "菜谱名称",
      "calorie": 热量(千卡),
      "protein": 蛋白质(克),
      "fat": 脂肪(克),
      "carbs": 碳水(克),
      "category": "分类(蛋白质/蔬菜/主食/汤类)",
      "reason": "推荐理由(20字以内)"
    }
  ]
}
要求：
1. 推荐 5-8 道菜谱
2. 每道菜的热量不超过剩余热量的 40%
3. 根据用户目标调整推荐（减脂推荐低卡高蛋白，增肌推荐高蛋白）
4. 如果用户今日蛋白质或蔬菜摄入不足，优先推荐相关菜谱
5. 菜谱名称要具体，如"香煎鸡胸肉配西兰花"而不是"鸡胸肉"
6. 所有数值必须是数字类型`
  };

  const userPrompt: TongyiMessage = {
    role: 'user',
    content: `用户信息：
- 目标：${targetLabels[target]}
- 每日目标热量：${targetCal} 千卡
- 今日已摄入：${currentCal} 千卡
- 剩余可摄入：${remaining} 千卡
- 身高：${profile.height}cm
- 体重：${profile.weight}kg
- 年龄：${profile.age}岁
- 性别：${profile.gender === 'male' ? '男' : '女'}
- 今日运动消耗：${profile.todayExerciseCal} 千卡

今日已进食记录（截至${mealTypeLabels[lastMealType] || '当前'}）：
${todayRecordsFiltered.map(r => `- ${r.name}: ${r.calorie}千卡 (蛋白质${r.macro?.protein || 0}g, 脂肪${r.macro?.fat || 0}g, 碳水${r.macro?.carbs || 0}g)`).join('\n') || '暂无记录'}

今日营养总计：
- 蛋白质：${todayTotalProtein.toFixed(1)}g
- 脂肪：${todayTotalFat.toFixed(1)}g
- 碳水：${todayTotalCarbs.toFixed(1)}g

请根据以上信息，推荐最适合的菜谱。`
  };

  try {
    const response = await callTongyi([systemPrompt, userPrompt]);
    const parsed = parseAIResponse<AIRecipeResponse>(response);
    
    if (parsed && parsed.recipes && parsed.recipes.length > 0) {
      const recommendations: RecommendedRecipe[] = parsed.recipes.map((recipe, index) => ({
        id: `ai-${Date.now()}-${index}`,
        name: recipe.name,
        calorie: recipe.calorie,
        protein: recipe.protein,
        fat: recipe.fat,
        carbs: recipe.carbs,
        category: recipe.category,
        reason: recipe.reason,
      }));
      
      return {
        recipes: recommendations,
        analysis: parsed.analysis || 'AI 分析中...',
      };
    }
  } catch (error) {
    // 静默失败，使用本地推荐
  }
  
  // 降级到规则引擎
  return fallbackRuleBasedRecommendation(todayRecordsFiltered, profile, allRecipes);
}

/**
 * 规则引擎降级方案
 */
function fallbackRuleBasedRecommendation(
  todayRecordsFiltered: any[],
  profile: UserProfile,
  allRecipes: any[]
): AIRecipeRecommendation {
  const { target, targetCal, currentCal } = profile;
  const remaining = targetCal - currentCal;
  
  const todayTotalProtein = todayRecordsFiltered.reduce((sum, r) => sum + (r.macro?.protein || 0), 0);
  const todayTotalFat = todayRecordsFiltered.reduce((sum, r) => sum + (r.macro?.fat || 0), 0);
  const todayTotalCarbs = todayRecordsFiltered.reduce((sum, r) => sum + (r.macro?.carbs || 0), 0);
  
  const todayFoodNames = todayRecordsFiltered.map(r => r.name.toLowerCase());
  const proteinFoods = ['鸡胸肉', '牛肉', '鱼', '虾', '鸡蛋', '豆腐', '牛奶', '酸奶'];
  const vegFoods = ['西兰花', '菠菜', '生菜', '西红柿', '黄瓜', '胡萝卜', '白菜', '蔬菜'];
  
  const hasProteinToday = todayFoodNames.some(n => proteinFoods.some(p => n.includes(p)));
  const hasVegToday = todayFoodNames.some(n => vegFoods.some(v => n.includes(v)));
  
  let analysis = `今日已摄入 ${currentCal} 千卡，剩余 ${remaining} 千卡。`;
  if (!hasProteinToday) analysis += ' 蛋白质摄入不足。';
  if (!hasVegToday) analysis += ' 蔬菜摄入不足。';
  
  const filteredRecipes = allRecipes
    .filter(r => r.calorie <= remaining + 50 && r.suitableTarget?.includes(target))
    .sort((a, b) => Math.abs(a.calorie - remaining * 0.3) - Math.abs(b.calorie - remaining * 0.3))
    .slice(0, 8);
  
  const recommendations: RecommendedRecipe[] = filteredRecipes.map(recipe => {
    let reason = '';
    if (!hasProteinToday && ['蛋白质'].includes(recipe.category)) {
      reason = '今日蛋白质不足，优先补充';
    } else if (!hasVegToday && ['蔬菜'].includes(recipe.category)) {
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
      reason,
    };
  });
  
  return { recipes: recommendations, analysis };
}

/**
 * 根据上一餐记录和用户资料，生成下一餐的 AI 建议 - 通义千问版
 */
export async function generateMealSuggestion(
  mealHistory: MealHistory,
  profile: UserProfile
): Promise<AISuggestion> {
  const { mealType, totalCalorie, foods } = mealHistory;
  const { target, targetCal, currentCal, todayExerciseCal } = profile;
  const remaining = targetCal - currentCal;
  
  const mealTypeLabels: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐',
  };
  
  const targetLabels: Record<string, string> = {
    fat: '减脂',
    keep: '维持体重',
    muscle: '增肌',
  };
  
  const currentMealLabel = mealTypeLabels[mealType] || mealType;
  const nextMealLabel = getNextMealLabel(mealType);
  
  const systemPrompt: TongyiMessage = {
    role: 'system',
    content: `你是一个专业的营养师 AI 助手。请根据用户上一餐的进食情况和身体数据，给出专业的饮食建议和下一餐推荐。请严格按照 JSON 格式返回，不要添加任何其他内容。返回格式：
{
  "suggestion": "对上一餐的评价（30字以内）",
  "nextMealRecommendation": "下一餐的详细建议（50字以内）",
  "recommendedFoods": ["推荐食物1", "推荐食物2", "推荐食物3", "推荐食物4", "推荐食物5"],
  "exerciseTips": ["运动建议1", "运动建议2"]
}
要求：
1. 建议要具体、实用、有针对性
2. 考虑用户的目标（减脂/维持/增肌）和剩余热量
3. 推荐食物要具体，如"香煎鸡胸肉"而不是"肉类"
4. 运动建议要简单可行`
  };

  const userPrompt: TongyiMessage = {
    role: 'user',
    content: `用户信息：
- 目标：${targetLabels[target]}
- 每日目标热量：${targetCal} 千卡
- 今日已摄入：${currentCal} 千卡
- 剩余可摄入：${remaining} 千卡
- 身高：${profile.height}cm
- 体重：${profile.weight}kg
- 年龄：${profile.age}岁
- 性别：${profile.gender === 'male' ? '男' : '女'}
- 今日运动消耗：${todayExerciseCal} 千卡

上一餐（${currentMealLabel}）记录：
- 总热量：${totalCalorie} 千卡
- 食物：${foods.map(f => `${f.name}(${f.calorie}千卡)`).join('、') || '无'}

请根据以上信息，给出专业的饮食建议，并推荐下一餐（${nextMealLabel || '今日已结束'}）的饮食方案。`
  };

  try {
    const response = await callTongyi([systemPrompt, userPrompt]);
    const parsed = parseAIResponse<AISuggestionResponse>(response);
    
    if (parsed) {
      return {
        suggestion: parsed.suggestion || '',
        nextMealRecommendation: parsed.nextMealRecommendation || '',
        recommendedFoods: parsed.recommendedFoods || [],
        exerciseTips: parsed.exerciseTips || [],
      };
    }
  } catch (error) {
    // 静默失败
  }
  
  // 降级到规则引擎
  return fallbackRuleBasedSuggestion(mealHistory, profile);
}

/**
 * 规则引擎降级方案
 */
function fallbackRuleBasedSuggestion(
  mealHistory: MealHistory,
  profile: UserProfile
): AISuggestion {
  const { mealType, totalCalorie, foods } = mealHistory;
  const { target, targetCal, currentCal, todayExerciseCal } = profile;
  const remaining = targetCal - currentCal;
  const isLow = totalCalorie < 300;
  const isHigh = totalCalorie > 500;
  const isBalanced = !isLow && !isHigh;

  const proteinFoods = foods.filter(f => 
    ['鸡胸肉', '牛肉', '鱼', '虾', '鸡蛋', '豆腐', '牛奶', '酸奶'].includes(f.name)
  );
  const hasProtein = proteinFoods.length > 0;

  const vegFoods = foods.filter(f => 
    ['西兰花', '菠菜', '生菜', '西红柿', '黄瓜', '胡萝卜', '白菜', '蔬菜沙拉'].includes(f.name)
  );
  const hasVeg = vegFoods.length > 0;

  const carbFoods = foods.filter(f => 
    ['米饭', '面条', '馒头', '面包', '粥', '红薯', '玉米'].includes(f.name)
  );
  const hasCarb = carbFoods.length > 0;

  const nextMeal = getNextMealLabel(mealType);
  const nextMealTarget = getNextMealTarget(targetCal, target, nextMeal);

  let suggestion = '';
  let nextMealRecommendation = '';
  let recommendedFoods: string[] = [];
  let exerciseTips: string[] = [];

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
      nextMealRecommendation = `午餐热量余量较少（剩余${remaining}千卡），建议选择清淡低卡的食物，以蔬菜和蛋白质为主，减少主食摄入。`;
      recommendedFoods = ['蔬菜沙拉', '清蒸鱼', '豆腐', '黄瓜', '小番茄'];
      exerciseTips = ['上午适当走动促进消化', '饭后散步15分钟'];
    } else {
      nextMealRecommendation = `午餐热量余量充足（剩余${remaining}千卡），建议：优质蛋白+蔬菜+适量主食，七分饱即可。`;
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
      nextMealRecommendation = `目前热量余量较少（剩余${remaining}千卡），晚餐建议以蔬菜为主，减少主食，或者考虑轻食。`;
      recommendedFoods = ['蔬菜沙拉', '黄瓜', '小番茄', '清汤'];
      exerciseTips = ['下午多走路少坐多站', '晚餐后散步20分钟'];
    } else {
      nextMealRecommendation = `目前热量余量充足（剩余${remaining}千卡），晚餐建议19点前吃，以蔬菜和蛋白质为主，主食减半。`;
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

  return { suggestion, nextMealRecommendation, recommendedFoods, exerciseTips };
}

function getNextMealLabel(mealType: string): string {
  switch (mealType) {
    case 'breakfast': return '午餐';
    case 'lunch': return '晚餐';
    case 'dinner':
    case 'snack': return '';
    default: return '';
  }
}

function getNextMealTarget(targetCal: number, target: string, nextMeal: string): number {
  if (nextMeal === '午餐') {
    return Math.round(targetCal * 0.4);
  } else if (nextMeal === '晚餐') {
    return Math.round(targetCal * 0.25);
  }
  return 0;
}

/**
 * 获取上一餐记录摘要
 */
export function getLastMealSummary(records: any[]): MealHistory {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === todayStr);
  
  if (todayRecords.length === 0) {
    return {
      mealType: 'breakfast',
      foods: [],
      totalCalorie: 0,
      time: '',
    };
  }

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  let lastMealType = 'breakfast';
  let lastMealTime = '';
  
  for (const meal of mealOrder) {
    const mealRecords = todayRecords.filter(r => r.mealType === meal);
    if (mealRecords.length > 0) {
      lastMealType = meal;
      const latest = mealRecords[mealRecords.length - 1];
      lastMealTime = latest.time;
    }
  }

  const mealRecords = todayRecords.filter(r => r.mealType === lastMealType);
  const foods = mealRecords.map(r => ({ name: r.name, calorie: r.calorie }));
  const totalCalorie = foods.reduce((sum, f) => sum + f.calorie, 0);

  return {
    mealType: lastMealType,
    foods,
    totalCalorie,
    time: lastMealTime,
  };
}
