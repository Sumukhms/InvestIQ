from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
import random
import os
import httpx # Using httpx for async API calls

from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

# --- Gemini API Configuration ---
# In a real app, load your API Key securely from environment variables
# For this example, we'll use a placeholder.
# IMPORTANT: The Gemini API call will be simulated if no key is provided.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-0514:generateContent?key={GEMINI_API_KEY}"

# --- START: AUTHENTICATION SETUP ---

SECRET_KEY = "your-super-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
fake_users_db = {}

# --- Data Models for Authentication ---
class User(BaseModel):
    username: str
    email: str

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# --- Helper Functions for Auth ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = fake_users_db.get(token_data.username)
    if user is None:
        raise credentials_exception
    return user

# --- END: AUTHENTICATION SETUP ---


app = FastAPI()

# --- Add CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Define Input and Output Data Models ---
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

# --- MODIFIED: Added growthSuggestions to the response model ---
class PredictionResponse(BaseModel):
    successPercentage: int
    detailedScores: AnalysisScores
    risks: List[dict]
    recommendations: List[dict]
    growthSuggestions: List[str] # New field for Gemini's suggestions

# --- NEW: Helper function to get suggestions from Gemini ---
async def get_growth_suggestions(industry: str, stage: str) -> List[str]:
    """
    Generates growth suggestions for a startup using the Gemini API.
    """
    # If no API key is set, return mock data to avoid errors
    if not GEMINI_API_KEY:
        return [
            "Develop a clear go-to-market strategy.",
            "Focus on building a strong user feedback loop.",
            "Network with potential investors and mentors in your domain."
        ]

    prompt = f"You are an expert startup advisor. Provide 3 concise, actionable growth suggestions for a startup in the '{industry}' industry that is at the '{stage}' stage. Return the suggestions as a simple list of strings in JSON format."

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json",
        }
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(GEMINI_API_URL, json=payload, timeout=30)
            response.raise_for_status()
            # The Gemini API returns a JSON string, which we need to parse
            suggestions = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            return suggestions # It should already be a list of strings
    except (httpx.RequestError, KeyError, IndexError) as e:
        # If the API call fails, return generic advice
        print(f"Gemini API call failed: {e}")
        return [
            "Refine your value proposition and target audience.",
            "Build a minimum viable product (MVP) to test your core assumptions.",
            "Conduct thorough market research to understand customer needs."
        ]


# --- AUTHENTICATION ENDPOINTS ---

@app.post("/register", response_model=Token)
async def register_user(user: UserCreate):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    for existing_user in fake_users_db.values():
        if existing_user.email == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    user_in_db = UserInDB(username=user.username, email=user.email, hashed_password=hashed_password)
    fake_users_db[user.username] = user_in_db
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
async def login_for_access_token(login_data: UserLogin):
    user_to_login = None
    for username, user_in_db in fake_users_db.items():
        if user_in_db.email == login_data.email:
            user_to_login = user_in_db
            break
    if not user_to_login or not verify_password(login_data.password, user_to_login.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user_to_login.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/user", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


# --- MODIFIED: Prediction Endpoint now includes Gemini suggestions ---
@app.post("/predict", response_model=PredictionResponse)
async def predict_success(data: StartupFeatures, current_user: User = Depends(get_current_user)):
    # --- Simulate scoring logic ---
    market_score = random.randint(60, 95)
    innovation_score = random.randint(50, 95)
    team_score = random.randint(55, 75)
    financial_score = random.randint(40, 95)
    
    detailed_scores = {
        "marketPotential": market_score,
        "productInnovation": innovation_score,
        "teamStrength": team_score,
        "financialViability": financial_score
    }
    
    overall_score = round(sum(detailed_scores.values()) / len(detailed_scores))
    
    risks = [{"title": "Market Competition", "description": f"The {data.industry} market is highly competitive."},]
    recommendations = [{"title": "Focus on a Niche", "description": "Target a specific sub-segment of the market."},]

    # --- NEW: Call the Gemini function ---
    suggestions = await get_growth_suggestions(data.industry, data.fundingStage)

    return {
        "successPercentage": overall_score,
        "detailedScores": detailed_scores,
        "risks": risks,
        "recommendations": recommendations,
        "growthSuggestions": suggestions # Add suggestions to the response
    }

@app.get("/")
def read_root():
    return {"message": "InvestIQ ML API is running"}
