module.exports = {
  STORAGE_KEYS: {
    USER_SETTINGS: 'user_settings',
    DIET_RECORDS: 'diet_records',
    EXERCISE_RECORDS: 'exercise_records',
    CUSTOM_FOODS: 'custom_foods',
    LAST_FOODS: 'last_foods',
    FOOD_FREQUENCY: 'food_frequency',
    WATER_INTAKE: 'water_intake',
    WEIGHT_RECORDS: 'weight_records',
    CHECK_INS: 'check_ins',
    MEMBER_LEVEL: 'member_level',
    EXERCISE_TEMPLATES: 'exercise_templates',
  },

  MEAL_TYPES: {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  },

  FOOD_CATEGORIES: [
    { id: 'staple', name: '主食', icon: '🍚' },
    { id: 'vegetable', name: '蔬菜', icon: '🥬' },
    { id: 'fruit', name: '水果', icon: '🍎' },
    { id: 'meat', name: '肉蛋', icon: '🥩' },
    { id: 'dairy', name: '奶制品', icon: '🥛' },
    { id: 'bean_nut', name: '豆类坚果', icon: '🥜' },
    { id: 'beverage', name: '饮品', icon: '☕' },
    { id: 'snack', name: '零食', icon: '🍪' },
    { id: 'chinese_dish', name: '中式菜肴', icon: '🥘' },
    { id: 'soup', name: '汤类', icon: '🍲' },
    { id: 'fast_food', name: '快餐', icon: '🍔' },
    { id: 'brand_drink', name: '品牌饮品', icon: '🧋' },
  ],

  WEIGHT_GOALS: {
    fat: '减脂',
    keep: '维持',
    muscle: '增肌'
  },

  ACTIVITY_LEVELS: [
    { value: 1.2, label: '久坐不动', desc: '办公室工作，很少运动' },
    { value: 1.375, label: '轻度活动', desc: '每周运动1-3次' },
    { value: 1.55, label: '中度活动', desc: '每周运动3-5次' },
    { value: 1.725, label: '重度活动', desc: '每周运动6-7次' },
    { value: 1.9, label: '极重度活动', desc: '体力劳动者或专业运动员' }
  ],

  DEFAULT_CALORIE_GOAL: 1600,
  DEFAULT_WATER_GOAL: 8,
  DEFAULT_EXERCISE_TARGET: 300,

  PORTION_UNITS: ['g', 'ml', '个', '份', '杯', '碗', '块', '片'],

  MEMBER_LEVELS: {
    free: { name: '免费版', price: 0 },
    pro: { name: 'Pro版', price: 9.9 },
    premium: { name: '高级版', price: 19.9 }
  }
};
