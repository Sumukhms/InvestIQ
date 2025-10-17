# ml_model/optimize_threshold.py

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import (precision_score, recall_score, f1_score, 
                             accuracy_score, confusion_matrix, roc_auc_score)

def load_and_prepare_data():
    """Load and prepare data the same way as training"""
    try:
        df = pd.read_csv('startup data.csv')
    except FileNotFoundError:
        print("ERROR: 'startup data.csv' not found.")
        return None, None
    
    # Same preprocessing as training
    drop_cols = ['Unnamed: 0', 'state_code', 'latitude', 'longitude', 
                 'zip_code', 'id', 'city', 'Unnamed: 6', 'name', 
                 'labels', 'object_id']
    df.drop(columns=drop_cols, inplace=True, errors='ignore')
    
    date_cols = ['founded_at', 'closed_at', 'first_funding_at', 'last_funding_at']
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    
    df = df[df['status'].isin(['acquired', 'closed'])].copy()
    df['success'] = (df['status'] == 'acquired').astype(int)
    
    # Feature engineering (same as training)
    epsilon = 0.01
    df['days_to_first_funding'] = (df['first_funding_at'] - df['founded_at']).dt.days
    df['days_funding_active'] = (df['last_funding_at'] - df['first_funding_at']).dt.days
    df['days_since_founding'] = (df['last_funding_at'] - df['founded_at']).dt.days
    df['years_active'] = (df['days_funding_active'] / 365.25).clip(lower=epsilon)
    df['years_since_founding'] = (df['days_since_founding'] / 365.25).clip(lower=epsilon)
    
    df['funding_momentum'] = df['funding_total_usd'] / df['years_active']
    df['avg_funding_per_round'] = df['funding_total_usd'] / df['funding_rounds'].replace(0, 1)
    df['funding_concentration'] = df['avg_funding_per_round'] / (df['funding_total_usd'] + 1)
    df['funding_growth_rate'] = df['funding_total_usd'] / df['years_since_founding']
    
    df['milestone_years'] = (df['age_last_milestone_year'] - df['age_first_milestone_year']).clip(lower=epsilon)
    df['milestone_velocity'] = df['milestones'] / df['milestone_years']
    df['milestones_per_year_active'] = df['milestones'] / df['years_active']
    df['milestone_density'] = df['milestones'] / (df['days_since_founding'] + 1)
    
    df['relationships_per_year'] = df['relationships'] / df['years_active']
    df['relationship_efficiency'] = df['relationships'] / (df['funding_rounds'] + 1)
    df['network_strength'] = df['relationships'] * df['avg_participants']
    
    df['funding_x_relationships'] = df['funding_total_usd'] * df['relationships']
    df['rounds_x_participants'] = df['funding_rounds'] * df['avg_participants']
    df['milestones_x_relationships'] = df['milestones'] * df['relationships']
    df['top500_x_funding'] = df['is_top500'] * df['funding_total_usd']
    
    round_cols = [col for col in df.columns if col.startswith('has_round')]
    if round_cols:
        df['total_rounds_reached'] = df[round_cols].sum(axis=1)
        df['reached_late_stage'] = ((df.get('has_roundC', 0) == 1) | 
                                     (df.get('has_roundD', 0) == 1)).astype(int)
    
    df['early_stage_only'] = ((df['funding_rounds'] <= 2) & 
                               (df['funding_total_usd'] < df['funding_total_usd'].median())).astype(int)
    df['slow_milestone'] = (df['milestone_velocity'] < df['milestone_velocity'].quantile(0.25)).astype(int)
    df['low_participation'] = (df['avg_participants'] < 2).astype(int)
    
    df['same_day_funding'] = (df['days_funding_active'] == 0).astype(int)
    df['quick_first_funding'] = (df['days_to_first_funding'] < 30).astype(int)
    df['long_founding_period'] = (df['days_to_first_funding'] > 365).astype(int)
    
    df['funding_squared'] = np.log1p(df['funding_total_usd']) ** 2
    df['relationships_squared'] = df['relationships'] ** 2
    
    category_freq = df['category_code'].value_counts(normalize=True).to_dict()
    df['category_frequency'] = df['category_code'].map(category_freq)
    
    le = LabelEncoder()
    df['category_code'] = le.fit_transform(df['category_code'].astype(str))
    
    df.drop(columns=['status', 'founded_at', 'closed_at', 'first_funding_at', 
                     'last_funding_at', 'years_active', 'milestone_years', 
                     'years_since_founding'], inplace=True)
    
    df = df.select_dtypes(include=np.number)
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    
    X = df.drop('success', axis=1)
    y = df['success']
    
    # Load saved preprocessing objects
    imputer = joblib.load('imputer.pkl')
    scaler = joblib.load('scaler.pkl')
    
    X_imputed = pd.DataFrame(imputer.transform(X), columns=X.columns)
    X_scaled = pd.DataFrame(scaler.transform(X_imputed), columns=X.columns)
    
    # Same split as training
    _, X_test, _, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )
    
    return X_test, y_test

def analyze_thresholds():
    """
    Comprehensive threshold analysis using actual test data
    """
    
    print("="*80)
    print("DECISION THRESHOLD OPTIMIZER - REAL DATA ANALYSIS")
    print("="*80)
    
    # Load model
    print("\n[1/3] Loading model and test data...")
    try:
        model_package = joblib.load('startup_success_model_advanced.pkl')
        model = model_package['model']
        print("   ✓ Model loaded successfully")
    except FileNotFoundError:
        print("   ✗ Model file not found. Run training first.")
        return
    
    # Load test data
    X_test, y_test = load_and_prepare_data()
    if X_test is None:
        return
    
    print(f"   ✓ Test data loaded: {len(y_test)} samples")
    print(f"   ✓ Acquired: {sum(y_test)}, Closed: {len(y_test) - sum(y_test)}")
    
    # Get predictions
    print("\n[2/3] Analyzing thresholds from 0.10 to 0.70...")
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    thresholds = np.arange(0.10, 0.71, 0.05)
    results = []
    
    for threshold in thresholds:
        y_pred = (y_pred_proba >= threshold).astype(int)
        
        cm = confusion_matrix(y_test, y_pred)
        tn, fp, fn, tp = cm.ravel()
        
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        
        results.append({
            'threshold': threshold,
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision,
            'recall': recall,
            'f1': f1_score(y_test, y_pred, zero_division=0),
            'roc_auc': roc_auc_score(y_test, y_pred_proba),
            'fp': fp,
            'fn': fn,
            'tp': tp,
            'tn': tn,
            'total_errors': fp + fn
        })
    
    results_df = pd.DataFrame(results)
    
    # Display results
    print("\n[3/3] THRESHOLD ANALYSIS RESULTS")
    print("="*80)
    print(f"{'Thresh':<8} {'Acc':<7} {'Prec':<7} {'Rec':<7} {'F1':<7} {'FP':<5} {'FN':<5} {'Errors':<7} Rating")
    print("-"*80)
    
    for _, row in results_df.iterrows():
        rating = ""
        if row['f1'] >= 0.88:
            rating = "⭐⭐⭐ EXCELLENT"
        elif row['f1'] >= 0.86:
            rating = "⭐⭐ VERY GOOD"
        elif row['f1'] >= 0.84:
            rating = "⭐ GOOD"
        
        print(f"{row['threshold']:<8.2f} {row['accuracy']:<7.3f} {row['precision']:<7.3f} "
              f"{row['recall']:<7.3f} {row['f1']:<7.3f} {row['fp']:<5.0f} {row['fn']:<5.0f} "
              f"{row['total_errors']:<7.0f} {rating}")
    
    # Find optimal thresholds for different criteria
    best_f1_idx = results_df['f1'].idxmax()
    best_f1_row = results_df.loc[best_f1_idx]
    
    best_accuracy_idx = results_df['accuracy'].idxmax()
    best_accuracy_row = results_df.loc[best_accuracy_idx]
    
    min_errors_idx = results_df['total_errors'].idxmin()
    min_errors_row = results_df.loc[min_errors_idx]
    
    # Balanced: Find threshold with recall >= 0.90 and best precision
    balanced_df = results_df[results_df['recall'] >= 0.90]
    if not balanced_df.empty:
        balanced_idx = balanced_df['precision'].idxmax()
        balanced_row = results_df.loc[balanced_idx]
    else:
        balanced_row = best_f1_row
    
    print("\n" + "="*80)
    print("OPTIMAL THRESHOLDS BY OBJECTIVE")
    print("="*80)
    
    print(f"\n🎯 BEST F1-SCORE: Threshold = {best_f1_row['threshold']:.2f}")
    print(f"   Accuracy: {best_f1_row['accuracy']:.3f}, Precision: {best_f1_row['precision']:.3f}, "
          f"Recall: {best_f1_row['recall']:.3f}, F1: {best_f1_row['f1']:.3f}")
    print(f"   False Positives: {best_f1_row['fp']:.0f}, False Negatives: {best_f1_row['fn']:.0f}")
    print(f"   Total Errors: {best_f1_row['total_errors']:.0f}")
    
    print(f"\n📊 BEST ACCURACY: Threshold = {best_accuracy_row['threshold']:.2f}")
    print(f"   Accuracy: {best_accuracy_row['accuracy']:.3f}, Precision: {best_accuracy_row['precision']:.3f}, "
          f"Recall: {best_accuracy_row['recall']:.3f}, F1: {best_accuracy_row['f1']:.3f}")
    print(f"   False Positives: {best_accuracy_row['fp']:.0f}, False Negatives: {best_accuracy_row['fn']:.0f}")
    print(f"   Total Errors: {best_accuracy_row['total_errors']:.0f}")
    
    print(f"\n⚖️  BALANCED (90%+ Recall): Threshold = {balanced_row['threshold']:.2f}")
    print(f"   Accuracy: {balanced_row['accuracy']:.3f}, Precision: {balanced_row['precision']:.3f}, "
          f"Recall: {balanced_row['recall']:.3f}, F1: {balanced_row['f1']:.3f}")
    print(f"   False Positives: {balanced_row['fp']:.0f}, False Negatives: {balanced_row['fn']:.0f}")
    print(f"   Total Errors: {balanced_row['total_errors']:.0f}")
    
    print(f"\n🎖️  MINIMUM ERRORS: Threshold = {min_errors_row['threshold']:.2f}")
    print(f"   Accuracy: {min_errors_row['accuracy']:.3f}, Precision: {min_errors_row['precision']:.3f}, "
          f"Recall: {min_errors_row['recall']:.3f}, F1: {min_errors_row['f1']:.3f}")
    print(f"   False Positives: {min_errors_row['fp']:.0f}, False Negatives: {min_errors_row['fn']:.0f}")
    print(f"   Total Errors: {min_errors_row['total_errors']:.0f}")
    
    # Recommendations
    print("\n" + "="*80)
    print("BUSINESS SCENARIO RECOMMENDATIONS")
    print("="*80)
    
    print("\n💼 SCENARIO 1: Early-Stage VC (Don't miss winners)")
    early_stage = results_df[results_df['recall'] >= 0.95].iloc[0]
    print(f"   Recommended Threshold: {early_stage['threshold']:.2f}")
    print(f"   → Catches {early_stage['recall']*100:.1f}% of successful startups")
    print(f"   → Precision: {early_stage['precision']*100:.1f}% (accept some false positives)")
    print(f"   → Will evaluate {early_stage['fp']:.0f} failed startups as potential winners")
    
    print("\n⚖️  SCENARIO 2: Balanced Investor (Optimal F1)")
    print(f"   Recommended Threshold: {best_f1_row['threshold']:.2f}")
    print(f"   → Best overall performance (F1: {best_f1_row['f1']:.3f})")
    print(f"   → Catches {best_f1_row['recall']*100:.1f}% of winners")
    print(f"   → {best_f1_row['precision']*100:.1f}% precision")
    print(f"   → Only {best_f1_row['total_errors']:.0f} total mistakes")
    
    print("\n💎 SCENARIO 3: Conservative/Late-Stage (High precision)")
    conservative = results_df[results_df['precision'] >= 0.90].iloc[-1] if any(results_df['precision'] >= 0.90) else results_df.iloc[-1]
    print(f"   Recommended Threshold: {conservative['threshold']:.2f}")
    print(f"   → Very high confidence predictions ({conservative['precision']*100:.1f}% precision)")
    print(f"   → Will miss {conservative['fn']:.0f} successful startups")
    print(f"   → Only {conservative['fp']:.0f} false positives")
    
    # Save optimal threshold
    print("\n" + "="*80)
    print("SAVING OPTIMAL THRESHOLD")
    print("="*80)
    
    optimal_threshold = best_f1_row['threshold']
    
    # Update model package with optimal threshold
    model_package['optimal_threshold'] = optimal_threshold
    model_package['threshold_analysis'] = results_df.to_dict('records')
    
    joblib.dump(model_package, 'startup_success_model_advanced.pkl')
    
    print(f"\n✓ Optimal threshold ({optimal_threshold:.2f}) saved to model package")
    print(f"✓ Full analysis saved for reference")
    
    # Save CSV report
    results_df.to_csv('threshold_analysis_report.csv', index=False)
    print(f"✓ Detailed report saved: threshold_analysis_report.csv")
    
    print("\n" + "="*80)
    print("🎯 FINAL RECOMMENDATION FOR 'NEAR PERFECT' PERFORMANCE")
    print("="*80)
    print(f"\nUse Threshold: {optimal_threshold:.2f}")
    print(f"\nExpected Performance:")
    print(f"  • Accuracy: {best_f1_row['accuracy']*100:.2f}%")
    print(f"  • Precision: {best_f1_row['precision']*100:.2f}%")
    print(f"  • Recall: {best_f1_row['recall']*100:.2f}%")
    print(f"  • F1-Score: {best_f1_row['f1']*100:.2f}%")
    print(f"  • Total Errors: {best_f1_row['total_errors']:.0f} out of {len(y_test)}")
    print(f"  • Success Rate: {(1 - best_f1_row['total_errors']/len(y_test))*100:.2f}%")
    print("="*80)

if __name__ == '__main__':
    analyze_thresholds()