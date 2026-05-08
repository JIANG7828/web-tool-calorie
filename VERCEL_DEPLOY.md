# 🚀 Vercel 免费部署指南

## ⚡ 方式一：GitHub + Vercel（推荐，最简单）

### 步骤1：创建 GitHub 仓库

1. 打开 https://github.com
2. 登录你的 GitHub 账号（没有的话先注册）
3. 点击右上角 "+" → "New repository"
4. 填写：
   - Repository name: `calorie-manager`（或其他名字）
   - Description: `极简热量追踪工具`
   - 选择 "Public"（公开）
   - 勾选 "Add a README file"
5. 点击 "Create repository"

### 步骤2：上传代码到 GitHub

有两种方式，推荐使用 GitHub Desktop（更简单）：

**方式A：使用 GitHub Desktop（推荐）**

1. 下载 GitHub Desktop: https://desktop.github.com/
2. 安装并登录 GitHub 账号
3. 点击 "File" → "Add Local Repository"
4. 选择项目文件夹：`d:\GTMC_User_Profiles\yanmin_jiang\solo PJT`
5. 点击 "Publish repository" 推送到 GitHub

**方式B：使用命令行**

1. 在项目目录打开终端（PowerShell）
2. 初始化 Git：
```powershell
git init
git add .
git commit -m "first commit: 极简热量管理小程序"
```

3. 关联 GitHub 仓库：
```powershell
git remote add origin https://github.com/你的用户名/calorie-manager.git
git branch -M main
git push -u origin main
```

### 步骤3：在 Vercel 部署

1. 打开 https://vercel.com
2. 点击 "Sign Up" 注册账号（推荐用 GitHub 登录）
3. 点击 "Add New..." → "Project"
4. 选择 "Import Git Repository"
5. 找到你的 `calorie-manager` 仓库
6. Vercel 会自动检测配置，点击 "Deploy"
7. 等待 1-2 分钟，部署完成！

### 步骤4：获得免费域名 🎉

部署成功后，你会获得一个免费的域名：
```
https://calorie-manager.vercel.app
```

这就是你的网页版地址，可以立即访问！

---

## ⚡ 方式二：Vercel CLI（适合命令行爱好者）

### 步骤1：登录 Vercel

```bash
vercel login
```
会打开浏览器，按提示完成登录。

### 步骤2：部署

```bash
# 进入项目目录
cd "d:\GTMC_User_Profiles\yanmin_jiang\solo PJT"

# 部署到预览环境
vercel

# 按照提示操作：
# ? Set up and deploy? [Y/n] → Y
# ? Which scope? → 选择你的账号
# ? Link to existing project? [y/N] → N
# ? What's your project's name? → calorie-manager
# ? In which directory is your code located? → ./

# 等待部署完成，会显示预览链接
```

### 步骤3：部署到生产环境

```bash
vercel --prod
```

---

## 🎯 方式三：手动部署（无需 Git）

如果不想用 Git，可以直接上传 dist 文件夹：

1. 打开 https://vercel.com
2. 登录后，点击 "Add New..." → "Project"
3. 选择 "Import Third-Party Git Repository"
4. 选择 "Or upload a directory manually"
5. 上传 `dist` 文件夹（已构建的生产版本）
6. 点击 Deploy

---

## 🌐 绑定自定义域名（可选）

### 购买域名

推荐平台：
- 阿里云：https://wanwang.aliyun.com
- 腾讯云：https://dnspod.cloud.tencent.com

推荐域名：
```
kaluli.com        # 卡路里
jianfei.com      # 减肥
reliang.cn       # 热量
healthdiet.cn    # 健康饮食
```

价格：¥30-80/年

### 在 Vercel 配置域名

1. 部署成功后，进入项目设置
2. 点击 "Domains"
3. 输入你的域名（如：kaluli.com）
4. 点击 "Add"
5. 在域名服务商添加 DNS 记录：
   ```
   类型：CNAME
   名称：www
   值：cname.vercel-dns.com
   
   类型：A
   名称：@
   值：76.76.21.21
   ```
6. 等待 DNS 生效（5-30分钟）
7. 完成！你的网站就可以用 www.你的域名.com 访问了

---

## ✅ 验证部署成功

部署成功后，你应该能看到：

```
✅ Preview: https://calorie-manager-xxx.vercel.app
✅ Production: https://calorie-manager.vercel.app
```

现在可以：
- [ ] 在浏览器打开这个链接
- [ ] 用手机访问测试
- [ ] 分享给朋友试试

---

## 📱 测试移动端显示

1. 电脑打开部署的链接
2. 按 F12 打开开发者工具
3. 点击手机图标切换到移动端视图
4. 测试所有功能是否正常

---

## 🔧 遇到问题？

### 问题1：部署失败
```
解决：检查代码是否有语法错误
运行 npm run build 看是否有报错
```

### 问题2：Git 推送失败
```
解决：先在 GitHub 创建仓库，再推送
git remote set-url origin https://github.com/你的用户名/仓库名.git
```

### 问题3：Vercel 登录不了
```
解决：使用 GitHub 账号登录最简单
或者清除浏览器缓存后重试
```

### 问题4：域名解析不生效
```
解决：等待10-30分钟
使用 https://tool.chinaz.com/dns/ 查询解析状态
```

---

## 🎉 部署成功后的下一步

1. **测试完整功能**
   - [ ] 添加食物记录
   - [ ] 记录运动消耗
   - [ ] 查看热量计算
   - [ ] 修改个人资料

2. **申请支付接口**
   - [ ] 微信支付商户号：https://pay.weixin.qq.com
   - [ ] 腾讯广告：https://e.qq.com

3. **开始推广**
   - [ ] 分享给朋友
   - [ ] 发布到社交媒体
   - [ ] 建立用户群

---

## 💰 立即行动清单

**现在（5分钟）**：
1. 打开 https://github.com
2. 创建新仓库 `calorie-manager`
3. 上传代码（或用 GitHub Desktop）

**今天（30分钟）**：
1. 在 Vercel 导入 GitHub 仓库
2. 点击 Deploy
3. 获得免费域名
4. 测试所有功能

**本周（2小时）**：
1. 申请微信支付商户号
2. 申请腾讯广告账号
3. 购买域名（可选）
4. 开始小规模推广

---

## 📞 遇到问题？

如果按照步骤操作遇到问题，可以：
1. 查看 Vercel 官方文档：https://vercel.com/docs
2. 查看部署指南：https://vercel.com/support
3. 或者告诉我具体的错误信息，我来帮你解决

---

## 🎯 小贴士

- ✅ 使用 GitHub 登录 Vercel 最方便
- ✅ Public 仓库部署更快
- ✅ 免费域名立即可用
- ✅ 自动 HTTPS 安全连接
- ✅ 全球 CDN 加速访问
- ✅ 自动部署，更新代码自动生效

---

**现在就开始！打开 https://github.com 创建你的仓库吧！** 🚀

记住：最快的脚步是开始行动！不要等到完美，先上线再说！💪
