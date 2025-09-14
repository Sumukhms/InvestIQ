import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field
import random

# --- 1. Load the Trained Model and Feature List ---
try:
    model = joblib.load("investiq_final_model.joblib")
    model_features = joblib.load("investiq_final_features.joblib")
    print("✅ Model and feature list loaded successfully!")
except FileNotFoundError:
    print("❌ Model or feature files not found. Please train the model first.")
    model = None
    model_features = []

# --- 2. Define the Input Data Structure ---
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
    description="API for predicting startup success."
)

# --- 4. Preprocessing Function ---
def preprocess_live_data(df: pd.DataFrame) -> pd.DataFrame:
    for col in ["founded_at", "first_funding_at", "last_funding_at"]:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    df["age_of_startup"] = (pd.Timestamp.now() - df["founded_at"]).dt.days / 365.25
    df["funding_duration_years"] = ((df["last_funding_at"] - df["first_funding_at"]).dt.days / 365.25).fillna(0)
    df["funding_velocity"] = df.apply(
        lambda row: row['funding_total_usd'] / row['age_of_startup'] if row['age_of_startup'] > 0 else 0, axis=1
    )
    major_hubs = ['CA', 'NY', 'MA', 'TX', 'WA']
    df['is_in_major_hub'] = df['state_code'].isin(major_hubs).astype(int)
    df['competitors_in_category'] = np.random.randint(5, 50)
    processed_df = pd.DataFrame(columns=model_features)
    for col in df.columns:
        if col in processed_df.columns:
            processed_df[col] = df[col]
    processed_df.fillna(0, inplace=True)
    return processed_df[model_features]

# --- 5. Helper Function to Generate Varied Scores ---
def generate_detailed_scores(success_probability: float) -> dict:
    scores = {
        "marketPotential": random.randint(50, 95),
        "productInnovation": random.randint(40, 90),
        "teamStrength": random.randint(30, 85),
        "financialViability": random.randint(45, 95),
    }
    adjustment_factor = (success_probability - 0.5) * 40
    for key in scores:
        scores[key] += adjustment_factor
        scores[key] = round(max(0, min(100, scores[key])))
    return scores

# --- 6. The Prediction Endpoint ---
@app.post("/predict")
def predict_success(data: StartupData):
    if not model:
        return {"error": "Model is not loaded."}
    input_df = pd.DataFrame([data.dict()])
    processed_df = preprocess_live_data(input_df)
    prediction_proba = model.predict_proba(processed_df)[0]
    success_probability = prediction_proba[1]
    detailed_scores = generate_detailed_scores(success_probability)
    return {
        "startup_name": data.name,
        "prediction": "Success" if success_probability >= 0.5 else "Failure",
        "success_probability": round(success_probability * 100, 2),
        "explanation": "The model has analyzed various factors to generate this prediction.",
        "detailedScores": detailed_scores
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to the InvestIQ API"}