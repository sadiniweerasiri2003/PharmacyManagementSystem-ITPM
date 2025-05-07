import schedule
import time
import subprocess
import sys
from datetime import datetime
import os

def run_prediction():
    print(f"Running prediction update at {datetime.now()}")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    prediction_script = os.path.join(script_dir, 'future_prediction.py')
    
    try:
        subprocess.run([sys.executable, prediction_script], check=True)
        print("Prediction update completed successfully")
    except subprocess.CalledProcessError as e:
        print(f"Error running prediction update: {e}")

# Schedule the job to run daily at midnight
schedule.every().day.at("00:00").do(run_prediction)

# Run immediately on start
run_prediction()

# Keep the script running
while True:
    schedule.run_pending()
    time.sleep(60)
