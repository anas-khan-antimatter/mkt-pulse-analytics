"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Brain,
  Code,
  BarChart3,
  Table,
  ArrowRight,
  Copy,
  Check,
  History,
  Eraser,
  Loader2,
} from "lucide-react";

// ── Mock dataset ─────────────────────────────────────────────────────

interface DataRow {
  month: string;
  deals: number;
  revenue: number;
  winRate: number;
  avgDealSize: number;
  acv: number;
  churn: number;
  repCount: number;
}

const sampleData: DataRow[] = [
  { month: "Jan-25", deals: 142, revenue: 420000, winRate: 28, avgDealSize: 12500, acv: 48500, churn: 3.2, repCount: 12 },
  { month: "Feb-25", deals: 158, revenue: 445000, winRate: 31, avgDealSize: 11800, acv: 47200, churn: 2.8, repCount: 13 },
  { month: "Mar-25", deals: 175, revenue: 510000, winRate: 33, avgDealSize: 13200, acv: 50100, churn: 2.5, repCount: 14 },
  { month: "Apr-25", deals: 163, revenue: 478000, winRate: 30, avgDealSize: 12800, acv: 49300, churn: 2.7, repCount: 14 },
  { month: "May-25", deals: 189, revenue: 545000, winRate: 35, avgDealSize: 14000, acv: 51500, churn: 2.3, repCount: 15 },
  { month: "Jun-25", deals: 201, revenue: 590000, winRate: 37, avgDealSize: 14500, acv: 52800, churn: 2.1, repCount: 16 },
  { month: "Jul-25", deals: 212, revenue: 625000, winRate: 36, avgDealSize: 14200, acv: 52000, churn: 2.0, repCount: 16 },
  { month: "Aug-25", deals: 225, revenue: 660000, winRate: 38, avgDealSize: 14800, acv: 53500, churn: 1.9, repCount: 17 },
  { month: "Sep-25", deals: 198, revenue: 580000, winRate: 34, avgDealSize: 13500, acv: 50500, churn: 2.2, repCount: 15 },
];

// ── Fake SQL-engine ──────────────────────────────────────────────────

type AggregateFn = "SUM" | "AVG" | "COUNT" | "MAX" | "MIN" | "MEDIAN";

const aggregateFns: AggregateFn[] = ["SUM", "AVG", "COUNT", "MAX", "MIN", "MEDIAN"];
const fieldNames = ["deals", "revenue", "winRate", "avgDealSize", "acv", "churn", "repCount"];

function evaluateQuery(
  aggregate: AggregateFn,
  field: string,
  groupBy: string | null
): { label: string; value: number | string }[] {
  const results: { label: string; value: number | string }[] = [];

  if (groupBy === "month") {
    for (const row of sampleData) {
      const vals = row[field as keyof DataRow] as number;
      results.push({
        label: row.month,
        value: formatValue(vals, field),
      });
    }
    return results;
  }

  const values = sampleData.map((r) => r[field as keyof DataRow] as number);

  if (!groupBy) {
    let result: number;
    switch (aggregate) {
      case "SUM":
        result = values.reduce((a, b) => a + b, 0);
        break;
      case "AVG":
        result = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
        break;
      case "COUNT":
        result = values.length;
        break;
      case "MAX":
        result = Math.max(...values);
        break;
      case "MIN":
        result = Math.min(...values);
        break;
      case "MEDIAN": {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        result = sorted.length % 2 === 0
          ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
          : sorted[mid];
        break;
      }
      default:
        result = 0;
    }
    return [{ label: "Result", value: formatValue(result, field) }];
  }

  // Group by simulated category
  const halves = Math.ceil(sampleData.length / 2);
  const firstHalf = values.slice(0, halves);
  const secondHalf = values.slice(halves);
  const groups = [firstHalf, secondHalf];
  const labels = groupBy === "month" ? [] : ["H1", "H2"];

  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    let result: number;
    switch (aggregate) {
      case "SUM":
        result = g.reduce((a, b) => a + b, 0);
        break;
      case "AVG":
        result = Math.round(g.reduce((a, b) => a + b, 0) / g.length);
        break;
      case "COUNT":
        result = g.length;
        break;
      case "MAX":
        result = Math.max(...g);
        break;
      case "MIN":
        result = Math.min(...g);
        break;
      case "MEDIAN": {
        const sorted = [...g].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        result = sorted.length % 2 === 0
          ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
          : sorted[mid];
        break;
      }
      default:
        result = 0;
    }
    results.push({ label: labels[i] || `Group ${i + 1}`, value: formatValue(result, field) });
  }

  return results;
}

function formatValue(val: number, field: string): string {
  if (field === "revenue" || field === "avgDealSize" || field === "acv") {
    return `$${val.toLocaleString()}`;
  }
  if (field === "winRate" || field === "churn") {
    return `${val}%`;
  }
  return val.toLocaleString();
}

// ── Suggested queries ────────────────────────────────────────────────

const suggestions = [
  { label: "Total revenue", agg: "SUM" as AggregateFn, field: "revenue", group: null },
  { label: "Avg. win rate", agg: "AVG" as AggregateFn, field: "winRate", group: null },
  { label: "Max deals / month", agg: "MAX" as AggregateFn, field: "deals", group: null },
  { label: "Revenue by month", agg: "SUM" as AggregateFn, field: "revenue", group: "month" },
  { label: "Median deal ACV", agg: "MEDIAN" as AggregateFn, field: "acv", group: null },
  { label: "H1 vs H2 revenue", agg: "SUM" as AggregateFn, field: "revenue", group: "half" },
];

// ── Component ────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [aggregate, setAggregate] = useState<AggregateFn>("SUM");
  const [field, setField] = useState("revenue");
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [showSQL, setShowSQL] = useState(false);
  const [history, setHistory] = useState<{ agg: AggregateFn; field: string; group: string | null }[]>([]);
  const [copied, setCopied] = useState(false);

  const results = useMemo(
    () => evaluateQuery(aggregate, field, groupBy),
    [aggregate, field, groupBy]
  );

  const sqlStatement = useMemo(() => {
    const agg = aggregate === "MEDIAN" ? `PERCENTILE_CONT(0.5)` : `${aggregate}(${field})`;
    const from = "FROM pulse.metrics";
    const group = groupBy ? `GROUP BY ${groupBy}` : "";
    return `SELECT ${agg} AS result\n${from}\n${group}`.trim();
  }, [aggregate, field, groupBy]);

  const runQuery = useCallback(
    (agg: AggregateFn, fld: string, grp: string | null) => {
      setAggregate(agg);
      setField(fld);
      setGroupBy(grp);
      setHistory((prev) => [{ agg, field: fld, group: grp }, ...prev.slice(0, 9)]);
    },
    []
  );

  const copySQL = () => {
    navigator.clipboard.writeText(sqlStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
            <Brain size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">
              Metric Playground
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Build your metric
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select an aggregation, field, and optional group to query our sample
            revenue dataset. See the result instantly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Controls panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-5"
          >
            {/* Aggregate */}
            <div className="glass-card p-5">
              <label className="text-xs text-muted-foreground font-medium mb-2 block">
                Aggregate Function
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {aggregateFns.map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setAggregate(fn)}
                    className={`py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                      aggregate === fn
                        ? "bg-primary text-primary-foreground"
                        : "glass text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {fn}
                  </button>
                ))}
              </div>
            </div>

            {/* Field */}
            <div className="glass-card p-5">
              <label className="text-xs text-muted-foreground font-medium mb-2 block">
                Field
              </label>
              <div className="space-y-1">
                {fieldNames.map((f) => (
                  <button
                    key={f}
                    onClick={() => setField(f)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                      field === f
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                    }`}
                  >
                    {f}
                    <span className="ml-2 text-[10px] text-muted-foreground/50">
                      {f === "deals" ? "integer" : f === "revenue" || f === "avgDealSize" || f === "acv" ? "currency" : "percentage"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group by */}
            <div className="glass-card p-5">
              <label className="text-xs text-muted-foreground font-medium mb-2 block">
                Group By
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGroupBy(null)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    groupBy === null
                      ? "bg-primary text-primary-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  None
                </button>
                <button
                  onClick={() => setGroupBy("month")}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    groupBy === "month"
                      ? "bg-primary text-primary-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setGroupBy("half")}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    groupBy === "half"
                      ? "bg-primary text-primary-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Half
                </button>
              </div>
            </div>

            {/* SQL toggle */}
            <button
              onClick={() => setShowSQL(!showSQL)}
              className="w-full glass-card p-4 flex items-center justify-between text-sm hover:bg-white/[0.06] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Code size={14} className="text-primary" />
                Show generated SQL
              </span>
              <ArrowRight
                size={14}
                className={`transition-transform ${showSQL ? "rotate-90" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showSQL && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      SQL Statement
                    </span>
                    <button
                      onClick={copySQL}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-primary/80 leading-relaxed whitespace-pre-wrap">
                    {sqlStatement}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Active query */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Play size={14} className="text-green-400" />
                    <span className="text-sm font-semibold">
                      {aggregate}({field}){groupBy ? ` grouped by ${groupBy}` : ""}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Query executed on {sampleData.length} data points
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/[0.04] px-2 py-1 rounded-md">
                  <BarChart3 size={12} />
                  {results.length} result{results.length > 1 ? "s" : ""}
                </div>
              </div>

              {/* Results display */}
              <div className="space-y-3">
                {results.map((r, i) => (
                  <motion.div
                    key={`${r.label}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl p-4 flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">{r.label}</span>
                    <span className="text-2xl font-bold tabular-nums gradient-text">
                      {r.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Data preview table */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Table size={14} className="text-primary" />
                  <span className="text-sm font-medium">Sample Data</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  pulse.metrics — {sampleData.length} rows
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-muted-foreground/60 border-b border-white/[0.06]">
                      <th className="text-left py-2 pr-3 font-medium">month</th>
                      <th className="text-right px-2 font-medium">deals</th>
                      <th className="text-right px-2 font-medium">revenue</th>
                      <th className="text-right px-2 font-medium">winRate</th>
                      <th className="text-right px-2 font-medium">avgDealSize</th>
                      <th className="text-right px-2 font-medium">acv</th>
                      <th className="text-right px-2 font-medium">churn</th>
                      <th className="text-right pl-2 font-medium">repCount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((row) => (
                      <tr
                        key={row.month}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-2 pr-3 text-muted-foreground">{row.month}</td>
                        <td className="text-right px-2 font-mono tabular-nums">{row.deals}</td>
                        <td className="text-right px-2 font-mono tabular-nums">
                          ${row.revenue.toLocaleString()}
                        </td>
                        <td className="text-right px-2 font-mono tabular-nums">{row.winRate}%</td>
                        <td className="text-right px-2 font-mono tabular-nums">
                          ${row.avgDealSize.toLocaleString()}
                        </td>
                        <td className="text-right px-2 font-mono tabular-nums">
                          ${row.acv.toLocaleString()}
                        </td>
                        <td className="text-right px-2 font-mono tabular-nums">{row.churn}%</td>
                        <td className="text-right pl-2 font-mono tabular-nums">{row.repCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Suggested queries */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <History size={14} className="text-primary" />
                <span className="text-sm font-medium">Quick Metrics</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => runQuery(s.agg, s.field, s.group)}
                    className={`glass px-3 py-1.5 rounded-full text-xs transition-all hover:bg-white/[0.06] ${
                      aggregate === s.agg && field === s.field && groupBy === s.group
                        ? "ring-1 ring-primary/30"
                        : ""
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <History size={12} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">History</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {history.map((h, i) => (
                      <button
                        key={`${h.agg}-${h.field}-${h.group}-${i}`}
                        onClick={() => runQuery(h.agg, h.field, h.group)}
                        className="text-[10px] px-2 py-1 rounded glass text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {h.agg}({h.field})
                        {h.group ? ` by ${h.group}` : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}