"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Send,
  Terminal,
} from "lucide-react";

export default function TestPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("/api/webhooks/test");
  const [body, setBody] = useState(
    JSON.stringify(
      {
        event: "deal.won",
        payload: {
          dealId: "deal_001",
          amount: 42000,
          company: "Acme Corp",
          rep: "Jane Doe",
        },
        source: "webhook-simulator",
      },
      null,
      2,
    ),
  );
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendRequest() {
    setLoading(true);
    setResponse("");
    setStatus(null);
    try {
      const opts: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (method === "POST" || method === "PUT" || method === "PATCH") {
        opts.body = body;
      }
      const res = await fetch(url, opts);
      setStatus(res.status);
      const text = await res.text();
      try {
        setResponse(JSON.stringify(JSON.parse(text), null, 2));
      } catch {
        setResponse(text);
      }
    } catch (err) {
      setStatus(0);
      setResponse(`Network error: ${err instanceof Error ? err.message : err}`);
    } finally {
      setLoading(false);
    }
  }

  async function sendSampleWebhook() {
    // Fire a sample deal.won event to /api/webhooks/test
    const events = [
      {
        event: "deal.won",
        payload: {
          dealId: `deal_${Math.random().toString(36).slice(2, 6)}`,
          amount: Math.round(20000 + Math.random() * 60000),
          company: ["Acme Corp", "Globex Inc", "Initech", "Umbrella Co"][
            Math.floor(Math.random() * 4)
          ],
          rep: ["Jane Doe", "John Smith", "Alice Lee", "Bob Chen"][
            Math.floor(Math.random() * 4)
          ],
        },
        source: "webhook-simulator",
      },
      {
        event: "pipeline.stage_change",
        payload: {
          dealId: `deal_${Math.random().toString(36).slice(2, 6)}`,
          from: "demo",
          to: "proposal",
          amount: Math.round(30000 + Math.random() * 80000),
        },
        source: "webhook-simulator",
      },
      {
        event: "forecast.updated",
        payload: {
          quarter: "Q4",
          previousForecast: 1200000,
          newForecast: 1350000,
          reason: "New enterprise pipeline added",
        },
        source: "webhook-simulator",
      },
      {
        event: "account.at_risk",
        payload: {
          accountId: `acc_${Math.random().toString(36).slice(2, 6)}`,
          company: ["RiskCo", "Churn Inc", "Dormant Ltd"][
            Math.floor(Math.random() * 3)
          ],
          riskScore: Math.round(60 + Math.random() * 35),
          daysSinceLogin: Math.round(30 + Math.random() * 60),
          action: "schedule QBR",
        },
        source: "webhook-simulator",
      },
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    setMethod("POST");
    setUrl("/api/webhooks/test");
    setBody(JSON.stringify(event, null, 2));
    // Auto-send after a short delay
    setTimeout(() => sendRequest(), 100);
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4">
            <Terminal size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">API Playground</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Test API Endpoints
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Send requests to Pulse Analytics API routes and inspect responses.
            Use the sample webhook button to simulate a live event.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={sendSampleWebhook}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-xs font-medium text-primary hover:bg-primary/30 transition-all"
          >
            <Activity size={12} />
            Send Sample Webhook
          </button>
          <button
            onClick={() => {
              setMethod("GET");
              setUrl("/api/demo-metrics?range=6m");
              setTimeout(() => sendRequest(), 100);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
          >
            <RefreshCw size={12} />
            Fetch Demo Metrics
          </button>
          <button
            onClick={() => {
              setMethod("GET");
              setUrl("/api/webhooks/test");
              setTimeout(() => sendRequest(), 100);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
          >
            <RefreshCw size={12} />
            Get Webhook Log
          </button>
        </div>

        {/* Request builder */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold mb-4">Request</h3>

            <div className="flex items-center gap-3 mb-4">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="h-9 px-3 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-foreground focus:outline-none"
              >
                {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50"
                placeholder="/api/endpoint"
              />
            </div>

            <label className="text-xs text-muted-foreground block mb-2">
              Request Body (JSON)
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-40 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-foreground font-mono focus:outline-none focus:border-primary/50 resize-none"
              spellCheck={false}
            />

            <button
              onClick={sendRequest}
              disabled={loading}
              className="mt-4 w-full h-10 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-40"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send size={15} />
              )}
              {loading ? "Sending..." : "Send Request"}
            </button>
          </motion.div>

          {/* Response */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Response</h3>
              {status && (
                <div className="flex items-center gap-1.5">
                  {status >= 200 && status < 300 ? (
                    <CheckCircle size={14} className="text-green-400" />
                  ) : (
                    <XCircle size={14} className="text-red-400" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      status >= 200 && status < 300
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              )}
            </div>
            <pre className="w-full min-h-60 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-foreground font-mono overflow-auto whitespace-pre-wrap">
              {response || "Send a request to see the response here..."}
            </pre>
          </motion.div>
        </div>
      </div>
    </div>
  );
}