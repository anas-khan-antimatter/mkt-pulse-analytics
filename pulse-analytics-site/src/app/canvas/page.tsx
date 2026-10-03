"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
} from "lucide-react";

/* ── Canvas-based interactive dashboard ──────────────────────────────
   Pure canvas chart rendering with data-range toggle and live metrics.
   No external charting library — hand-drawn SVG + canvas hybrid.
*/

function generateCanvasData(months: number) {
  const labels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const data: { label: string; value: number; prev: number }[] = [];
  let val = 400_000;
  for (let i = 0; i < months; i++) {
    const prev = val;
    val += Math.round((Math.random() * 25_000 + 2_000) * (1 + i * 0.015));
    data.push({
      label: labels[i % 12],
      value: val + Math.round((Math.random() - 0.5) * 30_000),
      prev,
    });
  }
  return data;
}

const KPI_BASE = {
  arr: 5_700_000,
  nrr: 118,
  subs: 2847,
  churn: 2.1,
};

function drawCanvasBarChart(
  canvas: HTMLCanvasElement | null,
  data: { label: string; value: number }[],
  color: string,
) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = (canvas.width = canvas.clientWidth * dpr);
  const h = (canvas.height = canvas.clientHeight * dpr);
  ctx.scale(dpr, dpr);
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;

  ctx.clearRect(0, 0, cw, ch);

  const pad = { t: 20, b: 30, l: 40, r: 20 };
  const chartW = cw - pad.l - pad.r;
  const chartH = ch - pad.t - pad.b;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const barW = chartW / data.length * 0.6;
  const gap = chartW / data.length;

  // Grid
  ctx.strokeStyle = "oklch(0.25 0.05 264 / 0.3)";
  ctx.lineWidth = 0.5;
  for (let f = 0; f <= 1; f += 0.25) {
    const y = pad.t + chartH * (1 - f);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(cw - pad.r, y);
    ctx.stroke();
    ctx.fillStyle = "oklch(0.5 0.03 264 / 0.5)";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(formatValue(min + range * f), pad.l - 4, y + 3);
  }

  // Bars
  data.forEach((d, i) => {
    const x = pad.l + i * gap + gap * 0.2;
    const barH = ((d.value - min) / range) * chartH;
    const y = pad.t + chartH - barH;

    const gradient = ctx.createLinearGradient(x, y, x, pad.t + chartH);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color.replace(")", " / 0.3)"));
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 3);
    ctx.fill();

    // Label
    ctx.fillStyle = "oklch(0.5 0.03 264 / 0.6)";
    ctx.font = "8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.label, x + barW / 2, ch - pad.b + 12);
  });
}

/* ── Canvas chart wrapper component ─────────────────────────────────── */

import { useEffect, useRef } from "react";

function CanvasBarChart({
  data,
  color = "oklch(0.65 0.18 250)",
}: {
  data: { label: string; value: number }[];
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    drawCanvasBarChart(canvasRef.current, data, color);
    const handler = () => drawCanvasBarChart(canvasRef.current, data, color);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [data, color]);
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-56 rounded-xl"
      style={{ height: "14rem" }}
    />
  );
}

function formatValue(v: number): string {
  if (v >= 1_000_000) return `$${Math.round(v / 1_000_000)}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${Math.round(v)}`;
}

/* ── Page export ───────────────────────────────────────────────────── */

export default function CanvasPage() {
  const [range, setRange] = useState("12m");
  const [data, setData] = useState(() => generateCanvasData(12));

  const months = range === "3m" ? 3 : range === "6m" ? 6 : 12;

  const kpis = [
    {
      label: "ARR",
      value: formatValue(KPI_BASE.arr),
      change: "+22%",
      up: true,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "NRR",
      value: `${KPI_BASE.nrr}%`,
      change: "+5pp",
      up: true,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      label: "Subscribers",
      value: KPI_BASE.subs.toLocaleString(),
      change: `+${Math.round(KPI_BASE.subs * 0.12)}`,
      up: true,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Churn",
      value: `${KPI_BASE.churn}%`,
      change: "-0.4pp",
      up: false,
      gradient: "from-rose-500 to-pink-500",
    },
  ];

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
              <h1 className="text-sm font-semibold">Canvas Dashboard</h1>
              <p className="text-[10px] text-muted-foreground">
                Canvas-rendered charts · {months}mo view
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex glass rounded-lg p-0.5">
              {["3m", "6m", "12m"].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRange(r);
                    setData(generateCanvasData(months));
                  }}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    range === r
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.gradient} opacity-20 flex items-center justify-center`}
                >
                  {kpi.label === "ARR" || kpi.label === "NRR"
                    ? <Activity size={16} className="text-white" />
                    : kpi.label === "Subscribers"
                    ? <DollarSign size={16} className="text-white" />
                    : <TrendingDown size={16} className="text-white" />}
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    kpi.up ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold mb-0.5">{kpi.value}</div>
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Canvas chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold">Revenue Trend (Canvas)</h3>
              <p className="text-xs text-muted-foreground">
                Native canvas rendering — no chart library
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.65_0.18_250)]" />
              <span className="text-[10px] text-muted-foreground">Revenue</span>
            </div>
          </div>
          <CanvasBarChart data={data} />
        </motion.div>

        {/* Data table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 overflow-x-auto"
        >
          <h3 className="text-sm font-semibold mb-3">Raw Series</h3>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-muted-foreground">
                <th className="py-2 px-3">Month</th>
                <th className="py-2 px-3">Revenue</th>
                <th className="py-2 px-3">Prev. Period</th>
                <th className="py-2 px-3">Change</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr
                  key={d.label}
                  className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                >
                  <td className="py-2 px-3 font-medium">{d.label}</td>
                  <td className="py-2 px-3">{formatValue(d.value)}</td>
                  <td className="py-2 px-3">{formatValue(d.prev)}</td>
                  <td
                    className={`py-2 px-3 ${
                      d.value >= d.prev ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {d.value >= d.prev ? "+" : ""}
                    {((d.value - d.prev) / d.prev * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}