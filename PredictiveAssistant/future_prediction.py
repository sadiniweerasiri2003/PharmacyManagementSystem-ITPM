from pymongo import MongoClient
import pandas as pd
import joblib
from datetime import datetime

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
    predictions = []

    for index, row in medicines_data.iterrows():
        medicine_id = row['medicineId']
        current_stock = row['quantity']
        restocked_date = row.get('restockedDate', None)  # Some records might not have this

        # Calculate daily sales average
        daily_sales_avg = calculate_daily_sales_avg(medicine_id)

        # If no sales data, skip this medicine
        if daily_sales_avg == 0:
            continue

        # Calculate predicted restock time in days
        predicted_restock_in_days = current_stock / daily_sales_avg

        # Set a restock threshold
        restock_threshold = 50  # Modify if needed
        stock_to_restock = restock_threshold - current_stock if current_stock < restock_threshold else 0

        # Append prediction
        predictions.append({
            'medicine_id': medicine_id,
            'current_stock': current_stock,
            'daily_sales_avg': daily_sales_avg,
            'restocked_date': restocked_date,
            'predicted_restock_in_days': round(predicted_restock_in_days),
            'prediction_timestamp': datetime.now(),
            'stock_to_restock': stock_to_restock
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
    # First check if we need to update
    if not has_data_changed():
        print("No data changes detected, skipping prediction update")
        return

    # Retrain the model
    import train_model  # This will run the training script
    
    # Fetch medicines data
    medicines_data = fetch_medicines_data()

    # Generate new predictions
    predicted_data = predict_restock(medicines_data)

    if predicted_data:
        # Delete all existing predictions
        predictions_collection.delete_many({})
        
        # Insert new predictions
        predictions_collection.insert_many(predicted_data)
        print("Predictions updated in MongoDB")
        
        # Print new predictions for reference
        for prediction in predicted_data:
            print(prediction)
    else:
        print("No predictions to insert!")

if __name__ == "__main__":
    update_predictions()
