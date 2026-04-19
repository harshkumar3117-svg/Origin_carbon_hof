# Company Carbon Footprint - Train + Serve
# Run this ONE file:  python retrain_annual_model.py
# It will:
#   1. Train the model on Carbon_FootPrint_Annual.csv
#   2. Start Flask prediction server on port 5001 (used by the website)

import pandas as pd
import numpy as np
import joblib
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from flask import Flask, request, jsonify
from flask_cors import CORS

# ─────────────────────────────────────────
# STEP 1: TRAIN MODEL ON ANNUAL DATASET
# ─────────────────────────────────────────

print("=" * 50)
print("  STEP 1: TRAINING MODEL")
print("=" * 50)

print("\nLoading annual dataset...")
df = pd.read_csv("Carbon_FootPrint_Annual.csv")
print(f"Shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print()

# One-Hot Encode Diet_Type (drop_first=True, baseline = 'Both')
df = pd.get_dummies(df, columns=["Diet_Type"], drop_first=True)

# Cast bool OHE columns to int for XGBoost compatibility
ohe_cols = [c for c in df.columns if c.startswith("Diet_Type_")]
df[ohe_cols] = df[ohe_cols].astype(int)

# Features / Target
X = df.drop("Carbon_Footprint_Kg_Annual", axis=1)
y = df["Carbon_Footprint_Kg_Annual"]

FEATURE_COLUMNS = X.columns.tolist()

print(f"Feature columns: {FEATURE_COLUMNS}")
print(f"Target range:    {y.min():.2f} to {y.max():.2f}  (mean {y.mean():.2f}) kg CO2/year")
print()

# Train / Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"Train size: {X_train.shape[0]}   Test size: {X_test.shape[0]}")

# Train XGBoost
print("\nTraining XGBoost Regressor on annual data...")
trained_model = xgb.XGBRegressor(
    objective="reg:squarederror",
    n_estimators=100,
    random_state=42,
    n_jobs=-1,
)
trained_model.fit(X_train, y_train)
print("Training complete!")

# Evaluate
y_pred = trained_model.predict(X_test)
mae  = mean_absolute_error(y_test, y_pred)
rmse = mean_squared_error(y_test, y_pred) ** 0.5
r2   = r2_score(y_test, y_pred)

print("\n=== Model Performance (Annual Scale) ===")
print(f"  MAE  (kg CO2/year): {mae:.4f}")
print(f"  RMSE (kg CO2/year): {rmse:.4f}")
print(f"  R2   :              {r2:.4f}")
print()

# ─────────────────────────────────────────
# STEP 2: START FLASK PREDICTION SERVER
# ─────────────────────────────────────────

print("=" * 50)
print("  STEP 2: STARTING PREDICTION SERVER")
print("=" * 50)

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Diet_Type one-hot encoding (drop_first=True — 'Both' is baseline)
        diet_type = data.get('Diet_Type', 'Both')
        ohe_diets = {
            'Diet_Type_MostlyNonVeg': 1 if diet_type == 'MostlyNonVeg' else 0,
            'Diet_Type_MostlyVeg':    1 if diet_type == 'MostlyVeg'    else 0,
            'Diet_Type_NonVeg':       1 if diet_type == 'NonVeg'       else 0,
            'Diet_Type_Veg':          1 if diet_type == 'Veg'          else 0,
        }

        # Build input using exact column names from training
        input_data = {
            'Personal_Vehicle_Km_Annual':  float(data.get('Personal_Vehicle_Km', 0)),
            'Public_Vehicle_Km_Annual':    float(data.get('Public_Vehicle_Km', 0)),
            'Plane_Journey_Count_Annual':  float(data.get('Plane_Journey_Count', 0)),
            'Train_Journey_Count_Annual':  float(data.get('Train_Journey_Count', 0)),
            'Electricity_Kwh_Annual':      float(data.get('Electricity_Kwh', 0)),
            'Water_Usage_Liters_Annual':   float(data.get('Water_Usage_Liters', 0)),
            'Waste_Kg_Annual':             float(data.get('Waste_Kg', 0)),
            **ohe_diets,
        }

        # Use the exact feature order from training
        input_df = pd.DataFrame([input_data])[FEATURE_COLUMNS]

        # Predict using in-memory trained model
        prediction = trained_model.predict(input_df)[0]

        return jsonify({
            'carbon_emission': float(prediction),
            'unit': 'kg CO2/year',
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'retrain_annual_model', 'r2': round(r2, 4)})

print("\n[OK] Model trained and ready in memory!")
print("[OK] Starting Flask server on http://localhost:5001")
print("[OK] Website will use this retrained model for all company predictions.\n")

app.run(debug=False, port=5001)
