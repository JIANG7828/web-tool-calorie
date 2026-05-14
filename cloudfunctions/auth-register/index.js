const http = require('http');
const crypto = require('crypto');
const cloud = require('@cloudbase/node-sdk');

const JWT_SECRET = process.env.JWT_SECRET || 'health_app_jwt_secret_key_2025';
const JWT_EXPIRE_HOURS = parseInt(process.env.JWT_EXPIRE_HOURS || '168', 10);

const app = cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = app.database();
const usersCollection = db.collection('users');

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

function successResponse(res, data) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify({ success: true, ...data }));
}

function errorResponse(res, message, statusCode = 400) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify({ success: false, error: message }));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    errorResponse(res, '只支持 POST 请求', 405);
    return;
  }

  try {
    const body = await parseBody(req);

    if (!body.username || !body.password || !body.nickname || !body.gender) {
      errorResponse(res, '缺少必填字段');
      return;
    }

    if (!['male', 'female'].includes(body.gender)) {
      errorResponse(res, '性别参数无效');
      return;
    }

    const usernameErrors = validateUsername(body.username);
    if (usernameErrors.length > 0) {
      errorResponse(res, usernameErrors.join('，'));
      return;
    }

    const passwordErrors = validatePassword(body.password);
    if (passwordErrors.length > 0) {
      errorResponse(res, passwordErrors.join('，'));
      return;
    }

    const existingUser = await usersCollection.where({ username: body.username }).get();
    if (existingUser.data.length > 0) {
      errorResponse(res, '用户名已被注册', 409);
      return;
    }

    if (body.wechatId) {
      const existingWechat = await usersCollection.where({ wechatId: body.wechatId }).get();
      if (existingWechat.data.length > 0) {
        errorResponse(res, '该微信账号已绑定其他用户', 409);
        return;
      }
    }

    const passwordHash = hashPassword(body.password);
    const now = new Date().toISOString();

    const result = await usersCollection.add({
      username: body.username,
      passwordHash,
      nickname: body.nickname,
      gender: body.gender,
      wechatId: body.wechatId || null,
      createdAt: now,
      updatedAt: now,
    });

    const newUser = {
      _id: result.id,
      username: body.username,
      nickname: body.nickname,
      gender: body.gender,
      wechatId: body.wechatId || null,
      createdAt: now,
    };

    const token = generateJWT(newUser);

    successResponse(res, {
      user: {
        id: newUser._id,
        username: newUser.username,
        nickname: newUser.nickname,
        gender: newUser.gender,
        wechatId: newUser.wechatId,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (err) {
    console.error('注册失败:', err);
    errorResponse(res, '注册失败，请稍后重试', 500);
  }
});

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`auth-register function listening on port ${PORT}`);
});
