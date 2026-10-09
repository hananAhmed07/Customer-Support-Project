export type Prediction = {
  intent: string;
  category: string;
  confidence: number;
};

export type PredictResponse = {
  intent: string;
  category: string;
  confidence: number;
  top_k: Prediction[];
  latency_ms: number;
};

export type HealthState = "checking" | "online" | "offline";

export type RequestStatus = "idle" | "loading" | "success" | "error";
