const http = require('http');
const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = app.database();
const usersCollection = db.collection('users');

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
    const { userId, wechatId } = body;

    if (!userId || !wechatId) {
      errorResponse(res, '缺少用户 ID 或微信 ID');
      return;
    }

    const existingWechat = await usersCollection.where({ wechatId }).get();
    if (existingWechat.data.length > 0) {
      errorResponse(res, '该微信账号已绑定其他用户', 409);
      return;
    }

    const result = await usersCollection.doc(userId).update({
      wechatId,
      updatedAt: new Date().toISOString(),
    });

    successResponse(res, { message: '微信绑定成功' });
  } catch (err) {
    console.error('绑定微信失败:', err);
    errorResponse(res, '绑定微信失败，请稍后重试', 500);
  }
});

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`auth-bind-wechat function listening on port ${PORT}`);
});
