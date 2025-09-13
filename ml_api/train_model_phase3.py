# ml_api/train_model_phase3.py

import pandas as pd
import numpy as np
import os
import joblib
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import re  # Import the regular expression module

def load_dataset(file_path: str) -> pd.DataFrame:
    """Loads the final, ML-ready dataset from Phase 2."""
    print(f"Loading dataset from '{file_path}'...")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ File not found: {file_path}. Please run the Phase 2 script first.")
    return pd.read_csv(file_path)

def train_and_evaluate(df: pd.DataFrame):
    """
    Performs all steps of Phase 3: splitting, training, evaluating, and feature importance.
    """
    print("\nStarting Phase 3: Model Preparation...")

    # --- 1. Define Target Variable ---
    if 'status_encoded' not in df.columns:
        raise ValueError("❌ Target variable 'status_encoded' not found in the dataset.")
        
    X = df.drop(columns=['status_encoded'])
    y = df['status_encoded']

    # *** FIX STARTS HERE ***
    # Sanitize feature names to remove special JSON characters
    X.columns = ["".join (c if c.isalnum() else "_" for c in str(x)) for x in X.columns]
    # *** FIX ENDS HERE ***

    # Ensure all feature columns are numeric before splitting
    for col in X.columns:
        if X[col].dtype == 'object':
            X[col] = pd.to_numeric(X[col], errors='coerce').fillna(0)

    # --- 2. Train-Test Split ---
    print("Splitting data into 80% training and 20% testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # --- 3. Choose and Train Model ---
    print("Training a LightGBM classification model...")
    model = lgb.LGBMClassifier(random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)

    # --- 4. Evaluate Model ---
    print("\n--- Model Evaluation ---")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✅ Accuracy on Test Set: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Failure (0)', 'Success (1)']))
    
    # --- 5. Feature Importance Analysis ---
    print("\n--- Feature Importance ---")
    feature_importances = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False).reset_index(drop=True)

    print("Top 15 most important features:")
    print(feature_importances.head(15))

    # Optional: Plot feature importances
    plt.figure(figsize=(10, 8))
    sns.barplot(x='importance', y='feature', data=feature_importances.head(15))
    plt.title('Top 15 Feature Importances')
    plt.tight_layout()
    plt.savefig('feature_importance.png')
    print("\nℹ️ A plot of feature importances has been saved as 'feature_importance.png'")
    
    return model, X.columns.tolist()

def main():
    """Main function to run the Phase 3 modeling pipeline."""
    input_file = "ml_ready_startups.csv"
    
    df = load_dataset(input_file)
    model, features = train_and_evaluate(df)

    # Save the final trained model and the list of features it expects
    joblib.dump(model, 'investiq_model_final.joblib')
    joblib.dump(features, 'investiq_features_final.joblib')

    print("\n✅ Phase 3 complete! Final model and feature list have been saved.")
    print("   - investiq_model_final.joblib")
    print("   - investiq_features_final.joblib")

if __name__ == "__main__":
    main()