import { NextResponse } from 'next/server';

export const runtime = 'edge';

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Mock data for local development (mirrors models and options)
const mockModelsData: Record<number, number> = {
  1: 25000,  // Otis Gen2
  2: 35000,  // Otis Gen2 Premium
  3: 28000,  // TKE Evolution
  4: 22000,  // Schindler 3300
  5: 30000,  // KONE MonoSpace
};

const mockOptionsData: Record<number, number> = {
  1: 0, 2: 5000, 3: 8000, 4: 0, 5: 6000, 6: 12000, 7: 0, 8: 2500, 9: 5000,
  10: 0, 11: 8000, 12: 0, 13: 8000, 14: 18000,
  15: 0, 16: 6000, 17: 0, 18: 7000,
  19: 0, 20: 3000, 21: 0, 22: 4000,
  23: 0, 24: 5000, 25: 0, 26: 8000,
};

export async function POST(request: Request, env: any) {
  try {
    const body = await request.json();
    const { model_id, selected_options, margin } = body;

    if (!model_id || !selected_options || margin === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: model_id, selected_options, margin' },
        { status: 400 }
      );
    }

    let base_price = 0;
    let options_total = 0;

    // Use D1 if available and not using mock data
    if (!USE_MOCK_DATA && env.DB) {
      // Get base price from elevator_models
      const modelResult = await env.DB.prepare(
        'SELECT base_price FROM elevator_models WHERE id = ?'
      ).bind(model_id).first();

      if (!modelResult) {
        return NextResponse.json(
          { error: 'Model not found' },
          { status: 404 }
        );
      }

      base_price = modelResult.base_price;

      // Get prices for selected options
      if (selected_options.length > 0) {
        const placeholders = selected_options.map(() => '?').join(',');
        const optionsResult = await env.DB.prepare(
          `SELECT SUM(price) as total FROM configuration_options WHERE id IN (${placeholders})`
        ).bind(...selected_options).first();

        options_total = optionsResult?.total || 0;
      }
    } else {
      // Use mock data
      base_price = mockModelsData[model_id] || 0;
      
      if (!base_price) {
        return NextResponse.json(
          { error: 'Model not found' },
          { status: 404 }
        );
      }

      // Sum up selected options
      options_total = selected_options.reduce((sum: number, optId: number) => {
        return sum + (mockOptionsData[optId] || 0);
      }, 0);
    }

    // Calculate costs
    const total_cost = base_price + options_total;
    const selling_price = total_cost * (1 + margin / 100);

    return NextResponse.json({
      base_price,
      options_total,
      total_cost,
      selling_price: Math.round(selling_price * 100) / 100
    });
  } catch (error) {
    console.error('Calculate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
