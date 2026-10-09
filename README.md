# Customer Support Ticket Classifier

Classifies customer-support messages into 27 intents (11 categories) using the
Bitext dataset.

## NLP & Preprocessing (summary)

| Step | Decision |
|---|---|
| Cleaning | Lowercase, whitespace normalisation, placeholders `{{Order Number}}` -> `ph_order_number` |
| Duplicates | Removed after cleaning (26,872 -> 24,274 rows); no label conflicts found |
| Split | Stratified on `intent`, 80/10/10, `random_state=42` (19,419 / 2,427 / 2,428), no overlap |
| Stop words | **Not removed** (val Macro-F1 0.9916 vs 0.9874 when removed) |
| Lemmatization / stemming | **Not used** (0.9913 / 0.9906 vs 0.9916 for none) |
| Features | TF-IDF **word (1,2) + char_wb (2,5) union**, 15,080 features, fit on train only |
| Model | LinearSVC `C=10`, `class_weight=None` (5-fold CV Macro-F1 0.9988; test acc/Macro-F1 0.9992, 2 errors / 2,428) |

Why char n-grams: under synthetic typo noise, char-only TF-IDF is the most robust
representation (val accuracy 0.9699 @ 10% typos and 0.8879 @ 20%, vs 0.8109 and
0.8307 for word/word+char). Word+char wins on clean text (val Macro-F1 0.9979), so
the union is the exported feature set.

## Project structure

| Path | Description |
|---|---|
| `Bitext_Sample_Customer_Support_Training_Dataset_27K_responses-v11.csv` | Raw dataset |
| `organized.ipynb` | End-to-end notebook: EDA, preprocessing, split, features, grid search, evaluation, export |
| `preprocessing.py` | `clean_text` (single source of truth, imported by the notebook) |
| `processed_data/` | `train.csv`, `val.csv`, `test.csv` (use `clean_instruction` as input) |
| `artifacts/bestmodel.pkl` | **Final** full pipeline: word+char `FeatureUnion` + LinearSVC(C=10) |
| `artifacts/tfidfvectorizer.pkl` | Fitted word+char TF-IDF union (15,080 features) |
| `artifacts/linearsvc_pipeline.pkl`, `logreg_pipeline.pkl`, `complementnb_pipeline.pkl` | Alternative trained pipelines |
| `artifacts/word2vec.model` | gensim Word2Vec (native format) |
| `artifacts/results.json`, `metrics_val.csv`, `metrics_benchmark.csv`, `metrics_test.csv` | Metrics + hyperparameters |
| `reports/figures/` | 6 figures: EDA, benchmark heatmap, confusion matrix |
| `requirements.txt` | Pinned dependencies |

## Quick start

    pip install -r requirements.txt

    import joblib, pandas as pd
    from sklearn.pipeline import Pipeline
    import preprocessing as pp

    model = joblib.load("artifacts/bestmodel.pkl")
    df = pd.read_csv("processed_data/test.csv")
    preds = model.predict(df["clean_instruction"])

    # For raw text, clean it first (same function used in training):
    model.predict([pp.clean_text("I CAN'T cancel my ORDER {{Order Number}}")])

## Notes for modelling

- Do not use `response` as a feature (data leakage).
- Tune on `val.csv`; use `test.csv` for final evaluation only.
- `cancel_order` has only 436 rows after deduplication: use Macro-F1. The selected
  model uses `class_weight=None` (balanced weighting was tested and scored lower).
- The `.pkl` artifacts are the handoff point for the deployment teammate; deployment
  must call `preprocessing.clean_text` on raw input before `predict`.
