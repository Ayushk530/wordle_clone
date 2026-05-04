# Requires Run as Administrator
if (-Not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "Please run this script as Administrator. Right click the script and select 'Run with PowerShell' after starting PowerShell as Admin."
    Pause
    exit
}

$configPath = "C:\ProgramData\Jenkins\.jenkins\config.xml"

if (Test-Path $configPath) {
    Write-Host "Stopping Jenkins service..."
    Stop-Service -Name "Jenkins" -Force
    
    Write-Host "Updating config.xml to disable security..."
    $configContent = Get-Content $configPath
    $configContent = $configContent -replace "<useSecurity>true</useSecurity>", "<useSecurity>false</useSecurity>"
    $configContent | Set-Content $configPath
    
    Write-Host "Starting Jenkins service..."
    Start-Service -Name "Jenkins"
    Write-Host "Jenkins security disabled and service restarted successfully!" -ForegroundColor Green
    Write-Host "You can now go to http://localhost:8080 and access Jenkins without a password." -ForegroundColor Green
    Write-Host "Once you are in, go to Manage Jenkins -> Security to set up a new password." -ForegroundColor Yellow
} else {
    Write-Host "Could not find Jenkins config at $configPath" -ForegroundColor Red
}

Pause
