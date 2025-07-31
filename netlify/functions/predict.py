# netlify/functions/predict.py

import json
import joblib
import pandas as pd
import numpy as np
import os
import sys

# Add the path to the current directory to sys.path
# This helps in finding model.joblib if it's in the same directory
sys.path.append(os.path.dirname(__file__))

# --- Global Load: Model, Preprocessor, and Feature Names ---
# These are loaded once when the function starts (cold start)
# This improves performance by not reloading on every request.
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.joblib')

model = None
preprocessor = None
feature_names = None

try:
    loaded = joblib.load(MODEL_PATH)
    if isinstance(loaded, dict) and 'model' in loaded:
        model = loaded['model']
        preprocessor = loaded['preprocessor']
        feature_names = loaded['feature_names']
    else:
        # Fallback for older model saving formats if applicable
        model = loaded
        # You might need to manually define preprocessor and feature_names if not in 'loaded' dict
        # For this specific case, assuming they are always in the dict if present.
        preprocessor = None # Or load separately if saved differently
        feature_names = None # Or load separately if saved differently
    print("Model, preprocessor, and feature names loaded successfully!")
except Exception as e:
    print(f"Error loading model, preprocessor, or feature names: {e}")
    # Ensure these are None if loading fails to trigger appropriate error responses


# --- Helper Function: Preprocess Input Data ---
# This function is directly from your app.py, adapted slightly for standalone use.
def preprocess_input(data):
    df = pd.DataFrame([data])
    # print("DF columns before preprocessing:", df.columns.tolist()) # For debugging in Netlify logs
    if 'gender' in df.columns and 'Other' in df['gender'].unique():
        df['gender'] = df['gender'].replace('Other', 'Female')

    # Ensure all expected numerical columns are present before slicing
    numerical_cols = ['age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi']
    for col in numerical_cols:
        if col not in df.columns:
            df[col] = np.nan # Or a default value, depending on your preprocessing strategy

    numerical_df = df[numerical_cols].copy()

    # Preprocessor expects specific columns. Ensure df has all columns before transform.
    # If your preprocessor was trained on a specific set of columns, ensure those are present.
    # For robust deployment, ensure 'data' from frontend always contains all expected raw features.
    
    # Create a DataFrame with all original feature columns in the correct order
    # (This is crucial for preprocessor.transform if it's a ColumnTransformer or similar)
    # You might need to explicitly create columns with default values if they are missing from 'data'
    
    # Example: Create a full DataFrame with all expected raw features (including categorical)
    # and fill missing with appropriate defaults or NaNs before preprocessing
    all_raw_features = list(EXPECTED_FEATURES.keys()) # Assuming EXPECTED_FEATURES lists all raw inputs
    full_raw_df = pd.DataFrame([data], columns=all_raw_features)
    
    # Handle 'Other' gender replacement before preprocessing
    if 'gender' in full_raw_df.columns and 'Other' in full_raw_df['gender'].unique():
        full_raw_df['gender'] = full_raw_df['gender'].replace('Other', 'Female')

    # Transform categorical columns using preprocessor
    # The preprocessor should handle numerical columns if it's a ColumnTransformer or similar
    # If preprocessor only handles categorical, you'd combine numerical_df and encoded_df later.
    
    # Assuming your preprocessor (likely a ColumnTransformer or OneHotEncoder) expects the full DataFrame
    # and outputs the final feature array.
    processed_array = preprocessor.transform(full_raw_df)

    # Convert the processed array back to a DataFrame with correct feature names
    # This is important for the model.predict() call if it expects a DataFrame
    # Ensure feature_names matches the order of features output by your preprocessor
    processed_df = pd.DataFrame(processed_array, columns=feature_names, index=full_raw_df.index)
    
    return processed_df


# Define expected features for input validation (from your app.py)
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


# --- Netlify Function Handler ---
# This is the main entry point for your serverless function
def handler(event, context):
    # Set CORS headers for all responses
    # This is crucial to allow your Netlify frontend to talk to this function
    headers = {
        "Access-Control-Allow-Origin": "*", # Allows requests from any origin (you can restrict this later)
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS" # Only allow POST and OPTIONS for this endpoint
    }

    # Handle preflight OPTIONS requests (browsers send these before actual POST requests for CORS)
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }

    # Check if model, preprocessor, or feature_names failed to load globally
    if model is None or preprocessor is None or feature_names is None:
        print("Error: Model, preprocessor, or feature names not loaded.")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Prediction service not ready. Check function logs.'})
        }

    try:
        # Netlify Functions receive the request body as a string in event['body']
        # Parse it into a Python dictionary (equivalent to request.get_json())
        data = json.loads(event['body'])
        # print(f"Received data: {data}") # For debugging in Netlify logs

        # Basic validation for required fields (from your app.py)
        for key in EXPECTED_FEATURES:
            if key not in data:
                print(f"Missing required field: {key}")
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': f'Missing required field: {key}'})
                }

        # Preprocess the input data using your helper function
        processed_data = preprocess_input(data)
        # print(f"Processed data for prediction: {processed_data.values}") # For debugging

        # Make prediction
        prediction_proba = model.predict_proba(processed_data)[0][1]
        prediction_class = int(model.predict(processed_data)[0]) # 0 for no stroke, 1 for stroke

        result_text = "High Risk of Stroke" if prediction_class == 1 else "Low Risk of Stroke"

        # Return the response in Netlify Function format
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'prediction': prediction_class, # Renamed from prediction_class to 'prediction' for frontend
                'prediction_probability': round(prediction_proba * 100, 2),
                'result_text': result_text
            })
        }

    except Exception as e:
        print(f"Error during prediction: {e}") # This will appear in Netlify function logs
        # Return a 500 status code with an error message
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e), 'details': "An unexpected error occurred during prediction."})
        }