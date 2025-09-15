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