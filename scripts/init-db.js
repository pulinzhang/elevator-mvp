const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'elevator.db');
const schemaPath = path.join(__dirname, '..', 'schema.sql');
const seedPath = path.join(__dirname, '..', 'seed.sql');

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

console.log('Schema created successfully!');

// Read and execute seed data
const seed = fs.readFileSync(seedPath, 'utf8');
db.exec(seed);

console.log('Seed data inserted successfully!');

db.close();
