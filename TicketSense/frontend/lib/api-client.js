// Pure decoupled API Client for FastAPI backend
const DEFAULT_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export function getBackendUrl() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ticketsense_backend_url');
    if (saved) return saved;
  }
  return DEFAULT_URL;
}

export function setBackendUrl(url) {
  if (typeof window !== 'undefined') {
    if (!url || !url.trim()) {
      localStorage.removeItem('ticketsense_backend_url');
    } else {
      localStorage.setItem('ticketsense_backend_url', url.trim().replace(/\/$/, ''));
    }
  }
}

export async function checkBackendHealth() {
  const backendUrl = getBackendUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { connected: true, data, url: backendUrl, error: null };
    }
    return { connected: false, data: null, url: backendUrl, error: `HTTP ${res.status}` };
  } catch (err) {
    return { connected: false, data: null, url: backendUrl, error: err.message || 'Connection refused' };
  }
}

export async function classifyTicket(text) {
  if (!text || !text.trim()) {
    throw new Error('Please enter customer ticket inquiry text.');
  }

  const backendUrl = getBackendUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${backendUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Backend responded with HTTP ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Inference timeout: Backend at ${backendUrl} did not respond within 6 seconds.`);
    }
    throw new Error(`Backend Connection Error: Could not reach FastAPI server at ${backendUrl}. Make sure 'python run.py' is running.`);
  }
}

export async function batchClassifyTickets(texts) {
  if (!texts || texts.length === 0) return null;

  const backendUrl = getBackendUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${backendUrl}/batch-predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Backend responded with HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    throw new Error(`Batch Inference Error: Failed to communicate with ${backendUrl}. ${err.message}`);
  }
}
