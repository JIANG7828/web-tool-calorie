/**
 * AI 附近餐厅推荐服务 - 通义千问版
 * 根据用户当前位置、热量余额、饮食目标，通过 AI 智能推荐附近合适的餐厅
 */

import { callTongyi, parseAIResponse, TongyiMessage } from './tongyiService';
import { RESTAURANTS, Restaurant, RESTAURANT_MENUS, MenuItem } from './takeoutRecommend';

export interface LocationInfo {
  lat: number;
  lng: number;
  city: string;
  district?: string;
}

export interface AIRestaurantRecommendation {
  restaurants: Array<{
    restaurant: Restaurant;
    reason: string;
    recommendedDishes: MenuItem[];
  }>;
  locationHint: string;
}

interface AIResponse {
  locationHint: string;
  recommendations: Array<{
    restaurantId: string;
    reason: string;
    dishNames: string[];
  }>;
}

// 模拟城市区域列表
const DISTRICTS = [
  '朝阳区', '海淀区', '东城区', '西城区', '丰台区', '通州区',
  '昌平区', '大兴区', '顺义区', '石景山区', '房山区', '门头沟区'
];

// 根据经纬度模拟获取城市信息
export async function getLocationFromGPS(): Promise<LocationInfo> {
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // 简单模拟：默认在北京
          const district = DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)];
          resolve({
            lat: latitude,
            lng: longitude,
            city: '北京',
            district,
          });
        },
        () => {
          // 用户拒绝或获取失败，使用默认位置
          resolve({
            lat: 39.9042,
            lng: 116.4074,
            city: '北京',
            district: '朝阳区',
          });
        },
        { timeout: 5000 }
      );
    } else {
      resolve({
        lat: 39.9042,
        lng: 116.4074,
        city: '北京',
        district: '朝阳区',
      });
    }
  });
}

// 根据用户位置筛选附近餐厅
function getNearbyRestaurants(location: LocationInfo, maxDistance: number = 5): Restaurant[] {
  // 模拟距离计算：根据餐厅地址是否包含当前区域或距离字段
  return RESTAURANTS.filter(r => r.distance <= maxDistance).sort((a, b) => {
    // 优先推荐当前区域的餐厅
    const aInDistrict = a.address.includes(location.district || '');
    const bInDistrict = b.address.includes(location.district || '');
    if (aInDistrict && !bInDistrict) return -1;
    if (!aInDistrict && bInDistrict) return 1;
    return a.distance - b.distance;
  });
}

/**
 * AI 附近餐厅推荐
 * 根据用户位置、热量余额、饮食目标推荐附近合适的餐厅
 */
export async function generateRestaurantRecommendations(
  location: LocationInfo,
  remainingCalorie: number,
  userTarget: 'fat' | 'muscle' | 'keep',
  maxRestaurants: number = 6
): Promise<AIRestaurantRecommendation> {
  const nearbyRestaurants = getNearbyRestaurants(location);
  
  const targetLabels: Record<string, string> = {
    fat: '减脂',
    keep: '维持体重',
    muscle: '增肌',
  };

  const restaurantInfo = nearbyRestaurants.map(r => {
    const menuItems = RESTAURANT_MENUS[r.id] || [];
    const lowCalItems = menuItems.filter(m => m.calorie <= remainingCalorie);
    return {
      id: r.id,
      name: r.name,
      distance: r.distance,
      rating: r.rating,
      tags: r.tags,
      address: r.address,
      lowCalorieDishes: lowCalItems.slice(0, 5).map(m => ({
        name: m.name,
        calorie: m.calorie,
        protein: m.protein || 0,
        category: m.category,
      })),
    };
  });

  const systemPrompt: TongyiMessage = {
    role: 'system',
    content: `你是一个专业的饮食推荐 AI 助手。请根据用户当前位置、热量余额和饮食目标，从提供的餐厅列表中推荐最合适的几家餐厅。

请严格按照 JSON 格式返回，不要添加任何其他内容。返回格式：
{
  "locationHint": "简短描述用户所在区域（如：您目前在朝阳区，以下为您推荐附近的优质餐厅）",
  "recommendations": [
    {
      "restaurantId": "餐厅ID（必须与提供的餐厅ID一致）",
      "reason": "推荐理由（20字以内）",
      "dishNames": ["推荐菜品1", "推荐菜品2", "推荐菜品3"]
    }
  ]
}

要求：
1. 推荐 3-6 家餐厅
2. 优先推荐距离近、评分高的餐厅
3. 根据用户目标推荐（减脂推荐低卡/高蛋白菜品，增肌推荐高蛋白菜品）
4. 推荐理由要具体，如"距离近，沙拉低卡健康"
5. 推荐的菜品必须在提供的低卡菜品列表中`
  };

  const userPrompt: TongyiMessage = {
    role: 'user',
    content: `用户信息：
- 当前位置：${location.city}${location.district || ''}
- 剩余热量：${remainingCalorie} 千卡
- 饮食目标：${targetLabels[userTarget]}

附近餐厅列表：
${restaurantInfo.map(r => `
【${r.id}】${r.name}
  距离：${r.distance}km | 评分：${r.rating}
  标签：${r.tags.join('、')}
  地址：${r.address}
  可选低卡菜品（≤${remainingCalorie}千卡）：
${r.lowCalorieDishes.map(d => `    - ${d.name} (${d.calorie}千卡, 蛋白质${d.protein}g, 类别:${d.category})`).join('\n') || '    暂无合适菜品'}
`).join('\n')}

请根据以上信息，推荐最适合的餐厅和菜品。`
  };

  try {
    const response = await callTongyi([systemPrompt, userPrompt]);
    const parsed = parseAIResponse<AIResponse>(response);
    
    if (parsed && parsed.recommendations && parsed.recommendations.length > 0) {
      const result: AIRestaurantRecommendation = {
        locationHint: parsed.locationHint || `为您在${location.city}推荐以下餐厅`,
        restaurants: parsed.recommendations
          .map(rec => {
            const restaurant = RESTAURANTS.find(r => r.id === rec.restaurantId);
            if (!restaurant) return null;
            
            const menuItems = RESTAURANT_MENUS[restaurant.id] || [];
            const recommendedDishes = rec.dishNames
              .map(name => menuItems.find(m => m.name === name))
              .filter((m): m is MenuItem => m !== undefined);
            
            return {
              restaurant,
              reason: rec.reason,
              recommendedDishes: recommendedDishes.slice(0, 3),
            };
          })
          .filter(Boolean) as AIRestaurantRecommendation['restaurants'],
      };
      
      return result;
    }
  } catch (error) {
    console.error('AI 餐厅推荐失败:', error);
  }
  
  // 降级到规则引擎
  return fallbackRuleBasedRestaurantRecommendation(nearbyRestaurants, remainingCalorie, userTarget, location);
}

/**
 * 规则引擎降级方案
 */
function fallbackRuleBasedRestaurantRecommendation(
  nearbyRestaurants: Restaurant[],
  remainingCalorie: number,
  userTarget: 'fat' | 'muscle' | 'keep',
  location: LocationInfo
): AIRestaurantRecommendation {
  const targetDishFilters: Record<string, (item: MenuItem) => boolean> = {
    fat: (item) => item.calorie <= 300 && ((item.protein || 0) >= 10 || item.category === '沙拉' || item.category === '蔬菜'),
    muscle: (item) => (item.protein || 0) >= 15,
    keep: () => true,
  };

  const filter = targetDishFilters[userTarget] || (() => true);

  const recommendations = nearbyRestaurants
    .slice(0, 8)
    .map(restaurant => {
      const menuItems = RESTAURANT_MENUS[restaurant.id] || [];
      const suitableDishes = menuItems.filter(m => m.calorie <= remainingCalorie && filter(m));
      
      return {
        restaurant,
        reason: getFallbackReason(restaurant, userTarget, suitableDishes),
        recommendedDishes: suitableDishes.slice(0, 3),
      };
    })
    .filter(r => r.recommendedDishes.length > 0);

  return {
    locationHint: `为您在${location.city}${location.district || ''}推荐以下餐厅`,
    restaurants: recommendations.slice(0, 6),
  };
}

function getFallbackReason(
  restaurant: Restaurant,
  target: string,
  suitableDishes: MenuItem[]
): string {
  if (target === 'fat') {
    if (restaurant.tags.includes('轻食') || restaurant.tags.includes('健康')) {
      return '轻食健康，适合减脂';
    }
    if (suitableDishes.some(d => d.calorie <= 200)) {
      return '有低卡菜品可选';
    }
    return '有适合减脂的菜品';
  }
  if (target === 'muscle') {
    if (restaurant.tags.includes('高蛋白') || restaurant.tags.includes('健身餐')) {
      return '高蛋白，增肌首选';
    }
    if (suitableDishes.some(d => (d.protein || 0) >= 20)) {
      return '有高蛋白菜品';
    }
    return '蛋白质补充好去处';
  }
  return '菜品丰富，营养均衡';
}
