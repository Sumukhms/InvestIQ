from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
import joblib
import pandas as pd
import numpy as np
import random

app = FastAPI()

# --- 1. Load the trained model and encoders ---
# These are loaded once when the application starts
try:
    model = joblib.load('startup_predictor.joblib')
    country_encoder = joblib.load('country_encoder.joblib')
    state_encoder = joblib.load('state_encoder.joblib')
    print("Model and encoders loaded successfully!")
except FileNotFoundError:
    print("Error: Model or encoder files not found.")
    print("Please ensure 'startup_predictor.joblib', 'country_encoder.joblib', and 'state_encoder.joblib' are in the same directory.")
    model = None
    country_encoder = None
    state_encoder = None


# --- 2. Define Input and Output Data Models ---
class Competitor(BaseModel):
    name: str
    strength: str

class StartupFeatures(BaseModel):
    # Features used by the actual model
    funding_total_usd: float
    funding_rounds: float
    country_code: str # This will be encoded
    state_code: str # This will be encoded

    # Additional features for generating detailed scores (can be extended)
    startupName: str
    pitch: str
    problem: str
    industry: str
    location: str
    marketSize: str
    fundingStage: str
    revenue: int
    competitors: List[Competitor]


class AnalysisScores(BaseModel):
    marketPotential: int
    productInnovation: int
    teamStrength: int
    financialViability: int

class PredictionResponse(BaseModel):
    successPercentage: int
    detailedScores: AnalysisScores
    risks: List[dict]
    recommendations: List[dict]


# --- 3. Create the Prediction Endpoint ---
@app.post("/predict", response_model=PredictionResponse)
def predict_success(data: StartupFeatures):
    if not all([model, country_encoder, state_encoder]):
        return {
            "successPercentage": 0,
            "detailedScores": {"marketPotential": 0, "productInnovation": 0, "teamStrength": 0, "financialViability": 0},
            "risks": [{"title": "Model Not Loaded", "description": "The machine learning model could not be loaded. Please check the server logs."}],
            "recommendations": []
        }

    # --- Feature Engineering and Preprocessing ---
    # Create a DataFrame from the input data
    input_data = pd.DataFrame([data.dict()])

    # Calculate 'funding_per_round'
    if input_data['funding_rounds'][0] > 0:
        input_data['funding_per_round'] = input_data['funding_total_usd'] / input_data['funding_rounds']
    else:
        input_data['funding_per_round'] = 0
    input_data['funding_per_round'].replace([np.inf, -np.inf], 0, inplace=True)


    # Use the loaded encoders to transform categorical data
    try:
        input_data['country_code'] = country_encoder.transform(input_data['country_code'])
        input_data['state_code'] = state_encoder.transform(input_data['state_code'])
    except ValueError as e:
        # Handle cases where a category was not seen during training
        return {
            "successPercentage": 0,
            "detailedScores": {"marketPotential": 0, "productInnovation": 0, "teamStrength": 0, "financialViability": 0},
            "risks": [{"title": "Invalid Input", "description": f"Could not process input: {e}"}],
            "recommendations": [{"title": "Check Location Data", "description": "Please use standard country and state codes (e.g., 'USA', 'CA')."}]
        }


    # Ensure the columns are in the correct order for the model
    # This must match the order from the training script
    feature_order = ['funding_total_usd', 'country_code', 'state_code', 'funding_rounds', 'funding_per_round']
    processed_input = input_data[feature_order]


    # --- Make a Prediction ---
    # The model predicts the probability of success (class 1)
    prediction_proba = model.predict_proba(processed_input)[0][1]
    success_percentage = int(prediction_proba * 100)

    # --- Simulate the detailed scores (as in your original file) ---
    market_score = random.randint(60, 90)
    innovation_score = random.randint(50, 85)
    team_score = random.randint(55, 75)
    financial_score = random.randint(40, 80)

    detailed_scores = {
        "marketPotential": market_score,
        "productInnovation": innovation_score,
        "teamStrength": team_score,
        "financialViability": financial_score
    }

    # --- Generate Dummy Risks & Recommendations ---
    risks = [
        {"title": "Market Competition", "description": f"The {data.industry} market is highly competitive."},
        {"title": "Scalability Challenges", "description": "Infrastructure may need significant investment to support growth."}
    ]
    recommendations = [
        {"title": "Focus on a Niche", "description": "Target a specific sub-segment of the market to establish a strong user base."},
        {"title": "Develop a Viral Loop", "description": "Incentivize users to share the product to drive organic growth."}
    ]

    return {
        "successPercentage": success_percentage,
        "detailedScores": detailed_scores,
        "risks": risks,
        "recommendations": recommendations
    }

@app.get("/")
def read_root():
    return {"message": "InvestIQ ML API is running"}