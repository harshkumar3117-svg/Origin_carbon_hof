from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the annual-trained model
# NOTE: Ensure you have xgboost installed: pip install xgboost
model = joblib.load('best_carbon_footprint_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # --- Diet_Type one-hot encoding ---
        # drop_first=True in training means 'Both' is the dropped (baseline) category
        diet_type = data.get('Diet_Type', 'Both')
        ohe_diets = {
            'Diet_Type_MostlyNonVeg': 1 if diet_type == 'MostlyNonVeg' else 0,
            'Diet_Type_MostlyVeg':    1 if diet_type == 'MostlyVeg'    else 0,
            'Diet_Type_NonVeg':       1 if diet_type == 'NonVeg'       else 0,
            'Diet_Type_Veg':          1 if diet_type == 'Veg'          else 0,
        }

        # --- Build input dict using ANNUAL column names ---
        # Users submit annual values directly (no ×12 conversion needed).
        input_data = {
            'Personal_Vehicle_Km_Annual':   float(data.get('Personal_Vehicle_Km', 0)),
            'Public_Vehicle_Km_Annual':     float(data.get('Public_Vehicle_Km', 0)),
            'Plane_Journey_Count_Annual':   float(data.get('Plane_Journey_Count', 0)),
            'Train_Journey_Count_Annual':   float(data.get('Train_Journey_Count', 0)),
            'Electricity_Kwh_Annual':       float(data.get('Electricity_Kwh', 0)),
            'Water_Usage_Liters_Annual':    float(data.get('Water_Usage_Liters', 0)),
            'Waste_Kg_Annual':              float(data.get('Waste_Kg', 0)),
            **ohe_diets,
        }

        # Column order MUST match retrain_annual_model.py training feature order exactly
        features_order = [
            'Personal_Vehicle_Km_Annual',
            'Public_Vehicle_Km_Annual',
            'Plane_Journey_Count_Annual',
            'Train_Journey_Count_Annual',
            'Electricity_Kwh_Annual',
            'Water_Usage_Liters_Annual',
            'Waste_Kg_Annual',
            'Diet_Type_MostlyNonVeg',
            'Diet_Type_MostlyVeg',
            'Diet_Type_NonVeg',
            'Diet_Type_Veg',
        ]

        input_df = pd.DataFrame([input_data])[features_order]

        # Predict (returns annual kg CO2)
        prediction = model.predict(input_df)[0]

        return jsonify({
            'carbon_emission': float(prediction),  # kg CO2 per year
            'unit': 'kg CO2/year',
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Running on 5001 to avoid conflict with individual model servers
    app.run(debug=True, port=5001)
