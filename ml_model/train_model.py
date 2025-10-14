# ml_model/train_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
import joblib

def build_final_corrected_model():
    try:
        df = pd.read_csv('startup data.csv')
        print("Dataset loaded successfully.")
    except FileNotFoundError:
        print("\nERROR: 'startup data.csv' not found.")
        return

    print("Engineering novel features...")
    df.drop(columns=['Unnamed: 0', 'state_code', 'latitude', 'longitude', 'zip_code', 'id', 'city', 'Unnamed: 6', 'name', 'labels', 'object_id'], inplace=True, errors='ignore')

    for col in ['founded_at', 'closed_at', 'first_funding_at', 'last_funding_at']:
        df[col] = pd.to_datetime(df[col], errors='coerce')

    df = df[df['status'].isin(['acquired', 'closed'])]
    df['success'] = (df['status'] == 'acquired').astype(int)
    df.drop(columns=['status', 'closed_at'], inplace=True)

    df['funding_velocity_days'] = (df['first_funding_at'] - df['founded_at']).dt.days
    df['age_in_years'] = (df['last_funding_at'] - df['first_funding_at']).dt.days / 365.25
    df['age_in_years'] = df['age_in_years'].replace(0, 1/365.25)
    df['funding_momentum'] = df['funding_total_usd'] / df['age_in_years']
    df['milestone_age_years'] = df['age_last_milestone_year'] - df['age_first_milestone_year']
    df['milestone_age_years'] = df['milestone_age_years'].replace(0, 1/365.25)
    df['milestone_velocity'] = df['milestones'] / df['milestone_age_years']
    
    df.drop(columns=['founded_at', 'first_funding_at', 'last_funding_at', 'age_in_years', 'milestone_age_years'], inplace=True)

    le = LabelEncoder()
    df['category_code'] = le.fit_transform(df['category_code'].astype(str))
    joblib.dump(le, 'category_encoder.pkl')

    df = df.select_dtypes(include=np.number)
    df.replace([np.inf, -np.inf], np.nan, inplace=True)

    X = df.drop('success', axis=1)
    y = df['success']

    imputer = SimpleImputer(strategy='median')
    X_imputed = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)
    joblib.dump(imputer, 'imputer.pkl')

    X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.2, random_state=42, stratify=y)

    print("Tuning the final model...")
    param_grid = {'n_estimators': [300], 'max_depth': [7], 'learning_rate': [0.1], 'subsample': [0.8], 'colsample_bytree': [0.8]}
    xgb = XGBClassifier(eval_metric='logloss')
    grid_search = GridSearchCV(estimator=xgb, param_grid=param_grid, cv=3, n_jobs=-1, verbose=1, scoring='accuracy')
    grid_search.fit(X_train, y_train)
    
    best_xgb = grid_search.best_estimator_
    y_pred = best_xgb.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n--- Final Model Accuracy: {accuracy:.4f} ---")
    
    print("\nSaving the final model...")
    joblib.dump(best_xgb, 'startup_success_model.pkl')
    print("Final, corrected model saved successfully!")

if __name__ == '__main__':
    build_final_corrected_model()