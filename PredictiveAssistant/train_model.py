import pandas as pd
import pymongo
from prophet import Prophet
import joblib
import plotly.graph_objects as go

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://sadini20030104:Sadini%4003@cluster0.b3ltw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["test"]

# Load medicine stock data
medicine_data = pd.DataFrame(list(db.medicines.find({}, {"medicineId": 1, "quantity": 1})))

# Load sales data and extract medicines
sales_records = list(db.sales.find({}, {"orderdate_time": 1, "medicines": 1}))

sales_list = []
for sale in sales_records:
	order_date = sale.get("orderdate_time")
	if "medicines" in sale:
		for med in sale["medicines"]:
			sales_list.append({
				"ds": order_date,
				"medicineId": med["medicineId"],
				"y": med["qty_sold"]
			})

# Convert to DataFrame
sales_data = pd.DataFrame(sales_list)

# Convert orderdate_time to datetime format
sales_data["ds"] = pd.to_datetime(sales_data["ds"]).dt.tz_localize(None)

# Ensure all dates are represented
date_range = pd.date_range(start=sales_data["ds"].min(), end=sales_data["ds"].max(), freq="D")
sales_data = sales_data.groupby("ds")["y"].sum().reindex(date_range, fill_value=0).reset_index()
sales_data.rename(columns={"index": "ds"}, inplace=True)

# Check if we have data to train
if sales_data.empty:
	print("⚠ Not enough sales data to train the model!")
	exit()

# Train Prophet model for total sales
print("Training Prophet model for total sales...")
model = Prophet(seasonality_mode="multiplicative", changepoint_prior_scale=0.05)
model.fit(sales_data)

# Save the trained model
joblib.dump(model, "general_prophet_model.pkl")

# Create future dates for prediction (next 30 days)
future = model.make_future_dataframe(periods=30)

# Predict future sales
forecast = model.predict(future)

# Compute cumulative sales for depletion check
forecast["cumulative_sales"] = forecast["yhat"].cumsum()

# Dictionary to store stock depletion predictions
stock_depletion_dates = {}

for _, row in medicine_data.iterrows():
	med_id, stock = row["medicineId"], row["quantity"]

	# Find depletion date (when cumulative sales exceed stock)
	depletion_date = forecast.loc[forecast["cumulative_sales"] >= stock, "ds"].min()
	stock_depletion_dates[med_id] = depletion_date if pd.notna(depletion_date) else "Stock sufficient"

print("📉 Predicted Stock Depletion Dates:", stock_depletion_dates)

# Compute restocking recommendations based on the last 30 days' predicted sales
forecast_last_30_days = forecast.tail(30)
monthly_demand = forecast_last_30_days["yhat"].sum()

# Adjust restocking needs by confidence intervals
upper_bound_demand = forecast_last_30_days["yhat_upper"].sum()
restocking_needs = {med_id: int(upper_bound_demand * 1.2) for med_id in medicine_data["medicineId"]}

print("📦 Recommended Restocking Quantities:", restocking_needs)

# Create medication-specific predictions
medicine_forecasts = {}
for med_id in medicine_data["medicineId"]:
    # Filter data for this medicine
    med_sales = pd.DataFrame(sales_list)
    med_sales = med_sales[med_sales["medicineId"] == med_id]
    
    if not med_sales.empty:
        # Prepare data for Prophet
        med_sales = med_sales[["ds", "y"]]
        med_sales["ds"] = pd.to_datetime(med_sales["ds"]).dt.tz_localize(None)
        
        # Train model for this medicine
        med_model = Prophet(seasonality_mode="multiplicative", changepoint_prior_scale=0.05)
        med_model.fit(med_sales)
        
        # Predict next 30 days
        med_future = med_model.make_future_dataframe(periods=30)
        med_forecast = med_model.predict(med_future)
        medicine_forecasts[med_id] = med_forecast

# Dictionary to store stock depletion predictions and restocking needs
stock_depletion_dates = {}
restocking_needs = {}

for _, row in medicine_data.iterrows():
    med_id, current_stock = row["medicineId"], row["quantity"]
    
    if med_id in medicine_forecasts:
        forecast = medicine_forecasts[med_id]
        
        # Calculate monthly predicted demand
        last_30_days = forecast.tail(30)
        monthly_demand = last_30_days["yhat"].sum()
        safety_stock = monthly_demand * 0.2  # 20% safety stock
        
        # Calculate required stock level for next month
        required_stock = int(monthly_demand + safety_stock)
        
        # Calculate restock amount considering current stock
        restock_amount = max(0, required_stock - current_stock)
        
        # Store results
        depletion_date = forecast.loc[forecast["yhat"].cumsum() >= current_stock, "ds"].min()
        stock_depletion_dates[med_id] = depletion_date if pd.notna(depletion_date) else "Stock sufficient"
        restocking_needs[med_id] = restock_amount
    else:
        # If no sales data, use conservative estimate
        restocking_needs[med_id] = max(0, 50 - current_stock)  # Maintain minimum 50 units

print("📉 Predicted Stock Depletion Dates:", stock_depletion_dates)
print("📦 Recommended Restocking Quantities:", restocking_needs)