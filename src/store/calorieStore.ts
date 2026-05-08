import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MemberLevel } from '../utils/memberPlans';

export interface FoodRecord {
  id: string;
  name: string;
  calorie: number;
  time: string;
  date: string;
}

export interface UserSettings {
  nickname: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  target: 'fat' | 'keep' | 'muscle';
  activityLevel: number;
}

export interface ExerciseRecord {
  id: string;
  name: string;
  met: number;
  duration: number;
  calorie: number;
  date: string;
}

interface AdStats {
  lastAdDate: string;
  dailyAdCount: number;
}

interface CalorieStore {
  userSettings: UserSettings;
  memberLevel: MemberLevel;
  todayRecords: FoodRecord[];
  todayExercises: ExerciseRecord[];
  adStats: AdStats;
  
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  upgradeMember: (level: MemberLevel) => void;
  addFoodRecord: (record: Omit<FoodRecord, 'id' | 'date'>) => void;
  removeFoodRecord: (id: string) => void;
  addExerciseRecord: (record: Omit<ExerciseRecord, 'id' | 'date'>) => void;
  resetTodayRecords: () => void;
  getTodayTotalCalories: () => number;
  getTodayExerciseCalories: () => number;
  getNetCalories: () => number;
  canShowAd: () => boolean;
  recordAdView: () => void;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTodayDate = () => formatDate(new Date());

export const useCalorieStore = create<CalorieStore>()(
  persist(
    (set, get) => ({
      userSettings: {
        nickname: '用户',
        gender: 'female',
        age: 25,
        height: 165,
        weight: 55,
        target: 'keep',
        activityLevel: 1.2,
      },
      memberLevel: 'free',
      todayRecords: [],
      todayExercises: [],
      adStats: {
        lastAdDate: '',
        dailyAdCount: 0,
      },

      updateUserSettings: (settings) => {
        set((state) => ({
          userSettings: { ...state.userSettings, ...settings },
        }));
      },

      upgradeMember: (level) => {
        set({ memberLevel: level });
      },

      addFoodRecord: (record) => {
        const newRecord: FoodRecord = {
          ...record,
          id: generateId(),
          date: getTodayDate(),
        };
        set((state) => ({
          todayRecords: [...state.todayRecords, newRecord],
        }));
      },

      removeFoodRecord: (id) => {
        set((state) => ({
          todayRecords: state.todayRecords.filter((r) => r.id !== id),
        }));
      },

      addExerciseRecord: (record) => {
        const newRecord: ExerciseRecord = {
          ...record,
          id: generateId(),
          date: getTodayDate(),
        };
        set((state) => ({
          todayExercises: [...state.todayExercises, newRecord],
        }));
      },

      resetTodayRecords: () => {
        set({
          todayRecords: [],
          todayExercises: [],
        });
      },

      getTodayTotalCalories: () => {
        const records = get().todayRecords;
        return records.reduce((sum, record) => sum + record.calorie, 0);
      },

      getTodayExerciseCalories: () => {
        const exercises = get().todayExercises;
        return exercises.reduce((sum, ex) => sum + ex.calorie, 0);
      },

      getNetCalories: () => {
        return get().getTodayTotalCalories() - get().getTodayExerciseCalories();
      },

      canShowAd: () => {
        const { memberLevel, adStats } = get();
        const today = getTodayDate();

        if (memberLevel !== 'free') {
          return false;
        }

        if (adStats.lastAdDate !== today) {
          return true;
        }

        return adStats.dailyAdCount < 3;
      },

      recordAdView: () => {
        const today = getTodayDate();
        set((state) => {
          if (state.adStats.lastAdDate !== today) {
            return {
              adStats: {
                lastAdDate: today,
                dailyAdCount: 1,
              },
            };
          }
          return {
            adStats: {
              ...state.adStats,
              dailyAdCount: state.adStats.dailyAdCount + 1,
            },
          };
        });
      },
    }),
    {
      name: 'calorie-storage',
    }
  )
);
