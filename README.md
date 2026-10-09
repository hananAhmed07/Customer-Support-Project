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
| Features | **char_wb (2,5) TF-IDF ∪ Word2Vec (128-d, mean-pooled)** — 10,234 features, fit on train only |
| Model | char TF-IDF ∪ Word2Vec → LinearSVC `C=10`, `class_weight=None` (5-fold CV Macro-F1 0.9984; test acc 0.9984 / Macro-F1 0.998, 4 errors / 2,428) |

Why char TF-IDF + Word2Vec: char n-grams are the most typo-robust representation, and
adding Word2Vec (mean-pooled 128-d) gives the best validation score — the benchmark
ranks char+w2v LinearSVC 0.9996 > word+char 0.9994 > char 0.9987 (val Macro-F1). The
exported feature set is therefore char_wb (2,5) TF-IDF ∪ Word2Vec.

ComplementNB requires non-negative inputs, so it is evaluated on the char TF-IDF
features alone (CV Macro-F1 0.9395) and is not part of the final model.

## Project structure

| Path | Description |
|---|---|
| `Bitext_Sample_Customer_Support_Training_Dataset_27K_responses-v11.csv` | Raw dataset |
| `organized.ipynb` | End-to-end notebook: EDA, preprocessing, split, features, grid search, evaluation, export |
| `preprocessing.py` | `clean_text` (single source of truth, imported by the notebook) |
| `vectorizers.py` | `Word2VecVectorizer` (mean-pooled embeddings as a scikit-learn transformer; required to load `bestmodel.pkl`) |
| `processed_data/` | `train.csv`, `val.csv`, `test.csv` (use `clean_instruction` as input) |
| `artifacts/bestmodel.pkl` | **Final** full pipeline: char TF-IDF ∪ Word2Vec `FeatureUnion` + LinearSVC(C=10); takes cleaned text |
| `artifacts/features_union.pkl` | Fitted char TF-IDF ∪ Word2Vec union (10,234 features) |
| `artifacts/linearsvc_pipeline.pkl`, `logreg_pipeline.pkl` | Alternative pipelines on the combined features |
| `artifacts/complementnb_pipeline.pkl` | ComplementNB pipeline (char TF-IDF only — needs non-negative input) |
| `artifacts/word2vec.model` | gensim Word2Vec (native format) |
| `artifacts/results.json`, `metrics_val.csv`, `metrics_benchmark.csv`, `metrics_test.csv` | Metrics + hyperparameters |
| `reports/figures/` | 6 figures: EDA, benchmark heatmap, confusion matrix |
| `requirements.txt` | Pinned dependencies (notebook / training env) |
| `backend/` | FastAPI inference service for Vercel — `/health` and `/predict` |
| `frontend/` | Next.js UI for Vercel (intent analyzer) |

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

Loading `bestmodel.pkl` requires `vectorizers.py` (and `gensim`) importable on the path.

## Deployment - two Vercel services

The repository ships two independently deployable services. On Vercel, create **two
projects** from this repo and set each project's **Root Directory**:

| Project | Root Directory | Framework | Env var |
|---|---|---|---|
| Backend | `backend` | FastAPI (Python) | `ALLOWED_ORIGINS` (optional; defaults to `*`) |
| Frontend | `frontend` | Next.js | `NEXT_PUBLIC_BACKEND_URL` (the backend URL) |

### Backend (`backend/`)

- `api/index.py` exports the FastAPI `app`: `GET /health` and `POST /predict`
  (`{"text": "..."}` -> `{intent, category, confidence, top_k, latency_ms}`).
- The Vercel entrypoint is declared in `backend/pyproject.toml`
  (`[tool.vercel] entrypoint = "api.index:app"`); `backend/vercel.json` sets the
  function timeout.
- Inference reuses `preprocessing.clean_text` and loads `artifacts/bestmodel.pkl`
  plus `artifacts/intent_map.json`. Runtime dependencies (and their pins, which
  match the training env) live in `[project].dependencies` in
  `backend/pyproject.toml`; `backend/uv.lock` pins the full resolved graph.

Local run:

    cd backend
    uv sync
    uv run uvicorn api.index:app --port 8000

### Frontend (`frontend/`)

- Next.js (App Router) UI with a live backend health pill, sample-query chips, a
  routing-trace result view, and inline error handling.
- Reads `NEXT_PUBLIC_BACKEND_URL`, falling back to `http://127.0.0.1:8000` for
  local development (see `frontend/.env.example`).

Local run:

    cd frontend
    npm install
    npm run dev

## Notes for modelling

- Do not use `response` as a feature (data leakage).
- Tune on `val.csv`; use `test.csv` for final evaluation only.
- `cancel_order` has only 436 rows after deduplication: use Macro-F1. The selected
  model uses `class_weight=None` (balanced weighting was tested and scored lower).
- The `.pkl` artifacts are the handoff point for the deployment teammate; deployment
  must call `preprocessing.clean_text` on raw input before `predict`.
