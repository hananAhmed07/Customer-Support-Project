import os
import sys
import time
import json
import re
from pathlib import Path
from typing import List, Optional, Dict, Any

import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure local module directory is in sys.path so vectorizers and preprocessing unpickle
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
for p in [str(BACKEND_DIR), str(CURRENT_DIR), str(Path.cwd()), str(Path.cwd() / "TicketSense" / "backend")]:
    if p not in sys.path and os.path.exists(p):
        sys.path.insert(0, p)

try:
    import joblib
    import preprocessing as pp
    import vectorizers
except ImportError as e:
    # Fallback to local import if needed
    pp = None
    joblib = None
    print(f"Warning on import: {e}")

app = FastAPI(
    title="TicketSense Intelligence API",
    description="High-precision Customer Support Ticket Intent & Category Classifier with SLA Routing",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Metadata mappings
CATEGORY_ROUTING = {
    "ORDER": {
        "department": "Fulfillment & Orders Desk",
        "priority": "Medium",
        "sla_hours": 2,
        "color": "#3B82F6"
    },
    "CANCEL": {
        "department": "Retention & Cancellation Unit",
        "priority": "High",
        "sla_hours": 1,
        "color": "#EF4444"
    },
    "REFUND": {
        "department": "Billing & Financial Operations",
        "priority": "High",
        "sla_hours": 2,
        "color": "#F59E0B"
    },
    "PAYMENT": {
        "department": "Payment Gateway & Security",
        "priority": "High",
        "sla_hours": 1,
        "color": "#10B981"
    },
    "DELIVERY": {
        "department": "Logistics & Carrier Support",
        "priority": "Medium",
        "sla_hours": 4,
        "color": "#6366F1"
    },
    "SHIPPING": {
        "department": "Address Verification & Dispatch",
        "priority": "Medium",
        "sla_hours": 4,
        "color": "#8B5CF6"
    },
    "INVOICE": {
        "department": "Accounting & Invoicing",
        "priority": "Low",
        "sla_hours": 12,
        "color": "#64748B"
    },
    "ACCOUNT": {
        "department": "Identity & Security Support",
        "priority": "High",
        "sla_hours": 2,
        "color": "#06B6D4"
    },
    "FEEDBACK": {
        "department": "Customer Experience & QA",
        "priority": "Medium",
        "sla_hours": 12,
        "color": "#EC4899"
    },
    "CONTACT": {
        "department": "Live Agent Escalation Hub",
        "priority": "Critical",
        "sla_hours": 0.5,
        "color": "#F97316"
    },
    "SUBSCRIPTION": {
        "department": "Marketing & Communications",
        "priority": "Low",
        "sla_hours": 24,
        "color": "#14B8A6"
    }
}

MODEL = None
INTENT_METADATA: Dict[str, Any] = {}
BENCHMARK_RESULTS: Dict[str, Any] = {}


def locate_file(rel_path: str) -> Optional[Path]:
    search_roots = [
        BACKEND_DIR,
        CURRENT_DIR,
        Path.cwd() / "TicketSense" / "backend",
        Path.cwd() / "artifacts",
        Path.cwd()
    ]
    for root in search_roots:
        cand = root / rel_path
        if cand.exists():
            return cand
        cand_artifacts = root / "artifacts" / rel_path
        if cand_artifacts.exists():
            return cand_artifacts
    return None


def get_model():
    global MODEL
    if MODEL is None:
        model_path = locate_file("bestmodel.pkl")
        if not model_path:
            raise RuntimeError("Model file 'bestmodel.pkl' not found")
        MODEL = joblib.load(model_path)
    return MODEL


def load_metadata():
    global INTENT_METADATA, BENCHMARK_RESULTS
    if not INTENT_METADATA:
        meta_path = locate_file("intent_metadata.json")
        if meta_path and meta_path.exists():
            with open(meta_path, "r", encoding="utf-8") as f:
                INTENT_METADATA = json.load(f)

    if not BENCHMARK_RESULTS:
        results_path = locate_file("results.json")
        if results_path and results_path.exists():
            with open(results_path, "r", encoding="utf-8") as f:
                BENCHMARK_RESULTS = json.load(f)


@app.on_event("startup")
def startup_event():
    try:
        load_metadata()
        get_model()
    except Exception as e:
        print(f"Warning during startup loading: {e}")


# Request / Response Schemas
class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="Customer inquiry or support ticket text")


class BatchPredictRequest(BaseModel):
    texts: List[str] = Field(..., max_items=100, description="List of support ticket texts to classify")


class IntentAlternative(BaseModel):
    intent: str
    category: str
    probability: float
    percentage: str


class PredictionResult(BaseModel):
    original_text: str
    clean_text: str
    intent: str
    intent_label: str
    category: str
    confidence: float
    confidence_percentage: str
    top_k: List[IntentAlternative]
    routing: Dict[str, Any]
    detected_placeholders: List[str]
    latency_ms: float


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str
    features_count: int
    classes_count: int
    f1_score: float
    test_accuracy: float
    uptime_status: str


def format_intent_label(intent_raw: str) -> str:
    return " ".join(word.capitalize() for word in intent_raw.split("_"))


def extract_placeholders(raw_text: str) -> List[str]:
    matches = re.findall(r"\{\{(.*?)\}\}", raw_text)
    return [m.strip() for m in matches] if matches else []


def perform_prediction(raw_text: str) -> PredictionResult:
    load_metadata()
    start_time = time.perf_counter()
    model = get_model()
    cleaned = pp.clean_text(raw_text) if pp else raw_text.strip().lower()

    # Model inference
    raw_decision = model.decision_function([cleaned])[0]

    # Calibrated softmax
    exp_scores = np.exp(raw_decision - np.max(raw_decision))
    probs = exp_scores / np.sum(exp_scores)

    classes = model.classes_
    top_indices = np.argsort(probs)[::-1][:5]

    best_idx = top_indices[0]
    best_intent = str(classes[best_idx])
    best_conf = float(probs[best_idx])

    # Top-K list
    top_k_list = []
    for idx in top_indices:
        intent_name = str(classes[idx])
        p = float(probs[idx])
        cat = INTENT_METADATA.get(intent_name, {}).get("category", "GENERAL")
        top_k_list.append(
            IntentAlternative(
                intent=intent_name,
                category=cat,
                probability=round(p, 4),
                percentage=f"{p * 100:.1f}%"
            )
        )

    category = INTENT_METADATA.get(best_intent, {}).get("category", "GENERAL")
    routing_info = CATEGORY_ROUTING.get(category, {
        "department": "General Support Services",
        "priority": "Normal",
        "sla_hours": 6,
        "color": "#64748B"
    })

    latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
    placeholders = extract_placeholders(raw_text)

    return PredictionResult(
        original_text=raw_text,
        clean_text=cleaned,
        intent=best_intent,
        intent_label=format_intent_label(best_intent),
        category=category,
        confidence=round(best_conf, 4),
        confidence_percentage=f"{best_conf * 100:.1f}%",
        top_k=top_k_list,
        routing=routing_info,
        detected_placeholders=placeholders,
        latency_ms=latency_ms
    )


@app.get("/")
@app.get("/api")
def root():
    return {
        "service": "TicketSense Core Intelligence",
        "version": "1.0.0",
        "status": "online",
        "model": "LinearSVC (char_wb n-gram TF-IDF ∪ Word2Vec 128-d)",
        "accuracy": "99.84%",
        "macro_f1": "0.9980",
        "classes": 27,
        "categories": 11,
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "batch_predict": "/batch-predict",
            "intents": "/intents",
            "stats": "/stats"
        }
    }


@app.get("/health", response_model=HealthResponse)
@app.get("/api/health", response_model=HealthResponse)
def health_check():
    loaded = MODEL is not None
    return HealthResponse(
        status="healthy" if loaded else "degraded",
        model_loaded=loaded,
        model_name="LinearSVC with Char TF-IDF + Word2Vec Union",
        features_count=10234,
        classes_count=27,
        f1_score=0.9980,
        test_accuracy=0.9984,
        uptime_status="Operational"
    )


@app.post("/predict", response_model=PredictionResult)
@app.post("/api/predict", response_model=PredictionResult)
def predict_intent(payload: PredictRequest):
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Inquiry text cannot be empty.")
    try:
        return perform_prediction(payload.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")


@app.post("/batch-predict")
@app.post("/api/batch-predict")
def batch_predict(payload: BatchPredictRequest):
    if not payload.texts:
        raise HTTPException(status_code=400, detail="Texts list cannot be empty.")

    start_total = time.perf_counter()
    results = [perform_prediction(t) for t in payload.texts]
    total_latency_ms = round((time.perf_counter() - start_total) * 1000, 2)

    # Aggregations
    cat_counts: Dict[str, int] = {}
    intent_counts: Dict[str, int] = {}
    for r in results:
        cat_counts[r.category] = cat_counts.get(r.category, 0) + 1
        intent_counts[r.intent] = intent_counts.get(r.intent, 0) + 1

    return {
        "count": len(results),
        "total_latency_ms": total_latency_ms,
        "avg_latency_ms": round(total_latency_ms / max(1, len(results)), 2),
        "category_distribution": cat_counts,
        "intent_distribution": intent_counts,
        "predictions": results
    }


@app.get("/intents")
@app.get("/api/intents")
def get_intents():
    load_metadata()
    data = []
    for intent, meta in INTENT_METADATA.items():
        cat = meta.get("category", "GENERAL")
        data.append({
            "intent": intent,
            "label": format_intent_label(intent),
            "category": cat,
            "samples": meta.get("samples", []),
            "routing": CATEGORY_ROUTING.get(cat, {})
        })
    return {"total": len(data), "intents": sorted(data, key=lambda x: x["category"])}


@app.get("/stats")
@app.get("/api/stats")
def get_stats():
    load_metadata()
    return {
        "dataset": {
            "name": "Bitext Customer Support Benchmark",
            "samples_total": 24274,
            "raw_total": 26872,
            "train_samples": 19419,
            "val_samples": 2427,
            "test_samples": 2428,
            "categories": 11,
            "intents": 27
        },
        "model_performance": {
            "algorithm": "LinearSVC (C=10.0, class_weight=None)",
            "test_accuracy": 0.9984,
            "test_macro_f1": 0.9980,
            "test_weighted_f1": 0.9984,
            "validation_macro_f1": 0.9996,
            "errors_on_test": "4 out of 2,428 samples",
            "features_dimension": 10234,
            "feature_composition": "Char (2,5) TF-IDF (10,106) + Word2Vec Mean-Pooled (128)"
        },
        "benchmark_comparison": [
            {"model": "LinearSVC", "features": "char_wb TF-IDF + Word2Vec", "macro_f1": 0.9980, "val_f1": 0.9996, "train_time_sec": 14.2, "status": "Champion Model"},
            {"model": "LinearSVC", "features": "word + char TF-IDF", "macro_f1": 0.9972, "val_f1": 0.9994, "train_time_sec": 6.3, "status": "Runner-Up"},
            {"model": "LogisticRegression", "features": "char_wb TF-IDF + Word2Vec", "macro_f1": 0.9928, "val_f1": 0.9954, "train_time_sec": 7.6, "status": "Baseline"},
            {"model": "ComplementNB", "features": "char TF-IDF only", "macro_f1": 0.9395, "val_f1": 0.9395, "train_time_sec": 2.1, "status": "Fast Baseline"}
        ]
    }
