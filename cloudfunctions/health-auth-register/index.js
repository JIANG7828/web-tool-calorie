const cloud = require('@cloudbase/node-sdk');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'health_app_jwt_secret_key_2025';
const JWT_EXPIRE_HOURS = parseInt(process.env.JWT_EXPIRE_HOURS || '168', 10);

const app = cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = app.database();
const usersCollection = db.collection('users');

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
const USERNAME_RULES = [
  { pattern: /^[a-zA-Z0-9_]{4,20}$/, message: '用户名只能包含字母、数字和下划线，长度4-20位' },
];

function validatePassword(password) { return PASSWORD_RULES.filter(rule => !rule.pattern.test(password)).map(rule => rule.message); }
function validateUsername(username) { return USERNAME_RULES.filter(rule => !rule.pattern.test(username)).map(rule => rule.message); }

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

exports.main = async (event, context) => {
  if (event.httpMethod && event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }, body: '' };
  }
  try {
    const body = parseRequestBody(event);
    if (!body || !body.username || !body.password || !body.nickname || !body.gender) return errorResponse('缺少必填字段');
    if (!['male', 'female'].includes(body.gender)) return errorResponse('性别参数无效');
    const usernameErrors = validateUsername(body.username);
    if (usernameErrors.length > 0) return errorResponse(usernameErrors.join('，'));
    const passwordErrors = validatePassword(body.password);
    if (passwordErrors.length > 0) return errorResponse(passwordErrors.join('，'));
    const existingUser = await usersCollection.where({ username: body.username }).get();
    if (existingUser.data.length > 0) return errorResponse('用户名已被注册', 409);
    if (body.wechatId) {
      const existingWechat = await usersCollection.where({ wechatId: body.wechatId }).get();
      if (existingWechat.data.length > 0) return errorResponse('该微信账号已绑定其他用户', 409);
    }
    const passwordHash = hashPassword(body.password);
    const now = new Date().toISOString();
    const result = await usersCollection.add({ username: body.username, passwordHash, nickname: body.nickname, gender: body.gender, wechatId: body.wechatId || null, createdAt: now, updatedAt: now });
    const newUser = { _id: result.id, username: body.username, nickname: body.nickname, gender: body.gender, wechatId: body.wechatId || null, createdAt: now };
    const token = generateJWT(newUser);
    return successResponse({ user: { id: newUser._id, username: newUser.username, nickname: newUser.nickname, gender: newUser.gender, wechatId: newUser.wechatId, createdAt: newUser.createdAt }, token });
  } catch (err) {
    console.error('注册失败:', err);
    return errorResponse('注册失败，请稍后重试', 500);
  }
};
