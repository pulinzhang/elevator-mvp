import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

function getLocalDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'elevator.db');
    db = new Database(dbPath);
  }
  return db;
}

export async function GET(request: Request, env: any) {
  // Check if D1 is available (Cloudflare production)
  if (env.DB) {
    const result = await env.DB.prepare("SELECT * FROM elevators").all();
    return Response.json(result);
  }

  // Fallback to local SQLite for development
  const localDb = getLocalDb();
  const stmt = localDb.prepare("SELECT * FROM elevators");
  const rows = stmt.all();
  return Response.json(rows);
}

export async function POST(request: Request, env: any) {
  const body = await request.json();

  // Check if D1 is available (Cloudflare production)
  if (env.DB) {
    await env.DB.prepare(
      "INSERT INTO elevators (brand, model, base_price) VALUES (?, ?, ?)"
    )
      .bind(body.brand, body.model, body.base_price)
      .run();
    return Response.json({ success: true });
  }

  // Fallback to local SQLite for development
  const localDb = getLocalDb();
  const stmt = localDb.prepare(
    "INSERT INTO elevators (brand, model, base_price) VALUES (?, ?, ?)"
  );
  stmt.run(body.brand, body.model, body.base_price);
  return Response.json({ success: true });
}
