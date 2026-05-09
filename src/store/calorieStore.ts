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
  todayRecords: FoodRecord[];
  todayExercises: ExerciseRecord[];
  checkIns: CheckInRecord[];
  weightRecords: WeightRecord[];
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
  getTodayTotalCalories: () => number;
  getTodayExerciseCalories: () => number;
  getTodayMacros: () => MacroNutrients;
  getAchievementStats: () => AchievementStats[];
  getMealTypeLabel: (type: string) => string;
  isMealRecorded: (type: string) => boolean;
  getInitialWeight: () => number | undefined;
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

export const useCalorieStore = create<CalorieStore>()(
  persist(
    (set, get) => ({
      userSettings: DEFAULT_SETTINGS,
      todayRecords: [],
      todayExercises: [],
      checkIns: [],
      weightRecords: [],
      todayWaterCount: 0,

      updateUserSettings: (settings: Partial<UserSettings>) => {
        set((state) => ({
          userSettings: { ...state.userSettings, ...settings },
        }));
      },

      addFoodRecord: (record: FoodRecord) => {
        set((state) => ({
          todayRecords: [...state.todayRecords, record],
        }));
      },

      removeFoodRecord: (id: string) => {
        set((state) => ({
          todayRecords: state.todayRecords.filter((r) => r.id !== id),
        }));
      },

      addExerciseRecord: (record: ExerciseRecord) => {
        set((state) => ({
          todayExercises: [...state.todayExercises, record],
        }));
      },

      removeExerciseRecord: (id: string) => {
        set((state) => ({
          todayExercises: state.todayExercises.filter((r) => r.id !== id),
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
        set({ todayRecords: [], todayExercises: [] });
      },

      incrementWater: () => {
        set((state) => ({ todayWaterCount: state.todayWaterCount + 1 }));
      },

      resetWater: () => {
        set({ todayWaterCount: 0 });
      },

      getTodayTotalCalories: () => {
        return get().todayRecords.reduce((sum, r) => sum + r.calorie, 0);
      },

      getTodayExerciseCalories: () => {
        return get().todayExercises.reduce((sum, r) => sum + r.calorie, 0);
      },

      getTodayMacros: () => {
        const macros = { protein: 0, fat: 0, carbs: 0 };
        get().todayRecords.forEach((r) => {
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
        return get().todayRecords.some((r) => r.mealType === type);
      },

      getInitialWeight: () => {
        const { weightRecords, userSettings } = get();
        if (weightRecords.length > 0) {
          return weightRecords[weightRecords.length - 1].weight;
        }
        return userSettings.weight;
      },
    }),
    {
      name: 'calorie-store',
    }
  )
);
