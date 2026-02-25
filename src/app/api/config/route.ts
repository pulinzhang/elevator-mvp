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
      return Response.json(mockConfig);
    }

    const result = await env.DB.prepare("SELECT key, value FROM system_config").all();
    const configs = result.results || [];
    return Response.json(configs);
  } catch (error) {
    console.error("Config GET error:", error);
    return Response.json(mockConfig, { status: 200 });
  }
}

export async function POST(request: Request, env: any) {
  const useMock = env.USE_MOCK_DATA === "true";
  const body = await request.json();
  const { key, value } = body;

  if (!key || !value) {
    return Response.json({ error: "Missing key or value" }, { status: 400 });
  }

  try {
    if (useMock) {
      const existing = mockConfig.find((c) => c.key === key);
      if (existing) {
        existing.value = value;
      } else {
        mockConfig.push({ key, value });
      }
      return Response.json({ success: true, key, value });
    }

    await env.DB.prepare(
      "INSERT INTO system_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?"
    )
      .bind(key, value, value)
      .run();

    return Response.json({ success: true, key, value });
  } catch (error) {
    console.error("Config POST error:", error);
    return Response.json({ error: "Failed to update config" }, { status: 500 });
  }
}

