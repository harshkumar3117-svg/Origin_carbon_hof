from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the model
# NOTE: Ensure you have xgboost installed: pip install xgboost
model = joblib.load('best_carbon_footprint_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract features
        diet_type = data.get('Diet_Type', 'Both')
        ohe_diets = {
            'Diet_Type_MostlyNonVeg': 1 if diet_type == 'MostlyNonVeg' else 0,
            'Diet_Type_MostlyVeg': 1 if diet_type == 'MostlyVeg' else 0,
            'Diet_Type_NonVeg': 1 if diet_type == 'NonVeg' else 0,
            'Diet_Type_Veg': 1 if diet_type == 'Veg' else 0
        }

        # Prepare input for model
        input_data = {
            'Personal_Vehicle_Km': float(data.get('Personal_Vehicle_Km', 0)),
            'Public_Vehicle_Km': float(data.get('Public_Vehicle_Km', 0)),
            'Plane_Journey_Count': float(data.get('Plane_Journey_Count', 0)),
            'Train_Journey_Count': float(data.get('Train_Journey_Count', 0)),
            'Electricity_Kwh': float(data.get('Electricity_Kwh', 0)),
            'Water_Usage_Liters': float(data.get('Water_Usage_Liters', 0)),
            'Waste_Kg': float(data.get('Waste_Kg', 0)),
            **ohe_diets
        }

        # Convert to DataFrame for prediction
        features_order = [
            'Personal_Vehicle_Km', 'Public_Vehicle_Km', 'Plane_Journey_Count', 
            'Train_Journey_Count', 'Electricity_Kwh', 'Water_Usage_Liters', 
            'Waste_Kg', 'Diet_Type_MostlyNonVeg', 'Diet_Type_MostlyVeg', 
            'Diet_Type_NonVeg', 'Diet_Type_Veg'
        ]
        input_df = pd.DataFrame([input_data])[features_order]

        # Predict
        prediction = model.predict(input_df)[0]
        prediction = round(float(prediction), 2)

        return jsonify({
            'carbon_emission': prediction,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
