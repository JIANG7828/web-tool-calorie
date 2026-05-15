const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const API_KEY = '';

let apiAvailable = null;

function callTongyi(messages, options) {
  options = options || {};
  var model = options.model || 'qwen-turbo';
  var temperature = options.temperature != null ? options.temperature : 0.7;
  var maxTokens = options.maxTokens || 1024;
  var timeout = options.timeout || 10000;

  return new Promise(function(resolve, reject) {
    if (!API_KEY) {
      resolve('');
      return;
    }

    if (apiAvailable === false) {
      resolve('');
      return;
    }

    wx.request({
      url: API_URL,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      data: {
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens
      },
      timeout: timeout,
      success: function(res) {
        if (res.statusCode === 401 || res.statusCode === 403) {
          apiAvailable = false;
          resolve('');
          return;
        }

        if (res.statusCode !== 200) {
          resolve('');
          return;
        }

        if (apiAvailable === null) {
          apiAvailable = true;
        }

        var data = res.data;
        var content = '';
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
          content = data.choices[0].message.content || '';
        }
        resolve(content);
      },
      fail: function() {
        resolve('');
      }
    });
  });
}

function callTongyiVision(base64Image) {
  return new Promise(function(resolve, reject) {
    if (!API_KEY) {
      reject(new Error('API 密钥未配置'));
      return;
    }

    if (apiAvailable === false) {
      reject(new Error('视觉 API 不可用'));
      return;
    }

    wx.request({
      url: API_URL,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      data: {
        model: 'qwen-vl-plus',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: base64Image } },
              {
                type: 'text',
                text: '你是专业的食物识别助手。请分析这张图片中的食物。\n\n请以严格的 JSON 数组格式返回，不要包含任何其他文字。格式：\n[\n  {"name": "食物名称", "calorie": 每100克千卡热量, "probability": 置信度百分比}\n]\n\n要求：只识别图片中实际存在的食物，置信度 60-100，热量单位千卡/100g，最多 5 个结果，没有食物返回 []'
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 512
      },
      timeout: 15000,
      success: function(res) {
        if (res.statusCode === 401 || res.statusCode === 403) {
          apiAvailable = false;
          reject(new Error('视觉 API 不可用'));
          return;
        }

        if (res.statusCode !== 200) {
          resolve([]);
          return;
        }

        if (apiAvailable === null) {
          apiAvailable = true;
        }

        var data = res.data;
        var content = '';
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
          content = data.choices[0].message.content || '';
        }

        var jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        var results;
        try {
          results = JSON.parse(jsonStr);
        } catch (e) {
          reject(new Error('未识别到食物'));
          return;
        }

        if (!Array.isArray(results) || results.length === 0) {
          reject(new Error('未识别到食物'));
          return;
        }

        var filtered = results
          .filter(function(r) { return r.name && typeof r.calorie === 'number'; })
          .map(function(r) {
            return {
              name: r.name,
              calorie: Math.round(r.calorie),
              probability: Math.min(100, Math.round(r.probability || 80))
            };
          });

        resolve(filtered);
      },
      fail: function() {
        resolve([]);
      }
    });
  });
}

function compressImageToBase64(imagePath) {
  return new Promise(function(resolve, reject) {
    wx.compressImage({
      src: imagePath,
      quality: 70,
      success: function(res) {
        var fs = wx.getFileSystemManager();
        fs.readFile({
          filePath: res.tempFilePath,
          encoding: 'base64',
          success: function(fileRes) {
            resolve('data:image/jpeg;base64,' + fileRes.data);
          },
          fail: reject
        });
      },
      fail: reject
    });
  });
}

function parseAIResponse(content) {
  try {
    var jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

var LOCAL_FOOD_CALORIE_MAP = {
  '米饭': 116, '面条': 284, '馒头': 223, '饺子': 242, '包子': 227,
  '鸡胸肉': 133, '猪肉': 143, '牛肉': 125, '鱼肉': 90, '鸡蛋': 144,
  '豆腐': 81, '西红柿': 15, '黄瓜': 15, '苹果': 52, '香蕉': 93,
  '牛奶': 54, '酸奶': 72, '薯片': 548, '巧克力': 546, '汉堡': 295,
  '薯条': 312, '披萨': 266, '炸鸡': 300, '可乐': 42, '奶茶': 85,
};

function getLocalCalorie(foodName) {
  if (LOCAL_FOOD_CALORIE_MAP[foodName]) return LOCAL_FOOD_CALORIE_MAP[foodName];
  var keys = Object.keys(LOCAL_FOOD_CALORIE_MAP);
  for (var i = 0; i < keys.length; i++) {
    var name = keys[i];
    if (foodName.indexOf(name) !== -1 || name.indexOf(foodName) !== -1) {
      return LOCAL_FOOD_CALORIE_MAP[name];
    }
  }
  return 150;
}

module.exports = {
  callTongyi: callTongyi,
  callTongyiVision: callTongyiVision,
  compressImageToBase64: compressImageToBase64,
  parseAIResponse: parseAIResponse,
  getLocalCalorie: getLocalCalorie,
  recognizeFood: function(imagePath) {
    return compressImageToBase64(imagePath).then(function(base64Image) {
      return callTongyiVision(base64Image);
    });
  }
};
