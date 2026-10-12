# TicketSense

**Enterprise Customer Support Intent & Category Classifier with SLA Auto-Routing**

TicketSense is a high-precision, production-ready SaaS application that automatically analyzes customer support inquiries, identifies the underlying intent across 27 distinct classes and 11 categories, and routes the ticket to the appropriate departmental queue with guaranteed SLA targets.

Built on an empirical NLP model achieving **99.84% accuracy** (0.9980 Macro-F1) on the Bitext Customer Support Dataset, with sub-2ms inference latency.

---

## Architecture Overview

```text
TicketSense/
├── backend/                  # FastAPI Inference Service (Python)
│   ├── api/
│   │   └── index.py         # FastAPI App (Vercel serverless entrypoint)
│   ├── artifacts/
│   │   ├── bestmodel.pkl    # Trained LinearSVC + FeatureUnion pipeline
│   │   ├── intent_metadata.json # 27 intents metadata, samples, and routing
│   │   └── results.json     # Empirical evaluation & benchmark results
│   ├── preprocessing.py     # Text normalization (clean_text, placeholders)
│   ├── vectorizers.py       # Mean-pooled Word2Vec transformer
│   ├── requirements.txt     # Pinned Python dependencies
│   ├── run.py               # Local development runner
│   └── vercel.json          # Vercel Python runtime configuration
└── frontend/                 # Next.js 14 Web Application
    ├── app/
    │   ├── globals.css      # Design tokens, fonts, and utilities
    │   ├── layout.jsx       # Root layout & SEO metadata
    │   └── page.jsx         # Main interactive dashboard
    ├── components/
    │   ├── Navbar.jsx       # Header with live backend health monitor
    │   ├── LiveClassifier.jsx # Real-time ticket analysis & SLA dispatch
    │   ├── BatchTriage.jsx  # Multi-ticket bulk triage & CSV export
    │   ├── SlaMatrix.jsx    # 11-Department SLA & routing matrix
    │   ├── BenchmarkMetrics.jsx # Model evaluation & validation graphs
    │   ├── IntentCatalog.jsx # 27-Intent directory with 1-click test
    │   ├── ApiPlayground.jsx# Interactive API tester & code generator
    │   └── Footer.jsx       # Architecture summary & Vercel deployment
    ├── lib/
    │   ├── api-client.js    # Resilient API communication client
    │   └── intents-data.js  # Intent definitions, SLA, and simulation engine
    ├── package.json
    ├── tailwind.config.js
    └── vercel.json
```

---

## NLP Model & Performance

- **Champion Model:** `LinearSVC (C=10.0, class_weight=None)`
- **Feature Pipeline:** Word-boundary Character n-grams `char_wb (2,5)` TF-IDF (10,106 features) ∪ Dense `Word2Vec 128-d` Mean-Pooled Embeddings (10,234 total features)
- **Test Set Accuracy:** **99.84%** (Only 4 errors across 2,428 real customer queries)
- **Macro-F1 Score:** **0.9980** across all 27 intents
- **5-Fold Cross Validation Macro-F1:** **0.9984**

---

## Local Development Quickstart

### 1. Run Backend (FastAPI)

```bash
cd TicketSense/backend
pip install -r requirements.txt
python run.py
```
Backend will start at: `http://127.0.0.1:8000`
Interactive Swagger Docs: `http://127.0.0.1:8000/api/docs`

### 2. Run Frontend (Next.js)

```bash
cd TicketSense/frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Deployment to Vercel

On Vercel, create **two separate projects** connected to this repository (or deploy from CLI):

### Project 1: Backend Service
1. **Root Directory:** Set to `TicketSense/backend`
2. **Framework Preset:** `Other` (or Python)
3. **Entrypoint:** Configured automatically in `TicketSense/backend/vercel.json` (`api/index.py`)
4. Note your deployed backend URL (e.g., `https://ticketsense-backend.vercel.app`).

### Project 2: Frontend Service
1. **Root Directory:** Set to `TicketSense/frontend`
2. **Framework Preset:** `Next.js`
3. **Environment Variables:**
   - `NEXT_PUBLIC_BACKEND_URL`: Set to your deployed Backend URL (e.g., `https://ticketsense-backend.vercel.app`)

---

## Core REST API Endpoints

- `GET /health`: Health check, model status, and uptime metrics.
- `POST /predict`: Classify a single ticket inquiry.
  ```json
  // Request
  { "text": "I want to cancel order {{Order Number}}" }

  // Response
  {
    "intent": "cancel_order",
    "intent_label": "Cancel Order",
    "category": "ORDER",
    "confidence": 0.989,
    "confidence_percentage": "98.9%",
    "routing": {
      "department": "Fulfillment & Orders Desk",
      "priority": "Medium",
      "sla_hours": 2
    },
    "top_k": [...],
    "latency_ms": 1.4
  }
  ```
- `POST /batch-predict`: Classify up to 100 inquiries with distribution summary.
- `GET /intents`: Catalog of all 27 intents with sample inquiries.
- `GET /stats`: Dataset sizes, feature dimensions, and benchmark scores.
