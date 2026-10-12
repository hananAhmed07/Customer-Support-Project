'use client';

import { useState } from 'react';
import { 
  Server, 
  Copy, 
  Check, 
  Play, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export default function ApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/predict');
  const [requestBody, setRequestBody] = useState('{\n  "text": "I want to cancel my order {{Order Number}}"\n}');
  const [responseOutput, setResponseOutput] = useState('{\n  "status": "ready",\n  "click": "Click Run Request below to test live endpoint"\n}');
  const [loading, setLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeLang, setActiveLang] = useState('curl');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

  const endpoints = [
    { method: 'POST', path: '/predict', desc: 'Classify single ticket intent & get SLA routing' },
    { method: 'POST', path: '/batch-predict', desc: 'Batch classify up to 100 ticket inquiries' },
    { method: 'GET', path: '/health', desc: 'Service health, model status, and uptime' },
    { method: 'GET', path: '/stats', desc: 'Evaluation accuracy, Macro-F1, and feature counts' },
    { method: 'GET', path: '/intents', desc: 'List of all 27 intents and sample training data' },
  ];

  const handleSelectEndpoint = (ep) => {
    setSelectedEndpoint(ep.path);
    if (ep.path === '/predict') {
      setRequestBody('{\n  "text": "I want to cancel my order {{Order Number}}"\n}');
    } else if (ep.path === '/batch-predict') {
      setRequestBody('{\n  "texts": [\n    "How soon can I expect the order?",\n    "My credit card was charged twice",\n    "I want to speak with a human agent"\n  ]\n}');
    } else {
      setRequestBody('');
    }
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponseOutput('Executing request...');
    try {
      const ep = endpoints.find(e => e.path === selectedEndpoint);
      const isPost = ep?.method === 'POST';

      const options = {
        method: isPost ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
      };

      if (isPost && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(`${backendUrl}${selectedEndpoint}`, options);
      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponseOutput(JSON.stringify({
        error: "Backend server not responding or offline.",
        detail: err.message,
        hint: "Start backend locally with 'python run.py' or check NEXT_PUBLIC_BACKEND_URL in Vercel settings."
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const getCodeSnippet = () => {
    const ep = endpoints.find(e => e.path === selectedEndpoint);
    const isPost = ep?.method === 'POST';

    if (activeLang === 'curl') {
      if (isPost) {
        return `curl -X POST "${backendUrl}${selectedEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody.replace(/\n/g, '').replace(/\s+/g, ' ')}'`;
      }
      return `curl -X GET "${backendUrl}${selectedEndpoint}"`;
    }

    if (activeLang === 'python') {
      if (isPost) {
        return `import requests

url = "${backendUrl}${selectedEndpoint}"
payload = ${requestBody}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
      }
      return `import requests

url = "${backendUrl}${selectedEndpoint}"
response = requests.get(url)
print(response.json())`;
    }

    if (activeLang === 'javascript') {
      if (isPost) {
        return `const res = await fetch("${backendUrl}${selectedEndpoint}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(${requestBody})
});
const data = await res.json();
console.log(data);`;
      }
      return `const res = await fetch("${backendUrl}${selectedEndpoint}");
const data = await res.json();
console.log(data);`;
    }

    return '';
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          FastAPI Integration & API Playground
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Integrate the TicketSense classifier directly into Zendesk, Salesforce, Freshdesk, or custom internal helpdesks. Test endpoints interactively or copy generated client snippets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint List & Request Builder */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Available REST Endpoints:
            </span>

            <div className="space-y-2">
              {endpoints.map((ep) => (
                <button
                  key={ep.path}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    selectedEndpoint === ep.path
                      ? 'bg-blue-950/40 border-blue-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      ep.method === 'POST' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-semibold">{ep.path}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">{ep.desc}</span>
                </button>
              ))}
            </div>

            {requestBody && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  JSON Request Payload:
                </label>
                <textarea
                  rows={6}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
            )}

            <button
              onClick={handleExecute}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending API Request...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Send API Request</span>
                </>
              )}
            </button>
          </div>

          {/* Swagger / OpenAPI Docs Link */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Interactive Swagger / OpenAPI UI:</span>
            <a
              href={`${backendUrl}/api/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium"
            >
              <span>Open /api/docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right: Live Response & Client Code Generator */}
        <div className="lg:col-span-6 space-y-4">
          {/* Live Response Box */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Live Server Response
              </span>
              <span className="text-[11px] font-mono text-slate-500">application/json</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[220px]">
              {responseOutput}
            </pre>
          </div>

          {/* Code Generator */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Client Code Integration
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['curl', 'python', 'javascript'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium transition ${
                      activeLang === lang ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
                {getCodeSnippet()}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                title="Copy code snippet"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
