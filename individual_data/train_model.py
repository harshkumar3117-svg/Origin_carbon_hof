import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def train():
    # Load the dataset
    file_path = 'Carbon Emission.csv'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    data = pd.read_csv(file_path)

    # Drop any columns that are definitely not features (none observed in data.head())
    # Based on the notebook, it uses all columns except the target 'CarbonEmission'
    
    # Preprocessing
    categorical_cols = data.select_dtypes(include=['object']).columns
    encoders = {}

    for col in categorical_cols:
        le = LabelEncoder()
        data[col] = le.fit_transform(data[col])
        encoders[col] = le

    # Define features and target
    X = data.drop('CarbonEmission', axis=1)
    y = data['CarbonEmission']

    # Model Initialization and Training
    # Using parameters from the notebook (default or stated)
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Save the model and encoders
    joblib.dump(model, 'model.joblib')
    joblib.dump(encoders, 'encoders.joblib')
    joblib.dump(X.columns.tolist(), 'features.joblib')

    print("Model and encoders saved successfully.")
    print(f"Features: {X.columns.tolist()}")

if __name__ == "__main__":
    train()
