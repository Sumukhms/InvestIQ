from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# --- 1. Load the Trained Model ---
# In a real-world scenario, you would have a separate script to train your model
# and save it to a file. We'll load a pre-trained model here.
# For this example, we'll create a dummy model if one doesn't exist.
try:
    model = joblib.load('startup_predictor.joblib')
except FileNotFoundError:
    # Create and save a dummy model for demonstration purposes
    from sklearn.ensemble import RandomForestClassifier
    # Dummy data: [funding_stage_encoded, revenue] -> success (1) or failure (0)
    X_train = [[0, 5000], [1, 25000], [2, 100000], [0, 1000], [1, 15000], [2, 80000]]
    y_train = [0, 1, 1, 0, 0, 1]
    model = RandomForestClassifier()
    model.fit(X_train, y_train)
    joblib.dump(model, 'startup_predictor.joblib')

# --- 2. Define the Input Data Model ---
# This tells FastAPI what kind of data to expect in the request body.
class StartupFeatures(BaseModel):
    fundingStage: str
    revenue: int

# --- 3. Create the Prediction Endpoint ---
@app.post("/predict")
def predict_success(data: StartupFeatures):
    # --- Feature Engineering ---
    # Convert categorical data (like 'fundingStage') into a number the model can understand.
    funding_map = {"pre-seed": 0, "seed": 1, "series-a": 2, "series-b": 3, "growth": 4}
    funding_encoded = funding_map.get(data.fundingStage.lower(), 0)

    # --- Create DataFrame for Prediction ---
    # The model expects a DataFrame with specific column names.
    input_df = pd.DataFrame([[funding_encoded, data.revenue]], columns=['funding_stage_encoded', 'revenue'])

    # --- Make Prediction ---
    # The model.predict_proba() method returns the probability for each class (e.g., [fail_prob, success_prob]).
    prediction_proba = model.predict_proba(input_df)
    success_percentage = round(prediction_proba[0][1] * 100)

    # --- Generate Dummy Risks & Recommendations (for now) ---
    risks = [
        {"title": "Market Competition", "description": "The target market has several established players."},
        {"title": "Scalability Challenges", "description": "Infrastructure may need significant investment to support rapid growth."}
    ]
    recommendations = [
        {"title": "Focus on a Niche", "description": "Target a specific sub-segment of the market to establish a strong initial user base."},
        {"title": "Develop a Viral Loop", "description": "Incentivize users to share the product to drive organic growth."}
    ]

    return {
        "successPercentage": success_percentage,
        "risks": risks,
        "recommendations": recommendations
    }

@app.get("/")
def read_root():
    return {"message": "InvestIQ ML API is running"}
