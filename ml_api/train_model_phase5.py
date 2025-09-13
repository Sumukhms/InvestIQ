# ml_api/train_model_phase5.py

import pandas as pd
import numpy as np
import os
import joblib
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE

def load_dataset(file_path: str) -> pd.DataFrame:
    """Loads the ML-ready dataset from Phase 2."""
    print(f"Loading dataset from '{file_path}'...")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ File not found: {file_path}")
    return pd.read_csv(file_path)

def prepare_data(df: pd.DataFrame):
    """Prepares data by separating features and target, and sanitizing feature names."""
    print("Preparing data...")
    if 'status_encoded' not in df.columns:
        raise ValueError("❌ Target variable 'status_encoded' not found.")

    X = df.select_dtypes(include=np.number).drop(columns=['status_encoded'], errors='ignore')
    y = df['status_encoded']
    
    X.columns = ["".join(c if c.isalnum() else "_" for c in str(x)) for x in X.columns]
    
    return X, y

def train_with_smote(X: pd.DataFrame, y: pd.Series, best_params: dict):
    """
    Applies SMOTE to the training data and trains the final, tuned model.
    """
    print("\nStarting Phase 5: Training with SMOTE for Imbalance...")

    # 1. Split data into training and testing sets FIRST
    print("Splitting data into 80% training and 20% testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Original training data shape: {X_train.shape}")
    print(f"Original training class distribution:\n{y_train.value_counts()}")

    # 2. Apply SMOTE ONLY to the training data
    print("\nApplying SMOTE to the training data to create synthetic samples...")
    smote = SMOTE(random_state=42)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

    print(f"Resampled training data shape: {X_train_resampled.shape}")
    print(f"Resampled training class distribution:\n{y_train_resampled.value_counts()}")

    # 3. Train the model on the new, balanced data
    print("\nTraining final model on the balanced dataset...")
    final_params = best_params.copy()
    model = lgb.LGBMClassifier(**final_params, random_state=42, objective='binary')
    model.fit(X_train_resampled, y_train_resampled)
    
    # 4. Evaluate on the ORIGINAL, unbalanced test set
    print("\n--- Final Model Evaluation on Original Test Set ---")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"🎯 Final Accuracy on Test Set: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Failure (0)', 'Success (1)']))

    return model, X.columns.tolist()

def main():
    """Main function to run the Phase 5 SMOTE pipeline."""
    input_file = "ml_ready_startups.csv"
    
    # These are the best parameters found in the previous phase (Phase 4)
    # We use these to train our final model
    best_params_from_phase4 = {
        'learning_rate': 0.07785044527934697,
        'num_leaves': 57,
        'max_depth': 4,
        'subsample': 0.7037657198383025,
        'colsample_bytree': 0.976126157520278,
        'scale_pos_weight': 5.763667074822214
    }

    df = load_dataset(input_file)
    X, y = prepare_data(df)
    
    model, features = train_with_smote(X, y, best_params_from_phase4)

    # Save the final, most robust model
    joblib.dump(model, 'investiq_model_smote_final.joblib')
    joblib.dump(features, 'investiq_features_final.joblib')

    print("\n✅ Phase 5 complete! SMOTE-trained model and feature list saved.")
    print("   - investiq_model_smote_final.joblib")
    print("   - investiq_features_final.joblib")

if __name__ == "__main__":
    main()