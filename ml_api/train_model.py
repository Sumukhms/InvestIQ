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