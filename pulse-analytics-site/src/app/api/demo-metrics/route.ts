import { NextRequest, NextResponse } from "next/server";

interface MetricPoint {
  month: string;
  revenue: number;
  churn: number;
  mrr: number;
  newDeals: number;
  acv: number;
}

function generateSeries(months: number): MetricPoint[] {
  const labels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  let baseRevenue = 420_000;
  let baseChurn = 3.2;
  const series: MetricPoint[] = [];

  for (let i = 0; i < months; i++) {
    baseRevenue += Math.round((Math.random() * 20_000 + 5_000) * (1 + i * 0.02));
    baseChurn = Math.max(1.2, baseChurn + (Math.random() - 0.6) * 0.4);
    series.push({
      month: labels[i % 12],
      revenue: baseRevenue + Math.round((Math.random() - 0.5) * 40_000),
      churn: Math.round(baseChurn * 10) / 10,
      mrr: Math.round(baseRevenue / 12),
      newDeals: Math.max(0, Math.round(18 + (Math.random() - 0.3) * 10)),
      acv: Math.round(28_000 + Math.random() * 15_000),
    });
  }
  return series;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const range = searchParams.get("range") || "12m";

  const months = range === "3m" ? 3 : range === "6m" ? 6 : 12;
  const series = generateSeries(months);

  const summary = {
    totalRevenue: series.reduce((s, m) => s + m.revenue, 0),
    avgChurn: Math.round((series.reduce((s, m) => s + m.churn, 0) / series.length) * 10) / 10,
    avgMRR: Math.round(series.reduce((s, m) => s + m.mrr, 0) / series.length),
    totalDeals: series.reduce((s, m) => s + m.newDeals, 0),
    avgACV: Math.round(series.reduce((s, m) => s + m.acv, 0) / series.length),
  };

  return NextResponse.json({
    range,
    months,
    series,
    summary,
    generated: new Date().toISOString(),
  });
}