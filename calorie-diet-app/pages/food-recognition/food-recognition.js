const tongyi = require('../../services/tongyi');
const foodDb = require('../../utils/food-database');
const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');

Page({
  data: {
    imageTempPath: '',
    imageBase64: '',
    recognizeResults: [],
    selectedResult: null,
    selectedWeight: 100,
    loading: false,
    historyResults: [],
    portionOptions: [
      { label: '50g', value: 50 },
      { label: '100g', value: 100 },
      { label: '150g', value: 150 },
      { label: '200g', value: 200 },
      { label: '300g', value: 300 }
    ]
  },

  onShow: function() {
    this.setData({ historyResults: [] });
  },

  chooseImage: function() {
    var page = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempPath = res.tempFiles[0].tempFilePath;
        page.setData({ imageTempPath: tempPath, recognizeResults: [], selectedResult: null });
        page.recognizeFood(tempPath);
      }
    });
  },

  recognizeFood: function(imagePath) {
    var page = this;
    page.setData({ loading: true });

    tongyi.recognizeFood(imagePath).then(function(results) {
      if (results && results.length > 0) {
        page.setData({ recognizeResults: results });
      } else {
        page.setData({ recognizeResults: [], historyResults: [] });
        wx.showToast({ title: '未识别到食物', icon: 'none' });
      }
    }).catch(function() {
      page.fallbackToLocalFood();
    }).finally(function() {
      page.setData({ loading: false });
    });
  },

  fallbackToLocalFood: function() {
    wx.showModal({
      title: 'AI识别不可用',
      content: '将使用本地食物库。请输入食物名称查询热量。',
      showCancel: false,
      success: function() {
        wx.navigateTo({ url: '/pages/add-food/add-food' });
      }
    });
  },

  onSelectResult: function(e) {
    var result = e.currentTarget.dataset.item;
    this.setData({ selectedResult: result, selectedWeight: 100 });
  },

  onWeightChange: function(e) {
    var idx = parseInt(e.detail.value);
    this.setData({ selectedWeight: this.data.portionOptions[idx].value });
  },

  onCustomWeightInput: function(e) {
    this.setData({ selectedWeight: parseInt(e.detail.value) || 100 });
  },

  addToRecord: function() {
    var result = this.data.selectedResult;
    var weight = this.data.selectedWeight;

    if (!result) {
      wx.showToast({ title: '请先选择食物', icon: 'none' });
      return;
    }

    var calPerHundred = result.calorie;
    var cal = Math.round((calPerHundred * weight) / 100);

    var matchedFood = foodDb.searchFood(result.name);
    var macro = { protein: 0, fat: 0, carbs: 0 };

    if (matchedFood.length > 0) {
      macro = foodDb.calculateMacro(matchedFood[0].id, weight);
    }

    var record = {
      id: format.generateId(),
      date: format.formatDate(new Date()),
      mealType: 'snack',
      foodName: result.name,
      calorie: cal,
      portion: weight,
      portionUnit: 'g',
      source: 'ai_recognition',
      probability: result.probability || 0,
      macro: macro,
      createdAt: Date.now()
    };

    dataStore.addRecord(record);

    this.setData({
      imageTempPath: '',
      recognizeResults: [],
      selectedResult: null,
      selectedWeight: 100
    });

    wx.showToast({ title: '已添加', icon: 'success', duration: 1500 });
  },

  clearImage: function() {
    this.setData({
      imageTempPath: '',
      recognizeResults: [],
      selectedResult: null
    });
  },

  getCalForWeight: function(calPerHundred, weight) {
    return Math.round((calPerHundred * weight) / 100);
  }
});
