@echo off
echo Installing Pharmacy Monitor Service...

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This script requires administrator privileges.
    echo Please right-click and select "Run as administrator"
    pause
    exit
)

cd /d "%~dp0"
python "%~dp0pharmacy_monitor_service.py" install
python "%~dp0pharmacy_monitor_service.py" start
echo.
echo Service installed and started successfully!
echo You can verify in Windows Services (services.msc)
pause
