# PowerShell script to fix GitHub repository settings
param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken = $env:GITHUB_TOKEN
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Fixing GitHub Repository Settings..." -ForegroundColor Green

# Repository details
$owner = "davidss20"
$repo = "home-assistant-24h-timer-card-n"
$description = "Professional-grade 24-hour scheduling integration for Home Assistant with server-side automation, condition-based control, and beautiful visual interface."
$topics = @("home-assistant", "hacs", "custom-integration", "timer", "scheduler", "automation", "24-hour", "smart-home", "lovelace", "websocket")

# Check if GitHub CLI is available
try {
    $ghVersion = gh --version
    Write-Host "✅ GitHub CLI found: $($ghVersion[0])" -ForegroundColor Green
    
    # Update description
    Write-Host "📝 Updating repository description..." -ForegroundColor Yellow
    gh repo edit "$owner/$repo" --description $description
    Write-Host "✅ Description updated!" -ForegroundColor Green
    
    # Update topics
    Write-Host "🏷️ Updating repository topics..." -ForegroundColor Yellow
    $topicString = $topics -join ","
    gh repo edit "$owner/$repo" --add-topic $topicString
    Write-Host "✅ Topics updated!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ GitHub CLI not found. Using REST API..." -ForegroundColor Yellow
    
    if (-not $GitHubToken) {
        Write-Host "❌ GitHub token required!" -ForegroundColor Red
        Write-Host "Set GITHUB_TOKEN environment variable or pass as parameter" -ForegroundColor Red
        exit 1
    }
    
    $headers = @{
        "Authorization" = "token $GitHubToken"
        "Accept" = "application/vnd.github.v3+json"
    }
    
    # Update description
    Write-Host "📝 Updating repository description via API..." -ForegroundColor Yellow
    $descriptionBody = @{ description = $description } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo" -Method PATCH -Headers $headers -Body $descriptionBody -ContentType "application/json"
        Write-Host "✅ Description updated!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to update description: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Update topics
    Write-Host "🏷️ Updating repository topics via API..." -ForegroundColor Yellow
    $topicsBody = @{ names = $topics } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/topics" -Method PUT -Headers $headers -Body $topicsBody -ContentType "application/json"
        Write-Host "✅ Topics updated!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to update topics: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Repository settings updated!" -ForegroundColor Green
Write-Host "Now run HACS validation again - it should pass!" -ForegroundColor Cyan
