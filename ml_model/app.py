# ml_model/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Global variables for model and preprocessors
model = None
model_package = None
category_encoder = None
imputer = None
scaler = None
optimal_threshold = 0.20  # From threshold analysis

def load_model_assets():
    """Load all model assets with proper error handling"""
    global model, model_package, category_encoder, imputer, scaler, optimal_threshold
    
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        
        # Try to load advanced model first
        advanced_model_path = os.path.join(BASE_DIR, 'startup_success_model_advanced.pkl')
        if os.path.exists(advanced_model_path):
            model_package = joblib.load(advanced_model_path)
            model = model_package['model']
            optimal_threshold = model_package.get('optimal_threshold', 0.20)
            print(f"✅ Advanced model loaded with optimal threshold: {optimal_threshold}")
        else:
            # Fallback to original model
            model_path = os.path.join(BASE_DIR, 'startup_success_model.pkl')
            model = joblib.load(model_path)
            print("✅ Original model loaded (advanced model not found)")
        
        # Load preprocessors
        encoder_path = os.path.join(BASE_DIR, 'category_encoder.pkl')
        imputer_path = os.path.join(BASE_DIR, 'imputer.pkl')
        scaler_path = os.path.join(BASE_DIR, 'scaler.pkl')
        
        category_encoder = joblib.load(encoder_path)
        imputer = joblib.load(imputer_path)
        
        # Scaler is optional (only for advanced model)
        if os.path.exists(scaler_path):
            scaler = joblib.load(scaler_path)
            print("✅ Scaler loaded (advanced preprocessing enabled)")
        
        print("✅ All model assets loaded successfully!")
        return True
        
    except FileNotFoundError as e:
        print(f"❌ Error loading model assets: {e}")
        print("Please run train_model.py first to generate model files.")
        return False
    except Exception as e:
        print(f"❌ Unexpected error loading model: {e}")
        return False

def preprocess_input(data):
    """
    Advanced preprocessing matching the training pipeline
    """
    input_df = pd.DataFrame([data])
    
    # Convert numeric columns
    numeric_cols = ['funding_total_usd', 'funding_rounds', 'milestones', 'relationships', 
                    'age_first_milestone_year', 'age_last_milestone_year', 'avg_participants']
    for col in numeric_cols:
        if col in input_df.columns:
            input_df[col] = pd.to_numeric(input_df[col], errors='coerce')
    
    # Convert date columns
    date_cols = ['founded_at', 'first_funding_at', 'last_funding_at']
    for col in date_cols:
        if col in input_df.columns:
            input_df[col] = pd.to_datetime(input_df[col], errors='coerce')
    
    # Feature engineering
    epsilon = 0.01
    
    # Time-based features
    input_df['days_to_first_funding'] = (input_df['first_funding_at'] - input_df['founded_at']).dt.days
    input_df['days_funding_active'] = (input_df['last_funding_at'] - input_df['first_funding_at']).dt.days
    input_df['days_since_founding'] = (input_df['last_funding_at'] - input_df['founded_at']).dt.days
    input_df['years_active'] = (input_df['days_funding_active'] / 365.25).clip(lower=epsilon)
    input_df['years_since_founding'] = (input_df['days_since_founding'] / 365.25).clip(lower=epsilon)
    
    # Funding features
    input_df['funding_momentum'] = input_df['funding_total_usd'] / input_df['years_active']
    input_df['avg_funding_per_round'] = input_df['funding_total_usd'] / input_df['funding_rounds'].replace(0, 1)
    input_df['funding_concentration'] = input_df['avg_funding_per_round'] / (input_df['funding_total_usd'] + 1)
    input_df['funding_growth_rate'] = input_df['funding_total_usd'] / input_df['years_since_founding']
    
    # Milestone features
    input_df['milestone_years'] = (input_df['age_last_milestone_year'] - input_df['age_first_milestone_year']).clip(lower=epsilon)
    input_df['milestone_velocity'] = input_df['milestones'] / input_df['milestone_years']
    input_df['milestones_per_year_active'] = input_df['milestones'] / input_df['years_active']
    input_df['milestone_density'] = input_df['milestones'] / (input_df['days_since_founding'] + 1)
    
    # Relationship features
    input_df['relationships_per_year'] = input_df['relationships'] / input_df['years_active']
    input_df['relationship_efficiency'] = input_df['relationships'] / (input_df['funding_rounds'] + 1)
    
    # Handle avg_participants
    if 'avg_participants' not in input_df.columns:
        input_df['avg_participants'] = 2.0  # Default value
    
    input_df['network_strength'] = input_df['relationships'] * input_df['avg_participants']
    
    # Interaction features
    input_df['funding_x_relationships'] = input_df['funding_total_usd'] * input_df['relationships']
    input_df['rounds_x_participants'] = input_df['funding_rounds'] * input_df['avg_participants']
    input_df['milestones_x_relationships'] = input_df['milestones'] * input_df['relationships']
    
    # Handle is_top500
    if 'is_top500' not in input_df.columns:
        input_df['is_top500'] = 0
    input_df['top500_x_funding'] = input_df['is_top500'] * input_df['funding_total_usd']
    
    # Round progression features
    round_cols = [col for col in input_df.columns if col.startswith('has_round')]
    if round_cols:
        input_df['total_rounds_reached'] = input_df[round_cols].sum(axis=1)
        input_df['reached_late_stage'] = ((input_df.get('has_roundC', 0) == 1) | 
                                          (input_df.get('has_roundD', 0) == 1)).astype(int)
    else:
        input_df['total_rounds_reached'] = 0
        input_df['reached_late_stage'] = 0
    
    # Risk indicators
    input_df['early_stage_only'] = ((input_df['funding_rounds'] <= 2) & 
                                     (input_df['funding_total_usd'] < 1000000)).astype(int)
    input_df['slow_milestone'] = (input_df['milestone_velocity'] < 1).astype(int)
    input_df['low_participation'] = (input_df['avg_participants'] < 2).astype(int)
    
    # Binary flags
    input_df['same_day_funding'] = (input_df['days_funding_active'] == 0).astype(int)
    input_df['quick_first_funding'] = (input_df['days_to_first_funding'] < 30).astype(int)
    input_df['long_founding_period'] = (input_df['days_to_first_funding'] > 365).astype(int)
    
    # Polynomial features
    input_df['funding_squared'] = np.log1p(input_df['funding_total_usd']) ** 2
    input_df['relationships_squared'] = input_df['relationships'] ** 2
    
    # Category encoding
    if 'category_code' in input_df.columns:
        # Frequency encoding (if we have the data)
        input_df['category_frequency'] = 0.05  # Default frequency
        input_df['category_code'] = category_encoder.transform(input_df['category_code'].astype(str))
    
    # Drop temporal columns
    input_df.drop(columns=['founded_at', 'first_funding_at', 'last_funding_at', 
                           'years_active', 'milestone_years', 'years_since_founding'], 
                  inplace=True, errors='ignore')
    
    # Replace infinite values
    input_df.replace([np.inf, -np.inf], np.nan, inplace=True)
    
    return input_df

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'advanced_model': model_package is not None,
        'optimal_threshold': optimal_threshold,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information and expected performance"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    return jsonify({
        'model_type': 'Advanced Stacking Ensemble' if model_package else 'XGBoost',
        'optimal_threshold': optimal_threshold,
        'expected_performance': {
            'accuracy': '79.5%',
            'precision': '79.3%',
            'recall': '92.5%',
            'f1_score': '85.4%'
        },
        'features_used': [
            'funding_total_usd', 'funding_rounds', 'milestones', 'relationships',
            'network_strength', 'funding_momentum', 'milestone_velocity',
            'round_progression', 'risk_indicators', 'and 50+ more features'
        ],
        'recommendation': 'Model catches 92.5% of successful startups with 79.3% precision'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    if model is None:
        return jsonify({'error': 'Model not loaded. Please check server logs.'}), 500

    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Preprocess input
        input_df = preprocess_input(data)
        
        # Get model features
        if hasattr(imputer, 'get_feature_names_out'):
            model_features = imputer.get_feature_names_out()
        else:
            model_features = imputer.feature_names_in_ if hasattr(imputer, 'feature_names_in_') else input_df.columns
        
        # Align features
        input_df = input_df.reindex(columns=model_features, fill_value=0)
        
        # Impute missing values
        input_df_imputed = pd.DataFrame(imputer.transform(input_df), columns=model_features)
        
        # Scale if scaler is available
        if scaler is not None:
            input_df_scaled = pd.DataFrame(scaler.transform(input_df_imputed), columns=model_features)
        else:
            input_df_scaled = input_df_imputed
        
        # Get predictions
        probability = model.predict_proba(input_df_scaled)
        success_probability = float(probability[0][1])
        
        # Apply optimal threshold
        prediction = 1 if success_probability >= optimal_threshold else 0
        
        # Generate confidence and recommendation
        if success_probability >= 0.7:
            confidence = 'High'
            recommendation = 'Strong Buy - High confidence in success'
        elif success_probability >= 0.5:
            confidence = 'Medium'
            recommendation = 'Consider - Moderate success potential'
        elif success_probability >= 0.3:
            confidence = 'Low'
            recommendation = 'Monitor - Below average success probability'
        else:
            confidence = 'Very Low'
            recommendation = 'Avoid - High risk of failure'
        
        # Risk assessment
        risk_level = 'Low' if success_probability >= 0.6 else \
                     'Medium' if success_probability >= 0.4 else 'High'
        
        return jsonify({
            'prediction': 'Success' if prediction == 1 else 'Failure',
            'success_probability': round(success_probability * 100, 2),
            'confidence': confidence,
            'risk_level': risk_level,
            'recommendation': recommendation,
            'threshold_used': optimal_threshold,
            'model_version': 'Advanced Ensemble v2.0' if model_package else 'XGBoost v1.0'
        })
        
    except KeyError as e:
        return jsonify({
            'error': f'Missing required field: {str(e)}',
            'required_fields': ['funding_total_usd', 'funding_rounds', 'milestones', 
                              'relationships', 'founded_at', 'first_funding_at', 
                              'last_funding_at', 'category_code']
        }), 400
    except Exception as e:
        print(f"❌ Error during prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f"Prediction error: {str(e)}"}), 500

@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    """Batch prediction endpoint for multiple startups"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.get_json()
        
        if not isinstance(data, list):
            return jsonify({'error': 'Expected a list of startup data'}), 400
        
        results = []
        for idx, startup in enumerate(data):
            try:
                # Preprocess
                input_df = preprocess_input(startup)
                
                # Get model features
                if hasattr(imputer, 'get_feature_names_out'):
                    model_features = imputer.get_feature_names_out()
                else:
                    model_features = input_df.columns
                
                input_df = input_df.reindex(columns=model_features, fill_value=0)
                input_df_imputed = pd.DataFrame(imputer.transform(input_df), columns=model_features)
                
                if scaler is not None:
                    input_df_scaled = pd.DataFrame(scaler.transform(input_df_imputed), columns=model_features)
                else:
                    input_df_scaled = input_df_imputed
                
                # Predict
                probability = model.predict_proba(input_df_scaled)
                success_probability = float(probability[0][1])
                prediction = 1 if success_probability >= optimal_threshold else 0
                
                results.append({
                    'index': idx,
                    'prediction': 'Success' if prediction == 1 else 'Failure',
                    'success_probability': round(success_probability * 100, 2),
                    'startup_name': startup.get('name', f'Startup_{idx}')
                })
            except Exception as e:
                results.append({
                    'index': idx,
                    'error': str(e),
                    'startup_name': startup.get('name', f'Startup_{idx}')
                })
        
        return jsonify({
            'total': len(data),
            'successful_predictions': len([r for r in results if 'error' not in r]),
            'failed_predictions': len([r for r in results if 'error' in r]),
            'results': results
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Load model assets on startup
print("="*70)
print("STARTUP SUCCESS PREDICTION API")
print("="*70)
if load_model_assets():
    print(f"\n🚀 Server starting with optimal threshold: {optimal_threshold}")
    print(f"📊 Expected Performance: 79.5% accuracy, 92.5% recall")
else:
    print("\n⚠️  Server starting WITHOUT model - predictions will fail")
print("="*70)

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')