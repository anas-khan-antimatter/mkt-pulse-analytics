import { NextRequest, NextResponse } from "next/server";

interface WebhookEvent {
  event: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

// In-memory event store (resets per server instance)
const receivedEvents: WebhookEvent[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const event: WebhookEvent = {
      event: (body.event as string) ?? "test.ping",
      timestamp: new Date().toISOString(),
      payload: (body.payload as Record<string, unknown>) ?? body,
    };

    receivedEvents.unshift(event);
    // Keep last 50
    if (receivedEvents.length > 50) receivedEvents.length = 50;

    return NextResponse.json({
      ok: true,
      received: event,
      queueDepth: receivedEvents.length,
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
    endpoint: "/api/webhooks/test",
    events: receivedEvents.slice(0, 20),
    total: receivedEvents.length,
    instructions:
      "POST a JSON body with event (string) and payload (object) to simulate a webhook call.",
  });
}