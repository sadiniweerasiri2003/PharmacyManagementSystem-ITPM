from pymongo import MongoClient
import pandas as pd
import joblib
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# MongoDB connection
client = MongoClient('mongodb+srv://sadini20030104:Sadini%4003@cluster0.b3ltw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')  # Replace with your MongoDB URI
db = client['test']  # Replace with your database name

# Collections
medicines_collection = db['medicines']
sales_collection = db['sales']
predictions_collection = db['medicine_predictions']  # Add this line

# Load the pre-trained model
model = joblib.load('general_prophet_model.pkl')

# Function to fetch medicine data
def fetch_medicines_data():
    cursor = medicines_collection.find({}, {'_id': 0, 'medicineId': 1, 'quantity': 1, 'restockedDate': 1})
    data = list(cursor)

    if not data:
        print("No data found in medicines collection!")

    return pd.DataFrame(data)

# Function to calculate daily sales average
def calculate_daily_sales_avg(medicine_id):
    # Fetch sales data for the given medicineId
    cursor = sales_collection.find({'medicines.medicineId': medicine_id},
                                   {'_id': 0, 'medicines.$': 1, 'orderdate_time': 1})

    sales_data = list(cursor)

    if not sales_data:
        print(f"No sales data found for {medicine_id}")
        return 0  # Return 0 if no sales data is found

    # Extract sales quantity and order dates
    total_sales = sum(sale['medicines'][0]['qty_sold'] for sale in sales_data)

    # Ensure o1 orderdate_time is correctly parsed
    dates = [sale['orderdate_time'] if isinstance(sale['orderdate_time'], datetime)
             else datetime.fromisoformat(sale['orderdate_time']) for sale in sales_data]

    first_sale_date = min(dates)
    last_sale_date = max(dates)

    # Calculate the number of days between first and last sale
    days = (last_sale_date - first_sale_date).days + 1  # +1 to include both days

    return total_sales / days if days > 0 else 0  # Avoid division by zero

# Function to predict medicine restock needs
def predict_restock(medicines_data):
    # First retrain the model with latest data
    import train_model  # This will retrain and save new model
    
    # Now load the freshly trained model
    model = joblib.load('general_prophet_model.pkl')
    
    predictions = []
    for index, row in medicines_data.iterrows():
        medicine_id = row['medicineId']
        current_stock = row['quantity']
        
        # Use the medicine-specific forecasts from train_model
        if medicine_id in train_model.medicine_forecasts:
            forecast = train_model.medicine_forecasts[medicine_id]
            
            # Calculate daily average from Prophet forecast
            recent_forecast = forecast.tail(90)  # Last 90 days
            daily_sales_avg = recent_forecast['yhat'].mean()
            
            # Calculate days until depletion using Prophet's predictions
            future_daily_sales = forecast.tail(30)['yhat'].mean()  # Next 30 days prediction
            days_until_depletion = round(current_stock / future_daily_sales) if future_daily_sales > 0 else float('inf')
            
            # Calculate restock date
            restock_date = datetime.now() + pd.Timedelta(days=days_until_depletion)
            
            # Get monthly need from Prophet's forecast
            monthly_prediction = forecast.tail(30)['yhat'].sum()
            peak_adjustment = monthly_prediction * 0.15
            safety_stock = monthly_prediction * 0.20
            
            # Calculate final order quantity
            total_monthly_need = int(monthly_prediction + peak_adjustment + safety_stock)
            
            predictions.append({
                'medicine_id': medicine_id,
                'current_stock': current_stock,
                'daily_sales_avg': round(daily_sales_avg, 2),
                'days_until_restock': days_until_depletion,
                'predicted_restock_date': restock_date,
                'order_quantity': total_monthly_need,
                'prediction_timestamp': datetime.now(),
                'peak_adjusted': True,
                'includes_safety_stock': True,
                'forecast_confidence': forecast.tail(30)['yhat_upper'].mean() - forecast.tail(30)['yhat'].mean()
            })

    return predictions

def has_data_changed():
    # Get last prediction timestamp
    last_prediction = predictions_collection.find_one(
        sort=[('prediction_timestamp', -1)]
    )
    
    if not last_prediction:
        return True

    # Check for any medicine updates after last prediction
    last_medicine_update = medicines_collection.find_one(
        sort=[('updatedAt', -1)]
    )
    last_sale = sales_collection.find_one(
        sort=[('orderdate_time', -1)]
    )

    last_prediction_time = last_prediction['prediction_timestamp']
    
    # Return True if there are newer updates
    return (
        (last_medicine_update and 'updatedAt' in last_medicine_update 
         and last_medicine_update['updatedAt'] > last_prediction_time) or
        (last_sale and last_sale['orderdate_time'] > last_prediction_time)
    )

def update_predictions():
    try:
        if not has_data_changed():
            logging.info("No data changes detected, skipping prediction update")
            return

        logging.info("Fetching medicines data...")
        medicines_data = fetch_medicines_data()

        logging.info("Generating new predictions using trained model...")
        predicted_data = predict_restock(medicines_data)

        if predicted_data:
            predictions_collection.delete_many({})
            predictions_collection.insert_many(predicted_data)
            logging.info(f"Successfully updated {len(predicted_data)} predictions in MongoDB")
        else:
            logging.warning("No predictions generated!")

    except Exception as e:
        logging.error(f"Error during prediction update: {e}")
        raise

if __name__ == "__main__":
    update_predictions()
