export const runtime = 'edge';

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Mock data for local development
const mockQuotes: Array<{
  id: number;
  customer_name: string | null;
  configuration_json: string;
  total_cost: number;
  selling_price: number;
  margin: number;
  created_at: string;
}> = [];

let nextQuoteId = 1;

export async function POST(request: Request, env: any) {
  try {
    const body = await request.json();
    const { customer_name, configuration_json, total_cost, selling_price, margin } = body;

    if (!configuration_json || selling_price === undefined || margin === undefined) {
      return Response.json(
        { error: 'Missing required fields: configuration_json, selling_price, margin' },
        { status: 400 }
      );
    }

    const created_at = new Date().toISOString();

    if (!USE_MOCK_DATA && env.DB) {
      await env.DB.prepare(
        `INSERT INTO quotes (customer_name, configuration_json, total_cost, selling_price, margin, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
        .bind(customer_name || null, configuration_json, total_cost || 0, selling_price, margin, created_at)
        .run();

      return Response.json({ success: true, created_at });
    } else {
      // Use mock data
      const newQuote = {
        id: nextQuoteId++,
        customer_name: customer_name || null,
        configuration_json,
        total_cost: total_cost || 0,
        selling_price,
        margin,
        created_at,
      };
      mockQuotes.push(newQuote);
      return Response.json({ success: true, created_at });
    }
  } catch (error) {
    console.error('Quote save error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request, env: any) {
  try {
    const limit = 20;

    if (!USE_MOCK_DATA && env.DB) {
      const result = await env.DB.prepare(
        'SELECT * FROM quotes ORDER BY id DESC LIMIT ?'
      ).bind(limit).all();

      const rows = Array.isArray(result) ? result : result.results || [];
      return Response.json(rows);
    } else {
      // Use mock data
      return Response.json(mockQuotes.slice(-limit).reverse());
    }
  } catch (error) {
    console.error('Quote fetch error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
