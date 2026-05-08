# ==========================================
# GitHub 自动发布脚本 - 极简热量管理小程序
# ==========================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  GitHub 自动发布脚本" -ForegroundColor Cyan
Write-Host "  极简热量管理小程序" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 配置变量
$REPO_NAME = "web-tool-calorie"
$GITHUB_USER = "JIANG7828"
$REMOTE_URL = "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
$PROJECT_PATH = "d:\GTMC_User_Profiles\yanmin_jiang\solo PJT"

Write-Host "📦 项目配置:" -ForegroundColor Green
Write-Host "   仓库名: $REPO_NAME"
Write-Host "   用户: $GITHUB_USER"
Write-Host ""

# 设置当前目录
Set-Location $PROJECT_PATH

# 步骤1: 检查 Git 是否安装
Write-Host " 检查 Git 安装状态..." -ForegroundColor Yellow
$gitVersion = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitVersion) {
    Write-Host "❌ Git 未安装！请从 https://git-scm.com/download/win 下载并安装" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}
Write-Host "✅ Git 已安装: $(& git --version)" -ForegroundColor Green

# 步骤2: 检查是否已有 .git 目录
if (Test-Path ".git") {
    Write-Host "⚠️  已存在 Git 仓库，清理旧配置..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".git"
    Write-Host "✅ 清理完成" -ForegroundColor Green
}

# 步骤3: 初始化 Git 仓库
Write-Host ""
Write-Host " 步骤 1/5: 初始化 Git 仓库..." -ForegroundColor Cyan
& git init
Write-Host "✅ 仓库初始化完成" -ForegroundColor Green

# 步骤4: 配置用户信息
Write-Host ""
Write-Host " 步骤 2/5: 配置用户信息..." -ForegroundColor Cyan
& git config user.email "dev@example.com"
& git config user.name "Developer"
Write-Host "✅ 用户配置完成" -ForegroundColor Green

# 步骤5: 添加所有文件并提交
Write-Host ""
Write-Host " 步骤 3/5: 添加文件并提交..." -ForegroundColor Cyan
& git add .
& git commit -m "feat: 极简热量管理小程序 - 完整功能

- 首页: 今日热量管控 (BMR/TDEE/MET计算)
- 运动页: 8类日常+10种运动消耗记录
- 个人中心: 用户资料+目标设置
- 数据持久化: localStorage存储
- 响应式设计: 移动端优先"
Write-Host "✅ 提交完成" -ForegroundColor Green

# 步骤6: 添加远程仓库
Write-Host ""
Write-Host "🔗 步骤 4/5: 关联 GitHub 仓库..." -ForegroundColor Cyan
& git remote add origin $REMOTE_URL
Write-Host "✅ 远程仓库关联完成" -ForegroundColor Green

# 步骤7: 设置主分支并推送
Write-Host ""
Write-Host "🚀 步骤 5/5: 推送到 GitHub..." -ForegroundColor Cyan
& git branch -M main
& git push -u origin main

# 完成
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ✅ 发布成功!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " 仓库地址:" -ForegroundColor Yellow
Write-Host "   https://github.com/$GITHUB_USER/$REPO_NAME" -ForegroundColor Blue
Write-Host ""
Write-Host " Vercel 部署:" -ForegroundColor Yellow
Write-Host "   1. 打开 https://vercel.com"
Write-Host "   2. 点击 'Add New' -> 'Project'"
Write-Host "   3. 选择 '$REPO_NAME' 仓库"
Write-Host "   4. 点击 'Import' -> 'Deploy'"
Write-Host ""
Write-Host " 以后只需运行:" -ForegroundColor Yellow
Write-Host "   git add . && git commit -m '描述' && git push"
Write-Host "============================================" -ForegroundColor Cyan

Read-Host "按任意键退出"
