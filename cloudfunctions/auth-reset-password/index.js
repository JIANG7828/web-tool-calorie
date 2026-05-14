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
const resetCodesCollection = db.collection('passwordResetCodes');

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

function validatePassword(password) {
  return PASSWORD_RULES
    .filter((rule) => !rule.pattern.test(password))
    .map((rule) => rule.message);
}

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    const { action, username, wechatId, code, newPassword, confirmPassword } = body;

    if (action === 'generateCode') {
      if (!username) {
        errorResponse(res, '缺少用户名');
        return;
      }

      const userResult = await usersCollection.where({ username }).get();
      if (userResult.data.length === 0) {
        errorResponse(res, '用户名不存在', 404);
        return;
      }

      const resetCode = generateResetCode();
      const expiresAt = Date.now() + 15 * 60 * 1000;

      await resetCodesCollection.add({
        username,
        code: crypto.createHash('sha256').update(resetCode).digest('hex'),
        expiresAt,
        verified: false,
        createdAt: new Date().toISOString(),
      });

      successResponse(res, {
        message: '重置码已生成（模拟发送，实际应通过邮件/短信发送）',
        code: resetCode,
      });
      return;
    }

    if (action === 'verifyCode') {
      if (!username || !code) {
        errorResponse(res, '缺少用户名或验证码');
        return;
      }

      const codeHash = crypto.createHash('sha256').update(code).digest('hex');
      const resetResult = await resetCodesCollection
        .where({ username, code: codeHash })
        .get();

      if (resetResult.data.length === 0) {
        errorResponse(res, '验证码无效');
        return;
      }

      const resetRecord = resetResult.data[0];
      if (resetRecord.expiresAt < Date.now()) {
        errorResponse(res, '验证码已过期');
        return;
      }

      await resetCodesCollection.doc(resetRecord._id).update({
        verified: true,
        updatedAt: new Date().toISOString(),
      });

      successResponse(res, { message: '验证码验证成功' });
      return;
    }

    if (action === 'resetByUsername') {
      if (!username || !newPassword || !confirmPassword) {
        errorResponse(res, '缺少必填字段');
        return;
      }

      if (newPassword !== confirmPassword) {
        errorResponse(res, '两次密码输入不一致');
        return;
      }

      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        errorResponse(res, passwordErrors.join('，'));
        return;
      }

      const verifiedResult = await resetCodesCollection
        .where({ username, verified: true })
        .get();

      if (verifiedResult.data.length === 0) {
        errorResponse(res, '请先验证重置码');
        return;
      }

      const resetRecord = verifiedResult.data[0];
      if (resetRecord.expiresAt < Date.now()) {
        errorResponse(res, '重置请求已过期');
        return;
      }

      const userResult = await usersCollection.where({ username }).get();
      if (userResult.data.length === 0) {
        errorResponse(res, '用户不存在');
        return;
      }

      const user = userResult.data[0];
      const passwordHash = hashPassword(newPassword);

      await usersCollection.doc(user._id).update({
        passwordHash,
        updatedAt: new Date().toISOString(),
      });

      await resetCodesCollection.doc(resetRecord._id).remove();

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
        message: '密码重置成功',
        user: userResponse,
        token,
      });
      return;
    }

    if (action === 'resetByWechat') {
      if (!wechatId || !newPassword || !confirmPassword) {
        errorResponse(res, '缺少必填字段');
        return;
      }

      if (newPassword !== confirmPassword) {
        errorResponse(res, '两次密码输入不一致');
        return;
      }

      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        errorResponse(res, passwordErrors.join('，'));
        return;
      }

      const userResult = await usersCollection.where({ wechatId }).get();
      if (userResult.data.length === 0) {
        errorResponse(res, '未找到绑定该微信的账号');
        return;
      }

      const user = userResult.data[0];
      const passwordHash = hashPassword(newPassword);

      await usersCollection.doc(user._id).update({
        passwordHash,
        updatedAt: new Date().toISOString(),
      });

      successResponse(res, { message: '密码重置成功' });
      return;
    }

    errorResponse(res, '未知的操作类型');
  } catch (err) {
    console.error('密码重置失败:', err);
    errorResponse(res, '密码重置失败，请稍后重试', 500);
  }
});

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`auth-reset-password function listening on port ${PORT}`);
});
