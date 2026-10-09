# Customer Support Ticket Classifier

Classifies customer-support messages into 27 intents (11 categories) using the
Bitext dataset.

## NLP & Preprocessing (summary)

| Step | Decision |
|---|---|
| Cleaning | Lowercase, whitespace normalisation, placeholders `{{Order Number}}` -> `ph_order_number` |
| Duplicates | Removed after cleaning (26,872 -> 24,274 rows); no label conflicts found |
| Split | Stratified on `intent`, 80/10/10, `random_state=42` (19,419 / 2,427 / 2,428), no overlap |
| Stop words | **Not removed** (Macro-F1 0.9912 vs ~0.974 when removed) |
| Lemmatization / stemming | **Not used** (no gain over baseline) |
| Features | TF-IDF Word(1-2) + Char_wb(2-5), 15,080 features, fit on train only |

Why Char n-grams: word features reach 0.9654 accuracy on sentences with typos
(flag `Z`), char n-grams 0.9935.

## Project structure

| Path | Description |
|---|---|
| `Bitext_Sample_..._v11.csv` | Raw dataset |
| `nlp_preprocessing.ipynb` | Cleaning, split, preprocessing experiments, vectorizer |
| `processed_data/` | `train.csv`, `val.csv`, `test.csv` (use `instruction_clean` as input) |
| `artifacts/tfidf_word_char.joblib` | Fitted TF-IDF vectorizer |
| `requirements.txt` | Pinned dependencies |

## Quick start

```bash
pip install -r requirements.txt
```

```python
import joblib, pandas as pd

tfidf = joblib.load("artifacts/tfidf_word_char.joblib")
train = pd.read_csv("processed_data/train.csv")

X_train = tfidf.transform(train["instruction_clean"])
y_train = train["intent"]   # or "category"
```

## Notes for modelling

- Do not use `response` as a feature (data leakage).
- Tune on `val.csv`; use `test.csv` for final evaluation only.
- `cancel_order` has only 436 rows after deduplication: use Macro-F1 and
  consider `class_weight="balanced"`.## Quick start

```bash
pip install -r requirements.txt
```

```python
import joblib, pandas as pd

tfidf = joblib.load("artifacts/tfidf_word_char.joblib")
train = pd.read_csv("processed_data/train.csv")

X_train = tfidf.transform(train["instruction_clean"])
y_train = train["intent"]   # or "category"
```