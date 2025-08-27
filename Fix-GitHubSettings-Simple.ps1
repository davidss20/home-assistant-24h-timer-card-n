# Simple PowerShell script to fix GitHub repository settings
Write-Host "🚀 Fixing GitHub Repository Settings..." -ForegroundColor Green

# Repository details
$owner = "davidss20"
$repo = "home-assistant-24h-timer-card-n"

# Try GitHub CLI first
try {
    $ghVersion = gh --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub CLI found" -ForegroundColor Green
        
        # Update description
        Write-Host "📝 Updating repository description..." -ForegroundColor Yellow
        gh repo edit "$owner/$repo" --description "Professional-grade 24-hour scheduling integration for Home Assistant with server-side automation, condition-based control, and beautiful visual interface."
        
        # Update topics
        Write-Host "🏷️ Updating repository topics..." -ForegroundColor Yellow
        gh repo edit "$owner/$repo" --add-topic "home-assistant,hacs,custom-integration,timer,scheduler,automation,24-hour,smart-home,lovelace,websocket"
        
        Write-Host "✅ Settings updated via GitHub CLI!" -ForegroundColor Green
    } else {
        throw "GitHub CLI not available"
    }
} catch {
    Write-Host "❌ GitHub CLI not available. Please install from https://cli.github.com/" -ForegroundColor Red
    Write-Host "Alternative: Update manually via browser at https://github.com/$owner/$repo/settings" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Run HACS validation again!" -ForegroundColor Cyan
