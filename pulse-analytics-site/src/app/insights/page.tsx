"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Upload,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  RefreshCw,
  Table,
  Zap,
} from "lucide-react";

type InsightCategory = "revenue" | "growth" | "risk" | "opportunity";

interface Insight {
  bullet: string;
  category: InsightCategory;
}

const categoryConfig: Record<InsightCategory, { label: string; color: string; icon: React.ElementType }> = {
  revenue: { label: "Revenue", color: "from-blue-500 to-cyan-500", icon: TrendingUp },
  growth: { label: "Growth", color: "from-emerald-500 to-teal-500", icon: TrendingUp },
  risk: { label: "Risk", color: "from-rose-500 to-pink-500", icon: AlertCircle },
  opportunity: { label: "Opportunity", color: "from-violet-500 to-purple-500", icon: Lightbulb },
};

const SAMPLE_CSV = `month,revenue,deals,winRate,churn,acv
Jan-25,420000,142,28,3.2,48500
Feb-25,445000,158,31,2.8,47200
Mar-25,510000,175,33,2.5,50100
Apr-25,478000,163,30,2.7,49300
May-25,545000,189,35,2.3,51500
Jun-25,590000,201,37,2.1,52800`;

export default function InsightsPage() {
  const [csvInput, setCsvInput] = useState("");
  const [metricsInput, setMetricsInput] = useState("");
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"csv" | "metrics">("csv");

  const analyze = useCallback(async () => {
    setLoading(true);
    setInsights([]);
    setSource(null);

    const body: Record<string, unknown> = {};

    if (inputMode === "csv" && csvInput.trim()) {
      body.csv = csvInput;
    } else if (inputMode === "metrics" && metricsInput.trim()) {
      try {
        body.metrics = JSON.parse(metricsInput);
      } catch {
        // Try numeric key-value pairs
        const pairs = metricsInput.split("\n").filter(Boolean);
        const parsed: Record<string, number> = {};
        for (const pair of pairs) {
          const [k, v] = pair.split(":").map((s) => s.trim());
          const num = parseFloat(v);
          if (k && !isNaN(num)) parsed[k] = num;
        }
        body.metrics = parsed;
      }
    }

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
      }
      if (data.source) setSource(data.source);
    } catch {
      // Fallback local insights
      setInsights([
        { bullet: "Unable to reach the insights API. Using local analysis.", category: "opportunity" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [csvInput, metricsInput, inputMode]);

  const loadSample = () => {
    setCsvInput(SAMPLE_CSV);
    setInputMode("csv");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4">
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">AI-Powered</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Revenue Insights
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste CSV data or structured metrics and get instant AI analysis.
            {source === "deterministic" && (
              <span className="block mt-1 text-xs text-amber-400/80">
                Running in offline mode — connect an OpenAI key for deeper AI insights.
              </span>
            )}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Input panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Input mode toggle */}
            <div className="glass-card p-1 flex rounded-xl">
              <button
                onClick={() => setInputMode("csv")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  inputMode === "csv"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText size={14} />
                CSV Data
              </button>
              <button
                onClick={() => setInputMode("metrics")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  inputMode === "metrics"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Table size={14} />
                Key:Value Metrics
              </button>
            </div>

            {/* CSV input */}
            <AnimatePresence mode="wait">
              {inputMode === "csv" ? (
                <motion.div
                  key="csv"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm text-muted-foreground">
                        Paste CSV data
                      </label>
                      <button
                        onClick={loadSample}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Zap size={11} />
                        Load sample
                      </button>
                    </div>
                    <textarea
                      value={csvInput}
                      onChange={(e) => setCsvInput(e.target.value)}
                      placeholder="month,revenue,deals,winRate,churn&#10;Jan-25,420000,142,28,3.2"
                      rows={12}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-all resize-none"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="metrics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="glass-card p-5">
                    <label className="text-sm text-muted-foreground mb-3 block">
                      Enter metrics (JSON or key:value per line)
                    </label>
                    <textarea
                      value={metricsInput}
                      onChange={(e) => setMetricsInput(e.target.value)}
                      placeholder='{"mrr": 420000, "churn": 3.2, "winRate": 28, "deals": 142}'
                      rows={8}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-all resize-none"
                    />
                    <div className="mt-3 text-[10px] text-muted-foreground/50">
                      Example line format: mrr: 420000
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze button */}
            <button
              onClick={analyze}
              disabled={loading || (!csvInput.trim() && !metricsInput.trim())}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Insights
                </>
              )}
            </button>

            {/* Data preview */}
            {csvInput.trim() && (
              <div className="glass-card p-4">
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <Table size={12} />
                  Data preview ({csvInput.split("\n").filter(Boolean).length} lines)
                </div>
                <pre className="text-[10px] font-mono text-muted-foreground/70 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-24">
                  {csvInput.split("\n").slice(0, 5).join("\n")}
                  {csvInput.split("\n").length > 5 && "\n..."}
                </pre>
              </div>
            )}
          </motion.div>

          {/* Results panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="glass-card p-6 min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  Analysis Results
                </h3>
                {source && (
                  <span className="text-[10px] text-muted-foreground/50 px-2 py-0.5 rounded glass">
                    {source}
                  </span>
                )}
              </div>

              <AnimatePresence mode="wait">
                {insights.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <Upload size={40} className="mx-auto text-muted-foreground/20 mb-4" />
                    <p className="text-sm text-muted-foreground/60">
                      Paste your data on the left and click Generate Insights
                    </p>
                    <button
                      onClick={loadSample}
                      className="mt-3 text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <Zap size={11} />
                      Try with sample data
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {insights.map((insight, i) => {
                      const cfg = categoryConfig[insight.category] || categoryConfig.opportunity;
                      const Icon = cfg.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass rounded-2xl p-5"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cfg.color} opacity-20 flex items-center justify-center shrink-0`}>
                              <Icon size={16} className="text-white" />
                            </div>
                            <div>
                              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r ${cfg.color} text-white mb-2`}>
                                {cfg.label}
                              </div>
                              <p className="text-sm leading-relaxed text-muted-foreground">
                                {insight.bullet}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Additional help */}
                    <div className="text-center pt-4">
                      <p className="text-xs text-muted-foreground/50">
                        Insights are generated server-side. Add an{" "}
                        <code className="text-primary/80">OPENAI_API_KEY</code> env var
                        for GPT-4o-mini powered analysis.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}