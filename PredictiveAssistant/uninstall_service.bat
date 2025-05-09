@echo off
echo Stopping and removing Pharmacy Monitor Service...
python pharmacy_monitor_service.py stop
python pharmacy_monitor_service.py remove
echo Service removed.
pause
