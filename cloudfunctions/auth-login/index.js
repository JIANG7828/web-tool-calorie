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

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
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
    const { loginType, username, password, wechatId } = body;

    let user;

    if (loginType === 'wechat') {
      if (!wechatId) {
        errorResponse(res, '缺少微信 ID');
        return;
      }

      const result = await usersCollection.where({ wechatId }).get();
      if (result.data.length === 0) {
        errorResponse(res, '该微信账号尚未注册，请先注册', 404);
        return;
      }
      user = result.data[0];
    } else {
      if (!username || !password) {
        errorResponse(res, '用户名和密码不能为空');
        return;
      }

      const result = await usersCollection.where({ username }).get();
      if (result.data.length === 0) {
        errorResponse(res, '用户名不存在', 404);
        return;
      }

      user = result.data[0];

      if (!verifyPassword(password, user.passwordHash)) {
        errorResponse(res, '密码错误', 401);
        return;
      }
    }

    await usersCollection.doc(user._id).update({
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const userResponse = {
      id: user._id,
      username: user.username,
      nickname: user.nickname,
      gender: user.gender,
      wechatId: user.wechatId,
      createdAt: user.createdAt,
    };

    const token = generateJWT(userResponse);

    successResponse(res, {
      user: userResponse,
      token,
    });
  } catch (err) {
    console.error('登录失败:', err);
    errorResponse(res, '登录失败，请稍后重试', 500);
  }
});

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`auth-login function listening on port ${PORT}`);
});
