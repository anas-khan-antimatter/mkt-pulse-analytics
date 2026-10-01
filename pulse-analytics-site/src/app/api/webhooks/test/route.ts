import { NextRequest, NextResponse } from "next/server";

interface WebhookEvent {
  id: string;
  event: string;
  payload: Record<string, unknown>;
  received: string;
  source: string;
}

// In-memory event store (resets on server restart)
const eventLog: WebhookEvent[] = [];
const MAX_LOG = 50;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, payload, source } = body as {
      event?: string;
      payload?: Record<string, unknown>;
      source?: string;
    };

    const webhookEvent: WebhookEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      event: event || "test.ping",
      payload: payload || { message: "No payload" },
      received: new Date().toISOString(),
      source: source || "webhook-simulator",
    };

    eventLog.unshift(webhookEvent);
    if (eventLog.length > MAX_LOG) eventLog.pop();

    return NextResponse.json({
      ok: true,
      received: webhookEvent,
      queueDepth: eventLog.length,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    events: eventLog.slice(0, 20),
    total: eventLog.length,
    instructions: "POST a JSON body with { event, payload, source } to simulate a webhook.",
  });
}