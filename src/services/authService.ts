/**
 * 用户认证服务 - CloudBase 云函数认证方式
 * 通过调用云函数实现用户注册、登录、密码找回等功能
 */

const CLOUD_FUNCTION_BASE_URL = import.meta.env.VITE_CLOUD_FUNCTION_BASE_URL || '';

export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  gender: 'male' | 'female';
  wechatId?: string;
  createdAt: string;
}

export interface LoginResult {
  success: boolean;
  user?: UserProfile;
  token?: string;
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: UserProfile;
  token?: string;
  errors?: string[];
}

export interface PasswordResetResult {
  success: boolean;
  error?: string;
}

const JWT_TOKEN_KEY = 'health_app_jwt_token';
const CURRENT_USER_KEY = 'health_app_current_user';

async function callCloudFunction(functionName: string, body: object): Promise<Response> {
  const url = CLOUD_FUNCTION_BASE_URL
    ? `${CLOUD_FUNCTION_BASE_URL}/${functionName}`
    : `/api/${functionName}`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

async function parseCloudFunctionResponse(response: Response): Promise<{ success: boolean; [key: string]: unknown }> {
  const data = await response.json();
  return data;
}

export function getToken(): string | null {
  return localStorage.getItem(JWT_TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(JWT_TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(JWT_TOKEN_KEY);
}

export function getCurrentUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export async function login(username: string, password: string): Promise<LoginResult> {
  try {
    const response = await callCloudFunction('auth-login', {
      loginType: 'username',
      username,
      password,
    });

    const data = await parseCloudFunctionResponse(response);

    if (data.success && data.user && data.token) {
      setToken(data.token as string);
      setCurrentUser(data.user as UserProfile);
    }

    return {
      success: !!data.success,
      user: data.user as UserProfile | undefined,
      token: data.token as string | undefined,
      error: data.error as string | undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '网络请求失败',
    };
  }
}

export async function register(
  username: string,
  password: string,
  nickname: string,
  gender: 'male' | 'female',
  wechatId?: string
): Promise<RegisterResult> {
  try {
    const response = await callCloudFunction('auth-register', {
      username,
      password,
      nickname,
      gender,
      wechatId,
    });

    const data = await parseCloudFunctionResponse(response);

    if (data.success && data.user && data.token) {
      setToken(data.token as string);
      setCurrentUser(data.user as UserProfile);
    }

    return {
      success: !!data.success,
      user: data.user as UserProfile | undefined,
      token: data.token as string | undefined,
      errors: data.error ? [data.error as string] : undefined,
    };
  } catch (err) {
    return {
      success: false,
      errors: [err instanceof Error ? err.message : '网络请求失败'],
    };
  }
}

export async function loginWithWechat(wechatId: string): Promise<LoginResult> {
  try {
    const response = await callCloudFunction('auth-login', {
      loginType: 'wechat',
      wechatId,
    });

    const data = await parseCloudFunctionResponse(response);

    if (data.success && data.user && data.token) {
      setToken(data.token as string);
      setCurrentUser(data.user as UserProfile);
    }

    return {
      success: !!data.success,
      user: data.user as UserProfile | undefined,
      token: data.token as string | undefined,
      error: data.error as string | undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '网络请求失败',
    };
  }
}

export function logout(): void {
  removeToken();
  setCurrentUser(null);
}

export async function updatePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: '请先登录' };
  }

  const loginResult = await login(currentUser.username, oldPassword);
  if (!loginResult.success) {
    return { success: false, error: '原密码错误' };
  }

  const registerResult = await register(
    currentUser.username + '_temp',
    newPassword,
    currentUser.nickname,
    currentUser.gender,
    currentUser.wechatId
  );

  return { success: registerResult.success, error: registerResult.errors?.[0] };
}

export async function bindWechat(wechatId: string): Promise<{ success: boolean; error?: string }> {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: '请先登录' };
  }

  try {
    const response = await callCloudFunction('auth-bind-wechat', {
      userId: currentUser.id,
      wechatId,
    });

    const data = await parseCloudFunctionResponse(response);

    if (data.success) {
      setCurrentUser({ ...currentUser, wechatId });
    }

    return {
      success: !!data.success,
      error: data.error as string | undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '网络请求失败',
    };
  }
}

export async function generateResetCode(username: string): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const response = await callCloudFunction('auth-reset-password', {
      action: 'generateCode',
      username,
    });

    const data = await parseCloudFunctionResponse(response);

    return {
      success: !!data.success,
      code: data.code as string | undefined,
      error: data.error as string | undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '网络请求失败',
    };
  }
}

export async function verifyResetCode(username: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await callCloudFunction('auth-reset-password', {
      action: 'verifyCode',
      username,
      code,
    });

    const data = await parseCloudFunctionResponse(response);

    return {
      success: !!data.success,
      error: data.error as string | undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '网络请求失败',
    };
  }
}

export async function resetPassword(
  username: string,
  newPassword: string,
  confirmPassword: string
): Promise<PasswordResetResult> {
  try {
    const response = await callCloudFunction('auth-reset-password', {
      action: 'resetByUsername',
      username,
      newPassword,
      confirmPassword,
    });

    const data = await parseCloudFunctionResponse(response);

    if (data.success && data.user && data.token) {
      setToken(data.token as string);
      setCurrentUser(data.user as UserProfile);
    }

    return {
      success: !!data.success,
      error: data.error as string | undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '网络请求失败',
    };
  }
}

export async function resetPasswordByWechat(
  wechatId: string,
  newPassword: string,
  confirmPassword: string
): Promise<PasswordResetResult> {
  try {
    const response = await callCloudFunction('auth-reset-password', {
      action: 'resetByWechat',
      wechatId,
      newPassword,
      confirmPassword,
    });

    const data = await parseCloudFunctionResponse(response);

    return {
      success: !!data.success,
      error: data.error as string | undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '网络请求失败',
    };
  }
}
