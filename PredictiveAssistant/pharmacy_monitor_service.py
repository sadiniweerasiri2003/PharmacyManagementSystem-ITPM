import win32serviceutil
import win32service
import win32event
import servicemanager
import socket
import sys
import os
import time
from datetime import datetime
import logging
from pymongo import MongoClient
from future_prediction import update_predictions

class PharmacyMonitorService(win32serviceutil.ServiceFramework):
    _svc_name_ = "PharmacyMonitorService"
    _svc_display_name_ = "Pharmacy Stock Monitor Service"
    _svc_description_ = "Monitors pharmacy inventory and updates predictions automatically"

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.stop_event = win32event.CreateEvent(None, 0, 0, None)
        self.client = MongoClient('mongodb+srv://sadini20030104:Sadini%4003@cluster0.b3ltw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        self.db = self.client['test']
        self.last_sales_update = None
        self.last_medicine_update = None

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.stop_event)

    def check_for_updates(self):
        try:
            latest_sale = self.db.sales.find_one(sort=[('orderdate_time', -1)])
            latest_medicine = self.db.medicines.find_one(sort=[('updatedAt', -1)])
            
            updates_exist = False
            
            if latest_sale and (not self.last_sales_update or 
                              latest_sale['orderdate_time'] > self.last_sales_update):
                servicemanager.LogInfoMsg("New sales detected")
                self.last_sales_update = latest_sale['orderdate_time']
                updates_exist = True
                
            if latest_medicine and (not self.last_medicine_update or 
                                  latest_medicine.get('updatedAt', datetime.now()) > self.last_medicine_update):
                servicemanager.LogInfoMsg("Medicine inventory changes detected")
                self.last_medicine_update = latest_medicine.get('updatedAt', datetime.now())
                updates_exist = True
            
            if updates_exist:
                update_predictions()
                
        except Exception as e:
            servicemanager.LogErrorMsg(f"Error checking updates: {str(e)}")

    def SvcDoRun(self):
        try:
            servicemanager.LogMsg(
                servicemanager.EVENTLOG_INFORMATION_TYPE,
                servicemanager.PID_INFO,
                ('Pharmacy Monitor Service Started', '')
            )
            
            while True:
                # Check for service stop signal
                if win32event.WaitForSingleObject(self.stop_event, 100) == win32event.WAIT_OBJECT_0:
                    break
                
                self.check_for_updates()
                
                # Run daily at midnight
                current_time = datetime.now()
                if current_time.hour == 0 and current_time.minute == 0:
                    update_predictions()
                
                time.sleep(300)  # Check every 5 minutes
                
        except Exception as e:
            servicemanager.LogErrorMsg(str(e))

if __name__ == '__main__':
    if len(sys.argv) == 1:
        servicemanager.Initialize()
        servicemanager.PrepareToHostSingle(PharmacyMonitorService)
        servicemanager.StartServiceCtrlDispatcher()
    else:
        win32serviceutil.HandleCommandLine(PharmacyMonitorService)
