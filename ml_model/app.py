# ml_model/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

model = None
category_encoder = None
imputer = None

try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(BASE_DIR, 'startup_success_model.pkl')
    encoder_path = os.path.join(BASE_DIR, 'category_encoder.pkl')
    imputer_path = os.path.join(BASE_DIR, 'imputer.pkl')

    model = joblib.load(model_path)
    category_encoder = joblib.load(encoder_path)
    imputer = joblib.load(imputer_path)
    
    print("✅ Final, corrected model and assets loaded successfully!")
except FileNotFoundError as e:
    print(f"❌ Error loading model assets: {e}. Please run the final train_model.py script.")

@app.route('/predict', methods=['POST'])
def predict():
    if not all([model, category_encoder, imputer]):
        return jsonify({'error': 'Model not loaded. Please check server logs.'}), 500

    data = request.get_json()
    
    try:
        input_df = pd.DataFrame([data])

        numeric_cols = ['funding_total_usd', 'funding_rounds', 'milestones', 'relationships', 'age_first_milestone_year', 'age_last_milestone_year']
        for col in numeric_cols:
            input_df[col] = pd.to_numeric(input_df[col], errors='coerce')

        for col in ['founded_at', 'first_funding_at', 'last_funding_at']:
            input_df[col] = pd.to_datetime(input_df[col], errors='coerce')

        input_df['funding_velocity_days'] = (input_df['first_funding_at'] - input_df['founded_at']).dt.days
        age_in_years = (input_df['last_funding_at'] - input_df['first_funding_at']).dt.days / 365.25
        input_df['age_in_years'] = age_in_years.replace(0, 1/365.25)
        input_df['funding_momentum'] = input_df['funding_total_usd'] / input_df['age_in_years']
        milestone_age_years = input_df['age_last_milestone_year'] - input_df['age_first_milestone_year']
        input_df['milestone_age_years'] = milestone_age_years.replace(0, 1/365.25)
        input_df['milestone_velocity'] = input_df['milestones'] / input_df['milestone_age_years']
        
        input_df['category_code'] = category_encoder.transform(input_df['category_code'].astype(str))

        model_features = imputer.get_feature_names_out()
        input_df = input_df.reindex(columns=model_features, fill_value=0)
        input_df.replace([np.inf, -np.inf], np.nan, inplace=True)
        
        input_df_imputed = pd.DataFrame(imputer.transform(input_df), columns=model_features)
        
        prediction = model.predict(input_df_imputed)
        probability = model.predict_proba(input_df_imputed)
        success_probability = probability[0][1]

        return jsonify({
            'prediction_label': 'Success' if int(prediction[0]) == 1 else 'Failure',
            'success_probability': round(float(success_probability) * 100, 2)
        })
    except Exception as e:
        print(f"❌ Error during prediction: {str(e)}")
        return jsonify({'error': f"An error occurred: {str(e)}"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)