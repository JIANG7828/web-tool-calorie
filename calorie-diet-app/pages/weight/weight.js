const dataStore = require('../../utils/data-store');
const format = require('../../utils/format');

Page({
  data: {
    weightInput: '',
    records: [],
    latestWeight: null,
    bmi: 0,
    bmiInfo: { label: '', color: '' },
    targetWeight: '',
    showCanvas: false
  },

  onLoad: function() {
    this.loadWeightData();
  },

  onShow: function() {
    this.loadWeightData();
  },

  loadWeightData: function() {
    var records = dataStore.getWeightRecords();
    records.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    var latest = dataStore.getLatestWeight();
    var settings = dataStore.getUserSettings();
    var targetWeight = settings.targetWeight || '';
    var bmi = latest ? format.calculateBMI(latest.weight, settings.height) : 0;
    var bmiInfo = format.getBMICategory(bmi);

    this.setData({
      records: records,
      latestWeight: latest,
      bmi: bmi,
      bmiInfo: bmiInfo,
      targetWeight: targetWeight,
      showCanvas: records.length > 0
    });

    if (records.length > 0) {
      var page = this;
      setTimeout(function() {
        page.drawChart();
      }, 100);
    }
  },

  onWeightInput: function(e) {
    this.setData({ weightInput: e.detail.value });
  },

  onSaveWeight: function() {
    var weightVal = parseFloat(this.data.weightInput);
    if (!weightVal || weightVal <= 0) {
      wx.showToast({ title: '请输入有效体重', icon: 'none' });
      return;
    }

    var record = {
      id: format.generateId(),
      date: new Date().toISOString(),
      weight: weightVal,
      createdAt: Date.now()
    };

    dataStore.addWeightRecord(record);
    this.setData({ weightInput: '' });
    this.loadWeightData();
    wx.showToast({ title: '记录成功', icon: 'success', duration: 1500 });
  },

  onDeleteRecord: function(e) {
    var id = e.currentTarget.dataset.id;
    var page = this;
    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条体重记录吗？',
      success: function(res) {
        if (res.confirm) {
          dataStore.deleteWeightRecord(id);
          page.loadWeightData();
          wx.showToast({ title: '已删除', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  drawChart: function() {
    var records = this.data.records;
    if (records.length === 0) return;

    var query = wx.createSelectorQuery();
    query.select('#weightChart').fields({ node: true, size: true }).exec(function(res) {
      if (!res[0] || !res[0].node) return;
      var canvas = res[0].node;
      var ctx = canvas.getContext('2d');
      var dpr = wx.getSystemInfoSync().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);

      var width = res[0].width;
      var height = res[0].height;
      var padding = { top: 40, right: 30, bottom: 60, left: 50 };
      var chartWidth = width - padding.left - padding.right;
      var chartHeight = height - padding.top - padding.bottom;

      var weights = records.map(function(r) { return r.weight; });
      var minW = Math.floor(Math.min.apply(null, weights) - 2);
      var maxW = Math.ceil(Math.max.apply(null, weights) + 2);
      var range = maxW - minW;
      if (range < 5) range = 5;
      minW = Math.floor(Math.min.apply(null, weights) - range * 0.1);
      maxW = Math.ceil(Math.max.apply(null, weights) + range * 0.1);
      range = maxW - minW;

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      for (var i = 0; i <= 4; i++) {
        var y = padding.top + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        var val = (maxW - (range / 4) * i).toFixed(1);
        ctx.fillStyle = '#999999';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val, padding.left - 10, y + 6);
      }

      var targetW = parseFloat(this.targetWeight);
      if (targetW > 0 && targetW >= minW && targetW <= maxW) {
        var targetY = padding.top + ((maxW - targetW) / range) * chartHeight;
        ctx.strokeStyle = '#ff4757';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(padding.left, targetY);
        ctx.lineTo(width - padding.right, targetY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ff4757';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('目标 ' + targetW + 'kg', width - padding.right - 100, targetY - 10);
      }

      var stepX = chartWidth / Math.max(records.length - 1, 1);

      ctx.beginPath();
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';

      var points = [];
      for (var j = 0; j < records.length; j++) {
        var x = padding.left + j * stepX;
        var y = padding.top + ((maxW - records[j].weight) / range) * chartHeight;
        points.push({ x: x, y: y });
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      ctx.beginPath();
      var gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, 'rgba(76, 175, 80, 0.3)');
      gradient.addColorStop(1, 'rgba(76, 175, 80, 0)');

      ctx.fillStyle = gradient;
      ctx.moveTo(points[0].x, points[0].y);
      for (var k = 1; k < points.length; k++) {
        ctx.lineTo(points[k].x, points[k].y);
      }
      ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
      ctx.lineTo(points[0].x, height - padding.bottom);
      ctx.closePath();
      ctx.fill();

      for (var m = 0; m < points.length; m++) {
        ctx.beginPath();
        ctx.arc(points[m].x, points[m].y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#4CAF50';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(points[m].x, points[m].y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      var labelCount = Math.min(records.length, 7);
      var step = Math.ceil(records.length / labelCount);
      ctx.fillStyle = '#999999';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      for (var n = 0; n < records.length; n += step) {
        var date = new Date(records[n].date);
        var label = (date.getMonth() + 1) + '/' + date.getDate();
        ctx.fillText(label, points[n].x, height - padding.bottom + 30);
      }
    }.bind(this));
  },

  onInputChange: function(e) {
    this.setData({ targetWeight: e.detail.value });
    var settings = dataStore.getUserSettings();
    settings.targetWeight = parseFloat(e.detail.value) || 0;
    dataStore.setUserSettings(settings);
  }
});
