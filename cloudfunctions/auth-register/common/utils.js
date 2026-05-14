/**
 * 云函数公共工具模块
 * 提供 JWT 生成/验证、密码加密、数据库操作等共享功能
 */

const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'health_app_jwt_secret_key_2025';
const JWT_EXPIRE_HOURS = parseInt(process.env.JWT_EXPIRE_HOURS || '168', 10);

function utf8ToBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

function base64ToUtf8(base64) {
  return Buffer.from(base64, 'base64').toString('utf8');
}

function generateJWT(user) {
  const payload = {
    sub: user._id,
    username: user.username,
    nickname: user.nickname,
    iat: Date.now(),
    exp: Date.now() + JWT_EXPIRE_HOURS * 60 * 60 * 1000,
  };

  const base64Header = utf8ToBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const base64Payload = utf8ToBase64(JSON.stringify(payload));
  const signature = utf8ToBase64(JWT_SECRET + base64Header + base64Payload);

  return `${base64Header}.${base64Payload}.${signature}`;
}

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Token 格式无效' };
    }

    const [header, payload, signature] = parts;
    const decodedPayload = JSON.parse(base64ToUtf8(payload));

    if (decodedPayload.exp && decodedPayload.exp < Date.now()) {
      return { valid: false, error: 'Token 已过期' };
    }

    const expectedSignature = utf8ToBase64(JWT_SECRET + header + payload);
    if (signature !== expectedSignature) {
      return { valid: false, error: 'Token 签名无效' };
    }

    return { valid: true, payload: decodedPayload };
  } catch (e) {
    return { valid: false, error: 'Token 解析失败' };
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
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

function validatePassword(password) {
  return PASSWORD_RULES
    .filter((rule) => !rule.pattern.test(password))
    .map((rule) => rule.message);
}

function validateUsername(username) {
  return USERNAME_RULES
    .filter((rule) => !rule.pattern.test(username))
    .map((rule) => rule.message);
}

function successResponse(data) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify({ success: true, ...data }),
  };
}

function errorResponse(message, statusCode = 400) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify({ success: false, error: message }),
  };
}

function parseRequestBody(event) {
  try {
    if (typeof event.body === 'string') {
      return JSON.parse(event.body);
    }
    if (typeof event.body === 'object') {
      return event.body;
    }
    return {};
  } catch (e) {
    return null;
  }
}

module.exports = {
  generateJWT,
  verifyJWT,
  hashPassword,
  verifyPassword,
  validatePassword,
  validateUsername,
  successResponse,
  errorResponse,
  parseRequestBody,
  JWT_SECRET,
};
