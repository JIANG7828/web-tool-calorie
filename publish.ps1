# ==========================================
# GitHub Auto Publish Script - Calorie App
# ==========================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  GitHub Auto Publish Script" -ForegroundColor Cyan
Write-Host "  Calorie Diet Management App" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Config variables
$REPO_NAME = "web-tool-calorie"
$GITHUB_USER = "JIANG7828"
$REMOTE_URL = "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
$PROJECT_PATH = "d:\GTMC_User_Profiles\yanmin_jiang\solo PJT"

Write-Host "Project Config:" -ForegroundColor Green
Write-Host "   Repository: $REPO_NAME"
Write-Host "   User: $GITHUB_USER"
Write-Host ""

# Set current directory
Set-Location $PROJECT_PATH

# Step 1: Check Git installation
Write-Host " Checking Git installation..." -ForegroundColor Yellow
$gitVersion = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitVersion) {
    Write-Host "ERROR: Git not installed!" -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "OK: Git installed: $(& git --version)" -ForegroundColor Green

# Step 2: Check if .git exists
if (Test-Path ".git") {
    Write-Host "Warning: Git repository exists, cleaning..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".git"
    Write-Host "OK: Cleaned" -ForegroundColor Green
}

# Step 3: Initialize Git repository
Write-Host ""
Write-Host "Step 1/5: Initialize Git repository..." -ForegroundColor Cyan
& git init
Write-Host "OK: Repository initialized" -ForegroundColor Green

# Step 4: Configure user info
Write-Host ""
Write-Host "Step 2/5: Configure user info..." -ForegroundColor Cyan
& git config user.email "dev@example.com"
& git config user.name "Developer"
Write-Host "OK: User configured" -ForegroundColor Green

# Step 5: Add all files and commit
Write-Host ""
Write-Host "Step 3/5: Add files and commit..." -ForegroundColor Cyan
& git add .
& git commit -m "feat: calorie diet management app - initial release"
Write-Host "OK: Commit completed" -ForegroundColor Green

# Step 6: Add remote repository
Write-Host ""
Write-Host "Step 4/5: Link GitHub repository..." -ForegroundColor Cyan
& git remote add origin $REMOTE_URL
Write-Host "OK: Remote linked" -ForegroundColor Green

# Step 7: Set main branch and push
Write-Host ""
Write-Host "Step 5/5: Push to GitHub..." -ForegroundColor Cyan
& git branch -M main
& git push -u origin main

# Complete
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SUCCESS: Published to GitHub!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository URL:" -ForegroundColor Yellow
Write-Host "   https://github.com/$GITHUB_USER/$REPO_NAME" -ForegroundColor Blue
Write-Host ""
Write-Host "Deploy to Vercel:" -ForegroundColor Yellow
Write-Host "   1. Open https://vercel.com"
Write-Host "   2. Click 'Add New' -> 'Project'"
Write-Host "   3. Select '$REPO_NAME' repository"
Write-Host "   4. Click 'Import' -> 'Deploy'"
Write-Host ""
Write-Host "Future updates:" -ForegroundColor Yellow
Write-Host "   git add . && git commit -m 'message' && git push"
Write-Host "============================================" -ForegroundColor Cyan

Read-Host "Press Enter to exit"
