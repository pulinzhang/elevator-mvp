export const runtime = 'edge';

// Use real database in production (set USE_MOCK_DATA=true in .dev.vars for local development)
const USE_MOCK_DATA = typeof process !== 'undefined' && process.env?.USE_MOCK_DATA === 'true';

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
  console.log('[manufacturers] GET called');
  console.log('[manufacturers] USE_MOCK_DATA:', USE_MOCK_DATA);
  console.log('[manufacturers] env.DB:', env.DB);
  
  try {
    if (!USE_MOCK_DATA && env.DB) {
      console.log('[manufacturers] Querying DB...');
      const result = await env.DB.prepare('SELECT * FROM manufacturers ORDER BY id').all();
      console.log('[manufacturers] DB result:', result);
      const rows = result.results || [];
      console.log('[manufacturers] rows:', rows);
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Use mock data
      console.log('[manufacturers] Using mock data');
      return new Response(JSON.stringify(mockManufacturersData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('[manufacturers] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request, env: any) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!USE_MOCK_DATA && env.DB) {
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
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
