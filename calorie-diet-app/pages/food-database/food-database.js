const foodDatabase = require('../../utils/food-database');
const constants = require('../../utils/constants');

var CATEGORY_ICONS = {
  '常用': '⭐',
  '主食': '🍚',
  '素菜': '🥬',
  '荤菜': '🥩',
  '奶制品': '🥛',
  '豆类坚果': '🥜',
  '水果': '🍎',
  '零食饮料': '🥤',
  '汤类': '🍲',
  '霸王茶姬': '🧋',
  '蜜雪冰城': '🍦',
  '瑞幸': '☕',
  '库迪': '☕',
  '肯德基': '🍗',
  '麦当劳': '🍔',
  '塔斯汀': '🍔',
  '沙县小吃': '🥟'
};

Page({
  data: {
    searchKeyword: '',
    categories: [],
    currentCategory: null,
    foods: [],
    filteredFoods: [],
    totalCount: 0,
    showSearchBar: false,
    foodDetail: null,
    showDetail: false
  },

  onLoad: function() {
    var cats = constants.FOOD_CATEGORIES;
    var allCats = ['全部'].concat(cats);
    this.setData({
      categories: allCats,
      totalCount: foodDatabase.getAllFoods().length
    });
    this.loadFoods(null);
  },

  loadFoods: function(category) {
    var foods = category ? foodDatabase.getFoodsByCategory(category) : foodDatabase.getAllFoods();
    this.setData({ foods: foods, filteredFoods: foods, currentCategory: category });
  },

  onSearchInput: function(e) {
    var keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    this.filterFoods();
  },

  onSearchConfirm: function() {
    this.filterFoods();
  },

  onClearSearch: function() {
    this.setData({ searchKeyword: '' });
    this.filterFoods();
  },

  toggleSearchBar: function() {
    this.setData({ showSearchBar: !this.data.showSearchBar });
  },

  filterFoods: function() {
    var keyword = this.data.searchKeyword.toLowerCase();
    var category = this.data.currentCategory;

    var foods = category ? foodDatabase.getFoodsByCategory(category) : foodDatabase.getAllFoods();

    if (keyword) {
      foods = foods.filter(function(f) {
        return f.name.toLowerCase().indexOf(keyword) !== -1 ||
          (f.category && f.category.toLowerCase().indexOf(keyword) !== -1);
      });
    }

    this.setData({ filteredFoods: foods });
  },

  onCategoryTap: function(e) {
    var cat = e.currentTarget.dataset.category;
    var category = cat === '全部' ? null : cat;
    this.setData({ currentCategory: category });
    this.loadFoods(category);

    if (this.data.searchKeyword) {
      this.setData({ searchKeyword: '' });
    }
  },

  onFoodTap: function(e) {
    var foodId = e.currentTarget.dataset.id;
    var food = foodDatabase.getFoodById(foodId);

    if (food) {
      this.setData({
        foodDetail: food,
        showDetail: true
      });
    }
  },

  onCloseDetail: function() {
    this.setData({ showDetail: false, foodDetail: null });
  },

  onAddToRecord: function() {
    var food = this.data.foodDetail;
    if (!food) return;

    wx.showModal({
      title: '添加到记录',
      content: '将 "' + food.name + '" (100g, ' + food.caloriePerHundred + '千卡) 添加到今日饮食？',
      success: function(res) {
        if (res.confirm) {
          var dataStore = require('../../utils/data-store');
          var format = require('../../utils/format');

          var macro = foodDatabase.calculateMacro(food.id, 100);

          var record = {
            id: format.generateId(),
            date: format.formatDate(new Date()),
            mealType: 'snack',
            foodName: food.name,
            calorie: food.caloriePerHundred,
            portion: 100,
            portionUnit: 'g',
            macro: macro,
            foodId: food.id,
            source: 'food_database',
            createdAt: Date.now()
          };

          dataStore.addRecord(record);

          wx.showToast({ title: '已添加', icon: 'success' });
        }
      }
    });
  },

  getCalorieColor: function(cal) {
    if (cal <= 100) return '#4CAF50';
    if (cal <= 200) return '#FFC107';
    if (cal <= 300) return '#FF9800';
    return '#F44336';
  },

  getCategoryIcon: function(cat) {
    return CATEGORY_ICONS[cat] || '🍽️';
  }
});
