const foodDatabase = require('../../utils/food-database');
const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');
const constants = require('../../utils/constants');

Page({
  data: {
    searchKeyword: '',
    searchResults: [],
    categories: constants.FOOD_CATEGORIES,
    currentCategory: null,
    lastFoods: [],
    selectedFood: null,
    selectedPortion: null,
    customCalories: '',
    customFoodName: '',
    mealType: 'breakfast',
    date: '',
    showFoodDetail: false,
    showCustomInput: false,
    macroInfo: { protein: 0, fat: 0, carbs: 0 }
  },

  onLoad: function(options) {
    const mealType = options.mealType || 'breakfast';
    const date = options.date || format.formatDate(new Date());

    this.setData({
      mealType: mealType,
      date: date
    });

    this.loadLastFoods();
    this.loadCategoriesFoods();
  },

  loadLastFoods: function() {
    const lastFoods = dataStore.getLastFoods();
    this.setData({
      lastFoods: lastFoods
    });
  },

  loadCategoriesFoods: function() {
    if (!this.data.currentCategory) {
      return;
    }

    const foods = foodDatabase.getFoodsByCategory(this.data.currentCategory);
    this.setData({
      searchResults: foods
    });
  },

  onSearch: function(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });

    if (keyword.trim()) {
      const results = foodDatabase.searchFood(keyword);
      this.setData({
        searchResults: results,
        currentCategory: null
      });
    } else {
      this.loadCategoriesFoods();
    }
  },

  selectCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category,
      searchKeyword: ''
    });
    this.loadCategoriesFoods();
  },

  selectFood: function(e) {
    const foodId = e.currentTarget.dataset.id;
    const food = foodDatabase.getFoodById(foodId);

    if (food) {
      const macro = food.macroPerHundred ? {
        protein: food.macroPerHundred.protein,
        fat: food.macroPerHundred.fat,
        carbs: food.macroPerHundred.carbs
      } : { protein: 0, fat: 0, carbs: 0 };

      this.setData({
        selectedFood: food,
        selectedPortion: food.portions[0],
        showFoodDetail: true,
        showCustomInput: false,
        customCalories: '',
        macroInfo: macro
      });
    }
  },

  selectPortion: function(e) {
    const index = e.currentTarget.dataset.index;
    const food = this.data.selectedFood;
    const weight = food.portions[index].weight;
    const macro = foodDatabase.calculateMacro(food.id, weight);

    this.setData({
      selectedPortion: food.portions[index],
      macroInfo: macro
    });
  },

  useCustomCalories: function() {
    this.setData({
      showCustomInput: true,
      showFoodDetail: false
    });
  },

  inputCustomCalories: function(e) {
    this.setData({
      customCalories: e.detail.value
    });
  },

  inputCustomFoodName: function(e) {
    this.setData({
      customFoodName: e.detail.value
    });
  },

  confirmCustom: function() {
    if (!this.data.customFoodName || !this.data.customCalories) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const calorie = parseFloat(this.data.customCalories);
    if (isNaN(calorie) || calorie <= 0) {
      wx.showToast({
        title: '请输入有效热量',
        icon: 'none'
      });
      return;
    }

    const record = {
      id: format.generateId(),
      date: this.data.date,
      mealType: this.data.mealType,
      foodName: this.data.customFoodName,
      calorie: calorie,
      portion: 1,
      portionUnit: '份',
      macro: { protein: 0, fat: 0, carbs: 0 },
      createdAt: Date.now()
    };

    dataStore.addRecord(record);

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },

  confirmAdd: function() {
    const { selectedFood, selectedPortion } = this.data;

    if (!selectedFood || !selectedPortion) {
      wx.showToast({
        title: '请选择食物和份量',
        icon: 'none'
      });
      return;
    }

    const calorie = Math.round((selectedFood.caloriePerHundred / 100) * selectedPortion.weight);
    const macro = foodDatabase.calculateMacro(selectedFood.id, selectedPortion.weight);

    const record = {
      id: format.generateId(),
      date: this.data.date,
      mealType: this.data.mealType,
      foodName: selectedFood.name,
      calorie: calorie,
      portion: selectedPortion.weight,
      portionUnit: 'g',
      macro: macro,
      foodId: selectedFood.id,
      createdAt: Date.now()
    };

    dataStore.addRecord(record);
    dataStore.addLastFood(selectedFood.name);

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },

  cancel: function() {
    this.setData({
      showFoodDetail: false,
      showCustomInput: false
    });
  },

  useLastFood: function(e) {
    const foodName = e.currentTarget.dataset.name;
    const results = foodDatabase.searchFood(foodName);

    if (results.length > 0) {
      this.selectFood({ currentTarget: { dataset: { id: results[0].id } } });
    }
  }
});
