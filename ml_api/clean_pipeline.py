import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

def load_dataset(file_path: str) -> pd.DataFrame:
    print("Loading dataset into pandas DataFrame...")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ File not found: {file_path}")
    return pd.read_csv(file_path)

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    print("Starting data cleaning...")
    # Fill numeric columns with median
    for col in df.select_dtypes(include=[np.number]).columns:
        df.loc[:, col] = df[col].fillna(df[col].median())

    # Fill object columns with "Unknown"
    for col in df.select_dtypes(include=["object"]).columns:
        df.loc[:, col] = df[col].fillna("Unknown")

    # Convert funding to numeric
    if "funding_total_usd" in df.columns:
        df.loc[:, "funding_total_usd"] = pd.to_numeric(df["funding_total_usd"], errors="coerce").fillna(0)

    print("Cleaning complete.")
    return df

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    print("Starting feature engineering...")

    # ---- Convert datetime columns safely ----
    date_cols = ["founded_at", "first_funding_at", "last_funding_at"]
    for col in date_cols:
        if col in df.columns:
            df.loc[:, col] = pd.to_datetime(df[col], errors="coerce")

    # ---- Startup age ----
    if "founded_at" in df.columns:
        df.loc[:, "age_of_startup"] = df["founded_at"].apply(
            lambda x: pd.Timestamp.now().year - x.year if pd.notnull(x) else 0
        )
    else:
        df.loc[:, "age_of_startup"] = 0

    # ---- Funding duration & speed (row-wise safe) ----
    if "first_funding_at" in df.columns and "last_funding_at" in df.columns:
        df["funding_duration_years"] = df.apply(
            lambda row: (row["last_funding_at"] - row["first_funding_at"]).days / 365
            if pd.notnull(row["last_funding_at"]) and pd.notnull(row["first_funding_at"])
            else 0,
            axis=1,
        )

        df["funding_speed"] = df.apply(
            lambda row: row["funding_total_usd"] / row["funding_duration_years"]
            if row["funding_duration_years"] > 0 else 0,
            axis=1,
        )
    else:
        df["funding_duration_years"] = 0
        df["funding_speed"] = 0

    # ---- Funding per round ----
    if "funding_rounds" in df.columns:
        df["funding_per_round"] = df.apply(
            lambda row: row["funding_total_usd"] / row["funding_rounds"]
            if row["funding_rounds"] > 0 else 0,
            axis=1,
        )
    else:
        df["funding_per_round"] = 0

    # ---- Category features: main + one-hot ----
    if "category_list" in df.columns:
        df["main_category"] = df["category_list"].apply(lambda x: x.split("|")[0] if x != "Unknown" else "Unknown")
        df["category_list_split"] = df["category_list"].apply(lambda x: x.split("|") if x != "Unknown" else [])
        all_categories = set(cat for sublist in df["category_list_split"] for cat in sublist)
        for cat in all_categories:
            df[f"cat_{cat}"] = df["category_list_split"].apply(lambda x: 1 if cat in x else 0)

    # ---- Location features ----
    # One-hot for country and state
    for loc_col in ["country_code", "state_code"]:
        if loc_col in df.columns:
            df = pd.get_dummies(df, columns=[loc_col], prefix=[f"{loc_col}"])

    # Label encode region and city
    for loc_col in ["region", "city"]:
        if loc_col in df.columns:
            le = LabelEncoder()
            df[loc_col] = le.fit_transform(df[loc_col].astype(str))

    # ---- Numeric normalization (optional) ----
    numeric_cols = ["funding_total_usd", "funding_per_round", "funding_speed"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = MinMaxScaler().fit_transform(df[[col]])

    print("✅ Feature engineering complete.")
    # Preview key columns
    preview_cols = ["name", "age_of_startup", "funding_per_round", "funding_speed", "main_category"]
    print(df[preview_cols].head())

    return df

def main():
    file_path = "data/training/raw_kaggle.csv"
    df = load_dataset(file_path)
    cleaned_df = clean_data(df)
    featured_df = engineer_features(cleaned_df)

    # Save final CSV
    out_file = "cleaned_featured_startups_mlready.csv"
    featured_df.to_csv(out_file, index=False)
    print(f"✅ Cleaned and ML-ready dataset saved as {out_file}")

if __name__ == "__main__":
    main()
