export const runtime = 'edge';

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Mock data for local development
const mockOptions = [
  // Otis Gen2 options
  { id: 1, model_id: 1, category: 'Capacity', name: '1000 lbs', price: 0 },
  { id: 2, model_id: 1, category: 'Capacity', name: '2000 lbs', price: 5000 },
  { id: 3, model_id: 1, category: 'Capacity', name: '2500 lbs', price: 8000 },
  { id: 4, model_id: 1, category: 'Speed', name: '500 FPM', price: 0 },
  { id: 5, model_id: 1, category: 'Speed', name: '750 FPM', price: 6000 },
  { id: 6, model_id: 1, category: 'Speed', name: '1000 FPM', price: 12000 },
  { id: 7, model_id: 1, category: 'Finishes', name: 'Standard Steel', price: 0 },
  { id: 8, model_id: 1, category: 'Finishes', name: 'Brushed Stainless', price: 2500 },
  { id: 9, model_id: 1, category: 'Finishes', name: 'Premium Wood', price: 5000 },
  // Otis Gen2 Premium options
  { id: 10, model_id: 2, category: 'Capacity', name: '2000 lbs', price: 0 },
  { id: 11, model_id: 2, category: 'Capacity', name: '3000 lbs', price: 8000 },
  { id: 12, model_id: 2, category: 'Speed', name: '750 FPM', price: 0 },
  { id: 13, model_id: 2, category: 'Speed', name: '1000 FPM', price: 8000 },
  { id: 14, model_id: 2, category: 'Speed', name: '1500 FPM', price: 18000 },
  // TKE Evolution options
  { id: 15, model_id: 3, category: 'Capacity', name: '1500 lbs', price: 0 },
  { id: 16, model_id: 3, category: 'Capacity', name: '2500 lbs', price: 6000 },
  { id: 17, model_id: 3, category: 'Speed', name: '500 FPM', price: 0 },
  { id: 18, model_id: 3, category: 'Speed', name: '800 FPM', price: 7000 },
  // Schindler 3300 options
  { id: 19, model_id: 4, category: 'Capacity', name: '1000 lbs', price: 0 },
  { id: 20, model_id: 4, category: 'Capacity', name: '1500 lbs', price: 3000 },
  { id: 21, model_id: 4, category: 'Speed', name: '350 FPM', price: 0 },
  { id: 22, model_id: 4, category: 'Speed', name: '500 FPM', price: 4000 },
  // KONE MonoSpace options
  { id: 23, model_id: 5, category: 'Capacity', name: '2000 lbs', price: 0 },
  { id: 24, model_id: 5, category: 'Capacity', name: '2500 lbs', price: 5000 },
  { id: 25, model_id: 5, category: 'Speed', name: '600 FPM', price: 0 },
  { id: 26, model_id: 5, category: 'Speed', name: '900 FPM', price: 8000 },
];

let mockOptionsData = [...mockOptions];
let nextId = 27;

export async function GET(request: Request, env: any) {
  try {
    const url = new URL(request.url);
    const modelId = url.searchParams.get('model_id');

    if (!modelId) {
      return Response.json({ error: 'model_id is required' }, { status: 400 });
    }

    if (!USE_MOCK_DATA && env.DB) {
      const result = await env.DB.prepare(
        'SELECT * FROM configuration_options WHERE model_id = ? ORDER BY category, id'
      ).bind(Number(modelId)).all();
      const rows = Array.isArray(result) ? result : result.results || [];
      return Response.json(rows);
    } else {
      // Use mock data
      const filtered = mockOptionsData.filter(o => o.model_id === Number(modelId));
      return Response.json(filtered);
    }
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request, env: any) {
  try {
    const body = await request.json();
    const { model_id, category, name, price } = body;

    if (!model_id || !category || !name || price === undefined) {
      return Response.json(
        { error: 'model_id, category, name, and price are required' },
        { status: 400 }
      );
    }

    if (!USE_MOCK_DATA && env.DB) {
      const result = await env.DB.prepare(
        'INSERT INTO configuration_options (model_id, category, name, price) VALUES (?, ?, ?, ?)'
      ).bind(model_id, category, name, price).run();

      return Response.json({ success: true, id: result.lastRowId });
    } else {
      // Use mock data
      const newOption = { id: nextId++, model_id, category, name, price };
      mockOptionsData.push(newOption);
      return Response.json({ success: true, id: newOption.id });
    }
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
