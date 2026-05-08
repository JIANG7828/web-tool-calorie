#!/bin/bash
# ==========================================
# GitHub 自动发布脚本 - 极简热量管理小程序
# ==========================================

echo "============================================"
echo "  GitHub 自动发布脚本"
echo "  极简热量管理小程序"
echo "============================================"
echo ""

# 配置变量
REPO_NAME="web-tool-calorie"
REPO_DESC="极简热量追踪工具 - BMR/TDEE/MET计算"
GITHUB_USER="JIANG7828"
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "📦 项目配置:"
echo "   仓库名: ${REPO_NAME}"
echo "   用户: ${GITHUB_USER}"
echo ""

# 步骤1: 检查是否已有 .git 目录
if [ -d ".git" ]; then
    echo "⚠️  已存在 Git 仓库，清理旧配置..."
    rm -rf .git
    echo "✅ 清理完成"
fi

# 步骤2: 初始化 Git 仓库
echo ""
echo "📂 步骤 1/5: 初始化 Git 仓库..."
git init
echo "✅ 仓库初始化完成"

# 步骤3: 配置用户信息
echo ""
echo "👤 步骤 2/5: 配置用户信息..."
git config user.email "dev@example.com"
git config user.name "Developer"
echo "✅ 用户配置完成"

# 步骤4: 添加所有文件并提交
echo ""
echo " 步骤 3/5: 添加文件并提交..."
git add .
git commit -m "feat: 极简热量管理小程序 - 完整功能

- 首页: 今日热量管控 (BMR/TDEE/MET计算)
- 运动页: 8类日常+10种运动消耗记录
- 个人中心: 用户资料+目标设置
- 数据持久化: localStorage存储
- 响应式设计: 移动端优先"
echo "✅ 提交完成"

# 步骤5: 添加远程仓库
echo ""
echo "🔗 步骤 4/5: 关联 GitHub 仓库..."
git remote add origin ${REMOTE_URL}
echo "✅ 远程仓库关联完成"

# 步骤6: 设置主分支并推送
echo ""
echo "🚀 步骤 5/5: 推送到 GitHub..."
git branch -M main
git push -u origin main

# 完成
echo ""
echo "============================================"
echo "  ✅ 发布成功!"
echo "============================================"
echo ""
echo "📂 仓库地址:"
echo "   https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo " Vercel 部署:"
echo "   1. 打开 https://vercel.com"
echo "   2. 点击 'Add New' -> 'Project'"
echo "   3. 选择 '${REPO_NAME}' 仓库"
echo "   4. 点击 'Import' -> 'Deploy'"
echo ""
echo " 以后只需运行:"
echo "   git add . && git commit -m '描述' && git push"
echo "============================================"
