# 健康饮食管理助手 - 卡路里管理助手

一款功能完整的健康饮食管理应用，帮助用户科学管理饮食和体重。

## 功能特点

### 🎯 核心功能
- 🍽️ **每日热量追踪** - 记录饮食，自动计算总摄入
- 🏃 **运动消耗记录** - MET标准算法，科学准确计算运动消耗
- 📊 **BMR/TDEE计算** - Mifflin-St Jeor公式，精准计算基础代谢
- 💧 **饮水记录** - 每日饮水目标追踪
- 📈 **数据统计与趋势** - 体重趋势、卡路里对比图表

### 📋 新增功能
- 🍜 **智能菜谱推荐** - 43道精心设计的菜谱（中餐21道+轻食22道）
- 📅 **餐单定制** - 按日期定制每日餐单，添加/移除菜谱
- 📷 **AI拍照识别** - 百度AI食物识别，快速记录
- 🤖 **AI智能建议** - 通义千问AI提供饮食和运动建议
- 🐦 **微信登录/注册** - 微信扫码快速登录
- 🔐 **JWT认证系统** - 安全的用户认证机制
- 🔑 **密码找回功能** - 支持用户名+验证码和微信验证两种方式

### 💡 其他特色
- 📱 **移动端优先** - 完美适配手机和平板
- 🏆 **打卡系统** - 每日打卡，激励坚持
- 💰 **会员订阅** - 免费/Pro/高级版（可选）
- 📱 **会员权益** - 高级AI功能、无限识别等
- 📊 **数据可视化** - 直观展示饮食和体重数据
- 🌙 **主题切换** - 浅色/深色主题（可选）

## 技术栈

- **前端框架** - React 18
- **开发语言** - TypeScript
- **样式方案** - Tailwind CSS + Ant Design
- **状态管理** - Zustand
- **构建工具** - Vite
- **部署平台** - 支持Vercel等主流平台
- **AI服务** - 百度食物识别、通义千问AI

## 项目结构

```
├── src/
│   ├── pages/           # 页面组件
│   │   ├── Home.tsx          # 首页
│   │   ├── ProfilePage.tsx   # 个人中心/登录
│   │   ├── TakeoutPage.tsx   # 餐单页面
│   │   ├── FoodDatabasePage.tsx # 食物库
│   │   ├── DietRecordPage.tsx   # 饮食记录
│   │   ├── ExercisePage.tsx     # 运动记录
│   │   ├── WeightTrendPage.tsx  # 体重趋势
│   │   ├── DataStatisticsPage.tsx # 数据统计
│   │   └── FoodRecognitionPage.tsx # AI识别
│   ├── components/       # 组件
│   ├── store/           # Zustand状态管理
│   ├── services/        # API服务
│   └── utils/           # 工具函数
├── public/
└── ...
```

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 类型检查
npx tsc
```

## 环境变量

如需使用AI功能，请配置相关API密钥：

```bash
# 百度食物识别API（可选）
# 配置文件位置：src/services/baiduFoodRecognition.ts

# 通义千问API（可选）
# 配置文件位置：src/utils/tongyiService.ts
```

## 部署

项目已配置Vercel一键部署：

1. Fork本项目到GitHub/Gitee
2. 在Vercel中导入项目
3. 自动部署完成

详细配置请参考 [部署指南](DEPLOYMENT_GUIDE.md)

## 文档

- [快速开始](QUICK_START.md)
- [技术架构](TECH_ARCH.md)
- [部署指南](DEPLOYMENT_GUIDE.md)
- [产品需求文档(PRD)](PRD.md)
- [变现方案](MONETIZATION_PLAN.md)

## License

MIT
