/**
 * 用户认证状态管理 - Zustand Store
 * 管理当前登录用户状态和认证操作
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  login,
  logout,
  register,
  getCurrentUser,
  setCurrentUser,
  updatePassword,
  bindWechat,
  loginWithWechat,
  generateResetCode,
  verifyResetCode,
  resetPassword,
  resetPasswordByWechat,
} from '../services/authService';

export interface AuthState {
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    password: string,
    nickname: string,
    gender: 'male' | 'female',
    wechatId?: string
  ) => Promise<{ success: boolean; errors?: string[] }>;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  bindWechat: (wechatId: string) => Promise<{ success: boolean; error?: string }>;
  loginWithWechat: (wechatId: string) => Promise<{ success: boolean; error?: string }>;
  registerWithWechat: (wechatId: string, nickname: string, gender: 'male' | 'female') => Promise<{ success: boolean; errors?: string[] }>;
  generateResetCode: (username: string) => Promise<{ success: boolean; code?: string; error?: string }>;
  verifyResetCode: (username: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (username: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordByWechat: (wechatId: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: getCurrentUser(),
      isLoggedIn: !!getCurrentUser(),
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const result = await login(username, password);
          if (result.success) {
            set({ currentUser: result.user, isLoggedIn: true });
          }
          return { success: result.success, error: result.error };
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (
        username: string,
        password: string,
        nickname: string,
        gender: 'male' | 'female',
        wechatId?: string
      ) => {
        set({ isLoading: true });
        try {
          const result = await register(username, password, nickname, gender, wechatId);
          if (result.success) {
            set({ currentUser: result.user, isLoggedIn: true });
          }
          return { success: result.success, errors: result.errors };
        } finally {
          set({ isLoading: false });
        }
      },

      registerWithWechat: async (wechatId: string, nickname: string, gender: 'male' | 'female') => {
        set({ isLoading: true });
        try {
          const result = await loginWithWechat(wechatId);
          if (result.success) {
            set({ currentUser: result.user, isLoggedIn: true });
            return { success: true };
          }

          const username = `wx_${wechatId.slice(-8)}`;
          const randomPassword = 'Wx' + Math.random().toString(36).slice(2, 14).toUpperCase();
          const registerResult = await register(username, randomPassword, nickname, gender, wechatId);
          if (registerResult.success) {
            set({ currentUser: registerResult.user, isLoggedIn: true });
          }
          return { success: registerResult.success, errors: registerResult.errors };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        logout();
        set({ currentUser: null, isLoggedIn: false });
      },

      updatePassword: async (oldPassword: string, newPassword: string) => {
        const currentUser = get().currentUser;
        if (!currentUser) {
          return { success: false, error: '请先登录' };
        }
        
        set({ isLoading: true });
        try {
          const result = await updatePassword(oldPassword, newPassword);
          if (result.success) {
            set({ currentUser: getCurrentUser() });
          }
          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      bindWechat: async (wechatId: string) => {
        const currentUser = get().currentUser;
        if (!currentUser) {
          return { success: false, error: '请先登录' };
        }
        
        set({ isLoading: true });
        try {
          const result = await bindWechat(wechatId);
          if (result.success) {
            set({ currentUser: getCurrentUser() });
          }
          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithWechat: async (wechatId: string) => {
        set({ isLoading: true });
        try {
          const result = await loginWithWechat(wechatId);
          if (result.success) {
            set({ currentUser: result.user, isLoggedIn: true });
          }
          return { success: result.success, error: result.error };
        } finally {
          set({ isLoading: false });
        }
      },

      generateResetCode: async (username: string) => {
        set({ isLoading: true });
        try {
          const result = await generateResetCode(username);
          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyResetCode: async (username: string, code: string) => {
        set({ isLoading: true });
        try {
          const result = await verifyResetCode(username, code);
          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (username: string, newPassword: string, confirmPassword: string) => {
        set({ isLoading: true });
        try {
          const result = await resetPassword(username, newPassword, confirmPassword);
          if (result.success) {
            set({ currentUser: getCurrentUser(), isLoggedIn: !!getCurrentUser() });
          }
          return { success: result.success, error: result.error };
        } finally {
          set({ isLoading: false });
        }
      },

      resetPasswordByWechat: async (wechatId: string, newPassword: string, confirmPassword: string) => {
        set({ isLoading: true });
        try {
          const result = await resetPasswordByWechat(wechatId, newPassword, confirmPassword);
          return { success: result.success, error: result.error };
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'health_app_auth',
    }
  )
);
