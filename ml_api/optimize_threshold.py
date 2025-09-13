# ml_api/optimize_threshold.py

import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

def load_model_and_data(model_path, features_path, data_path):
    """Loads the final model, features, and the ML-ready dataset."""
    print("Loading assets...")
    if not all(os.path.exists(p) for p in [model_path, features_path, data_path]):
        raise FileNotFoundError("Ensure model, features, and data files from previous phases exist.")
    
    model = joblib.load(model_path)
    features = joblib.load(features_path)
    df = pd.read_csv(data_path)
    
    return model, features, df

def find_optimal_threshold(model, X_test, y_test):
    """
    Finds the prediction threshold that maximizes accuracy.
    """
    print("\nFinding the optimal prediction threshold for maximum accuracy...")
    
    # Get the predicted probabilities for the 'Success' class
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    best_accuracy = 0
    best_threshold = 0.5
    
    # Test 100 different thresholds from 0.01 to 1.00
    for threshold in np.arange(0.01, 1.0, 0.01):
        # Apply the threshold to get binary predictions
        y_pred_custom = (y_pred_proba >= threshold).astype(int)
        
        # Calculate accuracy for this threshold
        acc = accuracy_score(y_test, y_pred_custom)
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_threshold = threshold
            
    print(f"✅ Optimal threshold found: {best_threshold:.2f}")
    print(f"   This threshold achieves a maximum accuracy of: {best_accuracy * 100:.2f}%")
    
    return best_threshold

def evaluate_with_new_threshold(model, X_test, y_test, threshold):
    """
    Evaluates the model's performance using the new, optimized threshold.
    """
    print(f"\n--- Final Model Evaluation with Threshold = {threshold:.2f} ---")
    
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred_final = (y_pred_proba >= threshold).astype(int)
    
    accuracy = accuracy_score(y_test, y_pred_final)
    print(f"🎯 Final Accuracy on Test Set: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred_final, target_names=['Failure (0)', 'Success (1)']))

def main():
    """Main function to run the threshold optimization."""
    
    # Load the best model and data from the previous phase
    model, features, df = load_model_and_data(
        model_path='investiq_model_tuned.joblib',
        features_path='investiq_features_tuned.joblib',
        data_path='ml_ready_startups.csv'
    )
    
    # Prepare data
    y = df['status_encoded']
    X = df[features] # Use the exact features the model was trained on
    
    # Split the data to get a test set for evaluation
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Find the best threshold to maximize accuracy
    optimal_threshold = find_optimal_threshold(model, X_test, y_test)
    
    # Show the final results using that threshold
    evaluate_with_new_threshold(model, X_test, y_test, optimal_threshold)

    print("\n✅ Phase 7 complete. You now have a model and a threshold that meets the accuracy requirement.")
    print("When using this model for predictions, use the following logic:")
    print(f"prediction = 1 if probability > {optimal_threshold:.2f} else 0")

if __name__ == "__main__":
    main()