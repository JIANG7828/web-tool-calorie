/**
 * 百度智能云食物识别服务
 * 文档: https://ai.baidu.com/ai-doc/IMAGESEEK/jhbyuw5la
 */

export interface FoodRecognitionResult {
  name: string;
  calorie: number;
  probability: number;
}

export interface BaiduFoodResponse {
  result: Array<{
    name: string;
    calorie: number;
    probability: number;
  }>;
}

// 百度智能云 API 配置
const BAIDU_API = {
  // API Key 和 Secret Key 需要替换为你的真实密钥
  API_KEY: 'YOUR_BAIDU_API_KEY',
  SECRET_KEY: 'YOUR_BAIDU_SECRET_KEY',
  // 食物识别接口地址
  FOOD_DETECT_URL: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish',
};

// 获取 Access Token
export async function getAccessToken(): Promise<string> {
  const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API.API_KEY}&client_secret=${BAIDU_API.SECRET_KEY}`;
  
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (data.access_token) {
      return data.access_token;
    } else {
      throw new Error(data.error_description || '获取 Access Token 失败');
    }
  } catch (error) {
    console.error('获取 Access Token 失败:', error);
    throw error;
  }
}

// 将图片转换为 Base64
function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// 调用百度食物识别 API
export async function recognizeFood(imageFile: File): Promise<FoodRecognitionResult[]> {
  try {
    // 获取 Access Token
    const accessToken = await getAccessToken();
    
    // 将图片转换为 Base64
    const base64Image = await getBase64(imageFile);
    const imageBase64 = base64Image.split(',')[1]; // 去掉 data:image/jpeg;base64, 前缀
    
    // 调用百度食物识别 API
    const params = new URLSearchParams({
      image: imageBase64,
      top_num: '5', // 返回前5个识别结果
    });
    
    const response = await fetch(`${BAIDU_API.FOOD_DETECT_URL}?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    const data = await response.json();
    
    if (data.result) {
      // 处理识别结果
      const results: FoodRecognitionResult[] = data.result.map((item: any) => ({
        name: item.name,
        calorie: item.calorie || 0,
        probability: Math.round(item.probability * 100), // 转换为百分比
      }));
      
      return results;
    } else {
      throw new Error(data.error_msg || '识别失败');
    }
  } catch (error) {
    console.error('食物识别失败:', error);
    throw error;
  }
}

// 简单的本地食物热量映射（作为备用方案）
const LOCAL_FOOD_CALORIE_MAP: Record<string, number> = {
  '米饭': 116,
  '面条': 284,
  '馒头': 223,
  '饺子': 242,
  '包子': 227,
  '鸡胸肉': 133,
  '猪肉': 143,
  '牛肉': 125,
  '鱼肉': 90,
  '鸡蛋': 144,
  '豆腐': 81,
  '西红柿': 15,
  '黄瓜': 15,
  '苹果': 52,
  '香蕉': 93,
  '牛奶': 54,
  '酸奶': 72,
  '薯片': 548,
  '巧克力': 546,
};

// 根据识别到的食物名称查找本地热量数据
export function getLocalCalorie(foodName: string): number {
  // 尝试精确匹配
  if (LOCAL_FOOD_CALORIE_MAP[foodName]) {
    return LOCAL_FOOD_CALORIE_MAP[foodName];
  }
  
  // 尝试模糊匹配
  for (const [name, calorie] of Object.entries(LOCAL_FOOD_CALORIE_MAP)) {
    if (foodName.includes(name) || name.includes(foodName)) {
      return calorie;
    }
  }
  
  // 默认返回估算值
  return 150; // 默认150千卡/100g
}
