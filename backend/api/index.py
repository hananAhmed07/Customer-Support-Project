"""Vercel serverless entrypoint for the Bitext customer-support intent classifier.

Exposes a small FastAPI app:

    GET  /health   -> liveness plus whether the model finished loading
    POST /predict  -> {"text": "..."} -> predicted intent, category, confidence, top-3

The exported ASGI ``app`` object is the Vercel Python entrypoint (declared in
``backend/pyproject.toml`` as ``api.index:app``).
"""

from __future__ import annotations

import json
import math
import os
import sys
import threading
import time
from pathlib import Path

# Make the backend project root importable so ``preprocessing`` / ``vectorizers``
# resolve both locally (uvicorn run from backend/) and inside the Vercel bundle.
BACKEND_ROOT = Path(__file__).resolve().parent.parent
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

import joblib  # noqa: E402
from fastapi import FastAPI, HTTPException  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from pydantic import BaseModel, Field  # noqa: E402

import preprocessing  # noqa: E402

ARTIFACTS = BACKEND_ROOT / "artifacts"
MODEL_PATH = ARTIFACTS / "bestmodel.pkl"
INTENT_MAP_PATH = ARTIFACTS / "intent_map.json"

# LinearSVC exposes no probabilities, so confidence is a softmax over its decision
# margins. The temperature sharpens/softens that curve; 1.0 reads well across the
# 27 classes (winning margin ~1-3 -> ~0.6-0.9 confidence, runners-up stay low).
_TEMPERATURE = 1.0
_TOP_K = 3

app = FastAPI(title="Bitext Intent Classifier", version="1.0.0")

_origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "*").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins or ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- model loading (once per warm function instance) ---------------------------------

_model = None
_intent_map: dict[str, str] = {}
_load_error: str | None = None
_load_lock = threading.Lock()


def _load() -> None:
    """Load the fitted pipeline and the intent -> category map exactly once."""
    global _model, _intent_map, _load_error
    if _model is not None:
        return
    with _load_lock:
        if _model is not None:
            return
        try:
            _model = joblib.load(MODEL_PATH)
            with open(INTENT_MAP_PATH, encoding="utf-8") as fh:
                _intent_map = json.load(fh)
            _load_error = None
        except Exception as exc:  # noqa: BLE001 - surfaced via /health
            _load_error = f"{type(exc).__name__}: {exc}"
            raise


def _ensure_ready() -> None:
    if _model is None:
        try:
            _load()
        except Exception:  # noqa: BLE001
            pass
    if _model is None:
        raise HTTPException(status_code=503, detail=f"Model unavailable: {_load_error}")


def _softmax(scores: list[float]) -> list[float]:
    top = max(scores)
    exps = [math.exp(s - top) for s in scores]
    total = sum(exps)
    return [e / total for e in exps]


# --- schemas -------------------------------------------------------------------------


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Raw customer-support message")


class Prediction(BaseModel):
    intent: str
    category: str
    confidence: float


class PredictResponse(BaseModel):
    intent: str
    category: str
    confidence: float
    top_k: list[Prediction]
    latency_ms: float


# --- routes --------------------------------------------------------------------------


@app.get("/")
def root() -> dict[str, object]:
    return {"service": "bitext-intent-classifier", "endpoints": ["/health", "/predict", "/docs"]}


@app.get("/health")
def health() -> dict[str, object]:
    try:
        _load()
    except Exception:  # noqa: BLE001 - health must never 5xx
        pass
    body: dict[str, object] = {"status": "ok", "model_ready": _model is not None}
    if _model is None:
        body["detail"] = _load_error
    return body


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    _ensure_ready()

    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="`text` must not be blank.")

    start = time.perf_counter()
    cleaned = preprocessing.clean_text(text)
    scores = _model.decision_function([cleaned])[0]
    latency_ms = (time.perf_counter() - start) * 1000.0

    classes = list(_model.classes_)
    probs = _softmax([float(s) / _TEMPERATURE for s in scores])
    ranked = sorted(zip(classes, probs), key=lambda kv: kv[1], reverse=True)[:_TOP_K]

    predictions = [
        Prediction(intent=intent, category=_intent_map.get(intent, "UNKNOWN"), confidence=round(float(p), 4))
        for intent, p in ranked
    ]
    best = predictions[0]
    return PredictResponse(
        intent=best.intent,
        category=best.category,
        confidence=best.confidence,
        top_k=predictions,
        latency_ms=round(latency_ms, 2),
    )
