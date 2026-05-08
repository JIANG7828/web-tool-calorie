const constants = require('./constants');

const FOOD_DATABASE = [
  {
    id: 'rice',
    name: '米饭',
    category: 'staple',
    caloriePerHundred: 116,
    defaultPortion: 100,
    portions: [
      { label: '小碗', weight: 100 },
      { label: '中碗', weight: 150 },
      { label: '大碗', weight: 200 }
    ]
  },
  {
    id: 'noodles',
    name: '面条',
    category: 'staple',
    caloriePerHundred: 284,
    defaultPortion: 100,
    portions: [
      { label: '小碗', weight: 100 },
      { label: '中碗', weight: 150 },
      { label: '大碗', weight: 200 }
    ]
  },
  {
    id: 'steamed_bun',
    name: '馒头',
    category: 'staple',
    caloriePerHundred: 223,
    defaultPortion: 100,
    portions: [
      { label: '小个', weight: 50 },
      { label: '中个', weight: 80 },
      { label: '大个', weight: 100 }
    ]
  },
  {
    id: 'bread',
    name: '面包',
    category: 'staple',
    caloriePerHundred: 265,
    defaultPortion: 100,
    portions: [
      { label: '片', weight: 50 },
      { label: '个', weight: 100 }
    ]
  },
  {
    id: 'dumplings',
    name: '饺子',
    category: 'staple',
    caloriePerHundred: 242,
    defaultPortion: 100,
    portions: [
      { label: '个', weight: 25 },
      { label: '两', weight: 50 },
      { label: '十个', weight: 250 }
    ]
  },
  {
    id: 'congee',
    name: '白粥',
    category: 'staple',
    caloriePerHundred: 46,
    defaultPortion: 100,
    portions: [
      { label: '小碗', weight: 200 },
      { label: '中碗', weight: 300 },
      { label: '大碗', weight: 400 }
    ]
  },
  {
    id: 'chicken_breast',
    name: '鸡胸肉',
    category: 'meat',
    caloriePerHundred: 133,
    defaultPortion: 100,
    portions: [
      { label: '块', weight: 100 },
      { label: '半块', weight: 50 }
    ]
  },
  {
    id: 'chicken_leg',
    name: '鸡腿',
    category: 'meat',
    caloriePerHundred: 181,
    defaultPortion: 100,
    portions: [
      { label: '个', weight: 120 },
      { label: '半个', weight: 60 }
    ]
  },
  {
    id: 'pork',
    name: '猪肉',
    category: 'meat',
    caloriePerHundred: 143,
    defaultPortion: 100,
    portions: [
      { label: '块', weight: 100 },
      { label: '片', weight: 30 }
    ]
  },
  {
    id: 'pork_ribs',
    name: '排骨',
    category: 'meat',
    caloriePerHundred: 278,
    defaultPortion: 100,
    portions: [
      { label: '块', weight: 100 },
      { label: '两块', weight: 200 }
    ]
  },
  {
    id: 'beef',
    name: '牛肉',
    category: 'meat',
    caloriePerHundred: 125,
    defaultPortion: 100,
    portions: [
      { label: '块', weight: 100 },
      { label: '片', weight: 30 }
    ]
  },
  {
    id: 'fish',
    name: '鱼肉',
    category: 'meat',
    caloriePerHundred: 90,
    defaultPortion: 100,
    portions: [
      { label: '块', weight: 100 },
      { label: '片', weight: 50 }
    ]
  },
  {
    id: 'shrimp',
    name: '虾',
    category: 'meat',
    caloriePerHundred: 93,
    defaultPortion: 100,
    portions: [
      { label: '只', weight: 10 },
      { label: '盘', weight: 150 }
    ]
  },
  {
    id: 'egg',
    name: '鸡蛋',
    category: 'meat',
    caloriePerHundred: 144,
    defaultPortion: 50,
    portions: [
      { label: '个(大)', weight: 60 },
      { label: '个(小)', weight: 50 },
      { label: '蛋白', weight: 30 },
      { label: '蛋黄', weight: 20 }
    ]
  },
  {
    id: 'tofu',
    name: '豆腐',
    category: 'meat',
    caloriePerHundred: 81,
    defaultPortion: 100,
    portions: [
      { label: '块', weight: 100 },
      { label: '半块', weight: 50 }
    ]
  },
  {
    id: 'broccoli',
    name: '西兰花',
    category: 'vegetable',
    caloriePerHundred: 27,
    defaultPortion: 100,
    portions: [
      { label: '朵', weight: 100 },
      { label: '半朵', weight: 50 }
    ]
  },
  {
    id: 'spinach',
    name: '菠菜',
    category: 'vegetable',
    caloriePerHundred: 20,
    defaultPortion: 100,
    portions: [
      { label: '把', weight: 100 },
      { label: '份', weight: 150 }
    ]
  },
  {
    id: 'cabbage',
    name: '白菜',
    category: 'vegetable',
    caloriePerHundred: 17,
    defaultPortion: 100,
    portions: [
      { label: '棵', weight: 500 },
      { label: '份', weight: 200 }
    ]
  },
  {
    id: 'tomato',
    name: '西红柿',
    category: 'vegetable',
    caloriePerHundred: 15,
    defaultPortion: 100,
    portions: [
      { label: '个(大)', weight: 150 },
      { label: '个(小)', weight: 100 }
    ]
  },
  {
    id: 'cucumber',
    name: '黄瓜',
    category: 'vegetable',
    caloriePerHundred: 15,
    defaultPortion: 100,
    portions: [
      { label: '根', weight: 150 },
      { label: '半根', weight: 75 }
    ]
  },
  {
    id: 'lettuce',
    name: '生菜',
    category: 'vegetable',
    caloriePerHundred: 13,
    defaultPortion: 100,
    portions: [
      { label: '棵', weight: 200 },
      { label: '份', weight: 100 }
    ]
  },
  {
    id: 'carrot',
    name: '胡萝卜',
    category: 'vegetable',
    caloriePerHundred: 32,
    defaultPortion: 100,
    portions: [
      { label: '根', weight: 100 },
      { label: '半根', weight: 50 }
    ]
  },
  {
    id: 'apple',
    name: '苹果',
    category: 'fruit',
    caloriePerHundred: 52,
    defaultPortion: 100,
    portions: [
      { label: '个(大)', weight: 250 },
      { label: '个(小)', weight: 150 }
    ]
  },
  {
    id: 'banana',
    name: '香蕉',
    category: 'fruit',
    caloriePerHundred: 93,
    defaultPortion: 100,
    portions: [
      { label: '根', weight: 120 },
      { label: '半根', weight: 60 }
    ]
  },
  {
    id: 'orange',
    name: '橙子',
    category: 'fruit',
    caloriePerHundred: 47,
    defaultPortion: 100,
    portions: [
      { label: '个(大)', weight: 200 },
      { label: '个(小)', weight: 130 }
    ]
  },
  {
    id: 'grape',
    name: '葡萄',
    category: 'fruit',
    caloriePerHundred: 67,
    defaultPortion: 100,
    portions: [
      { label: '颗', weight: 5 },
      { label: '把', weight: 100 }
    ]
  },
  {
    id: 'watermelon',
    name: '西瓜',
    category: 'fruit',
    caloriePerHundred: 30,
    defaultPortion: 100,
    portions: [
      { label: '块', weight: 300 },
      { label: '片', weight: 200 }
    ]
  },
  {
    id: 'strawberry',
    name: '草莓',
    category: 'fruit',
    caloriePerHundred: 30,
    defaultPortion: 100,
    portions: [
      { label: '颗', weight: 15 },
      { label: '盒', weight: 250 }
    ]
  },
  {
    id: 'milk',
    name: '牛奶',
    category: 'dairy',
    caloriePerHundred: 54,
    defaultPortion: 250,
    portions: [
      { label: '盒', weight: 250 },
      { label: '杯', weight: 200 }
    ]
  },
  {
    id: 'yogurt',
    name: '酸奶',
    category: 'dairy',
    caloriePerHundred: 72,
    defaultPortion: 100,
    portions: [
      { label: '杯', weight: 200 },
      { label: '盒', weight: 100 }
    ]
  },
  {
    id: 'cheese',
    name: '奶酪',
    category: 'dairy',
    caloriePerHundred: 328,
    defaultPortion: 30,
    portions: [
      { label: '片', weight: 30 },
      { label: '块', weight: 50 }
    ]
  },
  {
    id: 'water',
    name: '白开水',
    category: 'beverage',
    caloriePerHundred: 0,
    defaultPortion: 250,
    portions: [
      { label: '杯', weight: 250 },
      { label: '瓶', weight: 550 }
    ]
  },
  {
    id: 'green_tea',
    name: '绿茶',
    category: 'beverage',
    caloriePerHundred: 1,
    defaultPortion: 250,
    portions: [
      { label: '杯', weight: 250 }
    ]
  },
  {
    id: 'cola',
    name: '可乐',
    category: 'beverage',
    caloriePerHundred: 42,
    defaultPortion: 330,
    portions: [
      { label: '罐', weight: 330 },
      { label: '瓶', weight: 600 }
    ]
  },
  {
    id: 'juice',
    name: '果汁',
    category: 'beverage',
    caloriePerHundred: 45,
    defaultPortion: 250,
    portions: [
      { label: '杯', weight: 250 },
      { label: '盒', weight: 200 }
    ]
  },
  {
    id: 'coffee',
    name: '咖啡',
    category: 'beverage',
    caloriePerHundred: 1,
    defaultPortion: 240,
    portions: [
      { label: '杯', weight: 240 },
      { label: '美式', weight: 360 }
    ]
  },
  {
    id: 'latte',
    name: '拿铁咖啡',
    category: 'beverage',
    caloriePerHundred: 42,
    defaultPortion: 360,
    portions: [
      { label: '杯', weight: 360 }
    ]
  },
  {
    id: 'potato_chips',
    name: '薯片',
    category: 'snack',
    caloriePerHundred: 548,
    defaultPortion: 30,
    portions: [
      { label: '包', weight: 75 },
      { label: '片', weight: 5 }
    ]
  },
  {
    id: 'chocolate',
    name: '巧克力',
    category: 'snack',
    caloriePerHundred: 546,
    defaultPortion: 30,
    portions: [
      { label: '块', weight: 30 },
      { label: '排', weight: 100 }
    ]
  },
  {
    id: 'ice_cream',
    name: '冰淇淋',
    category: 'snack',
    caloriePerHundred: 207,
    defaultPortion: 100,
    portions: [
      { label: '个', weight: 80 },
      { label: '杯', weight: 150 }
    ]
  },
  {
    id: 'cookie',
    name: '饼干',
    category: 'snack',
    caloriePerHundred: 435,
    defaultPortion: 30,
    portions: [
      { label: '片', weight: 10 },
      { label: '包', weight: 50 }
    ]
  },
  {
    id: 'nuts',
    name: '坚果',
    category: 'snack',
    caloriePerHundred: 607,
    defaultPortion: 30,
    portions: [
      { label: '包', weight: 30 },
      { label: '把', weight: 20 }
    ]
  },
  {
    id: 'popcorn',
    name: '爆米花',
    category: 'snack',
    caloriePerHundred: 387,
    defaultPortion: 30,
    portions: [
      { label: '份', weight: 100 },
      { label: '小包', weight: 30 }
    ]
  },
  {
    id: 'mooncake',
    name: '月饼',
    category: 'snack',
    caloriePerHundred: 411,
    defaultPortion: 100,
    portions: [
      { label: '个', weight: 100 },
      { label: '半块', weight: 50 }
    ]
  },
  {
    id: 'peanuts',
    name: '花生',
    category: 'snack',
    caloriePerHundred: 574,
    defaultPortion: 30,
    portions: [
      { label: '把', weight: 30 },
      { label: '包', weight: 100 }
    ]
  },
  {
    id: 'rice_noodles',
    name: '米粉',
    category: 'staple',
    caloriePerHundred: 355,
    defaultPortion: 100,
    portions: [
      { label: '碗', weight: 300 }
    ]
  },
  {
    id: 'steamed_bun_meat',
    name: '肉包子',
    category: 'staple',
    caloriePerHundred: 227,
    defaultPortion: 80,
    portions: [
      { label: '个', weight: 80 }
    ]
  },
  {
    id: 'soymilk',
    name: '豆浆',
    category: 'beverage',
    caloriePerHundred: 33,
    defaultPortion: 250,
    portions: [
      { label: '杯', weight: 250 },
      { label: '碗', weight: 400 }
    ]
  },
  {
    id: 'fried_rice',
    name: '炒饭',
    category: 'staple',
    caloriePerHundred: 174,
    defaultPortion: 200,
    portions: [
      { label: '份', weight: 200 },
      { label: '小份', weight: 150 }
    ]
  },
  {
    id: 'fried_noodles',
    name: '炒面',
    category: 'staple',
    caloriePerHundred: 179,
    defaultPortion: 200,
    portions: [
      { label: '份', weight: 200 }
    ]
  }
];

const searchFood = (keyword) => {
  if (!keyword || keyword.trim() === '') {
    return [];
  }

  const lowerKeyword = keyword.toLowerCase();
  return FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(lowerKeyword)
  );
};

const getFoodById = (id) => {
  return FOOD_DATABASE.find(food => food.id === id);
};

const getFoodsByCategory = (category) => {
  return FOOD_DATABASE.filter(food => food.category === category);
};

const getAllCategories = () => {
  return constants.FOOD_CATEGORIES;
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
  addCustomFoodToDatabase
};
