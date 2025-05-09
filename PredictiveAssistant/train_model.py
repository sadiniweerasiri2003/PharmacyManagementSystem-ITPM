import pandas as pd
import pymongo
from prophet import Prophet
import joblib

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

# Clean and convert dates safely (fixes tz-aware vs tz-naive error)
sales_data["ds"] = sales_data["ds"].apply(lambda x: pd.to_datetime(x).tz_localize(None) if pd.notnull(x) else pd.NaT)
sales_data.dropna(subset=["ds"], inplace=True)

# Aggregate daily sales
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

# Predict future sales (30 days)
future = model.make_future_dataframe(periods=30)
forecast = model.predict(future)
forecast["cumulative_sales"] = forecast["yhat"].cumsum()

# Predict stock depletion
stock_depletion_dates = {}
for _, row in medicine_data.iterrows():
    med_id, stock = row["medicineId"], row["quantity"]
    depletion_date = forecast.loc[forecast["cumulative_sales"] >= stock, "ds"].min()
    stock_depletion_dates[med_id] = depletion_date if pd.notna(depletion_date) else "Stock sufficient"

print("📉 Predicted Stock Depletion Dates:", stock_depletion_dates)

# Estimate restocking needs
forecast_last_30_days = forecast.tail(30)
upper_bound_demand = forecast_last_30_days["yhat_upper"].sum()
restocking_needs = {med_id: int(upper_bound_demand * 1.2) for med_id in medicine_data["medicineId"]}

print("📦 Recommended Restocking Quantities (est.):", restocking_needs)

# Create forecasts per medicine
medicine_forecasts = {}
for med_id in medicine_data["medicineId"]:
    med_sales = pd.DataFrame(sales_list)
    med_sales = med_sales[med_sales["medicineId"] == med_id]

    if not med_sales.empty:
        med_sales = med_sales[["ds", "y"]]

        # Normalize datetime (same fix)
        med_sales["ds"] = med_sales["ds"].apply(lambda x: pd.to_datetime(x).tz_localize(None) if pd.notnull(x) else pd.NaT)
        med_sales.dropna(subset=["ds"], inplace=True)

        if not med_sales.empty:
            med_model = Prophet(seasonality_mode="multiplicative", changepoint_prior_scale=0.05)
            med_model.fit(med_sales)
            med_future = med_model.make_future_dataframe(periods=30)
            med_forecast = med_model.predict(med_future)
            medicine_forecasts[med_id] = med_forecast

# Compute stock depletion and restocking per medicine
stock_depletion_dates = {}
restocking_needs = {}

for _, row in medicine_data.iterrows():
    med_id, current_stock = row["medicineId"], row["quantity"]

    if med_id in medicine_forecasts:
        forecast = medicine_forecasts[med_id]
        last_30_days = forecast.tail(30)
        monthly_demand = last_30_days["yhat"].sum()
        safety_stock = monthly_demand * 0.2
        required_stock = int(monthly_demand + safety_stock)
        restock_amount = max(0, required_stock - current_stock)
        depletion_date = forecast.loc[forecast["yhat"].cumsum() >= current_stock, "ds"].min()
        stock_depletion_dates[med_id] = depletion_date if pd.notna(depletion_date) else "Stock sufficient"
        restocking_needs[med_id] = restock_amount
    else:
        restocking_needs[med_id] = max(0, 50 - current_stock)  # Fallback for unknowns

print("📉 Final Predicted Stock Depletion Dates:", stock_depletion_dates)
print("📦 Final Recommended Restocking Quantities:", restocking_needs)
