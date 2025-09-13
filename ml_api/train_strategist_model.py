# ml_api/train_strategist_model.py

import pandas as pd
import numpy as np
import os
import joblib
import lightgbm as lgb
import optuna
from sklearn.model_selection import TimeSeriesSplit, train_test_split
from sklearn.metrics import f1_score, accuracy_score, classification_report
from imblearn.over_sampling import SMOTE

def load_dataset(file_path: str) -> pd.DataFrame:
    """Loads the ML-ready dataset."""
    print(f"Loading dataset from '{file_path}'...")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ File not found: {file_path}")
    return pd.read_csv(file_path)

def engineer_strategic_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Engineers advanced features for competition and location.
    """
    print("Engineering strategic features (Competition & Location)...")

    # 1. Location Feature: Is the startup in a major tech hub?
    major_hubs = ['CA', 'NY', 'MA', 'TX', 'WA'] # USA states as a proxy for hubs
    if 'state_code' in df.columns:
        df['is_in_major_hub'] = df['state_code'].isin(major_hubs).astype(int)

    # 2. Competition Feature: How many competitors are in the same main category?
    if 'main_category' in df.columns:
        category_counts = df['main_category'].value_counts().to_dict()
        df['competitors_in_category'] = df['main_category'].map(category_counts).fillna(1)
        # Normalize this feature
        df['competitors_in_category'] = (df['competitors_in_category'] - df['competitors_in_category'].min()) / \
                                       (df['competitors_in_category'].max() - df['competitors_in_category'].min())
    
    print("✅ Strategic features created.")
    return df


def tune_for_f1_score(X: pd.DataFrame, y: pd.Series):
    """
    Uses Optuna to find the best hyperparameters, optimizing for F1-score.
    """
    def objective(trial):
        params = {
            'objective': 'binary',
            'metric': 'binary_logloss',
            'verbosity': -1,
            'boosting_type': 'gbdt',
            'n_estimators': 1000,
            'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.2, log=True),
            'num_leaves': trial.suggest_int('num_leaves', 20, 300),
            'max_depth': trial.suggest_int('max_depth', 3, 10),
        }

        tscv = TimeSeriesSplit(n_splits=5)
        f1_scores = []
        
        for train_index, val_index in tscv.split(X):
            X_train, X_val = X.iloc[train_index], X.iloc[val_index]
            y_train, y_val = y.iloc[train_index], y.iloc[val_index]

            smote = SMOTE(random_state=42)
            X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
            
            model = lgb.LGBMClassifier(**params, random_state=42)
            model.fit(X_train_resampled, y_train_resampled, 
                      eval_set=[(X_val, y_val)], 
                      callbacks=[lgb.early_stopping(50, verbose=False)])
            
            preds = model.predict(X_val)
            # Optimize for the F1 score of the minority class (Failure=0)
            score = f1_score(y_val, preds, pos_label=0)
            f1_scores.append(score)
            
        return np.mean(f1_scores)

    print("🚀 Starting hyperparameter tuning to maximize F1-Score...")
    study = optuna.create_study(direction='maximize')
    study.optimize(objective, n_trials=50, show_progress_bar=True)

    print(f"\n✅ Best trial finished with F1-Score: {study.best_value:.4f}")
    print("Found best parameters for balanced performance: ", study.best_params)
    
    return study.best_params

def train_final_model(X: pd.DataFrame, y: pd.Series, best_params: dict):
    """Trains the final model on a balanced dataset with the best parameters."""
    print("\nTraining the final, most strategic model...")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    smote = SMOTE(random_state=42)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
    
    model = lgb.LGBMClassifier(**best_params, random_state=42, objective='binary')
    model.fit(X_train_resampled, y_train_resampled)

    print("\n--- Final 'Strategist's Model' Evaluation ---")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"🎯 Final Accuracy on Test Set: {accuracy * 100:.2f}%")
    print("\nClassification Report (Optimized for Balance):")
    print(classification_report(y_test, y_pred, target_names=['Failure (0)', 'Success (1)']))

    return model

def main():
    """Main function for the final modeling pipeline."""
    input_file = "ml_ready_startups.csv"
    
    df = load_dataset(input_file)
    df_strategic = engineer_strategic_features(df)
    
    # Prepare data for training
    y = df_strategic['status_encoded']
    X = df_strategic.select_dtypes(include=np.number).drop(columns=['status_encoded'], errors='ignore')
    X.columns = ["".join(c if c.isalnum() else "_" for c in str(x)) for x in X.columns]

    # Tune and train
    best_params = tune_for_f1_score(X, y)
    final_model = train_final_model(X, y, best_params)

    # Save the final assets
    joblib.dump(final_model, 'investiq_strategist_model.joblib')
    joblib.dump(X.columns.tolist(), 'investiq_strategist_features.joblib')

    print("\n✅ Final phase complete! The 'Strategist's Model' and feature list have been saved.")
    print("   - investiq_strategist_model.joblib")
    print("   - investiq_strategist_features.joblib")

if __name__ == "__main__":
    main()