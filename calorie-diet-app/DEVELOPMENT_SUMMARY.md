# 健康热量管理微信小程序 - 移植完成报告

## 项目概览

**项目名称**: 极简热量管理（微信小程序版）
**技术栈**: 原生微信小程序 + 通义千问AI + 本地存储
**源项目**: React + TypeScript + Zustand + Ant Design Mobile
**目标**: 微信小程序（WXML/WXSS/JS）

## 已完成功能清单

### ✅ 核心工具层（全部完成）

| 文件 | 功能 | 对应React版本 |
|------|------|--------------|
| utils/constants.js | 常量配置（餐次、分类、目标、活动级别） | 对应各页面常量 |
| utils/format.js | 日期/数字格式化、BMI计算、ID生成 | 通用工具函数 |
| utils/calorie.js | BMR/TDEE计算、目标热量、运动消耗 | utils/calorie.ts |
| utils/activities.js | 30种运动/活动（MET值） | utils/activities.ts |
| utils/food-database.js | 100+食物（12分类，含宏量营养素） | utils/foodDatabase.ts |
| utils/data-store.js | 数据存储层（支持宏量营养素/体重/打卡） | store/calorieStore.ts |
| utils/check-in.js | 打卡系统（连续天数/成就统计） | utils/checkInSystem.ts |

### ✅ AI服务层（全部完成）

| 文件 | 功能 | 对应React版本 |
|------|------|--------------|
| services/tongyi.js | 通义千问API封装（文本+视觉） | utils/tongyiService.ts + services/baiduFoodRecognition.ts |
| services/ai-suggestion.js | AI智能建议（营养分析/菜谱推荐） | utils/aiSuggestion.ts |

**AI功能详情**:
- 🤖 **AI食物识别**: qwen-vl-plus 视觉模型，拍照识别食物，返回热量/置信度
- 🤖 **AI营养分析**: qwen-turbo 文本模型，分析当日饮食，生成营养素报告
- 🤖 **AI智能建议**: 根据上一餐记录生成下一餐建议
- 🤖 **降级方案**: API失败时使用本地食物库

### ✅ 页面层（全部完成）

| 页面 | 功能 | 对应React版本 |
|------|------|--------------|
| pages/index/ | 首页（热量概览/宏量营养素/AI建议/饮水/打卡） | src/pages/Home.tsx |
| pages/add-food/ | 添加食物（搜索/分类/份量/营养素） | src/pages/AddFoodModal.tsx |
| pages/records/ | 食物记录（日期导航/餐次分组/编辑删除/营养素） | src/pages/FoodRecordsPage.tsx |
| pages/exercise/ | 运动记录（30种活动/MET计算/搜索/分类） | src/pages/ExercisePage.tsx |
| pages/food-recognition/ | AI识食物（拍照识别/结果选择/份量添加） | src/pages/FoodRecognitionPage.tsx |
| pages/profile/ | 个人档案（信息编辑/BMI/7天统计/目标设置） | src/pages/ProfilePage.tsx |
| pages/statistics/ | 统计页面（Canvas柱状图/周月切换/营养素分布） | src/pages/WeightTrendPage.tsx |
| pages/weight/ | 体重趋势（录入/Canvas折线图/目标线） | src/pages/WeightTrendPage.tsx |

### ✅ 配置层（全部完成）

| 文件 | 说明 |
|------|------|
| app.json | 8个页面配置，5-tab底部导航（首页/记录/运动/识食物/我的） |
| app.js | 应用初始化，用户设置默认值 |
| app.wxss | 全局样式，主题色 #4CAF50 |

## 数据模型

### 食物记录（FoodRecord）
```javascript
{
  id: String,
  date: String,
  mealType: String, // breakfast/lunch/dinner/snack
  foodName: String,
  calorie: Number,
  portion: Number,
  portionUnit: String,
  macro: { protein: Number, fat: Number, carbs: Number },
  source: String, // 'ai_recognition' | 'food_database' | 'custom'
  probability: Number,
  foodId: String,
  createdAt: Number
}
```

### 运动记录（ExerciseRecord）
```javascript
{
  id: String,
  date: String,
  activityId: String,
  activityName: String,
  met: Number,
  icon: String,
  duration: Number,
  calories: Number,
  createdAt: Number
}
```

### 用户设置（UserSettings）
```javascript
{
  nickname: String,
  gender: String,
  age: Number,
  height: Number,
  weight: Number,
  target: String,
  activityLevel: Number,
  dailyCalorieGoal: Number,
  waterGoal: Number,
  exerciseTarget: Number
}
```

## AI功能实现详情

### 通义千问API配置
```javascript
// services/tongyi.js
API_URL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
API_KEY: '' // 需要用户配置

文本模型: qwen-turbo（营养分析/建议生成）
视觉模型: qwen-vl-plus（食物图片识别）
```

### AI食物识别流程
1. wx.chooseMedia → 拍照/选图
2. wx.compressImage → 压缩到70%质量
3. wx.getFileSystemManager().readFile → 转base64
4. wx.request → 调用通义千问视觉API
5. 解析JSON → 食物名称/热量/置信度
6. 用户选择份量 → 添加到记录

### AI营养分析流程
1. 获取当日食物记录
2. 构建prompt（含记录详情+用户画像）
3. 调用通义千问文本API
4. 解析结构化结果
5. 展示分析报告

## 项目文件结构

```
calorie-diet-app/
├── pages/
│   ├── index/              # 首页（已升级）
│   ├── add-food/           # 添加食物（已升级）
│   ├── records/            # 食物记录（新增）
│   ├── exercise/           # 运动记录（新增）
│   ├── food-recognition/   # AI识食物（新增）
│   ├── profile/            # 个人档案（新增）
│   ├── statistics/         # 统计页面（已升级）
│   └── weight/             # 体重趋势（新增）
├── services/
│   ├── tongyi.js           # 通义千问AI（新增）
│   └── ai-suggestion.js    # AI建议服务（新增）
├── utils/
│   ├── constants.js        # 常量配置（已升级）
│   ├── format.js           # 格式化工具（已升级）
│   ├── calorie.js          # 热量计算（新增）
│   ├── activities.js       # 运动模板（新增）
│   ├── food-database.js    # 食物数据库（已升级）
│   ├── data-store.js       # 数据存储（已升级）
│   └── check-in.js         # 打卡系统（新增）
├── app.js
├── app.json
└── app.wxss
```

## 未实现功能（除外卖功能）

以下功能在React版本中存在，但本次未移植：

| 功能 | 原因 |
|------|------|
| 会员系统 | 需要后端支持，暂不实现 |
| 数据导出 | 需要额外权限 |
| 挑战系统 | 非核心功能 |
| 自定义食物管理 | 可通过"自定义热量"替代 |
| 霸王茶姬/蜜雪冰城等品牌数据 | 食物库已包含常见品牌 |

## 使用说明

### 配置AI功能
1. 打开 `services/tongyi.js`
2. 在顶部配置 `API_KEY`（通义千问API密钥）
3. 保存后即可使用AI食物识别和营养分析功能

### 导入微信开发者工具
1. 打开微信开发者工具
2. 导入 `calorie-diet-app/` 目录
3. 填写AppID（或使用测试号）
4. 编译运行

### 测试功能
1. **首页**: 查看热量概览、饮水记录、AI建议
2. **添加食物**: 搜索食物、选择份量、记录热量
3. **食物记录**: 查看历史记录、按餐次分组、编辑删除
4. **运动**: 选择运动类型、输入时长、自动计算消耗
5. **识食物**: 拍照/选图、AI识别、添加到记录
6. **我的**: 编辑个人信息、查看BMI、7天统计

## 技术特点

- ✅ 完全本地存储，无需服务器
- ✅ AI功能可选，不影响基础功能
- ✅ 宏量营养素追踪（蛋白质/脂肪/碳水）
- ✅ 30种运动模板，自动计算消耗
- ✅ 打卡系统，连续天数统计
- ✅ Canvas图表，轻量高效
- ✅ 主色调薄荷绿 #4CAF50，清新美观

## 后续优化建议

1. 添加云开发支持，实现多设备同步
2. 增加更多食物数据
3. 优化图表交互
4. 添加分享功能
5. 接入微信登录
