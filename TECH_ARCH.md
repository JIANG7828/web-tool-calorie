# 极简热量饮食管理小程序 - 技术架构文档

## 1. 项目概述

**项目类型**: 微信小程序  
**开发框架**: 原生微信小程序框架 (MINA)  
**目标平台**: 微信小程序（支持iOS和Android）  
**最低基础库版本**: 2.8.0

## 2. 项目结构

```
calorie-diet-app/
├── project.config.json          # 项目配置文件
├── app.js                       # 小程序入口文件
├── app.json                     # 全局配置
├── app.wxss                     # 全局样式
├── pages/
│   ├── index/                   # 首页 - 今日热量概览
│   │   ├── index.js
│   │   ├── index.wxml
│   │   ├── index.wxss
│   │   └── index.json
│   ├── add-food/                # 添加食物页面
│   │   ├── add-food.js
│   │   ├── add-food.wxml
│   │   ├── add-food.wxss
│   │   └── add-food.json
│   ├── statistics/              # 统计页面
│   │   ├── statistics.js
│   │   ├── statistics.wxml
│   │   ├── statistics.wxss
│   │   └── statistics.json
│   └── settings/                # 设置页面
│       ├── settings.js
│       ├── settings.wxml
│       ├── settings.wxss
│       └── settings.json
├── components/
│   ├── calorie-ring/            # 热量圆环组件
│   │   ├── calorie-ring.js
│   │   ├── calorie-ring.wxml
│   │   └── calorie-ring.wxss
│   ├── food-item/               # 食物列表项组件
│   │   ├── food-item.js
│   │   ├── food-item.wxml
│   │   └── food-item.wxss
│   └── date-selector/           # 日期选择器组件
│       ├── date-selector.js
│       ├── date-selector.wxml
│       └── date-selector.wxss
├── utils/
│   ├── data-store.js            # 数据存储管理
│   ├── food-database.js        # 内置食物数据库
│   ├── format.js                # 格式化工具函数
│   └── constants.js             # 常量定义
└── assets/
    ├── images/                  # 图片资源
    └── icons/                   # 图标资源
```

## 3. 技术实现细节

### 3.1 数据存储方案

**存储键定义** (utils/constants.js):
```javascript
const STORAGE_KEYS = {
  USER_SETTINGS: 'user_settings',      // 用户设置
  DIET_RECORDS: 'diet_records',         // 饮食记录
  CUSTOM_FOODS: 'custom_foods',          // 自定义食物
  LAST_FOODS: 'last_foods'               // 最近使用的食物
};
```

**数据结构**:
- `user_settings`: Object - 用户个人设置和目标
- `diet_records`: Object - 按日期组织的饮食记录 { '2024-01-15': [record1, record2, ...] }
- `custom_foods`: Array - 用户自定义食物列表
- `last_foods`: Array - 最近使用的10种食物

### 3.2 食物数据库设计

**内置数据结构** (utils/food-database.js):
```javascript
const FOOD_DATABASE = [
  {
    id: 'rice',
    name: '米饭',
    category: '主食',
    caloriePerHundred: 116,       // kcal/100g
    defaultPortion: '100g',
    portions: [
      { label: '小碗', weight: 100 },
      { label: '中碗', weight: 150 },
      { label: '大碗', weight: 200 }
    ]
  },
  // ... 200+ 食物
];
```

**食物分类**:
1. 主食 (rice, noodles, bread等)
2. 肉蛋类 (chicken, beef, eggs等)
3. 蔬菜类 (vegetables)
4. 水果类 (fruits)
5. 奶制品 (milk, yogurt等)
6. 饮品 (beverages)
7. 零食 (snacks)

### 3.3 页面路由

**app.json 配置**:
```json
{
  "pages": [
    "pages/index/index",
    "pages/add-food/add-food",
    "pages/statistics/statistics",
    "pages/settings/settings"
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "今日", "iconPath": "assets/icons/home.png" },
      { "pagePath": "pages/add-food/add-food", "text": "记录", "iconPath": "assets/icons/add.png" },
      { "pagePath": "pages/statistics/statistics", "text": "统计", "iconPath": "assets/icons/chart.png" },
      { "pagePath": "pages/settings/settings", "text": "设置", "iconPath": "assets/icons/settings.png" }
    ]
  }
}
```

### 3.4 核心算法

#### 3.4.1 热量计算
```javascript
calculateCalorie(food, portion) {
  return (food.caloriePerHundred / 100) * portion;
}
```

#### 3.4.2 每日总热量
```javascript
getTodayTotalCalories(records) {
  return records.reduce((sum, record) => sum + record.calorie, 0);
}
```

#### 3.4.3 目标完成百分比
```javascript
getCompletionPercentage(current, goal) {
  return Math.min((current / goal) * 100, 100);
}
```

### 3.5 组件设计

#### 3.5.1 CalorieRing (热量圆环)
**功能**: 绘制圆形进度环显示热量完成度  
**属性**:
- `current`: 当前摄入热量
- `goal`: 目标热量
- `size`: 圆环尺寸（默认300）
- `strokeWidth`: 环宽度（默认20）

**技术实现**: 使用 Canvas 2D API 绘制

#### 3.5.2 FoodItem (食物列表项)
**功能**: 显示单个食物记录  
**属性**:
- `record`: 饮食记录对象
- `showDate`: 是否显示日期
- `onEdit`: 编辑回调
- `onDelete`: 删除回调

**交互**: 支持左滑显示删除按钮

#### 3.5.3 DateSelector (日期选择器)
**功能**: 日期导航选择  
**属性**:
- `currentDate`: 当前日期
- `onDateChange`: 日期变更回调

**交互**: 左右滑动切换日期，支持点击选择器展开日历

## 4. 页面实现

### 4.1 首页 (pages/index/index)

**功能**:
1. 显示今日热量概览（圆环图）
2. 展示今日各餐次记录
3. 快速添加按钮
4. 删除记录功能

**关键函数**:
```javascript
// 获取今日记录
getTodayRecords() {
  const today = formatDate(new Date());
  const records = dataStore.getRecordsByDate(today);
  this.setData({ records });
}

// 计算今日总热量
calculateTodayTotal() {
  const records = this.data.records;
  const total = records.reduce((sum, r) => sum + r.calorie, 0);
  this.setData({ todayTotal: total });
}
```

### 4.2 添加食物页 (pages/add-food/add-food)

**功能**:
1. 搜索食物
2. 浏览分类食物
3. 选择份量
4. 添加自定义热量

**关键函数**:
```javascript
// 搜索食物
searchFood(keyword) {
  const results = foodDatabase.filter(food => 
    food.name.includes(keyword)
  );
  this.setData({ searchResults: results });
}

// 添加记录
addRecord(food, portion, mealType) {
  const record = {
    id: generateId(),
    date: formatDate(new Date()),
    mealType,
    foodName: food.name,
    calorie: food.caloriePerHundred * portion / 100,
    portion,
    portionUnit: 'g',
    createdAt: Date.now()
  };
  dataStore.addRecord(record);
  wx.navigateBack();
}
```

### 4.3 统计页 (pages/statistics/statistics)

**功能**:
1. 本周柱状图
2. 周平均热量
3. 历史记录查询

**技术**: 使用 Canvas 绘制简单柱状图

### 4.4 设置页 (pages/settings/settings)

**功能**:
1. 设置每日目标
2. 个人信息
3. 数据导出
4. 清空数据

## 5. 数据流

```
用户操作 → Page.js → 调用工具函数 → 数据存储
                ↓
            更新页面数据
                ↓
            重新渲染视图
```

**工具函数层**:
- `dataStore`: 数据CRUD操作
- `foodDatabase`: 食物查询
- `format`: 数据格式化

## 6. 性能优化

1. **数据缓存**: 使用 `wx.setStorageSync` 进行同步存储，避免频繁读取
2. **图片优化**: 使用iconfont代替小图标图片
3. **列表渲染**: 使用 `wx:if` 条件渲染，减少DOM节点
4. **防抖处理**: 搜索功能添加300ms防抖

## 7. 测试计划

### 7.1 功能测试
- [ ] 添加食物记录
- [ ] 编辑食物记录
- [ ] 删除食物记录
- [ ] 热量计算准确性
- [ ] 数据持久化
- [ ] 目标设置和显示

### 7.2 兼容性测试
- [ ] iOS设备测试
- [ ] Android设备测试
- [ ] 不同屏幕尺寸适配

## 8. 注意事项

1. **微信小程序限制**: 
   - 不支持某些CSS特性
   - 组件需在app.json中声明
   - 样式需使用rpx单位适配

2. **数据安全**:
   - 不在代码中硬编码敏感信息
   - 清空数据需二次确认

3. **用户体验**:
   - 加载状态提示
   - 操作成功/失败反馈
   - 空状态友好提示
