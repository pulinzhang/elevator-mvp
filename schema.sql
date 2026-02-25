DROP TABLE IF EXISTS manufacturers;

DROP TABLE IF EXISTS elevator_models;

DROP TABLE IF EXISTS configuration_options;

DROP TABLE IF EXISTS quotes;

DROP TABLE IF EXISTS system_config;


CREATE TABLE manufacturers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);


CREATE TABLE elevator_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  manufacturer_id INTEGER,
  name TEXT,
  base_price REAL,
  image_url TEXT
);


CREATE TABLE configuration_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id INTEGER,
  category TEXT,
  name TEXT,
  price REAL
);


CREATE TABLE quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT,
  configuration_json TEXT,
  total_cost REAL,
  selling_price REAL,
  margin REAL,
  created_at TEXT
);


CREATE TABLE system_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- Default configuration
INSERT INTO system_config (key, value) VALUES ('default_margin', '20');

