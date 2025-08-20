from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
import joblib
import pandas as pd
import random

app = FastAPI()

# --- 1. Define Input and Output Data Models ---
class Competitor(BaseModel):
    name: str
    strength: str

class StartupFeatures(BaseModel):
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


# --- 2. Create the Prediction Endpoint ---
@app.post("/predict", response_model=PredictionResponse)
def predict_success(data: StartupFeatures):
    # --- Simulate a more complex scoring logic based on new inputs ---

    # Market Potential Score (based on market size and location)
    market_score = 60
    if "Billion" in data.marketSize:
        market_score += 20
    if any(loc in data.location for loc in ["San Francisco", "New York", "Boston"]):
        market_score += 15
    else:
        market_score += 5
    
    # Product Innovation Score (based on pitch and problem)
    innovation_score = 50
    if "AI" in data.pitch or "automate" in data.pitch:
        innovation_score += 25
    if len(data.problem) > 100:
        innovation_score += 15

    # Team Strength Score (simulated for now)
    team_score = random.randint(55, 75)

    # Financial Viability Score (based on revenue and funding)
    financial_score = 40
    if data.revenue > 50000:
        financial_score += 30
    elif data.revenue > 10000:
        financial_score += 15
        
    funding_map = {"pre-seed": 5, "seed": 10, "series-a": 20}
    financial_score += funding_map.get(data.fundingStage.lower(), 0)

    # Clamp scores to a max of 95 to be realistic
    detailed_scores = {
        "marketPotential": min(market_score, 95),
        "productInnovation": min(innovation_score, 95),
        "teamStrength": min(team_score, 95),
        "financialViability": min(financial_score, 95)
    }

    # Calculate overall success percentage as the average of the detailed scores
    overall_score = round(sum(detailed_scores.values()) / len(detailed_scores))

    # --- Generate Dummy Risks & Recommendations (for now) ---
    risks = [
        {"title": "Market Competition", "description": f"The {data.industry} market is highly competitive, with established players."},
        {"title": "Scalability Challenges", "description": "Infrastructure may need significant investment to support rapid growth."}
    ]
    recommendations = [
        {"title": "Focus on a Niche", "description": "Target a specific sub-segment of the market to establish a strong initial user base."},
        {"title": "Develop a Viral Loop", "description": "Incentivize users to share the product to drive organic growth."}
    ]

    return {
        "successPercentage": overall_score,
        "detailedScores": detailed_scores,
        "risks": risks,
        "recommendations": recommendations
    }

@app.get("/")
def read_root():
    return {"message": "InvestIQ ML API is running"}