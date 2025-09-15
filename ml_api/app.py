# ml_api/app.py

from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI(
    title="InvestIQ ML API",
    description="API for predicting startup success using a Gradient Boosting model.",
    version="2.0.0"
)

# --- 1. Load the Trained Model and Preprocessing Objects ---
# In a real scenario, these files are created during model training.
# We are providing a pre-trained model for this example.
MODEL_PATH = 'startup_predictor_gb.joblib'

# Check if the model file exists
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Please train the model and save it first.")

try:
    model_pipeline = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")
except Exception as e:
    raise RuntimeError(f"Failed to load the model: {e}")


# --- 2. Define Input and Output Data Models ---
# Matches the frontend and expands on it for a real model
class StartupFeatures(BaseModel):
    # Features coming directly from the user form
    startupName: str = Field(..., description="Name of the startup.")
    industry: str = Field(..., description="Primary industry of the startup (e.g., 'SaaS', 'FinTech').")
    location: str = Field(..., description="Headquarters location (e.g., 'San Francisco').")
    fundingStage: str = Field(..., description="Current funding stage (e.g., 'seed', 'series-a').")
    total_funding: float = Field(..., ge=0, description="Total funding raised in USD.")
    age_in_days: int = Field(..., ge=0, description="Age of the company in days.")
    employee_count: int = Field(..., ge=1, description="Number of employees.")
    num_investors: int = Field(..., ge=0, description="Number of investors.")
    months_since_last_funding: int = Field(..., ge=0, description="Months passed since the last funding round.")
    
    # Example of a feature that might be enriched from an external API like Finnhub
    industry_pe_ratio: Optional[float] = Field(25.0, description="Average Price-to-Earnings ratio for the startup's industry.")

class PredictionResponse(BaseModel):
    startupName: str
    success_probability: float
    prediction: str
    feature_importance: dict
    recommendations: List[str]

# --- 3. Create the Prediction Endpoint ---
@app.post("/predict", response_model=PredictionResponse)
def predict_success(data: StartupFeatures):
    """
    Predicts the success probability of a startup using the trained model.
    """
    try:
        # Convert the Pydantic model to a pandas DataFrame
        # The model's preprocessor expects specific column names and order
        input_data = pd.DataFrame([data.dict()])

        # Ensure the column order matches the training data
        # This is a crucial step!
        expected_columns = model_pipeline.named_steps['preprocessor'].transformers_[0][2] + \
                           model_pipeline.named_steps['preprocessor'].transformers_[1][2]
        
        # Reorder and add missing columns if any (though the Pydantic model should prevent this)
        input_df = pd.DataFrame(columns=expected_columns)
        for col in input_df.columns:
            if col in input_data.columns:
                input_df[col] = input_data[col]
            else:
                 # Set a default value for any missing columns, though this shouldn't happen with Pydantic
                input_df[col] = 0 
        
        # --- Make Prediction ---
        # The pipeline handles scaling, encoding, and prediction
        probability = model_pipeline.predict_proba(input_df)[0][1] # Probability of the "success" class
        prediction_label = "Success" if probability >= 0.5 else "Failure"

        # --- Get Feature Importance ---
        # For tree-based models like Gradient Boosting, we can get feature importances
        feature_names = expected_columns
        importances = model_pipeline.named_steps['classifier'].feature_importances_
        
        importance_dict = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
        top_features = {name: round(float(imp), 4) for name, imp in importance_dict[:5]}


        # --- Generate Dynamic Recommendations ---
        recommendations = []
        if probability < 0.5:
            weakest_feature = importance_dict[-1][0]
            recommendations.append(f"Focus on improving '{weakest_feature}', as it is a key area for improvement.")
        if data.months_since_last_funding > 18:
            recommendations.append("It has been a while since the last funding round. Consider preparing for a new fundraise or focusing on profitability.")
        if data.employee_count < 5:
            recommendations.append("Strengthen the core team. A small team might be a risk factor.")

        return {
            "startupName": data.startupName,
            "success_probability": round(probability, 2),
            "prediction": prediction_label,
            "feature_importance": top_features,
            "recommendations": recommendations if recommendations else ["The startup shows a balanced profile. Continue to focus on growth and execution."]
        }

    except Exception as e:
        print(f"Prediction error: {e}")
        # In a real app, you'd log this error properly
        return {
            "startupName": data.startupName,
            "success_probability": 0.0,
            "prediction": "Error",
            "feature_importance": {},
            "recommendations": ["An error occurred during prediction. Please check the input data."]
        }


@app.get("/")
def read_root():
    return {"message": "InvestIQ ML API v2 is running. Use the /predict endpoint for analysis."}