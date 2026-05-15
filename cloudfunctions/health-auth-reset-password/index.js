const cloud = require('@cloudbase/node-sdk');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'health_app_jwt_secret_key_2025';
const JWT_EXPIRE_HOURS = parseInt(process.env.JWT_EXPIRE_HOURS || '168', 10);

const app = cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = app.database();
const usersCollection = db.collection('users');
const resetCodesCollection = db.collection('passwordResetCodes');

function utf8ToBase64(str) { return Buffer.from(str, 'utf8').toString('base64'); }
function base64ToUtf8(base64) { return Buffer.from(base64, 'base64').toString('utf8'); }

function generateJWT(user) {
  const payload = { sub: user._id, username: user.username, nickname: user.nickname, iat: Date.now(), exp: Date.now() + JWT_EXPIRE_HOURS * 60 * 60 * 1000 };
  const base64Header = utf8ToBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const base64Payload = utf8ToBase64(JSON.stringify(payload));
  const signature = utf8ToBase64(JWT_SECRET + base64Header + base64Payload);
  return `${base64Header}.${base64Payload}.${signature}`;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

const PASSWORD_RULES = [
  { pattern: /^.{8,}$/, message: '密码长度至少8位' },
  { pattern: /[A-Z]/, message: '密码必须包含至少一个大写字母' },
  { pattern: /[a-z]/, message: '密码必须包含至少一个小写字母' },
  { pattern: /[0-9]/, message: '密码必须包含至少一个数字' },
];

function validatePassword(password) { return PASSWORD_RULES.filter(rule => !rule.pattern.test(password)).map(rule => rule.message); }

function successResponse(data) {
  return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }, body: JSON.stringify({ success: true, ...data }) };
}
function errorResponse(message, statusCode = 400) {
  return { statusCode, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }, body: JSON.stringify({ success: false, error: message }) };
}

function parseRequestBody(event) {
  try {
    if (typeof event.body === 'string') return JSON.parse(event.body);
    if (typeof event.body === 'object') return event.body;
    return {};
  } catch { return null; }
}

function generateCode() { return crypto.randomInt(100000, 999999).toString(); }

exports.main = async (event, context) => {
  if (event.httpMethod && event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }, body: '' };
  }
  try {
    const body = parseRequestBody(event);
    const { action, username, code, newPassword, confirmPassword, wechatId } = body;

    if (action === 'generateCode') {
      if (!username) return errorResponse('缺少用户名');
      const result = await usersCollection.where({ username }).get();
      if (result.data.length === 0) return errorResponse('用户名不存在', 404);
      const resetCode = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await resetCodesCollection.add({ username, code: resetCode, expiresAt, createdAt: new Date().toISOString() });
      return successResponse({ code: resetCode, message: '验证码已生成（生产环境应发送到邮箱/短信）' });
    }

    if (action === 'verifyCode') {
      if (!username || !code) return errorResponse('缺少用户名或验证码');
      const result = await resetCodesCollection.where({ username, code }).orderBy('createdAt', 'desc').limit(1).get();
      if (result.data.length === 0) return errorResponse('验证码无效');
      const record = result.data[0];
      if (new Date(record.expiresAt) < new Date()) return errorResponse('验证码已过期');
      return successResponse({ message: '验证码验证成功' });
    }

    if (action === 'resetByUsername') {
      if (!username || !newPassword || !confirmPassword) return errorResponse('缺少必填字段');
      if (newPassword !== confirmPassword) return errorResponse('两次输入的密码不一致');
      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) return errorResponse(passwordErrors.join('，'));
      const result = await usersCollection.where({ username }).get();
      if (result.data.length === 0) return errorResponse('用户名不存在', 404);
      const user = result.data[0];
      const passwordHash = hashPassword(newPassword);
      await usersCollection.doc(user._id).update({ passwordHash, updatedAt: new Date().toISOString() });
      const userResponse = { id: user._id, username: user.username, nickname: user.nickname, gender: user.gender, createdAt: user.createdAt };
      const token = generateJWT(userResponse);
      return successResponse({ user: userResponse, token, message: '密码重置成功' });
    }

    if (action === 'resetByWechat') {
      if (!wechatId || !newPassword || !confirmPassword) return errorResponse('缺少必填字段');
      if (newPassword !== confirmPassword) return errorResponse('两次输入的密码不一致');
      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) return errorResponse(passwordErrors.join('，'));
      const result = await usersCollection.where({ wechatId }).get();
      if (result.data.length === 0) return errorResponse('该微信账号尚未注册', 404);
      const user = result.data[0];
      const passwordHash = hashPassword(newPassword);
      await usersCollection.doc(user._id).update({ passwordHash, updatedAt: new Date().toISOString() });
      return successResponse({ message: '密码重置成功' });
    }

    return errorResponse('无效的操作类型');
  } catch (err) {
    console.error('密码重置失败:', err);
    return errorResponse('操作失败，请稍后重试', 500);
  }
};
