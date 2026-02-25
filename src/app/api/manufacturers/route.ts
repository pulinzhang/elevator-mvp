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
  try {
    if (!USE_MOCK_DATA && env.DB) {
      const result = await env.DB.prepare('SELECT * FROM manufacturers ORDER BY id').all();
      const rows = Array.isArray(result) ? result : result.results || [];
      return Response.json(rows);
    } else {
      // Use mock data
      return Response.json(mockManufacturersData);
    }
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request, env: any) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!USE_MOCK_DATA && env.DB) {
      const result = await env.DB.prepare(
        'INSERT INTO manufacturers (name) VALUES (?)'
      ).bind(name).run();

      return Response.json({ success: true, id: result.lastRowId });
    } else {
      // Use mock data
      const newManufacturer = { id: nextId++, name };
      mockManufacturersData.push(newManufacturer);
      return Response.json({ success: true, id: newManufacturer.id });
    }
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
