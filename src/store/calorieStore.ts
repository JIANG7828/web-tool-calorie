import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MemberLevel } from '../utils/memberPlans';
import { calculateStreak, calculateAchievementStats, AchievementStats } from '../utils/checkInSystem';

export interface MacroNutrients {
  protein: number;
  fat: number;
  carbs: number;
}

export interface FoodRecord {
  id: string;
  name: string;
  calorie: number;
  time: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  macro?: MacroNutrients;
  timestamp: number;
}

export interface UserSettings {
  nickname: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  targetWeight?: number;
  target: 'fat' | 'keep' | 'muscle';
  activityLevel: number;
  startDate?: string;
  dailyBudget?: number;
  targetSetDate?: string;
  targetAchievementDate?: string;
}

export interface ExerciseRecord {
  id: string;
  name: string;
  met: number;
  duration: number;
  calorie: number;
  date: string;
}

export interface CheckInRecord {
  id: string;
  date: string;
  completed: boolean;
  calorie: number;
  target: number;
  exerciseCal?: number;
  waterCount?: number;
  waterTarget?: number;
  exerciseTarget?: number;
}

export interface WeightRecord {
  id: string;
  date: string;
  time: string;
  weight: number;
}

export interface CalorieState {
  userSettings: UserSettings;
  allFoodRecords: FoodRecord[];
  allExerciseRecords: ExerciseRecord[];
  checkIns: CheckInRecord[];
  weightRecords: WeightRecord[];
  waterRecords: { date: string; count: number }[];
  todayWaterCount: number;
}

export interface CalorieStore extends CalorieState {
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  addFoodRecord: (record: FoodRecord) => void;
  removeFoodRecord: (id: string) => void;
  addExerciseRecord: (record: ExerciseRecord) => void;
  removeExerciseRecord: (id: string) => void;
  addCheckIn: (record: CheckInRecord) => void;
  updateCheckIn: (id: string, updates: Partial<CheckInRecord>) => void;
  removeCheckIn: (id: string) => void;
  addWeightRecord: (weight: number) => void;
  removeWeightRecord: (id: string) => void;
  resetTodayRecords: () => void;
  incrementWater: () => void;
  resetWater: () => void;
  addWater: () => void;
  getRecordsByDate: (date: string) => FoodRecord[];
  getExercisesByDate: (date: string) => ExerciseRecord[];
  getWaterCountByDate: (date: string) => number;
  setWaterCountByDate: (date: string, count: number) => void;
  getTodayTotalCalories: () => number;
  getTodayExerciseCalories: () => number;
  getTodayMacros: () => MacroNutrients;
  getAchievementStats: () => AchievementStats[];
  getMealTypeLabel: (type: string) => string;
  isMealRecorded: (type: string) => boolean;
  getInitialWeight: () => number | undefined;
  evaluateLastMeal: () => any;
  canShowAd: () => boolean;
  recordAdView: () => void;
  memberLevel: 'free' | 'pro' | 'premium';
  upgradeMember: (level: 'free' | 'pro' | 'premium') => void;
  resetAllData: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  nickname: '用户',
  gender: 'female',
  age: 25,
  height: 160,
  weight: 55,
  target: 'fat',
  activityLevel: 1.2,
};

function getStoreName(): string {
  try {
    const data = localStorage.getItem('health_app_current_user');
    if (data) {
      const user = JSON.parse(data);
      return `calorie-store-${user.id}`;
    }
  } catch {}
  return 'calorie-store-default';
}

const defaultState: CalorieState = {
  userSettings: DEFAULT_SETTINGS,
  allFoodRecords: [],
  allExerciseRecords: [],
  checkIns: [],
  weightRecords: [],
  waterRecords: [],
  todayWaterCount: 0,
};

export const useCalorieStore = create<CalorieStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      updateUserSettings: (settings: Partial<UserSettings>) => {
        set((state) => ({
          userSettings: { ...state.userSettings, ...settings },
        }));
      },

      addFoodRecord: (record: FoodRecord) => {
        set((state) => {
          const newRecords = [...state.allFoodRecords, record];
          const today = record.date;
          const dayCal = newRecords
            .filter((r) => r.date === today)
            .reduce((sum, r) => sum + r.calorie, 0);
          const dayExercise = state.allExerciseRecords
            .filter((r) => r.date === today)
            .reduce((sum, r) => sum + r.calorie, 0);
          const dayWater = state.waterRecords.find((r) => r.date === today)?.count || 0;
          const weight = state.userSettings.weight || 55;
          const activityLevel = state.userSettings.activityLevel || 1.2;
          const bmr = weight * 22;
          const tdee = bmr * activityLevel;
          let targetCal = Math.round(tdee);
          if (state.userSettings.target === 'fat') targetCal = Math.round(tdee - 400);
          else if (state.userSettings.target === 'muscle') targetCal = Math.round(tdee + 300);

          const existingIdx = state.checkIns.findIndex((c) => c.date === today);
          const checkInData: CheckInRecord = {
            id: existingIdx >= 0 ? state.checkIns[existingIdx].id : Date.now().toString(),
            date: today,
            completed: true,
            calorie: dayCal,
            target: targetCal,
            exerciseCal: dayExercise,
            waterCount: dayWater,
            waterTarget: 8,
            exerciseTarget: 300,
          };

          let newCheckIns = [...state.checkIns];
          if (existingIdx >= 0) {
            newCheckIns[existingIdx] = checkInData;
          } else {
            newCheckIns = [checkInData, ...newCheckIns];
          }

          return {
            allFoodRecords: newRecords,
            checkIns: newCheckIns,
          };
        });
      },

      removeFoodRecord: (id: string) => {
        set((state) => ({
          allFoodRecords: state.allFoodRecords.filter((r) => r.id !== id),
        }));
      },

      addExerciseRecord: (record: ExerciseRecord) => {
        set((state) => {
          const newRecords = [...state.allExerciseRecords, record];
          const today = record.date;
          const dayCal = state.allFoodRecords
            .filter((r) => r.date === today)
            .reduce((sum, r) => sum + r.calorie, 0);
          const dayExercise = newRecords
            .filter((r) => r.date === today)
            .reduce((sum, r) => sum + r.calorie, 0);
          const dayWater = state.waterRecords.find((r) => r.date === today)?.count || 0;
          const weight = state.userSettings.weight || 55;
          const activityLevel = state.userSettings.activityLevel || 1.2;
          const bmr = weight * 22;
          const tdee = bmr * activityLevel;
          let targetCal = Math.round(tdee);
          if (state.userSettings.target === 'fat') targetCal = Math.round(tdee - 400);
          else if (state.userSettings.target === 'muscle') targetCal = Math.round(tdee + 300);

          const existingIdx = state.checkIns.findIndex((c) => c.date === today);
          const checkInData: CheckInRecord = {
            id: existingIdx >= 0 ? state.checkIns[existingIdx].id : Date.now().toString(),
            date: today,
            completed: true,
            calorie: dayCal,
            target: targetCal,
            exerciseCal: dayExercise,
            waterCount: dayWater,
            waterTarget: 8,
            exerciseTarget: 300,
          };

          let newCheckIns = [...state.checkIns];
          if (existingIdx >= 0) {
            newCheckIns[existingIdx] = checkInData;
          } else {
            newCheckIns = [checkInData, ...newCheckIns];
          }

          return {
            allExerciseRecords: newRecords,
            checkIns: newCheckIns,
          };
        });
      },

      removeExerciseRecord: (id: string) => {
        set((state) => ({
          allExerciseRecords: state.allExerciseRecords.filter((r) => r.id !== id),
        }));
      },

      addCheckIn: (record: CheckInRecord) => {
        set((state) => ({
          checkIns: [record, ...state.checkIns],
        }));
      },

      updateCheckIn: (id: string, updates: Partial<CheckInRecord>) => {
        set((state) => ({
          checkIns: state.checkIns.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      removeCheckIn: (id: string) => {
        set((state) => ({
          checkIns: state.checkIns.filter((c) => c.id !== id),
        }));
      },

      addWeightRecord: (weight: number) => {
        const now = new Date();
        const record: WeightRecord = {
          id: Date.now().toString(),
          date: now.toISOString().split('T')[0],
          time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          weight,
        };
        set((state) => ({
          weightRecords: [record, ...state.weightRecords],
          userSettings: { ...state.userSettings, weight },
        }));
      },

      removeWeightRecord: (id: string) => {
        set((state) => ({
          weightRecords: state.weightRecords.filter((r) => r.id !== id),
        }));
      },

      resetTodayRecords: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          allFoodRecords: state.allFoodRecords.filter((r) => r.date !== today),
          allExerciseRecords: state.allExerciseRecords.filter((r) => r.date !== today),
        }));
      },

      incrementWater: () => {
        set((state) => ({ todayWaterCount: state.todayWaterCount + 1 }));
      },

      resetWater: () => {
        set({ todayWaterCount: 0 });
      },

      getRecordsByDate: (date: string) => {
        return get().allFoodRecords.filter((r) => r.date === date);
      },

      getExercisesByDate: (date: string) => {
        return get().allExerciseRecords.filter((r) => r.date === date);
      },

      getWaterCountByDate: (date: string) => {
        const record = get().waterRecords.find((r) => r.date === date);
        return record?.count || 0;
      },

      setWaterCountByDate: (date: string, count: number) => {
        set((state) => {
          const existing = state.waterRecords.findIndex((r) => r.date === date);
          if (existing >= 0) {
            const newRecords = [...state.waterRecords];
            newRecords[existing] = { date, count };
            return { waterRecords: newRecords };
          }
          return { waterRecords: [...state.waterRecords, { date, count }] };
        });
      },

      getTodayTotalCalories: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().allFoodRecords
          .filter((r) => r.date === today)
          .reduce((sum, r) => sum + r.calorie, 0);
      },

      getTodayExerciseCalories: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().allExerciseRecords
          .filter((r) => r.date === today)
          .reduce((sum, r) => sum + r.calorie, 0);
      },

      getTodayMacros: () => {
        const today = new Date().toISOString().split('T')[0];
        const macros = { protein: 0, fat: 0, carbs: 0 };
        get().allFoodRecords
          .filter((r) => r.date === today)
          .forEach((r) => {
            if (r.macro) {
              macros.protein += r.macro.protein;
              macros.fat += r.macro.fat;
              macros.carbs += r.macro.carbs;
            }
          });
        return macros;
      },

      getAchievementStats: () => {
        const { checkIns } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        return calculateAchievementStats(checkIns, startDate);
      },

      getMealTypeLabel: (type: string) => {
        const labels: Record<string, string> = {
          breakfast: '早餐',
          lunch: '午餐',
          dinner: '晚餐',
          snack: '加餐',
        };
        return labels[type] || type;
      },

      isMealRecorded: (type: string) => {
        const today = new Date().toISOString().split('T')[0];
        return get().allFoodRecords.some((r) => r.date === today && r.mealType === type);
      },

      getInitialWeight: () => {
        const { weightRecords, userSettings } = get();
        if (weightRecords.length > 0) {
          return weightRecords[weightRecords.length - 1].weight;
        }
        return userSettings.weight;
      },

      addWater: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const newCount = state.todayWaterCount + 1;
          const existing = state.waterRecords.findIndex((r) => r.date === today);
          let newWaterRecords = [...state.waterRecords];
          if (existing >= 0) {
            newWaterRecords[existing] = { date: today, count: newCount };
          } else {
            newWaterRecords = [...newWaterRecords, { date: today, count: newCount }];
          }

          const dayCal = state.allFoodRecords
            .filter((r) => r.date === today)
            .reduce((sum, r) => sum + r.calorie, 0);
          const dayExercise = state.allExerciseRecords
            .filter((r) => r.date === today)
            .reduce((sum, r) => sum + r.calorie, 0);
          const weight = state.userSettings.weight || 55;
          const activityLevel = state.userSettings.activityLevel || 1.2;
          const bmr = weight * 22;
          const tdee = bmr * activityLevel;
          let targetCal = Math.round(tdee);
          if (state.userSettings.target === 'fat') targetCal = Math.round(tdee - 400);
          else if (state.userSettings.target === 'muscle') targetCal = Math.round(tdee + 300);

          const existingIdx = state.checkIns.findIndex((c) => c.date === today);
          const checkInData: CheckInRecord = {
            id: existingIdx >= 0 ? state.checkIns[existingIdx].id : Date.now().toString(),
            date: today,
            completed: true,
            calorie: dayCal,
            target: targetCal,
            exerciseCal: dayExercise,
            waterCount: newCount,
            waterTarget: 8,
            exerciseTarget: 300,
          };

          let newCheckIns = [...state.checkIns];
          if (existingIdx >= 0) {
            newCheckIns[existingIdx] = checkInData;
          } else {
            newCheckIns = [checkInData, ...newCheckIns];
          }

          return {
            todayWaterCount: newCount,
            waterRecords: newWaterRecords,
            checkIns: newCheckIns,
          };
        });
      },

      evaluateLastMeal: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayRecords = get().allFoodRecords.filter((r) => r.date === today);
        if (todayRecords.length === 0) {
          return null;
        }
        const lastMeal = [...todayRecords].sort((a, b) => b.timestamp - a.timestamp)[0];
        const totalCal = todayRecords.reduce((s, r) => s + r.calorie, 0);
        const totalProtein = todayRecords.reduce((s, r) => s + (r.macro?.protein || 0), 0);
        const totalFat = todayRecords.reduce((s, r) => s + (r.macro?.fat || 0), 0);
        const totalCarbs = todayRecords.reduce((s, r) => s + (r.macro?.carbs || 0), 0);
        const totalMacro = totalProtein + totalFat + totalCarbs;
        const settings = get().userSettings;
        const targetCal = get().checkIns.find((c) => c.date === today)?.target || 1400;
        
        let rating = '一般';
        if (totalCal <= targetCal * 1.1 && totalCal >= targetCal * 0.8) {
          rating = '优秀';
        } else if (totalCal > targetCal * 1.3) {
          rating = '超标';
        } else if (totalCal < targetCal * 0.5) {
          rating = '过少';
        } else if (totalCal <= targetCal * 1.2) {
          rating = '良好';
        }

        return {
          rating,
          calories: totalCal,
          macros: {
            protein: totalProtein,
            fat: totalFat,
            carbs: totalCarbs,
            percentage: {
              protein: totalMacro > 0 ? Math.round((totalProtein / totalMacro) * 100) : 0,
              fat: totalMacro > 0 ? Math.round((totalFat / totalMacro) * 100) : 0,
              carbs: totalMacro > 0 ? Math.round((totalCarbs / totalMacro) * 100) : 0,
            },
          },
          pros: ['饮食记录完整', '营养搭配合理'],
          cons: totalCal > targetCal ? ['热量摄入偏高'] : [],
          suggestions: [lastMeal.mealType === 'dinner' ? '晚餐适量，注意控制' : '继续保持健康饮食'],
          mealType: lastMeal.mealType,
        };
      },

      canShowAd: () => {
        return false;
      },

      recordAdView: () => {
      },

      memberLevel: 'free',

      upgradeMember: (level: 'free' | 'pro' | 'premium') => {
        set({ memberLevel: level });
      },

      resetAllData: () => {
        set(defaultState);
      },
    }),
    {
      name: getStoreName(),
    }
  )
);
