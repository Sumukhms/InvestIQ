# ml_api/train_model_phase6.py

import pandas as pd
import numpy as np
import os
import joblib
import lightgbm as lgb
import optuna
from sklearn.model_selection import TimeSeriesSplit, train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score, classification_report
from imblearn.over_sampling import SMOTE

def load_dataset(file_path: str) -> pd.DataFrame:
    """Loads the ML-ready dataset."""
    print(f"Loading dataset from '{file_path}'...")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ File not found: {file_path}")
    return pd.read_csv(file_path)

def prepare_data_for_training(df: pd.DataFrame, time_column: str = 'age_of_startup'):
    """Prepares and sorts the data, ensuring only numeric features are returned."""
    print("Preparing data for time-series training...")
    if 'status_encoded' not in df.columns:
        raise ValueError("❌ Target variable 'status_encoded' not found.")

    df.sort_values(by=time_column, inplace=True)
    df.reset_index(drop=True, inplace=True)

    y = df['status_encoded']
    X = df.select_dtypes(include=np.number).drop(columns=['status_encoded'], errors='ignore')
    X.columns = ["".join(c if c.isalnum() else "_" for c in str(x)) for x in X.columns]
    
    print(f"Data prepared. Training with {X.shape[1]} numeric features.")
    return X, y

def tune_on_balanced_data(X: pd.DataFrame, y: pd.Series):
    """
    Uses Optuna to find the best hyperparameters, applying SMOTE within each trial.
    This is the core of the correct approach.
    """
    def objective(trial):
        # Define the search space, REMOVING scale_pos_weight
        params = {
            'objective': 'binary',
            'metric': 'auc',
            'verbosity': -1,
            'boosting_type': 'gbdt',
            'n_estimators': 1000,
            'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.1, log=True),
            'num_leaves': trial.suggest_int('num_leaves', 20, 200),
            'max_depth': trial.suggest_int('max_depth', 3, 10),
        }

        tscv = TimeSeriesSplit(n_splits=5)
        scores = []
        
        for train_index, val_index in tscv.split(X):
            X_train, X_val = X.iloc[train_index], X.iloc[val_index]
            y_train, y_val = y.iloc[train_index], y.iloc[val_index]

            # Apply SMOTE to the training fold for this trial
            smote = SMOTE(random_state=42)
            X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
            
            model = lgb.LGBMClassifier(**params, random_state=42)
            model.fit(X_train_resampled, y_train_resampled, 
                      eval_set=[(X_val, y_val)], 
                      callbacks=[lgb.early_stopping(50, verbose=False)])
            
            preds = model.predict_proba(X_val)[:, 1]
            auc_score = roc_auc_score(y_val, preds)
            scores.append(auc_score)
            
        return np.mean(scores)

    print("🚀 Starting hyperparameter tuning with SMOTE inside each trial...")
    study = optuna.create_study(direction='maximize')
    study.optimize(objective, n_trials=50, show_progress_bar=True)

    print(f"\n✅ Best trial finished with AUC: {study.best_value:.4f}")
    print("Found best parameters for balanced data: ", study.best_params)
    
    return study.best_params

def train_final_model(X: pd.DataFrame, y: pd.Series, best_params: dict):
    """Trains the final model on a SMOTE-resampled dataset using the best parameters."""
    print("\nTraining final model on a fully balanced dataset...")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Resample the entire training set one last time for the final model
    smote = SMOTE(random_state=42)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
    
    model = lgb.LGBMClassifier(**best_params, random_state=42, objective='binary')
    model.fit(X_train_resampled, y_train_resampled)

    print("\n--- Final Tuned & Balanced Model Evaluation ---")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"🎯 Final Accuracy on Test Set: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Failure (0)', 'Success (1)']))

    return model

def main():
    """Main function to run the final modeling pipeline."""
    input_file = "ml_ready_startups.csv"
    
    df = load_dataset(input_file)
    X, y = prepare_data_for_training(df)
    
    best_params = tune_on_balanced_data(X, y)
    final_model = train_final_model(X, y, best_params)

    # Save the final, most robust model
    joblib.dump(final_model, 'investiq_final_model.joblib')
    joblib.dump(X.columns.tolist(), 'investiq_final_features.joblib')

    print("\n✅ Phase 6 complete! The definitive model and feature list have been saved.")
    print("   - investiq_final_model.joblib")
    print("   - investiq_final_features.joblib")

if __name__ == "__main__":
    main()