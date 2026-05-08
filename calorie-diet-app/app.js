App({
  onLaunch: function () {
    this.initUserSettings();
  },

  initUserSettings: function () {
    const settings = wx.getStorageSync('user_settings');
    if (!settings) {
      wx.setStorageSync('user_settings', {
        dailyCalorieGoal: 1600,
        gender: 'female',
        height: 165,
        weight: 55,
        createdAt: Date.now()
      });
    }
  },

  globalData: {
    userInfo: null
  }
})
