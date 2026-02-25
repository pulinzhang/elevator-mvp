interface ConfigItem {
  key: string;
  value: string;
}

// In-memory mock data for local development
const mockConfig: ConfigItem[] = [
  { key: "default_margin", value: "20" },
];

export async function GET(request: Request, env: any) {
  const useMock = env.USE_MOCK_DATA === "true";

  try {
    if (useMock) {
      return new Response(JSON.stringify(mockConfig), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await env.DB.prepare("SELECT key, value FROM system_config").all();
    const configs = result.results || [];
    return new Response(JSON.stringify(configs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Config GET error:", error);
    return new Response(JSON.stringify(mockConfig), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request, env: any) {
  const useMock = env.USE_MOCK_DATA === "true";
  const body = await request.json();
  const { key, value } = body;

  if (!key || !value) {
    return new Response(JSON.stringify({ error: "Missing key or value" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (useMock) {
      const existing = mockConfig.find((c) => c.key === key);
      if (existing) {
        existing.value = value;
      } else {
        mockConfig.push({ key, value });
      }
      return new Response(JSON.stringify({ success: true, key, value }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      "INSERT INTO system_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?"
    )
      .bind(key, value, value)
      .run();

    return new Response(JSON.stringify({ success: true, key, value }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Config POST error:", error);
    return new Response(JSON.stringify({ error: "Failed to update config" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

