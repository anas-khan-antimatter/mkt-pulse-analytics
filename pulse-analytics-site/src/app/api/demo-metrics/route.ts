import { NextRequest, NextResponse } from "next/server";

// ── Shared mock dataset ─────────────────────────────────────────────

interface MonthData {
  month: string;
  mrr: number;
  churn: number;
  deals: number;
  revenue: number;
  winRate: number;
  avgDealSize: number;
  acv: number;
  repCount: number;
}

const monthlyData: MonthData[] = [
  { month: "Jan", mrr: 382000, churn: 3.2, deals: 142, revenue: 420000, winRate: 28, avgDealSize: 12500, acv: 48500, repCount: 12 },
  { month: "Feb", mrr: 396000, churn: 2.8, deals: 158, revenue: 445000, winRate: 31, avgDealSize: 11800, acv: 47200, repCount: 13 },
  { month: "Mar", mrr: 418000, churn: 2.5, deals: 175, revenue: 510000, winRate: 33, avgDealSize: 13200, acv: 50100, repCount: 14 },
  { month: "Apr", mrr: 435000, churn: 2.7, deals: 163, revenue: 478000, winRate: 30, avgDealSize: 12800, acv: 49300, repCount: 14 },
  { month: "May", mrr: 462000, churn: 2.3, deals: 189, revenue: 545000, winRate: 35, avgDealSize: 14000, acv: 51500, repCount: 15 },
  { month: "Jun", mrr: 478000, churn: 2.1, deals: 201, revenue: 590000, winRate: 37, avgDealSize: 14500, acv: 52800, repCount: 16 },
  { month: "Jul", mrr: 501000, churn: 2.0, deals: 212, revenue: 625000, winRate: 36, avgDealSize: 14200, acv: 52000, repCount: 16 },
  { month: "Aug", mrr: 523000, churn: 1.9, deals: 225, revenue: 660000, winRate: 38, avgDealSize: 14800, acv: 53500, repCount: 17 },
  { month: "Sep", mrr: 540000, churn: 2.2, deals: 198, revenue: 580000, winRate: 34, avgDealSize: 13500, acv: 50500, repCount: 15 },
  { month: "Oct", mrr: 558000, churn: 2.0, deals: 215, revenue: 610000, winRate: 36, avgDealSize: 14100, acv: 51500, repCount: 16 },
  { month: "Nov", mrr: 575000, churn: 1.8, deals: 230, revenue: 650000, winRate: 39, avgDealSize: 14900, acv: 54000, repCount: 17 },
  { month: "Dec", mrr: 590000, churn: 1.7, deals: 240, revenue: 685000, winRate: 40, avgDealSize: 15200, acv: 55000, repCount: 18 },
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const range = searchParams.get("range") ?? "12m";

  let count: number;
  switch (range) {
    case "3m":  count = 3;  break;
    case "6m":  count = 6;  break;
    default:    count = 12; break;
  }

  const data = monthlyData.slice(0, count);

  const arr = data.reduce((s, d) => s + d.revenue, 0);
  const mrr = data[data.length - 1]?.mrr ?? 0;
  const avgChurn = data.reduce((s, d, _, a) => s + d.churn / a.length, 0);
  const totalDeals = data.reduce((s, d) => s + d.deals, 0);
  const avgWinRate = data.reduce((s, d, _, a) => s + d.winRate / a.length, 0);

  return NextResponse.json({
    range,
    months: data,
    summary: {
      arr,
      mrr,
      avgChurn: Math.round(avgChurn * 10) / 10,
      totalDeals,
      avgWinRate: Math.round(avgWinRate * 10) / 10,
    },
  });
}