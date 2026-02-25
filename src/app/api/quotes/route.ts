export const runtime = 'edge';

// Use real database in production (set USE_MOCK_DATA=true in .dev.vars for local development)
const USE_MOCK_DATA = typeof process !== 'undefined' && process.env?.USE_MOCK_DATA === 'true';

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
      return new Response(
        JSON.stringify({ error: 'Missing required fields: configuration_json, selling_price, margin' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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

      return new Response(JSON.stringify({ success: true, created_at }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
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
      return new Response(JSON.stringify({ success: true, created_at }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Quote save error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request: Request, env: any) {
  try {
    const limit = 20;

    if (!USE_MOCK_DATA && env.DB) {
      const result = await env.DB.prepare(
        'SELECT * FROM quotes ORDER BY id DESC LIMIT ?'
      ).bind(limit).all();

      const rows = result.results || [];
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Use mock data
      return new Response(JSON.stringify(mockQuotes.slice(-limit).reverse()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Quote fetch error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
