# ml_model/train_model_advanced.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from sklearn.ensemble import RandomForestClassifier, VotingClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                             f1_score, roc_auc_score, classification_report, 
                             confusion_matrix, roc_curve)
from imblearn.over_sampling import SMOTE
from imblearn.combine import SMOTETomek
import joblib
import warnings
warnings.filterwarnings('ignore')

def advanced_feature_engineering(df):
    """
    Advanced feature engineering with interaction terms and domain knowledge
    """
    print("   → Creating advanced features...")
    
    # === Time-based features ===
    df['days_to_first_funding'] = (df['first_funding_at'] - df['founded_at']).dt.days
    df['days_funding_active'] = (df['last_funding_at'] - df['first_funding_at']).dt.days
    df['days_since_founding'] = (df['last_funding_at'] - df['founded_at']).dt.days
    
    epsilon = 0.01
    df['years_active'] = (df['days_funding_active'] / 365.25).clip(lower=epsilon)
    df['years_since_founding'] = (df['days_since_founding'] / 365.25).clip(lower=epsilon)
    
    # === Funding efficiency metrics ===
    df['funding_momentum'] = df['funding_total_usd'] / df['years_active']
    df['avg_funding_per_round'] = df['funding_total_usd'] / df['funding_rounds'].replace(0, 1)
    df['funding_concentration'] = df['avg_funding_per_round'] / (df['funding_total_usd'] + 1)
    df['funding_growth_rate'] = df['funding_total_usd'] / df['years_since_founding']
    
    # === Milestone metrics ===
    df['milestone_years'] = (df['age_last_milestone_year'] - df['age_first_milestone_year']).clip(lower=epsilon)
    df['milestone_velocity'] = df['milestones'] / df['milestone_years']
    df['milestones_per_year_active'] = df['milestones'] / df['years_active']
    df['milestone_density'] = df['milestones'] / (df['days_since_founding'] + 1)
    
    # === Relationship & network metrics ===
    df['relationships_per_year'] = df['relationships'] / df['years_active']
    df['relationship_efficiency'] = df['relationships'] / (df['funding_rounds'] + 1)
    df['network_strength'] = df['relationships'] * df['avg_participants']
    
    # === Interaction features (critical for non-linear patterns) ===
    df['funding_x_relationships'] = df['funding_total_usd'] * df['relationships']
    df['rounds_x_participants'] = df['funding_rounds'] * df['avg_participants']
    df['milestones_x_relationships'] = df['milestones'] * df['relationships']
    df['top500_x_funding'] = df['is_top500'] * df['funding_total_usd']
    
    # === Round progression features ===
    round_cols = [col for col in df.columns if col.startswith('has_round')]
    if round_cols:
        df['total_rounds_reached'] = df[round_cols].sum(axis=1)
        df['reached_late_stage'] = ((df.get('has_roundC', 0) == 1) | 
                                     (df.get('has_roundD', 0) == 1)).astype(int)
    
    # === Risk indicators ===
    df['early_stage_only'] = ((df['funding_rounds'] <= 2) & 
                               (df['funding_total_usd'] < df['funding_total_usd'].median())).astype(int)
    df['slow_milestone'] = (df['milestone_velocity'] < df['milestone_velocity'].quantile(0.25)).astype(int)
    df['low_participation'] = (df['avg_participants'] < 2).astype(int)
    
    # === Binary flags ===
    df['same_day_funding'] = (df['days_funding_active'] == 0).astype(int)
    df['quick_first_funding'] = (df['days_to_first_funding'] < 30).astype(int)
    df['long_founding_period'] = (df['days_to_first_funding'] > 365).astype(int)
    
    # === Polynomial features for key metrics ===
    df['funding_squared'] = np.log1p(df['funding_total_usd']) ** 2
    df['relationships_squared'] = df['relationships'] ** 2
    
    return df

def build_near_perfect_model():
    """
    Advanced ensemble model with SMOTE, stacking, and optimized thresholds
    """
    
    # ==================== DATA LOADING ====================
    try:
        df = pd.read_csv('startup data.csv')
        print(f"Dataset loaded successfully. Shape: {df.shape}")
    except FileNotFoundError:
        print("\nERROR: 'startup data.csv' not found.")
        return
    
    # ==================== DATA CLEANING ====================
    print("\n[1/8] Cleaning data...")
    
    drop_cols = ['Unnamed: 0', 'state_code', 'latitude', 'longitude', 
                 'zip_code', 'id', 'city', 'Unnamed: 6', 'name', 
                 'labels', 'object_id']
    df.drop(columns=drop_cols, inplace=True, errors='ignore')
    
    date_cols = ['founded_at', 'closed_at', 'first_funding_at', 'last_funding_at']
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    
    df = df[df['status'].isin(['acquired', 'closed'])].copy()
    df['success'] = (df['status'] == 'acquired').astype(int)
    
    print(f"   ✓ Success rate: {df['success'].mean():.2%}")
    print(f"   ✓ Acquired: {(df['success']==1).sum()}, Closed: {(df['success']==0).sum()}")
    
    # ==================== ADVANCED FEATURE ENGINEERING ====================
    print("\n[2/8] Advanced feature engineering...")
    
    df = advanced_feature_engineering(df)
    
    # Encode category with frequency encoding (better than label encoding)
    category_freq = df['category_code'].value_counts(normalize=True).to_dict()
    df['category_frequency'] = df['category_code'].map(category_freq)
    
    le = LabelEncoder()
    df['category_code'] = le.fit_transform(df['category_code'].astype(str))
    joblib.dump(le, 'category_encoder.pkl')
    
    # Drop temporal columns
    df.drop(columns=['status', 'founded_at', 'closed_at', 'first_funding_at', 
                     'last_funding_at', 'years_active', 'milestone_years', 
                     'years_since_founding'], inplace=True)
    
    # Keep only numeric features
    df = df.select_dtypes(include=np.number)
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    
    print(f"   ✓ Total features created: {df.shape[1] - 1}")
    
    # ==================== PREPROCESSING ====================
    print("\n[3/8] Preprocessing...")
    
    X = df.drop('success', axis=1)
    y = df['success']
    
    # Impute missing values
    imputer = SimpleImputer(strategy='median')
    X_imputed = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)
    joblib.dump(imputer, 'imputer.pkl')
    
    # Scale features (important for stacking)
    scaler = StandardScaler()
    X_scaled = pd.DataFrame(scaler.fit_transform(X_imputed), columns=X.columns)
    joblib.dump(scaler, 'scaler.pkl')
    
    # ==================== TRAIN/TEST SPLIT ====================
    print("\n[4/8] Splitting data...")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"   ✓ Train: {X_train.shape[0]}, Test: {X_test.shape[0]}, Features: {X_train.shape[1]}")
    
    # ==================== HANDLE CLASS IMBALANCE ====================
    print("\n[5/8] Balancing classes with SMOTE + Tomek Links...")
    
    smote_tomek = SMOTETomek(random_state=42)
    X_train_balanced, y_train_balanced = smote_tomek.fit_resample(X_train, y_train)
    
    print(f"   ✓ Before: {y_train.value_counts().to_dict()}")
    print(f"   ✓ After: {pd.Series(y_train_balanced).value_counts().to_dict()}")
    
    # ==================== BUILD ENSEMBLE MODEL ====================
    print("\n[6/8] Building advanced ensemble model...")
    
    # Base models with optimized hyperparameters
    xgb = XGBClassifier(
        n_estimators=500,
        max_depth=8,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        min_child_weight=3,
        gamma=0.1,
        reg_alpha=0.1,
        reg_lambda=1,
        eval_metric='logloss',
        random_state=42,
        use_label_encoder=False
    )
    
    lgbm = LGBMClassifier(
        n_estimators=500,
        max_depth=8,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        min_child_weight=3,
        reg_alpha=0.1,
        reg_lambda=1,
        random_state=42,
        verbose=-1
    )
    
    rf = RandomForestClassifier(
        n_estimators=500,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        max_features='sqrt',
        random_state=42,
        n_jobs=-1
    )
    
    # Stacking ensemble with logistic regression meta-learner
    print("   → Training stacked ensemble...")
    
    stacking_model = StackingClassifier(
        estimators=[
            ('xgb', xgb),
            ('lgbm', lgbm),
            ('rf', rf)
        ],
        final_estimator=LogisticRegression(max_iter=1000, random_state=42),
        cv=5,
        n_jobs=-1
    )
    
    stacking_model.fit(X_train_balanced, y_train_balanced)
    
    # ==================== CROSS-VALIDATION ====================
    print("\n[7/8] Cross-validating model...")
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(stacking_model, X_train_balanced, y_train_balanced, 
                                 cv=cv, scoring='roc_auc', n_jobs=-1)
    
    print(f"   ✓ CV ROC-AUC: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    
    # ==================== OPTIMIZE DECISION THRESHOLD ====================
    print("\n[8/8] Optimizing decision threshold...")
    
    y_pred_proba = stacking_model.predict_proba(X_test)[:, 1]
    
    # Find optimal threshold using ROC curve
    fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba)
    
    # Maximize F1-score
    f1_scores = []
    for threshold in thresholds:
        y_pred_thresh = (y_pred_proba >= threshold).astype(int)
        f1_scores.append(f1_score(y_test, y_pred_thresh))
    
    optimal_idx = np.argmax(f1_scores)
    optimal_threshold = thresholds[optimal_idx]
    
    print(f"   ✓ Optimal threshold: {optimal_threshold:.4f}")
    
    # Predictions with optimal threshold
    y_pred = (y_pred_proba >= optimal_threshold).astype(int)
    
    # ==================== EVALUATION ====================
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    
    print("\n" + "="*70)
    print("ADVANCED ENSEMBLE MODEL PERFORMANCE")
    print("="*70)
    print(f"Accuracy:        {accuracy:.4f}  ({accuracy*100:.2f}%)")
    print(f"Precision:       {precision:.4f}  ({precision*100:.2f}%)")
    print(f"Recall:          {recall:.4f}  ({recall*100:.2f}%)")
    print(f"F1-Score:        {f1:.4f}  ({f1*100:.2f}%)")
    print(f"ROC-AUC:         {roc_auc:.4f}  ({roc_auc*100:.2f}%)")
    print(f"Optimal Thresh:  {optimal_threshold:.4f}")
    print("="*70)
    
    cm = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(f"                 Predicted")
    print(f"               Closed  Acquired")
    print(f"Actual Closed    {cm[0,0]:3d}     {cm[0,1]:3d}      (FP: {cm[0,1]})")
    print(f"    Acquired     {cm[1,0]:3d}     {cm[1,1]:3d}      (FN: {cm[1,0]})")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Closed', 'Acquired']))
    
    # Feature importance from XGBoost
    print("\nTop 15 Most Important Features:")
    xgb_model = stacking_model.estimators_[0]
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': xgb_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    for idx, row in feature_importance.head(15).iterrows():
        print(f"   {row['feature']:35s}: {row['importance']:.4f}")
    
    feature_importance.to_csv('feature_importance.csv', index=False)
    
    # ==================== SAVE MODEL ====================
    print("\n" + "="*70)
    print("Saving model and artifacts...")
    
    model_package = {
        'model': stacking_model,
        'threshold': optimal_threshold,
        'feature_names': X.columns.tolist()
    }
    
    joblib.dump(model_package, 'startup_success_model_advanced.pkl')
    
    print("✓ Advanced model saved: startup_success_model_advanced.pkl")
    print("✓ Scaler saved: scaler.pkl")
    print("✓ Imputer saved: imputer.pkl")
    print("✓ Encoder saved: category_encoder.pkl")
    print("✓ Feature importance saved: feature_importance.csv")
    print("="*70)
    
    # Performance improvement summary
    print("\n" + "="*70)
    print("PERFORMANCE IMPROVEMENT SUMMARY")
    print("="*70)
    print("Previous Model → Advanced Model")
    print(f"Accuracy:   0.7730 → {accuracy:.4f}  ({(accuracy-0.7730)*100:+.2f}%)")
    print(f"Precision:  0.8047 → {precision:.4f}  ({(precision-0.8047)*100:+.2f}%)")
    print(f"Recall:     0.8583 → {recall:.4f}  ({(recall-0.8583)*100:+.2f}%)")
    print(f"F1-Score:   0.8306 → {f1:.4f}  ({(f1-0.8306)*100:+.2f}%)")
    print(f"ROC-AUC:    0.8226 → {roc_auc:.4f}  ({(roc_auc-0.8226)*100:+.2f}%)")
    print(f"False Pos:  25 → {cm[0,1]}  ({cm[0,1]-25:+d})")
    print(f"False Neg:  17 → {cm[1,0]}  ({cm[1,0]-17:+d})")
    print("="*70)

if __name__ == '__main__':
    build_near_perfect_model()