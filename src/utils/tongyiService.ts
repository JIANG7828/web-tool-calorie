/**
 * 通义千问 API 服务
 */

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const API_KEY = import.meta.env.VITE_TONGYI_API_KEY;

export interface TongyiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TongyiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * 调用通义千问 API
 */
export async function callTongyi(messages: TongyiMessage[]): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('API 密钥未配置');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data: TongyiResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    // 静默失败，不打印错误日志
    return '';
  }
}

/**
 * 解析 AI 返回的 JSON 字符串
 */
export function parseAIResponse<T>(content: string): T | null {
  try {
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}
