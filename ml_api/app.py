# ml_api/app.py

import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List

# --- 1. Load the Trained Model and Feature List ---
# These files are the output from our final training phase
try:
    model = joblib.load("investiq_final_model.joblib")
    model_features = joblib.load("investiq_final_features.joblib")
    print("✅ Model and feature list loaded successfully!")
except FileNotFoundError:
    print("❌ Model or feature files not found. Please train the model first.")
    model = None
    model_features = []

# --- 2. Define the Input Data Structure ---
# This Pydantic model ensures that the data sent to the API has the correct format.
class StartupData(BaseModel):
    name: str
    funding_total_usd: float = Field(..., example=5000000)
    status: str = Field(..., example="operating")
    country_code: str = Field(..., example="USA")
    state_code: str = Field(..., example="CA")
    region: str = Field(..., example="SF Bay Area")
    city: str = Field(..., example="San Francisco")
    funding_rounds: int = Field(..., example=3)
    founded_at: str = Field(..., example="2018-01-01")
    first_funding_at: str = Field(..., example="2019-01-01")
    last_funding_at: str = Field(..., example="2021-01-01")
    main_category: str = Field(..., example="Software")

# --- 3. Create the FastAPI Application ---
app = FastAPI(
    title="InvestIQ ML API",
    description="API for predicting startup success using a trained LightGBM model."
)

# --- 4. Preprocessing Function for Live Data ---
def preprocess_live_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Applies the same feature engineering and transformations from our training phases
    to new, incoming data.
    """
    # --- Feature Engineering ---
    # Convert dates and create time-based features
    for col in ["founded_at", "first_funding_at", "last_funding_at"]:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    
    df["age_of_startup"] = (pd.Timestamp.now() - df["founded_at"]).dt.days / 365.25
    df["funding_duration_years"] = ((df["last_funding_at"] - df["first_funding_at"]).dt.days / 365.25).fillna(0)
    
    df["funding_velocity"] = df.apply(
        lambda row: row['funding_total_usd'] / row['age_of_startup'] if row['age_of_startup'] > 0 else 0, axis=1
    )

    # --- Location & Competition Features (Simplified for real-time) ---
    major_hubs = ['CA', 'NY', 'MA', 'TX', 'WA']
    df['is_in_major_hub'] = df['state_code'].isin(major_hubs).astype(int)
    # Note: A real implementation would fetch competitor counts from a live database
    df['competitors_in_category'] = np.random.randint(5, 50) # Placeholder

    # --- Align columns with the trained model ---
    # Create a new DataFrame with the same columns as the training data
    processed_df = pd.DataFrame(columns=model_features)
    
    # Add the engineered features to our new DataFrame
    for col in df.columns:
        if col in processed_df.columns:
            processed_df[col] = df[col]

    # Fill any missing columns with 0 (for one-hot encoded features not present in the input)
    processed_df.fillna(0, inplace=True)
    
    # Ensure the column order is exactly the same as during training
    return processed_df[model_features]


# --- 5. The Prediction Endpoint ---
@app.post("/predict")
def predict_success(data: StartupData):
    if not model:
        return {"error": "Model is not loaded. Please train the model first."}

    # Convert the incoming data into a pandas DataFrame
    input_df = pd.DataFrame([data.dict()])
    
    # Apply all the necessary transformations
    processed_df = preprocess_live_data(input_df)

    # Make the prediction
    # model.predict_proba returns probabilities for both classes [Failure, Success]
    prediction_proba = model.predict_proba(processed_df)[0]
    success_probability = prediction_proba[1]

    # Return the result
    return {
        "startup_name": data.name,
        "prediction": "Success" if success_probability >= 0.5 else "Failure", # Using a default 0.5 threshold
        "success_probability": round(success_probability * 100, 2),
        "explanation": "The model has analyzed various factors including funding, age, and market category to generate this prediction."
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to the InvestIQ Real-Time Prediction API"}