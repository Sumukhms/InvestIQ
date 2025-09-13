# ml_api/train_model_phase4.py

import pandas as pd
import numpy as np
import os
import joblib
import lightgbm as lgb
import optuna
from sklearn.model_selection import TimeSeriesSplit, train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score, classification_report

def load_dataset(file_path: str) -> pd.DataFrame:
    """Loads the ML-ready dataset."""
    print(f"Loading dataset from '{file_path}'...")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ File not found: {file_path}")
    return pd.read_csv(file_path)

def prepare_data_for_training(df: pd.DataFrame, time_column: str = 'age_of_startup'):
    """
    Prepares and sorts the data, ensuring only numeric features are returned.
    """
    print("Preparing data for time-series training...")
    if 'status_encoded' not in df.columns:
        raise ValueError("❌ Target variable 'status_encoded' not found.")

    # Sort by a column that represents time progression
    # The to_datetime is added for robustness in case it wasn't converted before
    df[time_column] = pd.to_datetime(df[time_column], errors='coerce').fillna(0)
    df.sort_values(by=time_column, inplace=True)
    df.reset_index(drop=True, inplace=True)

    # --- THE CORRECT FIX IS HERE ---
    # 1. Define the target variable
    y = df['status_encoded']
    
    # 2. Create the feature set (X) by selecting ONLY numeric columns
    X = df.select_dtypes(include=np.number)
    
    # 3. Drop the target column from the feature set
    if 'status_encoded' in X.columns:
        X = X.drop(columns=['status_encoded'])
    
    print(f"Data prepared. Training with {X.shape[1]} numeric features.")
    
    # 4. Sanitize feature names to prevent errors with special characters
    X.columns = ["".join(c if c.isalnum() else "_" for c in str(x)) for x in X.columns]

    return X, y


def tune_model_with_optuna(X: pd.DataFrame, y: pd.Series):
    """
    Uses Optuna to find the best hyperparameters for the LightGBM model.
    """
    def objective(trial):
        params = {
            'objective': 'binary',
            'metric': 'auc',
            'verbosity': -1,
            'boosting_type': 'gbdt',
            'n_estimators': 1000,
            'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.1, log=True),
            'num_leaves': trial.suggest_int('num_leaves', 20, 300),
            'max_depth': trial.suggest_int('max_depth', 3, 12),
            'subsample': trial.suggest_float('subsample', 0.6, 1.0),
            'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
            'scale_pos_weight': trial.suggest_float('scale_pos_weight', 1.0, 15.0)
        }

        tscv = TimeSeriesSplit(n_splits=5)
        scores = []
        
        for train_index, val_index in tscv.split(X):
            X_train, X_val = X.iloc[train_index], X.iloc[val_index]
            y_train, y_val = y.iloc[train_index], y.iloc[val_index]
            
            model = lgb.LGBMClassifier(**params, random_state=42)
            model.fit(X_train, y_train, eval_set=[(X_val, y_val)], callbacks=[lgb.early_stopping(50, verbose=False)])
            
            preds = model.predict_proba(X_val)[:, 1]
            auc_score = roc_auc_score(y_val, preds)
            scores.append(auc_score)
            
        return np.mean(scores)

    print("🚀 Starting hyperparameter tuning with Optuna...")
    study = optuna.create_study(direction='maximize')
    study.optimize(objective, n_trials=50, show_progress_bar=True)

    print(f"\n✅ Best trial finished with AUC: {study.best_value:.4f}")
    print("Found best parameters: ", study.best_params)
    
    return study.best_params

def train_final_model(X: pd.DataFrame, y: pd.Series, best_params: dict):
    """Trains the final model on all data using the best parameters."""
    print("\nTraining final model with optimized parameters...")
    
    final_params = best_params.copy()
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    model = lgb.LGBMClassifier(**final_params, random_state=42, objective='binary')
    model.fit(X_train, y_train)

    print("\n--- Final Tuned Model Evaluation ---")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"🎯 Final Accuracy on Test Set: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Failure (0)', 'Success (1)']))

    return model

def main():
    """Main function to run the Phase 4 tuning and final training."""
    input_file = "ml_ready_startups.csv"
    
    df = load_dataset(input_file)
    X, y = prepare_data_for_training(df)
    
    best_params = tune_model_with_optuna(X, y)
    final_model = train_final_model(X, y, best_params)

    joblib.dump(final_model, 'investiq_model_tuned.joblib')
    joblib.dump(X.columns.tolist(), 'investiq_features_tuned.joblib')

    print("\n✅ Phase 4 complete! Tuned model and feature list saved.")
    print("   - investiq_model_tuned.joblib")
    print("   - investiq_features_tuned.joblib")

if __name__ == "__main__":
    main()