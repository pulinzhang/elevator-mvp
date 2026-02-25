export const runtime = 'edge';

// Check if we should use mock data
// In local dev, set USE_MOCK_DATA=true in .dev.vars
// In production, if no DB binding, use mock data
const shouldUseMockData = () => {
  // If USE_MOCK_DATA is explicitly set to true
  if (typeof process !== 'undefined' && process.env?.USE_MOCK_DATA === 'true') {
    return true;
  }
  // In Edge runtime, if we can't determine, default to mock for safety
  return false;
};

// Mock data for local development
const mockManufacturers = [
  { id: 1, name: 'Otis' },
  { id: 2, name: 'ThyssenKrupp' },
  { id: 3, name: 'Schindler' },
  { id: 4, name: 'KONE' },
];

let mockManufacturersData = [...mockManufacturers];
let nextId = 5;

export async function GET(request: Request, env: any) {
  const USE_MOCK_DATA = shouldUseMockData();
  const hasDB = !USE_MOCK_DATA && !!env.DB;
  
  try {
    if (hasDB) {
      const result = await env.DB.prepare('SELECT * FROM manufacturers ORDER BY id').all();
      const rows = result.results || [];
      return new Response(JSON.stringify({ rows }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Use mock data
      return new Response(JSON.stringify(mockManufacturersData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[manufacturers] Error:', errorMsg);
    return new Response(JSON.stringify({ error: 'Internal server error', details: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request, env: any) {
  const USE_MOCK_DATA = shouldUseMockData();
  const hasDB = !USE_MOCK_DATA && !!env.DB;
  
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (hasDB) {
      const result = await env.DB.prepare(
        'INSERT INTO manufacturers (name) VALUES (?)'
      ).bind(name).run();

      return new Response(JSON.stringify({ success: true, id: result.lastRowId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Use mock data
      const newManufacturer = { id: nextId++, name };
      mockManufacturersData.push(newManufacturer);
      return new Response(JSON.stringify({ success: true, id: newManufacturer.id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[manufacturers] POST Error:', errorMsg);
    return new Response(JSON.stringify({ error: 'Internal server error', details: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
