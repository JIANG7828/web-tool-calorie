/**
 * 通义千问视觉模型 - 食物识别服务
 */

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const API_KEY = import.meta.env.VITE_TONGYI_API_KEY;

export interface FoodRecognitionResult {
  name: string;
  calorie: number;
  probability: number;
}

/**
 * 将图片文件压缩并转为 base64 data URL
 * 限制最大尺寸 1024px，降低质量到 0.7
 */
function fileToCompressedBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.onload = () => {
        const MAX_SIZE = 1024;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context error')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function tryVisionRecognition(base64Image: string): Promise<FoodRecognitionResult[]> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen-vl-max',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: base64Image } },
            {
              type: 'text',
              text: `你是专业的食物识别助手。请分析这张图片中的食物。

请以严格的 JSON 数组格式返回，不要包含任何其他文字。格式：
[
  {"name": "食物名称", "calorie": 每100克千卡热量, "probability": 置信度百分比}
]

要求：只识别图片中实际存在的食物，置信度 60-100，热量单位千卡/100g，最多 5 个结果，没有食物返回 []`,
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  // 静默处理识别结果

  const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const results = JSON.parse(jsonStr);

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('未识别到食物');
  }

  return results
    .filter((r: any) => r.name && typeof r.calorie === 'number')
    .map((r: any) => ({
      name: r.name,
      calorie: Math.round(r.calorie),
      probability: Math.min(100, Math.round(r.probability || 80)),
    }));
}

export async function recognizeFood(imageFile: File): Promise<FoodRecognitionResult[]> {
  const base64Image = await fileToCompressedBase64(imageFile);
  return tryVisionRecognition(base64Image);
}

const LOCAL_FOOD_CALORIE_MAP: Record<string, number> = {
  米饭: 116, 面条: 284, 馒头: 223, 饺子: 242, 包子: 227,
  鸡胸肉: 133, 猪肉: 143, 牛肉: 125, 鱼肉: 90, 鸡蛋: 144,
  豆腐: 81, 西红柿: 15, 黄瓜: 15, 苹果: 52, 香蕉: 93,
  牛奶: 54, 酸奶: 72, 薯片: 548, 巧克力: 546, 汉堡: 295,
  薯条: 312, 披萨: 266, 炸鸡: 300, 可乐: 42, 奶茶: 85,
};

export function getLocalCalorie(foodName: string): number {
  if (LOCAL_FOOD_CALORIE_MAP[foodName]) return LOCAL_FOOD_CALORIE_MAP[foodName];
  for (const [name, calorie] of Object.entries(LOCAL_FOOD_CALORIE_MAP)) {
    if (foodName.includes(name) || name.includes(foodName)) return calorie;
  }
  return 150;
}
