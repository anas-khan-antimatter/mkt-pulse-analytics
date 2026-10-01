"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";

// ── Local fallback data generators (used when API is unreachable) ─────

function generateMonthlyData(months: number, base: number, variance: number) {
  const monthsArr = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return Array.from({ length: months }, (_, i) => ({
    month: monthsArr[i % 12],
    value: Math.round(base + (Math.random() - 0.5) * variance * 2),
  }));
}

const kpis = [
  {
    label: "Annual Recurring Revenue",
    value: "$5.7M",
    change: "+22%",
    up: true,
    icon: DollarSign,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    label: "Net Revenue Retention",
    value: "118%",
    change: "+5pp",
    up: true,
    icon: Activity,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    label: "Active Subscribers",
    value: "2,847",
    change: "+341",
    up: true,
    icon: Users,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    label: "Monthly Churn Rate",
    value: "2.1%",
    change: "-0.4pp",
    up: false,
    icon: TrendingDown,
    gradient: "from-rose-500 to-pink-500",
  },
];

// ── Chart components ─────────────────────────────────────────────────

function BarChart({
  data,
  color = "oklch(0.65 0.18 250)",
  height = 200,
}: {
  data: { month: string; value: number }[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value));
  const pad = 20;
  const w = 600;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={0}
          y1={pad + (height - pad * 2) * (1 - f)}
          x2={w}
          y2={pad + (height - pad * 2) * (1 - f)}
          stroke="oklch(0.25 0.05 264 / 0.4)"
          strokeWidth={0.5}
        />
      ))}
      {/* Bars */}
      {data.map((d, i) => {
        const barW = (w - pad * 2) / data.length * 0.7;
        const gap = (w - pad * 2) / data.length;
        const x = pad + i * gap + gap * 0.15;
        const h = ((d.value - Math.min(...data.map((dd) => dd.value))) / (max - Math.min(...data.map((dd) => dd.value)) || 1)) * (height - pad * 2);
        const y = height - pad - h;
        return (
          <motion.rect
            key={d.month + i}
            x={x}
            y={height - pad}
            width={barW}
            height={0}
            fill={color}
            rx={4}
            initial={{ height: 0, y: height - pad }}
            animate={{ height: h, y }}
            transition={{ duration: 0.6, delay: i * 0.03, ease: "easeOut" }}
          />
        );
      })}
      {/* X-axis labels */}
      {data.map((d, i) => {
        const gap = (w - pad * 2) / data.length;
        const x = pad + i * gap + gap / 2;
        return (
          <text
            key={d.month + i}
            x={x}
            y={height - 4}
            textAnchor="middle"
            fill="oklch(0.65 0.03 264)"
            fontSize={9}
          >
            {d.month}
          </text>
        );
      })}
    </svg>
  );
}

function LineChart({
  data,
  color = "oklch(0.55 0.15 200)",
  height = 200,
}: {
  data: { month: string; value: number }[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const pad = 20;
  const w = 600;

  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (height - pad * 2) * (1 - (d.value - min) / range);
    return `${x},${y}`;
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M${p}` : `L${p}`))
    .join(" ");

  const areaD = `${pathD} L${w - pad},${height - pad} L${pad},${height - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={0}
          y1={pad + (height - pad * 2) * (1 - f)}
          x2={w}
          y2={pad + (height - pad * 2) * (1 - f)}
          stroke="oklch(0.25 0.05 264 / 0.4)"
          strokeWidth={0.5}
        />
      ))}
      {/* Area fill */}
      <motion.path
        d={areaD}
        fill={`url(#grad-${color.replace(/\W/g, "")})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.8 }}
      />
      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* Dots */}
      {data.map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = pad + (height - pad * 2) * (1 - (d.value - min) / range);
        return (
          <motion.circle
            key={d.month + i}
            cx={x}
            cy={y}
            r={3}
            fill={color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + i * 0.03 }}
          />
        );
      })}
      {/* X labels */}
      {data.filter((_, i) => i % 2 === 0).map((d, i) => {
        const idx = data.findIndex((dd) => dd.month === d.month && dd.value === d.value);
        const x = pad + (idx / (data.length - 1)) * (w - pad * 2);
        return (
          <text
            key={d.month + i}
            x={x}
            y={height - 4}
            textAnchor="middle"
            fill="oklch(0.65 0.03 264)"
            fontSize={9}
          >
            {d.month}
          </text>
        );
      })}
      <defs>
        <linearGradient id={`grad-${color.replace(/\W/g, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Main component ───────────────────────────────────────────────────

export default function DemoPage() {
  const [timeRange, setTimeRange] = useState("12m");
  const [selectedKpi, setSelectedKpi] = useState(kpis[0]);
  const [arrData, setArrData] = useState(() => generateMonthlyData(12, 480000, 80000));
  const [churnData, setChurnData] = useState(() => generateMonthlyData(12, 32000, 8000));
  const [mrrData, setMrrData] = useState(() => generateMonthlyData(12, 420000, 40000));
  const [dataSource, setDataSource] = useState<"local" | "api">("local");
  const [loading, setLoading] = useState(false);

  // ── Fetch data from API with fallback ───────────────────────────────
  const fetchMetrics = useCallback(async (range: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/demo-metrics?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        const months = json.months ?? [];
        if (months.length > 0) {
          const newArr = months.map((m: { month: string; revenue: number }) => ({
            month: m.month,
            value: m.revenue,
          }));
          const newChurn = months.map((m: { month: string; churn: number }) => ({
            month: m.month,
            value: Math.round(m.churn * 10000),
          }));
          const newMrr = months.map((m: { month: string; mrr: number }) => ({
            month: m.month,
            value: m.mrr,
          }));
          setArrData(newArr);
          setChurnData(newChurn);
          setMrrData(newMrr);
          setDataSource("api");
          setLoading(false);
          return;
        }
      }
    } catch {
      // API unreachable — fall through to local
    }
    // Local fallback
    const count = range === "3m" ? 3 : range === "6m" ? 6 : 12;
    setArrData(generateMonthlyData(count, 480000, 80000));
    setChurnData(generateMonthlyData(count, 32000, 8000));
    setMrrData(generateMonthlyData(count, 420000, 40000));
    setDataSource("local");
    setLoading(false);
  }, []);

  // Initial load on component mount
  useEffect(() => {
    fetchMetrics(timeRange);
  }, [fetchMetrics, timeRange]);

  // Restore timeRange setter to also fetch
  const onTimeRangeChange = useCallback((range: string) => {
    setTimeRange(range);
    fetchMetrics(range);
  }, [fetchMetrics]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      {/* Sticky header */}
      <div className="sticky top-16 z-30 glass border-b border-white/[0.06] px-6 lg:px-8 py-3 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Interactive Dashboard</h1>
              <p className="text-[10px] text-muted-foreground">
                Mock data · Real-time viz
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex glass rounded-lg p-0.5">
              {["3m", "6m", "12m"].map((r) => (
                <button
                  key={r}
                  onClick={() => onTimeRangeChange(r)}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    timeRange === r
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="p-2 glass rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <Download size={14} />
            </button>
            <button className="p-2 glass rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <motion.button
                key={kpi.label}
                onClick={() => setSelectedKpi(kpi)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-5 text-left transition-all duration-200 ${
                  selectedKpi.label === kpi.label
                    ? "ring-1 ring-primary/50"
                    : "hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.gradient} opacity-20 flex items-center justify-center`}
                  >
                    <Icon size={16} className="text-white" />
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      kpi.up ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {kpi.up ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {kpi.change}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-0.5">{kpi.value}</div>
                <div className="text-xs text-muted-foreground">{kpi.label}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Chart row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* ARR chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold">Monthly Recurring Revenue</h3>
                <p className="text-xs text-muted-foreground">ARR trend over time</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.65_0.18_250)]" />
                <span className="text-[10px] text-muted-foreground">MRR</span>
              </div>
            </div>
            <div className="h-[220px]">
              <BarChart data={mrrData} />
            </div>
          </motion.div>

          {/* Churn chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold">Churn & Contraction</h3>
                <p className="text-xs text-muted-foreground">Monthly churn trend</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.55_0.15_200)]" />
                <span className="text-[10px] text-muted-foreground">Churn $</span>
              </div>
            </div>
            <div className="h-[220px]">
              <LineChart data={churnData} color="oklch(0.6 0.15 300)" />
            </div>
          </motion.div>
        </div>

        {/* Full-width ARR chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold">Annual Recurring Revenue</h3>
              <p className="text-xs text-muted-foreground">ARR by month with projection</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.65_0.18_250)]" />
                <span className="text-[10px] text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.55_0.15_200)]" />
                <span className="text-[10px] text-muted-foreground">Projected</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <BarChart data={arrData} color="oklch(0.65 0.18 250)" />
          </div>
        </motion.div>

        {/* Bottom metrics row */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: "Avg. Contract Value",
              value: "$42,500",
              sub: "Across all segments",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              label: "Avg. Days to Close",
              value: "18 days",
              sub: "Down from 24 days",
              gradient: "from-violet-500 to-purple-500",
            },
            {
              label: "Pipeline Coverage",
              value: "3.2x",
              sub: "Weighted pipeline / quota",
              gradient: "from-emerald-500 to-teal-500",
            },
          ].map((m) => (
            <div key={m.label} className="glass rounded-xl p-4">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${m.gradient} opacity-20 flex items-center justify-center mb-2`}>
                <Activity size={14} className="text-white" />
              </div>
              <div className="text-lg font-bold">{m.value}</div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}