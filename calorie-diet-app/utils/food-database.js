const constants = require('./constants');

const FOOD_DATABASE = [
  // 主食
  { id: 'rice', name: '米饭', category: 'staple', caloriePerHundred: 116, macroPerHundred: { protein: 2.6, fat: 0.3, carbs: 25.9 }, defaultPortion: 100, portions: [{ label: '小碗', weight: 100 }, { label: '中碗', weight: 150 }, { label: '大碗', weight: 200 }] },
  { id: 'noodles', name: '面条', category: 'staple', caloriePerHundred: 284, macroPerHundred: { protein: 8.6, fat: 1.0, carbs: 58.2 }, defaultPortion: 100, portions: [{ label: '小碗', weight: 100 }, { label: '中碗', weight: 150 }, { label: '大碗', weight: 200 }] },
  { id: 'steamed_bun', name: '馒头', category: 'staple', caloriePerHundred: 223, macroPerHundred: { protein: 7.0, fat: 1.1, carbs: 47.0 }, defaultPortion: 100, portions: [{ label: '小个', weight: 50 }, { label: '中个', weight: 80 }, { label: '大个', weight: 100 }] },
  { id: 'bread', name: '面包', category: 'staple', caloriePerHundred: 265, macroPerHundred: { protein: 8.0, fat: 3.0, carbs: 50.0 }, defaultPortion: 100, portions: [{ label: '片', weight: 50 }, { label: '个', weight: 100 }] },
  { id: 'dumplings', name: '饺子', category: 'staple', caloriePerHundred: 242, macroPerHundred: { protein: 8.0, fat: 8.0, carbs: 34.0 }, defaultPortion: 100, portions: [{ label: '个', weight: 25 }, { label: '两', weight: 50 }, { label: '十个', weight: 250 }] },
  { id: 'congee', name: '白粥', category: 'staple', caloriePerHundred: 46, macroPerHundred: { protein: 1.1, fat: 0.3, carbs: 9.9 }, defaultPortion: 100, portions: [{ label: '小碗', weight: 200 }, { label: '中碗', weight: 300 }, { label: '大碗', weight: 400 }] },
  { id: 'steamed_rice', name: '糙米饭', category: 'staple', caloriePerHundred: 111, macroPerHundred: { protein: 2.7, fat: 0.9, carbs: 23.5 }, defaultPortion: 100, portions: [{ label: '小碗', weight: 100 }, { label: '中碗', weight: 150 }] },
  { id: 'sweet_potato', name: '红薯', category: 'staple', caloriePerHundred: 86, macroPerHundred: { protein: 1.6, fat: 0.2, carbs: 20.1 }, defaultPortion: 100, portions: [{ label: '小个', weight: 100 }, { label: '中个', weight: 200 }] },
  { id: 'corn', name: '玉米', category: 'staple', caloriePerHundred: 112, macroPerHundred: { protein: 4.0, fat: 1.2, carbs: 22.8 }, defaultPortion: 100, portions: [{ label: '根', weight: 200 }, { label: '半根', weight: 100 }] },
  { id: 'oatmeal', name: '燕麦粥', category: 'staple', caloriePerHundred: 68, macroPerHundred: { protein: 2.5, fat: 1.4, carbs: 11.5 }, defaultPortion: 100, portions: [{ label: '碗', weight: 250 }] },
  { id: 'fried_rice', name: '炒饭', category: 'staple', caloriePerHundred: 174, macroPerHundred: { protein: 4.2, fat: 5.3, carbs: 28.0 }, defaultPortion: 200, portions: [{ label: '份', weight: 200 }, { label: '小份', weight: 150 }] },
  { id: 'fried_noodles', name: '炒面', category: 'staple', caloriePerHundred: 179, macroPerHundred: { protein: 4.5, fat: 5.8, carbs: 26.0 }, defaultPortion: 200, portions: [{ label: '份', weight: 200 }] },
  { id: 'rice_noodles', name: '米粉', category: 'staple', caloriePerHundred: 355, macroPerHundred: { protein: 7.4, fat: 0.8, carbs: 78.0 }, defaultPortion: 100, portions: [{ label: '碗', weight: 300 }] },
  { id: 'steamed_bun_meat', name: '肉包子', category: 'staple', caloriePerHundred: 227, macroPerHundred: { protein: 7.8, fat: 8.2, carbs: 31.0 }, defaultPortion: 80, portions: [{ label: '个', weight: 80 }] },

  // 蔬菜
  { id: 'broccoli', name: '西兰花', category: 'vegetable', caloriePerHundred: 27, macroPerHundred: { protein: 2.6, fat: 0.4, carbs: 4.3 }, defaultPortion: 100, portions: [{ label: '朵', weight: 100 }, { label: '半朵', weight: 50 }] },
  { id: 'spinach', name: '菠菜', category: 'vegetable', caloriePerHundred: 20, macroPerHundred: { protein: 2.6, fat: 0.3, carbs: 2.8 }, defaultPortion: 100, portions: [{ label: '把', weight: 100 }, { label: '份', weight: 150 }] },
  { id: 'cabbage', name: '白菜', category: 'vegetable', caloriePerHundred: 17, macroPerHundred: { protein: 1.5, fat: 0.1, carbs: 3.2 }, defaultPortion: 100, portions: [{ label: '棵', weight: 500 }, { label: '份', weight: 200 }] },
  { id: 'tomato', name: '西红柿', category: 'vegetable', caloriePerHundred: 15, macroPerHundred: { protein: 0.9, fat: 0.2, carbs: 3.5 }, defaultPortion: 100, portions: [{ label: '个(大)', weight: 150 }, { label: '个(小)', weight: 100 }] },
  { id: 'cucumber', name: '黄瓜', category: 'vegetable', caloriePerHundred: 15, macroPerHundred: { protein: 0.8, fat: 0.2, carbs: 2.9 }, defaultPortion: 100, portions: [{ label: '根', weight: 150 }, { label: '半根', weight: 75 }] },
  { id: 'lettuce', name: '生菜', category: 'vegetable', caloriePerHundred: 13, macroPerHundred: { protein: 1.3, fat: 0.2, carbs: 2.1 }, defaultPortion: 100, portions: [{ label: '棵', weight: 200 }, { label: '份', weight: 100 }] },
  { id: 'carrot', name: '胡萝卜', category: 'vegetable', caloriePerHundred: 32, macroPerHundred: { protein: 0.9, fat: 0.2, carbs: 7.6 }, defaultPortion: 100, portions: [{ label: '根', weight: 100 }, { label: '半根', weight: 50 }] },
  { id: 'celery', name: '芹菜', category: 'vegetable', caloriePerHundred: 14, macroPerHundred: { protein: 1.2, fat: 0.2, carbs: 2.5 }, defaultPortion: 100, portions: [{ label: '根', weight: 80 }] },
  { id: 'mushroom', name: '蘑菇', category: 'vegetable', caloriePerHundred: 22, macroPerHundred: { protein: 2.7, fat: 0.3, carbs: 3.4 }, defaultPortion: 100, portions: [{ label: '朵', weight: 30 }, { label: '份', weight: 100 }] },
  { id: 'potato', name: '土豆', category: 'vegetable', caloriePerHundred: 77, macroPerHundred: { protein: 2.0, fat: 0.1, carbs: 17.2 }, defaultPortion: 100, portions: [{ label: '个', weight: 150 }] },
  { id: 'eggplant', name: '茄子', category: 'vegetable', caloriePerHundred: 23, macroPerHundred: { protein: 1.0, fat: 0.2, carbs: 4.9 }, defaultPortion: 100, portions: [{ label: '个', weight: 200 }] },
  { id: 'pepper', name: '青椒', category: 'vegetable', caloriePerHundred: 20, macroPerHundred: { protein: 1.0, fat: 0.2, carbs: 4.0 }, defaultPortion: 100, portions: [{ label: '个', weight: 80 }] },
  { id: 'onion', name: '洋葱', category: 'vegetable', caloriePerHundred: 39, macroPerHundred: { protein: 1.1, fat: 0.1, carbs: 9.0 }, defaultPortion: 100, portions: [{ label: '个', weight: 150 }] },
  { id: 'pumpkin', name: '南瓜', category: 'vegetable', caloriePerHundred: 23, macroPerHundred: { protein: 0.7, fat: 0.1, carbs: 5.3 }, defaultPortion: 100, portions: [{ label: '块', weight: 200 }] },

  // 水果
  { id: 'apple', name: '苹果', category: 'fruit', caloriePerHundred: 52, macroPerHundred: { protein: 0.3, fat: 0.2, carbs: 13.8 }, defaultPortion: 100, portions: [{ label: '个(大)', weight: 250 }, { label: '个(小)', weight: 150 }] },
  { id: 'banana', name: '香蕉', category: 'fruit', caloriePerHundred: 93, macroPerHundred: { protein: 1.1, fat: 0.3, carbs: 22.0 }, defaultPortion: 100, portions: [{ label: '根', weight: 120 }, { label: '半根', weight: 60 }] },
  { id: 'orange', name: '橙子', category: 'fruit', caloriePerHundred: 47, macroPerHundred: { protein: 0.9, fat: 0.1, carbs: 11.8 }, defaultPortion: 100, portions: [{ label: '个(大)', weight: 200 }, { label: '个(小)', weight: 130 }] },
  { id: 'grape', name: '葡萄', category: 'fruit', caloriePerHundred: 67, macroPerHundred: { protein: 0.7, fat: 0.4, carbs: 17.2 }, defaultPortion: 100, portions: [{ label: '颗', weight: 5 }, { label: '把', weight: 100 }] },
  { id: 'watermelon', name: '西瓜', category: 'fruit', caloriePerHundred: 30, macroPerHundred: { protein: 0.6, fat: 0.1, carbs: 7.6 }, defaultPortion: 100, portions: [{ label: '块', weight: 300 }, { label: '片', weight: 200 }] },
  { id: 'strawberry', name: '草莓', category: 'fruit', caloriePerHundred: 30, macroPerHundred: { protein: 0.7, fat: 0.2, carbs: 6.7 }, defaultPortion: 100, portions: [{ label: '颗', weight: 15 }, { label: '盒', weight: 250 }] },
  { id: 'peach', name: '桃子', category: 'fruit', caloriePerHundred: 44, macroPerHundred: { protein: 0.9, fat: 0.2, carbs: 10.4 }, defaultPortion: 100, portions: [{ label: '个', weight: 150 }] },
  { id: 'pear', name: '梨', category: 'fruit', caloriePerHundred: 57, macroPerHundred: { protein: 0.4, fat: 0.1, carbs: 14.4 }, defaultPortion: 100, portions: [{ label: '个', weight: 200 }] },
  { id: 'mango', name: '芒果', category: 'fruit', caloriePerHundred: 60, macroPerHundred: { protein: 0.8, fat: 0.4, carbs: 14.2 }, defaultPortion: 100, portions: [{ label: '个', weight: 200 }] },
  { id: 'kiwi', name: '猕猴桃', category: 'fruit', caloriePerHundred: 61, macroPerHundred: { protein: 1.1, fat: 0.5, carbs: 13.5 }, defaultPortion: 100, portions: [{ label: '个', weight: 80 }] },
  { id: 'cherry', name: '樱桃', category: 'fruit', caloriePerHundred: 63, macroPerHundred: { protein: 1.1, fat: 0.2, carbs: 15.0 }, defaultPortion: 100, portions: [{ label: '颗', weight: 8 }, { label: '盒', weight: 200 }] },
  { id: 'blueberry', name: '蓝莓', category: 'fruit', caloriePerHundred: 57, macroPerHundred: { protein: 0.7, fat: 0.3, carbs: 14.0 }, defaultPortion: 100, portions: [{ label: '盒', weight: 125 }] },

  // 肉蛋
  { id: 'chicken_breast', name: '鸡胸肉', category: 'meat', caloriePerHundred: 133, macroPerHundred: { protein: 30.6, fat: 1.2, carbs: 0 }, defaultPortion: 100, portions: [{ label: '块', weight: 100 }, { label: '半块', weight: 50 }] },
  { id: 'chicken_leg', name: '鸡腿', category: 'meat', caloriePerHundred: 181, macroPerHundred: { protein: 20.6, fat: 10.2, carbs: 0 }, defaultPortion: 100, portions: [{ label: '个', weight: 120 }, { label: '半个', weight: 60 }] },
  { id: 'pork', name: '猪肉', category: 'meat', caloriePerHundred: 143, macroPerHundred: { protein: 20.3, fat: 6.3, carbs: 0 }, defaultPortion: 100, portions: [{ label: '块', weight: 100 }, { label: '片', weight: 30 }] },
  { id: 'pork_ribs', name: '排骨', category: 'meat', caloriePerHundred: 278, macroPerHundred: { protein: 16.0, fat: 23.0, carbs: 0 }, defaultPortion: 100, portions: [{ label: '块', weight: 100 }, { label: '两块', weight: 200 }] },
  { id: 'beef', name: '牛肉', category: 'meat', caloriePerHundred: 125, macroPerHundred: { protein: 20.2, fat: 4.2, carbs: 0 }, defaultPortion: 100, portions: [{ label: '块', weight: 100 }, { label: '片', weight: 30 }] },
  { id: 'fish', name: '鱼肉', category: 'meat', caloriePerHundred: 90, macroPerHundred: { protein: 18.0, fat: 2.0, carbs: 0 }, defaultPortion: 100, portions: [{ label: '块', weight: 100 }, { label: '片', weight: 50 }] },
  { id: 'shrimp', name: '虾', category: 'meat', caloriePerHundred: 93, macroPerHundred: { protein: 18.6, fat: 1.6, carbs: 0.8 }, defaultPortion: 100, portions: [{ label: '只', weight: 10 }, { label: '盘', weight: 150 }] },
  { id: 'egg', name: '鸡蛋', category: 'meat', caloriePerHundred: 144, macroPerHundred: { protein: 13.3, fat: 8.8, carbs: 2.8 }, defaultPortion: 50, portions: [{ label: '个(大)', weight: 60 }, { label: '个(小)', weight: 50 }, { label: '蛋白', weight: 30 }, { label: '蛋黄', weight: 20 }] },
  { id: 'tofu', name: '豆腐', category: 'meat', caloriePerHundred: 81, macroPerHundred: { protein: 8.1, fat: 3.7, carbs: 4.2 }, defaultPortion: 100, portions: [{ label: '块', weight: 100 }, { label: '半块', weight: 50 }] },
  { id: 'sausage', name: '香肠', category: 'meat', caloriePerHundred: 268, macroPerHundred: { protein: 14.0, fat: 22.0, carbs: 3.0 }, defaultPortion: 50, portions: [{ label: '根', weight: 50 }] },
  { id: 'bacon', name: '培根', category: 'meat', caloriePerHundred: 394, macroPerHundred: { protein: 15.0, fat: 36.0, carbs: 0.7 }, defaultPortion: 30, portions: [{ label: '片', weight: 15 }] },
  { id: 'duck', name: '鸭肉', category: 'meat', caloriePerHundred: 180, macroPerHundred: { protein: 16.0, fat: 12.0, carbs: 0 }, defaultPortion: 100, portions: [{ label: '块', weight: 100 }] },
  { id: 'lamb', name: '羊肉', category: 'meat', caloriePerHundred: 178, macroPerHundred: { protein: 18.0, fat: 11.0, carbs: 0 }, defaultPortion: 100, portions: [{ label: '块', weight: 100 }] },
  { id: 'crab', name: '蟹', category: 'meat', caloriePerHundred: 96, macroPerHundred: { protein: 18.0, fat: 2.0, carbs: 1.0 }, defaultPortion: 100, portions: [{ label: '只', weight: 150 }] },

  // 奶制品
  { id: 'milk', name: '牛奶', category: 'dairy', caloriePerHundred: 54, macroPerHundred: { protein: 3.0, fat: 3.2, carbs: 3.4 }, defaultPortion: 250, portions: [{ label: '盒', weight: 250 }, { label: '杯', weight: 200 }] },
  { id: 'yogurt', name: '酸奶', category: 'dairy', caloriePerHundred: 72, macroPerHundred: { protein: 3.1, fat: 3.2, carbs: 6.5 }, defaultPortion: 100, portions: [{ label: '杯', weight: 200 }, { label: '盒', weight: 100 }] },
  { id: 'cheese', name: '奶酪', category: 'dairy', caloriePerHundred: 328, macroPerHundred: { protein: 25.0, fat: 25.0, carbs: 2.5 }, defaultPortion: 30, portions: [{ label: '片', weight: 30 }, { label: '块', weight: 50 }] },
  { id: 'butter', name: '黄油', category: 'dairy', caloriePerHundred: 717, macroPerHundred: { protein: 0.9, fat: 81.0, carbs: 0.1 }, defaultPortion: 10, portions: [{ label: '块', weight: 10 }] },
  { id: 'cream', name: '奶油', category: 'dairy', caloriePerHundred: 350, macroPerHundred: { protein: 2.0, fat: 35.0, carbs: 3.0 }, defaultPortion: 30, portions: [{ label: '勺', weight: 15 }] },
  { id: 'soymilk', name: '豆浆', category: 'dairy', caloriePerHundred: 33, macroPerHundred: { protein: 2.8, fat: 1.6, carbs: 1.6 }, defaultPortion: 250, portions: [{ label: '杯', weight: 250 }, { label: '碗', weight: 400 }] },

  // 豆类坚果
  { id: 'soybean', name: '黄豆', category: 'bean_nut', caloriePerHundred: 391, macroPerHundred: { protein: 35.0, fat: 16.0, carbs: 34.0 }, defaultPortion: 50, portions: [{ label: '把', weight: 50 }] },
  { id: 'red_bean', name: '红豆', category: 'bean_nut', caloriePerHundred: 324, macroPerHundred: { protein: 20.2, fat: 0.6, carbs: 63.0 }, defaultPortion: 50, portions: [{ label: '把', weight: 50 }] },
  { id: 'mung_bean', name: '绿豆', category: 'bean_nut', caloriePerHundred: 323, macroPerHundred: { protein: 21.6, fat: 1.0, carbs: 59.0 }, defaultPortion: 50, portions: [{ label: '把', weight: 50 }] },
  { id: 'peanuts', name: '花生', category: 'bean_nut', caloriePerHundred: 574, macroPerHundred: { protein: 24.8, fat: 44.3, carbs: 26.0 }, defaultPortion: 30, portions: [{ label: '把', weight: 30 }, { label: '包', weight: 100 }] },
  { id: 'walnut', name: '核桃', category: 'bean_nut', caloriePerHundred: 654, macroPerHundred: { protein: 15.0, fat: 65.0, carbs: 14.0 }, defaultPortion: 30, portions: [{ label: '颗', weight: 10 }] },
  { id: 'almond', name: '杏仁', category: 'bean_nut', caloriePerHundred: 576, macroPerHundred: { protein: 21.0, fat: 49.0, carbs: 22.0 }, defaultPortion: 30, portions: [{ label: '把', weight: 30 }] },
  { id: 'cashew', name: '腰果', category: 'bean_nut', caloriePerHundred: 559, macroPerHundred: { protein: 18.0, fat: 44.0, carbs: 30.0 }, defaultPortion: 30, portions: [{ label: '把', weight: 30 }] },
  { id: 'sunflower_seeds', name: '瓜子', category: 'bean_nut', caloriePerHundred: 607, macroPerHundred: { protein: 24.0, fat: 53.0, carbs: 19.0 }, defaultPortion: 30, portions: [{ label: '把', weight: 30 }] },

  // 饮品
  { id: 'water', name: '白开水', category: 'beverage', caloriePerHundred: 0, macroPerHundred: { protein: 0, fat: 0, carbs: 0 }, defaultPortion: 250, portions: [{ label: '杯', weight: 250 }, { label: '瓶', weight: 550 }] },
  { id: 'green_tea', name: '绿茶', category: 'beverage', caloriePerHundred: 1, macroPerHundred: { protein: 0, fat: 0, carbs: 0.2 }, defaultPortion: 250, portions: [{ label: '杯', weight: 250 }] },
  { id: 'cola', name: '可乐', category: 'beverage', caloriePerHundred: 42, macroPerHundred: { protein: 0, fat: 0, carbs: 10.6 }, defaultPortion: 330, portions: [{ label: '罐', weight: 330 }, { label: '瓶', weight: 600 }] },
  { id: 'juice', name: '果汁', category: 'beverage', caloriePerHundred: 45, macroPerHundred: { protein: 0.3, fat: 0.1, carbs: 11.0 }, defaultPortion: 250, portions: [{ label: '杯', weight: 250 }, { label: '盒', weight: 200 }] },
  { id: 'coffee', name: '黑咖啡', category: 'beverage', caloriePerHundred: 1, macroPerHundred: { protein: 0.1, fat: 0, carbs: 0.3 }, defaultPortion: 240, portions: [{ label: '杯', weight: 240 }, { label: '美式', weight: 360 }] },
  { id: 'latte', name: '拿铁咖啡', category: 'beverage', caloriePerHundred: 42, macroPerHundred: { protein: 2.0, fat: 2.0, carbs: 4.5 }, defaultPortion: 360, portions: [{ label: '杯', weight: 360 }] },
  { id: 'milk_tea', name: '奶茶', category: 'beverage', caloriePerHundred: 85, macroPerHundred: { protein: 2.0, fat: 3.5, carbs: 12.0 }, defaultPortion: 500, portions: [{ label: '杯', weight: 500 }] },
  { id: 'beer', name: '啤酒', category: 'beverage', caloriePerHundred: 43, macroPerHundred: { protein: 0.4, fat: 0, carbs: 3.5 }, defaultPortion: 500, portions: [{ label: '瓶', weight: 500 }] },
  { id: 'red_wine', name: '红酒', category: 'beverage', caloriePerHundred: 85, macroPerHundred: { protein: 0.1, fat: 0, carbs: 2.6 }, defaultPortion: 150, portions: [{ label: '杯', weight: 150 }] },

  // 零食
  { id: 'potato_chips', name: '薯片', category: 'snack', caloriePerHundred: 548, macroPerHundred: { protein: 7.0, fat: 35.0, carbs: 53.0 }, defaultPortion: 30, portions: [{ label: '包', weight: 75 }, { label: '片', weight: 5 }] },
  { id: 'chocolate', name: '巧克力', category: 'snack', caloriePerHundred: 546, macroPerHundred: { protein: 5.0, fat: 31.0, carbs: 60.0 }, defaultPortion: 30, portions: [{ label: '块', weight: 30 }, { label: '排', weight: 100 }] },
  { id: 'ice_cream', name: '冰淇淋', category: 'snack', caloriePerHundred: 207, macroPerHundred: { protein: 3.5, fat: 11.0, carbs: 24.0 }, defaultPortion: 100, portions: [{ label: '个', weight: 80 }, { label: '杯', weight: 150 }] },
  { id: 'cookie', name: '饼干', category: 'snack', caloriePerHundred: 435, macroPerHundred: { protein: 8.0, fat: 14.0, carbs: 70.0 }, defaultPortion: 30, portions: [{ label: '片', weight: 10 }, { label: '包', weight: 50 }] },
  { id: 'nuts', name: '混合坚果', category: 'snack', caloriePerHundred: 607, macroPerHundred: { protein: 20.0, fat: 50.0, carbs: 20.0 }, defaultPortion: 30, portions: [{ label: '包', weight: 30 }, { label: '把', weight: 20 }] },
  { id: 'popcorn', name: '爆米花', category: 'snack', caloriePerHundred: 387, macroPerHundred: { protein: 13.0, fat: 4.5, carbs: 78.0 }, defaultPortion: 30, portions: [{ label: '份', weight: 100 }, { label: '小包', weight: 30 }] },
  { id: 'mooncake', name: '月饼', category: 'snack', caloriePerHundred: 411, macroPerHundred: { protein: 8.0, fat: 15.0, carbs: 63.0 }, defaultPortion: 100, portions: [{ label: '个', weight: 100 }, { label: '半块', weight: 50 }] },
  { id: 'cake', name: '蛋糕', category: 'snack', caloriePerHundred: 348, macroPerHundred: { protein: 7.0, fat: 14.0, carbs: 50.0 }, defaultPortion: 80, portions: [{ label: '块', weight: 80 }] },
  { id: 'candy', name: '糖果', category: 'snack', caloriePerHundred: 400, macroPerHundred: { protein: 0.5, fat: 0.5, carbs: 98.0 }, defaultPortion: 10, portions: [{ label: '颗', weight: 5 }] },
  { id: 'dried_fruit', name: '果干', category: 'snack', caloriePerHundred: 350, macroPerHundred: { protein: 2.0, fat: 1.0, carbs: 85.0 }, defaultPortion: 30, portions: [{ label: '包', weight: 30 }] },
  { id: 'pudding', name: '布丁', category: 'snack', caloriePerHundred: 130, macroPerHundred: { protein: 3.5, fat: 5.0, carbs: 18.0 }, defaultPortion: 100, portions: [{ label: '杯', weight: 100 }] },

  // 中式菜肴
  { id: 'tomato_egg', name: '西红柿炒蛋', category: 'chinese_dish', caloriePerHundred: 92, macroPerHundred: { protein: 5.0, fat: 6.0, carbs: 4.0 }, defaultPortion: 150, portions: [{ label: '份', weight: 150 }] },
  { id: 'kung_pao_chicken', name: '宫保鸡丁', category: 'chinese_dish', caloriePerHundred: 165, macroPerHundred: { protein: 16.0, fat: 8.0, carbs: 8.0 }, defaultPortion: 200, portions: [{ label: '份', weight: 200 }] },
  { id: 'mapo_tofu', name: '麻婆豆腐', category: 'chinese_dish', caloriePerHundred: 115, macroPerHundred: { protein: 8.0, fat: 7.0, carbs: 5.0 }, defaultPortion: 200, portions: [{ label: '份', weight: 200 }] },
  { id: 'sweet_sour_pork', name: '糖醋里脊', category: 'chinese_dish', caloriePerHundred: 195, macroPerHundred: { protein: 14.0, fat: 8.0, carbs: 16.0 }, defaultPortion: 150, portions: [{ label: '份', weight: 150 }] },
  { id: 'stir_fry_vegetables', name: '清炒时蔬', category: 'chinese_dish', caloriePerHundred: 65, macroPerHundred: { protein: 2.5, fat: 4.0, carbs: 5.0 }, defaultPortion: 150, portions: [{ label: '份', weight: 150 }] },
  { id: 'steamed_fish', name: '清蒸鱼', category: 'chinese_dish', caloriePerHundred: 95, macroPerHundred: { protein: 18.0, fat: 2.0, carbs: 1.0 }, defaultPortion: 200, portions: [{ label: '份', weight: 200 }] },
  { id: 'braised_pork', name: '红烧肉', category: 'chinese_dish', caloriePerHundred: 280, macroPerHundred: { protein: 14.0, fat: 24.0, carbs: 4.0 }, defaultPortion: 150, portions: [{ label: '份', weight: 150 }] },
  { id: 'hot_pot', name: '火锅', category: 'chinese_dish', caloriePerHundred: 120, macroPerHundred: { protein: 10.0, fat: 7.0, carbs: 5.0 }, defaultPortion: 500, portions: [{ label: '份', weight: 500 }] },

  // 汤类
  { id: 'egg_drop_soup', name: '蛋花汤', category: 'soup', caloriePerHundred: 25, macroPerHundred: { protein: 2.5, fat: 1.0, carbs: 2.0 }, defaultPortion: 250, portions: [{ label: '碗', weight: 250 }] },
  { id: 'tomato_soup', name: '西红柿蛋汤', category: 'soup', caloriePerHundred: 30, macroPerHundred: { protein: 2.0, fat: 1.5, carbs: 3.0 }, defaultPortion: 250, portions: [{ label: '碗', weight: 250 }] },
  { id: 'chicken_soup', name: '鸡汤', category: 'soup', caloriePerHundred: 40, macroPerHundred: { protein: 5.0, fat: 1.5, carbs: 2.0 }, defaultPortion: 300, portions: [{ label: '碗', weight: 300 }] },
  { id: 'seaweed_soup', name: '紫菜汤', category: 'soup', caloriePerHundred: 20, macroPerHundred: { protein: 1.5, fat: 0.5, carbs: 3.0 }, defaultPortion: 250, portions: [{ label: '碗', weight: 250 }] },
  { id: 'mushroom_soup', name: '蘑菇汤', category: 'soup', caloriePerHundred: 35, macroPerHundred: { protein: 2.5, fat: 1.5, carbs: 3.5 }, defaultPortion: 250, portions: [{ label: '碗', weight: 250 }] },
  { id: 'corn_soup', name: '玉米浓汤', category: 'soup', caloriePerHundred: 65, macroPerHundred: { protein: 2.0, fat: 3.0, carbs: 8.0 }, defaultPortion: 250, portions: [{ label: '碗', weight: 250 }] },

  // 快餐
  { id: 'hamburger', name: '汉堡', category: 'fast_food', caloriePerHundred: 295, macroPerHundred: { protein: 13.0, fat: 14.0, carbs: 28.0 }, defaultPortion: 150, portions: [{ label: '个', weight: 150 }] },
  { id: 'french_fries', name: '薯条', category: 'fast_food', caloriePerHundred: 312, macroPerHundred: { protein: 3.5, fat: 15.0, carbs: 41.0 }, defaultPortion: 100, portions: [{ label: '份', weight: 100 }, { label: '大份', weight: 150 }] },
  { id: 'pizza', name: '披萨', category: 'fast_food', caloriePerHundred: 266, macroPerHundred: { protein: 11.0, fat: 10.0, carbs: 33.0 }, defaultPortion: 100, portions: [{ label: '片', weight: 100 }] },
  { id: 'fried_chicken', name: '炸鸡', category: 'fast_food', caloriePerHundred: 300, macroPerHundred: { protein: 18.0, fat: 20.0, carbs: 15.0 }, defaultPortion: 150, portions: [{ label: '块', weight: 150 }] },
  { id: 'sandwich', name: '三明治', category: 'fast_food', caloriePerHundred: 215, macroPerHundred: { protein: 10.0, fat: 8.0, carbs: 26.0 }, defaultPortion: 150, portions: [{ label: '个', weight: 150 }] },
  { id: 'hot_dog', name: '热狗', category: 'fast_food', caloriePerHundred: 260, macroPerHundred: { protein: 10.0, fat: 18.0, carbs: 15.0 }, defaultPortion: 100, portions: [{ label: '个', weight: 100 }] },

  // 品牌饮品
  { id: 'luckin_latte', name: '瑞幸拿铁', category: 'brand_drink', caloriePerHundred: 55, macroPerHundred: { protein: 2.5, fat: 2.5, carbs: 5.5 }, defaultPortion: 360, portions: [{ label: '杯', weight: 360 }] },
  { id: 'luckin_americano', name: '瑞幸美式', category: 'brand_drink', caloriePerHundred: 5, macroPerHundred: { protein: 0.3, fat: 0, carbs: 1.0 }, defaultPortion: 360, portions: [{ label: '杯', weight: 360 }] },
  { id: 'mixue_tea', name: '蜜雪冰城奶茶', category: 'brand_drink', caloriePerHundred: 90, macroPerHundred: { protein: 1.5, fat: 3.0, carbs: 14.0 }, defaultPortion: 500, portions: [{ label: '杯', weight: 500 }] },
  { id: 'mixue_ice', name: '蜜雪冰城冰淇淋', category: 'brand_drink', caloriePerHundred: 180, macroPerHundred: { protein: 3.0, fat: 9.0, carbs: 22.0 }, defaultPortion: 150, portions: [{ label: '个', weight: 150 }] },
  { id: 'chagee_milk', name: '霸王茶姬奶茶', category: 'brand_drink', caloriePerHundred: 95, macroPerHundred: { protein: 2.0, fat: 3.5, carbs: 15.0 }, defaultPortion: 500, portions: [{ label: '杯', weight: 500 }] },
  { id: 'cotti_latte', name: '库迪拿铁', category: 'brand_drink', caloriePerHundred: 58, macroPerHundred: { protein: 2.5, fat: 2.8, carbs: 5.8 }, defaultPortion: 360, portions: [{ label: '杯', weight: 360 }] },
];

const searchFood = (keyword) => {
  if (!keyword || keyword.trim() === '') return [];
  const lowerKeyword = keyword.trim().toLowerCase();
  return FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(lowerKeyword)
  );
};

const getFoodById = (id) => FOOD_DATABASE.find(food => food.id === id);

const getFoodsByCategory = (category) => FOOD_DATABASE.filter(food => food.category === category);

const getAllCategories = () => constants.FOOD_CATEGORIES;

const calculateCalorie = (foodId, weight) => {
  const food = getFoodById(foodId);
  if (!food) return 0;
  return Math.round((food.caloriePerHundred * weight) / 100);
};

const calculateMacro = (foodId, weight) => {
  const food = getFoodById(foodId);
  if (!food || !food.macroPerHundred) return { protein: 0, fat: 0, carbs: 0 };
  return {
    protein: Number(((food.macroPerHundred.protein * weight) / 100).toFixed(1)),
    fat: Number(((food.macroPerHundred.fat * weight) / 100).toFixed(1)),
    carbs: Number(((food.macroPerHundred.carbs * weight) / 100).toFixed(1))
  };
};

const addCustomFoodToDatabase = (food) => {
  FOOD_DATABASE.push({
    ...food,
    id: 'custom_' + Date.now(),
    isCustom: true
  });
  return food;
};

module.exports = {
  FOOD_DATABASE,
  searchFood,
  getFoodById,
  getFoodsByCategory,
  getAllCategories,
  calculateCalorie,
  calculateMacro,
  addCustomFoodToDatabase
};
