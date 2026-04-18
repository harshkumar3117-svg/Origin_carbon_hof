from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app) # Enable CORS for frontend communication

# Load the model, encoders, and feature list
model = joblib.load('model.joblib')
encoders = joblib.load('encoders.joblib')
features = joblib.load('features.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Convert simple JSON to DataFrame
        input_df = pd.DataFrame([data])

        # Preprocess categorical features
        for col, le in encoders.items():
            if col in input_df.columns:
                # Handle unseen labels by mapping them to the first label if necessary
                # Or just use transform if we expect the frontend to provide valid labels
                try:
                    input_df[col] = le.transform(input_df[col])
                except ValueError:
                    # Fallback for unseen labels: use a default class (e.g. the first one)
                    input_df[col] = le.transform([le.classes_[0]])[0]

        # Ensure all required features are present
        for col in features:
            if col not in input_df.columns:
                return jsonify({'error': f'Missing feature: {col}'}), 400

        # Reorder columns to match training data
        input_df = input_df[features]

        # Predict
        prediction = model.predict(input_df)[0]

        return jsonify({
            'carbon_emission': float(prediction),
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
