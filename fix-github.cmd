@echo off
echo 🚀 Fixing GitHub Repository Settings...

REM Check if curl is available
where curl >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ curl not found. Please install curl or use browser method.
    echo Go to: https://github.com/davidss20/home-assistant-24h-timer-card-n/settings
    pause
    exit /b 1
)

REM Check if GitHub CLI is available
where gh >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ GitHub CLI found, using it...
    
    REM Update description
    echo 📝 Updating description...
    gh repo edit davidss20/home-assistant-24h-timer-card-n --description "Professional-grade 24-hour scheduling integration for Home Assistant with server-side automation, condition-based control, and beautiful visual interface."
    
    REM Update topics
    echo 🏷️ Updating topics...
    gh repo edit davidss20/home-assistant-24h-timer-card-n --add-topic "home-assistant,hacs,custom-integration,timer,scheduler,automation,24-hour,smart-home,lovelace,websocket"
    
    echo ✅ Done! Run HACS validation again.
    
) else (
    echo ❌ GitHub CLI not found.
    echo Please install GitHub CLI from: https://cli.github.com/
    echo Or update manually at: https://github.com/davidss20/home-assistant-24h-timer-card-n/settings
    echo.
    echo Manual steps:
    echo 1. Add description: Professional-grade 24-hour scheduling integration for Home Assistant
    echo 2. Add topics: home-assistant, hacs, custom-integration, timer, scheduler, automation
)

pause
