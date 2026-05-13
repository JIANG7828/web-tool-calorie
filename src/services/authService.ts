/**
 * 用户认证服务 - JWT 认证方式
 * 提供用户注册、登录、密码找回等功能
 */

export interface UserProfile {
  id: string;
  username: string;
  password: string;
  nickname: string;
  gender: 'male' | 'female';
  wechatId?: string;
  createdAt: string;
}

export interface ValidationRule {
  pattern: RegExp;
  message: string;
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

const USERS_KEY = 'health_app_users';
const JWT_TOKEN_KEY = 'health_app_jwt_token';
const CURRENT_USER_KEY = 'health_app_current_user';
const PASSWORD_RESET_CODE_KEY = 'health_app_reset_codes';

const PASSWORD_RULES: ValidationRule[] = [
  { pattern: /^.{8,}$/, message: '密码长度至少8位' },
  { pattern: /[A-Z]/, message: '密码必须包含至少一个大写字母' },
  { pattern: /[a-z]/, message: '密码必须包含至少一个小写字母' },
  { pattern: /[0-9]/, message: '密码必须包含至少一个数字' },
];

const USERNAME_RULES: ValidationRule[] = [
  { pattern: /^[a-zA-Z0-9_]{4,20}$/, message: '用户名只能包含字母、数字和下划线，长度4-20位' },
];

const JWT_SECRET = 'health_app_jwt_secret_key_2025';
const TOKEN_EXPIRE_HOURS = 24 * 7; // 7天

// 简单的 JWT 生成函数
function generateJWT(user: UserProfile): string {
  const payload = {
    sub: user.id,
    username: user.username,
    nickname: user.nickname,
    exp: Date.now() + TOKEN_EXPIRE_HOURS * 60 * 60 * 1000,
  };
  
  const base64Header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const base64Payload = btoa(JSON.stringify(payload));
  
  // 简单的签名（实际项目中应该使用 HMAC-SHA256）
  const signature = btoa(JWT_SECRET + base64Header + base64Payload);
  
  return `${base64Header}.${base64Payload}.${signature}`;
}

// 验证和解析 JWT
function verifyJWT(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) {
      return { valid: false, error: 'Token 格式无效' };
    }
    
    const decodedPayload = JSON.parse(atob(payload));
    if (decodedPayload.exp && decodedPayload.exp < Date.now()) {
      return { valid: false, error: 'Token 已过期' };
    }
    
    // 验证签名
    const expectedSignature = btoa(JWT_SECRET + header + payload);
    if (signature !== expectedSignature) {
      return { valid: false, error: 'Token 签名无效' };
    }
    
    return { valid: true, payload: decodedPayload };
  } catch (e) {
    return { valid: false, error: 'Token 解析失败' };
  }
}

function getUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: UserProfile[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function validatePassword(password: string): string[] {
  return PASSWORD_RULES
    .filter((rule) => !rule.pattern.test(password))
    .map((rule) => rule.message);
}

export function validateUsername(username: string): string[] {
  return USERNAME_RULES
    .filter((rule) => !rule.pattern.test(username))
    .map((rule) => rule.message);
}

export function getCurrentUser(): UserProfile | null {
  // 优先通过 JWT 获取用户信息
  const token = getToken();
  if (token) {
    const result = verifyJWT(token);
    if (result.valid && result.payload) {
      const users = getUsers();
      return users.find((u) => u.username === result.payload.username) || null;
    }
  }
  
  // fallback 到旧方式
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

export function getToken(): string | null {
  return localStorage.getItem(JWT_TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(JWT_TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(JWT_TOKEN_KEY);
}

export function login(username: string, password: string): LoginResult {
  const users = getUsers();
  const user = users.find((u) => u.username === username);
  
  if (!user) {
    return { success: false, error: '用户名不存在' };
  }
  
  if (user.password !== password) {
    return { success: false, error: '密码错误' };
  }
  
  const token = generateJWT(user);
  setToken(token);
  setCurrentUser(user);
  
  return { success: true, user, token };
}

export function register(
  username: string,
  password: string,
  nickname: string,
  gender: 'male' | 'female',
  wechatId?: string
): RegisterResult {
  const errors: string[] = [];
  
  if (!username) {
    errors.push('用户名不能为空');
  } else {
    const usernameErrors = validateUsername(username);
    errors.push(...usernameErrors);
  }
  
  if (!password) {
    errors.push('密码不能为空');
  } else {
    const passwordErrors = validatePassword(password);
    errors.push(...passwordErrors);
  }
  
  if (!nickname) {
    errors.push('昵称不能为空');
  }
  
  if (errors.length > 0) {
    return { success: false, errors };
  }
  
  const users = getUsers();
  
  if (users.find((u) => u.username === username)) {
    return { success: false, errors: ['用户名已被注册'] };
  }
  
  const newUser: UserProfile = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    password,
    nickname,
    gender,
    wechatId,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveUsers(users);
  
  const token = generateJWT(newUser);
  setToken(token);
  setCurrentUser(newUser);
  
  return { success: true, user: newUser, token };
}

export function logout(): void {
  removeToken();
  setCurrentUser(null);
}

export function updatePassword(username: string, oldPassword: string, newPassword: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.username === username);
  
  if (!user) {
    return { success: false, error: '用户不存在' };
  }
  
  if (user.password !== oldPassword) {
    return { success: false, error: '原密码错误' };
  }
  
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    return { success: false, error: passwordErrors.join('，') };
  }
  
  user.password = newPassword;
  saveUsers(users);
  
  // 重新生成 token
  const token = generateJWT(user);
  setToken(token);
  setCurrentUser(user);
  
  return { success: true };
}

export function bindWechat(username: string, wechatId: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.username === username);
  
  if (!user) {
    return { success: false, error: '用户不存在' };
  }
  
  user.wechatId = wechatId;
  saveUsers(users);
  setCurrentUser(user);
  
  return { success: true };
}

export function loginWithWechat(wechatId: string): LoginResult {
  const users = getUsers();
  const user = users.find((u) => u.wechatId === wechatId);
  
  if (!user) {
    return { success: false, error: '该微信账号尚未注册，请先注册' };
  }
  
  const token = generateJWT(user);
  setToken(token);
  setCurrentUser(user);
  
  return { success: true, user, token };
}

// ====== 密码找回功能 ======

// 生成重置码
export function generateResetCode(username: string): { success: boolean; code?: string; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.username === username);
  
  if (!user) {
    return { success: false, error: '用户名不存在' };
  }
  
  // 生成随机6位数字验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 存储重置码（15分钟有效期）
  const resetCodes = JSON.parse(localStorage.getItem(PASSWORD_RESET_CODE_KEY) || '{}');
  resetCodes[username] = {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000,
    verified: false,
  };
  
  localStorage.setItem(PASSWORD_RESET_CODE_KEY, JSON.stringify(resetCodes));
  
  console.log(`密码重置码已生成 (用户名: ${username}): ${code}`);
  
  return { success: true, code };
}

// 验证重置码
export function verifyResetCode(username: string, code: string): { success: boolean; error?: string } {
  const resetCodes = JSON.parse(localStorage.getItem(PASSWORD_RESET_CODE_KEY) || '{}');
  const resetData = resetCodes[username];
  
  if (!resetData) {
    return { success: false, error: '未找到该用户的重置请求' };
  }
  
  if (resetData.expiresAt < Date.now()) {
    delete resetCodes[username];
    localStorage.setItem(PASSWORD_RESET_CODE_KEY, JSON.stringify(resetCodes));
    return { success: false, error: '重置码已过期，请重新获取' };
  }
  
  if (resetData.code !== code) {
    return { success: false, error: '重置码错误' };
  }
  
  resetData.verified = true;
  resetCodes[username] = resetData;
  localStorage.setItem(PASSWORD_RESET_CODE_KEY, JSON.stringify(resetCodes));
  
  return { success: true };
}

// 重置密码（通过用户名和验证码）
export function resetPassword(
  username: string,
  newPassword: string,
  confirmPassword: string
): PasswordResetResult {
  const resetCodes = JSON.parse(localStorage.getItem(PASSWORD_RESET_CODE_KEY) || '{}');
  const resetData = resetCodes[username];
  
  if (!resetData || !resetData.verified) {
    return { success: false, error: '请先验证重置码' };
  }
  
  if (resetData.expiresAt < Date.now()) {
    delete resetCodes[username];
    localStorage.setItem(PASSWORD_RESET_CODE_KEY, JSON.stringify(resetCodes));
    return { success: false, error: '重置请求已过期，请重新发起' };
  }
  
  if (newPassword !== confirmPassword) {
    return { success: false, error: '两次密码输入不一致' };
  }
  
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    return { success: false, error: passwordErrors.join('，') };
  }
  
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.username === username);
  
  if (userIndex === -1) {
    return { success: false, error: '用户不存在' };
  }
  
  users[userIndex].password = newPassword;
  saveUsers(users);
  
  // 清除重置码
  delete resetCodes[username];
  localStorage.setItem(PASSWORD_RESET_CODE_KEY, JSON.stringify(resetCodes));
  
  return { success: true };
}

// 重置密码（通过微信验证）
export function resetPasswordByWechat(
  wechatId: string,
  newPassword: string,
  confirmPassword: string
): PasswordResetResult {
  const users = getUsers();
  const user = users.find((u) => u.wechatId === wechatId);
  
  if (!user) {
    return { success: false, error: '未找到绑定该微信的账号' };
  }
  
  if (newPassword !== confirmPassword) {
    return { success: false, error: '两次密码输入不一致' };
  }
  
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    return { success: false, error: passwordErrors.join('，') };
  }
  
  user.password = newPassword;
  saveUsers(users);
  
  return { success: true };
}
