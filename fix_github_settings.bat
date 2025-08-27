@echo off
echo 🚀 GitHub Repository Settings Fixer
echo =====================================

REM Check if GitHub CLI is installed
gh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ GitHub CLI not found. Installing...
    winget install GitHub.cli
    if %errorlevel% neq 0 (
        echo ❌ Failed to install GitHub CLI. Please install manually from https://cli.github.com/
        pause
        exit /b 1
    )
)

echo ✅ GitHub CLI found

REM Login to GitHub
echo 🔐 Logging in to GitHub...
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo Please login to GitHub:
    gh auth login
)

echo ✅ Authenticated with GitHub

REM Update repository description
echo 📝 Updating repository description...
gh repo edit davidss20/home-assistant-24h-timer-card-n --description "Professional-grade 24-hour scheduling integration for Home Assistant with server-side automation, condition-based control, and beautiful visual interface."

if %errorlevel% equ 0 (
    echo ✅ Description updated successfully!
) else (
    echo ❌ Failed to update description
)

REM Update repository topics
echo 🏷️  Updating repository topics...
gh repo edit davidss20/home-assistant-24h-timer-card-n --add-topic "home-assistant,hacs,custom-integration,timer,scheduler,automation,24-hour,smart-home,lovelace,websocket"

if %errorlevel% equ 0 (
    echo ✅ Topics updated successfully!
) else (
    echo ❌ Failed to update topics
)

echo.
echo 🎉 GitHub settings updated!
echo.
echo Now run HACS validation again - it should pass!
echo.
pause
