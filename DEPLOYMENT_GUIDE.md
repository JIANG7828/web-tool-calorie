# 🎯 极简热量管理小程序 - 域名部署指南

## 📋 部署前准备

### 1. 购买域名（推荐）

**国内域名平台**：
- 阿里云（万网）：https://wanwang.aliyun.com
- 腾讯云（DNSPod）：https://dnspod.cloud.tencent.com
- 华为云：https://www.huaweicloud.com

**推荐域名**：
```
kaluli.com (卡路里)
jiazhong.com (减重)
reliang.com (热量)
yinshi.com (饮食)
jianfei.com (减肥)
healthdiet.cn (健康饮食)
```

**价格参考**：
- .com/.cn 域名：约 ¥30-80/年
- 首次购买通常有优惠

### 2. 购买服务器（可选）

**如果使用静态部署（推荐）**：
- Vercel（免费）：https://vercel.com
- Netlify（免费）：https://netlify.com
- GitHub Pages（免费）：https://pages.github.com

**如果需要后端服务**：
- 阿里云ECS：约 ¥100-300/月
- 腾讯云CVM：约 ¥100-300/月
- Vultr：约 ¥5-20/月

---

## 🚀 部署方案

### **方案一：Vercel 部署（推荐，免费）**

#### 步骤1：打包项目
```bash
npm run build
```

这会在 `dist` 目录生成静态文件。

#### 步骤2：部署到Vercel

**方法A：使用GitHub**
1. 将代码推送到GitHub仓库
2. 访问 https://vercel.com
3. 点击 "New Project"
4. 导入GitHub仓库
5. 点击 "Deploy"

**方法B：使用Vercel CLI**
```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

#### 步骤3：绑定自定义域名

1. 在Vercel项目设置中，点击 "Domains"
2. 输入你的域名（如 kaluli.com）
3. 在域名DNS设置中添加记录：
   ```
   类型：CNAME
   名称：www
   值：cname.vercel-dns.com
   ```

4. 等待DNS生效（通常5-30分钟）

---

### **方案二：阿里云OSS部署（国内访问快）**

#### 步骤1：创建OSS Bucket

1. 登录阿里云控制台
2. 进入OSS产品
3. 创建Bucket：
   - 名称：kaluli（自定义）
   - 区域：选择离用户近的（如华南-广州）
   - 存储类型：标准存储
   - 读写权限：公共读

#### 步骤2：上传文件

```bash
# 安装ossutil
wget http://gosspublic.alicdn.com/ossutil/1.7.3/ossutil64
chmod 755 ossutil64

# 配置ossutil
./ossutil64 config

# 上传dist目录
./ossutil64 cp -r dist oss://your-bucket-name/
```

#### 步骤3：绑定域名

1. 在OSS控制台，点击Bucket
2. 进入"域名管理"
3. 绑定自定义域名
4. 配置CDN加速（推荐）
5. 添加DNS记录

#### DNS配置示例（阿里云DNS）
```
记录类型：A
主机记录：www
记录值：[CDN分配的CNAME]
```

---

### **方案三：Docker容器部署（适合有服务器）**

#### Dockerfile
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 构建和运行
```bash
docker build -t calorie-app .
docker run -d -p 80:80 --name calorie-app calorie-app
```

---

## 🎨 部署后配置

### 1. HTTPS证书（必需）

**使用Let's Encrypt（免费）**
```bash
# 使用certbot
certbot --nginx -d your-domain.com
```

**使用阿里云CDN**
- 在CDN控制台申请免费证书
- 自动续期，无需管理

### 2. 微信支付/支付宝配置

#### 微信支付申请
1. 访问 https://pay.weixin.qq.com
2. 注册商户号
3. 申请Native支付
4. 配置支付回调URL

#### 支付宝配置
1. 访问 https://open.alipay.com
2. 创建应用
3. 申请当面付

### 3. 广告接入

#### 腾讯广告（国内）
1. 访问 https://e.qq.com
2. 注册广告主账号
3. 创建应用，填写应用信息
4. 接入广告SDK

#### Google AdSense（海外）
1. 访问 https://www.google.com/adsense
2. 申请账号
3. 获取广告代码
4. 集成到应用中

---

## 🔧 高级配置

### 1. 设置WWW和非WWW跳转

**Nginx配置**
```nginx
server {
    listen 80;
    server_name kaluli.com;
    return 301 http://www.kaluli.com$request_uri;
}

server {
    listen 80;
    server_name www.kaluli.com;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 2. 配置CDN加速

**阿里云CDN**
```javascript
// 静态资源添加版本号
const version = 'v1.0.0';
const assets = [
  `/static/js/app.${version}.js`,
  `/static/css/app.${version}.css`
];
```

### 3. 配置监控

**Sentry错误监控**
```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 📊 SEO优化清单

- [ ] 提交网站到百度站长工具
- [ ] 提交网站到Google Search Console
- [ ] 生成并提交Sitemap
- [ ] 配置robots.txt
- [ ] 添加结构化数据（Schema.org）
- [ ] 优化页面加载速度（<3秒）
- [ ] 配置面包屑导航
- [ ] 添加404页面

---

## 🛡️ 安全配置

### 1. 启用HTTPS
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}
```

### 2. 配置CSP
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';">
```

### 3. 防止XSS
```javascript
// 用户输入转义
const escapeHtml = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};
```

---

## 💡 推荐域名配置

### 购买域名后，设置以下DNS记录：

```
@      A     [服务器IP]
www    CNAME your-app.vercel.app
@      MX    10 mail.your-domain.com
```

---

## 📞 技术支持

如果在部署过程中遇到问题：

1. **Vercel**：https://vercel.com/support
2. **阿里云**：https://help.aliyun.com
3. **微信支付**：https://pay.weixin.qq.com/static/home

---

## 🎯 快速启动命令

```bash
# 1. 构建项目
npm run build

# 2. 使用Vercel部署
npm install -g vercel
vercel --prod

# 3. 使用Docker部署
docker build -t calorie-app .
docker run -d -p 80:80 calorie-app
```

---

## ⚠️ 注意事项

1. **域名备案**：国内服务器需要ICP备案
2. **HTTPS必需**：微信支付/支付宝要求HTTPS
3. **数据备份**：定期备份用户数据
4. **性能监控**：监控加载速度和错误率
5. **安全更新**：定期更新依赖包

---

## 🎉 部署成功检查清单

- [ ] 域名可访问（http://your-domain.com）
- [ ] HTTPS证书生效
- [ ] 页面加载正常
- [ ] 所有功能可用
- [ ] 移动端显示正常
- [ ] SEO标签生效
- [ ] 微信浏览器测试通过
