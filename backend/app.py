from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to your trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.joblib')

# Load model, preprocessor, and feature names
try:
    loaded = joblib.load(MODEL_PATH)
    if isinstance(loaded, dict) and 'model' in loaded:
        model = loaded['model']
        preprocessor = loaded['preprocessor']
        feature_names = loaded['feature_names']  # <-- use feature_names from model
    else:
        model = loaded
        preprocessor = None
        feature_names = None
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    preprocessor = None
    feature_names = None

# Define expected features for input validation
EXPECTED_FEATURES = {
    'gender': 'Male',
    'age': 45.0,
    'hypertension': 0,
    'heart_disease': 0,
    'ever_married': 'Yes',
    'work_type': 'Private',
    'Residence_type': 'Urban',
    'avg_glucose_level': 90.0,
    'bmi': 25.0,
    'smoking_status': 'never smoked'
}

# Use the preprocessor from training for input transformation
def preprocess_input(data):
    df = pd.DataFrame([data])
    print("DF columns before preprocessing:", df.columns.tolist())
    if 'gender' in df.columns and 'Other' in df['gender'].unique():
        df['gender'] = df['gender'].replace('Other', 'Female')
    numerical_cols = ['age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi']
    # Extract numerical columns from original df
    numerical_df = df[numerical_cols].copy()
    # Transform categorical columns using preprocessor
    processed = preprocessor.transform(df)
    encoded_cols = list(feature_names)
    encoded_df = pd.DataFrame(processed, columns=encoded_cols, index=df.index)
    # Concatenate numerical and encoded columns
    full_df = pd.concat([numerical_df, encoded_df], axis=1)
    return full_df

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or preprocessor is None or feature_names is None:
        return jsonify({'error': 'Model, preprocessor, or feature names not loaded. Please check backend logs.'}), 500

    try:
        data = request.get_json(force=True)
        print(f"Received data: {data}")

        # Basic validation for required fields
        for key in EXPECTED_FEATURES:
            if key not in data:
                return jsonify({'error': f'Missing required field: {key}'}), 400

        # Preprocess the input data
        processed_data = preprocess_input(data)
        print(f"Processed data for prediction: {processed_data.values}")

        # Make prediction
        prediction_proba = model.predict_proba(processed_data)[0][1]
        prediction_class = int(model.predict(processed_data)[0])  # 0 for no stroke, 1 for stroke

        result_text = "High Risk of Stroke" if prediction_class == 1 else "Low Risk of Stroke"

        return jsonify({
            'prediction_class': prediction_class,
            'prediction_probability': round(prediction_proba * 100, 2),
            'result_text': result_text
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return "Synapse Backend is running!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)