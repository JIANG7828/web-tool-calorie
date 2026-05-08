@echo off
chcp 65001 >nul
echo ============================================
echo   GitHub 自动发布脚本
echo   极简热量管理小程序
echo ============================================
echo.

set REPO_NAME=web-tool-calorie
set GITHUB_USER=JIANG7828
set REMOTE_URL=https://github.com/%GITHUB_USER%/%REPO_NAME%.git

echo 📦 项目配置:
echo    仓库名: %REPO_NAME%
echo    用户: %GITHUB_USER%
echo.

REM Step 1: Check if .git exists
if exist .git (
    echo ️ 已存在 Git 仓库，清理旧配置...
    rmdir /s /q .git
    echo ✅ 清理完成
)

REM Step 2: Initialize Git
echo.
echo 📂 步骤 1/5: 初始化 Git 仓库...
git init
echo ✅ 仓库初始化完成

REM Step 3: Configure user
echo.
echo  步骤 2/5: 配置用户信息...
git config user.email "dev@example.com"
git config user.name "Developer"
echo ✅ 用户配置完成

REM Step 4: Add and commit
echo.
echo  步骤 3/5: 添加文件并提交...
git add .
git commit -m "feat: 极简热量管理小程序 - 完整功能"
echo ✅ 提交完成

REM Step 5: Add remote
echo.
echo 🔗 步骤 4/5: 关联 GitHub 仓库...
git remote add origin %REMOTE_URL%
echo ✅ 远程仓库关联完成

REM Step 6: Push to main
echo.
echo 🚀 步骤 5/5: 推送到 GitHub...
git branch -M main
git push -u origin main

REM Done
echo.
echo ============================================
echo   ✅ 发布成功!
echo ============================================
echo.
echo  仓库地址:
echo    https://github.com/%GITHUB_USER%/%REPO_NAME%
echo.
echo  Vercel 部署:
echo    1. 打开 https://vercel.com
echo    2. 点击 'Add New' -^> 'Project'
echo    3. 选择 '%REPO_NAME%' 仓库
echo    4. 点击 'Import' -^> 'Deploy'
echo.
echo  以后只需运行:
echo    git add . ^&^& git commit -m "描述" ^&^& git push
echo ============================================
pause
