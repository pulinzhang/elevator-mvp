export const runtime = 'edge';

// Use real database in production (set USE_MOCK_DATA=true in .dev.vars for local development)
const USE_MOCK_DATA = typeof process !== 'undefined' && process.env?.USE_MOCK_DATA === 'true';

// Mock data for local development
const mockModels = [
  { id: 1, manufacturer_id: 1, name: 'Gen2', base_price: 25000, image_url: 'https://placehold.co/400x300?text=Gen2' },
  { id: 2, manufacturer_id: 1, name: 'Gen2 Premium', base_price: 35000, image_url: 'https://placehold.co/400x300?text=Gen2+Premium' },
  { id: 3, manufacturer_id: 2, name: 'TKE Evolution', base_price: 28000, image_url: 'https://placehold.co/400x300?text=TKE+Evolution' },
  { id: 4, manufacturer_id: 3, name: '3300', base_price: 22000, image_url: 'https://placehold.co/400x300?text=3300' },
  { id: 5, manufacturer_id: 4, name: 'MonoSpace', base_price: 30000, image_url: 'https://placehold.co/400x300?text=MonoSpace' },
];

let mockModelsData = [...mockModels];
let nextId = 6;

export async function GET(request: Request, env: any) {
  try {
    const url = new URL(request.url);
    const manufacturerId = url.searchParams.get('manufacturer_id');

    if (!USE_MOCK_DATA && env.DB) {
      let query = 'SELECT * FROM elevator_models';
      if (manufacturerId) {
        query += ' WHERE manufacturer_id = ?';
        const result = await env.DB.prepare(query).bind(manufacturerId).all();
        const rows = result.results || [];
        return new Response(JSON.stringify(rows), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const result = await env.DB.prepare(query + ' ORDER BY id').all();
      const rows = result.results || [];
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Use mock data
      if (manufacturerId) {
        return new Response(JSON.stringify(mockModelsData.filter(m => m.manufacturer_id === Number(manufacturerId))), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify(mockModelsData), {
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

export async function POST(request: Request, env: any) {
  try {
    const body = await request.json();
    const { manufacturer_id, name, base_price, image_url } = body;

    if (!manufacturer_id || !name || base_price === undefined) {
      return new Response(JSON.stringify({ error: 'manufacturer_id, name, and base_price are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!USE_MOCK_DATA && env.DB) {
      const result = await env.DB.prepare(
        'INSERT INTO elevator_models (manufacturer_id, name, base_price, image_url) VALUES (?, ?, ?, ?)'
      ).bind(manufacturer_id, name, base_price, image_url || '').run();

      return new Response(JSON.stringify({ success: true, id: result.lastRowId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Use mock data
      const newModel = { id: nextId++, manufacturer_id, name, base_price, image_url: image_url || '' };
      mockModelsData.push(newModel);
      return new Response(JSON.stringify({ success: true, id: newModel.id }), {
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
