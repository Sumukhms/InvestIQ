import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

def load_dataset(file_path: str) -> pd.DataFrame:
    print(f"Loading dataset from '{file_path}'...")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ File not found: {file_path}")
    return pd.read_csv(file_path)

def create_ml_ready_dataset(df: pd.DataFrame) -> pd.DataFrame:
    print("Starting Phase 2: Creating ML-Ready Dataset...")

    # --- 1. Derived Features ---
    # Ensure 'age_of_startup' exists from the previous step
    if 'age_of_startup' in df.columns:
        df['funding_velocity'] = df.apply(
            lambda row: row['funding_total_usd'] / row['age_of_startup'] if row['age_of_startup'] > 0 else 0,
            axis=1
        )
    else:
        df['funding_velocity'] = 0

    if 'category_list' in df.columns:
        df['category_list_split'] = df['category_list'].apply(lambda x: x.split('|') if isinstance(x, str) else [])
        df['number_of_categories'] = df['category_list_split'].apply(len)
    else:
        df['number_of_categories'] = 0
    
    print("  - Derived features 'funding_velocity' and 'number_of_categories' created.")

    # --- 2. Categorical Encoding ---
    print("Encoding categorical features...")
    # Numerically encode the 'status' column
    if 'status' in df.columns:
        status_map = {'acquired': 1, 'operating': 1, 'closed': 0}
        df['status_encoded'] = df['status'].map(status_map).fillna(0)
        print("  - 'status' encoded numerically.")

    # One-hot encode other specified categorical features
    # Using pd.get_dummies is efficient for one-hot encoding
    cols_to_one_hot = ['main_category', 'region', 'city']
    for col in cols_to_one_hot:
        if col not in df.columns:
            print(f"  - Warning: Column '{col}' not found for one-hot encoding. Skipping.")
            continue
        # Limit to top N categories to avoid creating too many columns, group rest as 'Other'
        top_categories = df[col].value_counts().nlargest(15).index
        df[col] = df[col].where(df[col].isin(top_categories), 'Other')
        dummies = pd.get_dummies(df[col], prefix=f'ohe_{col}')
        df = pd.concat([df, dummies], axis=1)
        print(f"  - '{col}' has been one-hot encoded.")


    # --- 3. Numeric Feature Scaling ---
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    # Remove the target variable from scaling
    if 'status_encoded' in numeric_cols:
        numeric_cols.remove('status_encoded')

    print(f"Scaling {len(numeric_cols)} numeric features with MinMaxScaler...")
    scaler = MinMaxScaler()
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
    
    # --- Final Cleanup ---
    # Drop original columns that have been encoded or are no longer needed
    df_ml_ready = df.drop(columns=[
        'name', 'status', 'founded_at', 'first_funding_at', 'last_funding_at',
        'category_list', 'category_list_split', 'main_category', 'region', 'city',
        'country_code', 'state_code' # Drop original geo columns if they exist
    ], errors='ignore')

    print("✅ Feature engineering and transformation complete.")
    return df_ml_ready

def main():
    """Main function to run the Phase 2 pipeline."""
    # Corrected input file name as you specified
    input_file = "cleaned_featured_startups.csv" 
    output_file = "ml_ready_startups.csv"

    df = load_dataset(input_file)
    ml_ready_df = create_ml_ready_dataset(df)

    # Save the final ML-ready CSV
    ml_ready_df.to_csv(output_file, index=False)
    print(f"\n✅ Phase 2 complete! ML-ready dataset saved as '{output_file}'")
    print(f"   The dataset has {ml_ready_df.shape[0]} rows and {ml_ready_df.shape[1]} features.")

if __name__ == "__main__":
    main()