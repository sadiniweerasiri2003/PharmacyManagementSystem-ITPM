import schedule
import time
import subprocess
import sys
from datetime import datetime
import os
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scheduler.log'),
        logging.StreamHandler()
    ]
)

def run_prediction(max_retries=3):
    logging.info(f"Running prediction update at {datetime.now()}")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    prediction_script = os.path.join(script_dir, 'future_prediction.py')
    
    for attempt in range(max_retries):
        try:
            subprocess.run([sys.executable, prediction_script], check=True)
            logging.info("Prediction update completed successfully")
            return True
        except subprocess.CalledProcessError as e:
            logging.error(f"Attempt {attempt + 1}/{max_retries} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(300)  # Wait 5 minutes before retry
            else:
                logging.error("All retry attempts failed")
                return False

# Schedule jobs
def schedule_jobs():
    # Run at midnight and noon
    schedule.every().day.at("00:00").do(run_prediction)
    schedule.every().day.at("12:00").do(run_prediction)
    logging.info("Scheduled prediction updates for 00:00 and 12:00")

if __name__ == "__main__":
    schedule_jobs()
    run_prediction()  # Initial run

    while True:
        try:
            schedule.run_pending()
            time.sleep(60)
        except Exception as e:
            logging.error(f"Error in scheduler: {e}")
            time.sleep(60)  # Wait a minute and continue
