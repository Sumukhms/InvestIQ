<<<<<<< HEAD
# train_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
import joblib
import numpy as np

print("--- Step 1: Load and Prepare the Data ---")

# Load your dataset. Ensure the CSV is in the same directory.
try:
    df = pd.read_csv('startup_data.csv')
    print("Dataset loaded successfully.")
except FileNotFoundError:
    print("Error: startup_data.csv not found. Please make sure the CSV file is in the 'ml_api' directory.")
    exit()

# --- Data Cleaning and Preprocessing ---
df.dropna(inplace=True)

# Define the target variable 'y' and features 'X'
df['status'] = df['status'].apply(lambda x: 1 if x in ['acquired', 'operating'] else 0)
y = df['status']
# Drop non-feature columns if they exist
X = df.drop(['status'], axis=1)


print("\nData prepared for training:")
print(f"Number of samples: {len(X)}")
print(f"Number of features: {len(X.columns)}")


print("\n--- Step 2: Define the Preprocessing Pipeline ---")

numerical_features = [
    'total_funding', 'age_in_days', 'employee_count',
    'num_investors', 'months_since_last_funding', 'industry_pe_ratio'
]
categorical_features = ['industry', 'location', 'fundingStage']

# Create a preprocessor to handle different data types
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ],
    remainder='passthrough'
)

print("\n--- Step 3: Define and Train the Gradient Boosting Model ---")

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=3,
        random_state=42
    ))
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print(f"\nTraining the model on {len(X_train)} samples...")
model_pipeline.fit(X_train, y_train)
print("Model training complete.")


print("\n--- Step 4: Evaluate the Model's Performance ---")

y_pred = model_pipeline.predict(X_test)
y_pred_proba = model_pipeline.predict_proba(X_test)[:, 1]
accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred_proba)

print(f"Model Accuracy: {accuracy:.4f}")
print(f"Model ROC AUC Score: {roc_auc:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))


print("\n--- Step 5: Save the Trained Model Pipeline ---")

output_filename = 'startup_predictor_gb.joblib'
joblib.dump(model_pipeline, output_filename)

print(f"\nModel pipeline saved successfully to '{output_filename}'!")
print("You can now run 'python app.py' to start your API.")
=======
import os
import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report

def download_and_load_data():
    """Downloads and loads the dataset."""
    os.system('kaggle datasets download -d yanmaksi/big-startup-secsees-fail-dataset-from-crunchbase -p data --unzip')
    df = pd.read_csv('data/big_startup_secsees_dataset.csv')
    return df

def clean_data(df):
    """Cleans data and returns the cleaned DataFrame and fitted encoders."""
    df = df.drop(['permalink', 'name', 'homepage_url', 'category_list', 'founded_at', 'region', 'city', 'first_funding_at', 'last_funding_at'], axis=1, errors='ignore')
    df['funding_total_usd'] = pd.to_numeric(df['funding_total_usd'].str.replace(',', '').replace('-', '0'), errors='coerce').fillna(0)
    df = df[df['status'].isin(['acquired', 'closed'])]

    # Feature Engineering
    df['funding_rounds'] = df['funding_rounds'].astype(float)
    df['funding_per_round'] = df['funding_total_usd'] / df['funding_rounds']
    df['funding_per_round'].replace([np.inf, -np.inf], 0, inplace=True)
    df.fillna(0, inplace=True)

    # Encoding Categorical Data
    country_encoder = LabelEncoder()
    state_encoder = LabelEncoder()
    
    df['country_code'] = country_encoder.fit_transform(df['country_code'].astype(str))
    df['state_code'] = state_encoder.fit_transform(df['state_code'].astype(str))
    
    df['status'] = df['status'].apply(lambda x: 1 if x == 'acquired' else 0)
    
    return df, country_encoder, state_encoder

def train_and_evaluate_model(df):
    """Trains and evaluates the XGBoost model."""
    X = df.drop('status', axis=1)
    y = df['status']
    X.columns = ["".join (c if c.isalnum() else "_" for c in str(x)) for x in X.columns]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Using the best parameters we found previously
    best_params = {'learning_rate': 0.1, 'max_depth': 3, 'n_estimators': 100, 'subsample': 0.8}
    model = xgb.XGBClassifier(**best_params, objective='binary:logistic', eval_metric='logloss', use_label_encoder=False, random_state=42)
    
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    
    print(f"\nFinal Model Accuracy: {(accuracy):.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    return model

def main():
    """Main function to run the pipeline."""
    print("Downloading and loading data...")
    startup_df = download_and_load_data()
    
    print("Cleaning and preprocessing data...")
    cleaned_df, country_encoder, state_encoder = clean_data(startup_df.copy())
    
    print("Training final model...")
    trained_model = train_and_evaluate_model(cleaned_df)

    # Save the model and the encoders
    joblib.dump(trained_model, 'startup_predictor.joblib')
    joblib.dump(country_encoder, 'country_encoder.joblib')
    joblib.dump(state_encoder, 'state_encoder.joblib')
    
    print("\nModel and encoders have been saved! 🚀")

if __name__ == '__main__':
    main()
>>>>>>> 840abb684ac1614125eaf4daddf5be7b6708bea7
