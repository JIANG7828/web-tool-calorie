/**
 * 通义千问 API 服务
 */

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const API_KEY = import.meta.env.VITE_TONGYI_API_KEY;

// API 可用性缓存：一旦检测到欠费/认证失败，后续不再发起请求
let apiAvailable: boolean | null = null;

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
  if (!API_KEY) {
    return '';
  }

  // 如果已知 API 不可用，直接返回
  if (apiAvailable === false) {
    return '';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // 401/403 表示认证失败或欠费，缓存不可用状态
      if (response.status === 401 || response.status === 403) {
        apiAvailable = false;
      }
      return '';
    }

    // 首次成功，标记可用
    if (apiAvailable === null) {
      apiAvailable = true;
    }

    const data: TongyiResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch {
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
