module.exports = {
  STORAGE_KEYS: {
    USER_SETTINGS: 'user_settings',
    DIET_RECORDS: 'diet_records',
    CUSTOM_FOODS: 'custom_foods',
    LAST_FOODS: 'last_foods'
  },

  MEAL_TYPES: {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  },

  FOOD_CATEGORIES: [
    { id: 'staple', name: '主食' },
    { id: 'meat', name: '肉蛋' },
    { id: 'vegetable', name: '蔬菜' },
    { id: 'fruit', name: '水果' },
    { id: 'dairy', name: '奶制品' },
    { id: 'beverage', name: '饮品' },
    { id: 'snack', name: '零食' }
  ],

  DEFAULT_CALORIE_GOAL: 1600,

  PORTION_UNITS: ['g', 'ml', '个', '份', '杯', '碗', '块', '片']
};
