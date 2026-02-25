-- Seed data for enterprise elevator pricing

-- Insert Manufacturers
INSERT INTO manufacturers (name) VALUES ('Otis');
INSERT INTO manufacturers (name) VALUES ('KONE');
INSERT INTO manufacturers (name) VALUES ('Schindler');
INSERT INTO manufacturers (name) VALUES ('Mitsubishi');

-- Insert Elevator Models for Otis
INSERT INTO elevator_models (manufacturer_id, name, base_price, image_url) VALUES (1, 'Standard', 25000, 'https://picsum.photos/400/600');
INSERT INTO elevator_models (manufacturer_id, name, base_price, image_url) VALUES (1, 'Premium', 45000, 'https://picsum.photos/400/600');

-- Insert Elevator Models for KONE
INSERT INTO elevator_models (manufacturer_id, name, base_price, image_url) VALUES (2, 'Standard', 28000, 'https://picsum.photos/400/600');
INSERT INTO elevator_models (manufacturer_id, name, base_price, image_url) VALUES (2, 'Premium', 50000, 'https://picsum.photos/400/600');

-- Insert Elevator Models for Schindler
INSERT INTO elevator_models (manufacturer_id, name, base_price, image_url) VALUES (3, 'Standard', 26000, 'https://picsum.photos/400/600');
INSERT INTO elevator_models (manufacturer_id, name, base_price, image_url) VALUES (3, 'Premium', 48000, 'https://picsum.photos/400/600');

-- Insert Elevator Models for Mitsubishi
INSERT INTO elevator_models (manufacturer_id, name, base_price, image_url) VALUES (4, 'Standard', 30000, 'https://picsum.photos/400/600');
INSERT INTO elevator_models (manufacturer_id, name, base_price, image_url) VALUES (4, 'Premium', 60000, 'https://picsum.photos/400/600');

-- Configuration Options for Model 1 (Otis Standard)
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Speed', 'Standard Speed (2.5 m/s)', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Speed', 'High Speed (4.0 m/s)', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Speed', 'Premium Speed (6.0 m/s)', 4500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Cabin Finish', 'Standard Laminate', 800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Cabin Finish', 'Brushed Stainless Steel', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Cabin Finish', 'Premium Glass Panels', 4000);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Door Type', 'Automatic Sliding Door', 600);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Door Type', 'Center Opening Door', 1500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Door Type', 'Double Leaf Automatic', 2800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Smart Control', 'Basic Keypad', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Smart Control', 'Touch Screen Interface', 1800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Smart Control', 'AI Voice Control', 3500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Energy Saving Motor', 'Standard Motor', 700);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Energy Saving Motor', 'Variable Voltage Motor', 2200);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (1, 'Energy Saving Motor', 'Regenerative Drive System', 4000);

-- Configuration Options for Model 2 (Otis Premium)
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Speed', 'Standard Speed (2.5 m/s)', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Speed', 'High Speed (4.0 m/s)', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Speed', 'Premium Speed (6.0 m/s)', 4500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Cabin Finish', 'Standard Laminate', 800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Cabin Finish', 'Brushed Stainless Steel', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Cabin Finish', 'Premium Glass Panels', 4000);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Door Type', 'Automatic Sliding Door', 600);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Door Type', 'Center Opening Door', 1500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Door Type', 'Double Leaf Automatic', 2800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Smart Control', 'Basic Keypad', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Smart Control', 'Touch Screen Interface', 1800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Smart Control', 'AI Voice Control', 3500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Energy Saving Motor', 'Standard Motor', 700);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Energy Saving Motor', 'Variable Voltage Motor', 2200);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (2, 'Energy Saving Motor', 'Regenerative Drive System', 4000);

-- Configuration Options for Model 3 (KONE Standard)
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Speed', 'Standard Speed (2.5 m/s)', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Speed', 'High Speed (4.0 m/s)', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Speed', 'Premium Speed (6.0 m/s)', 4500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Cabin Finish', 'Standard Laminate', 800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Cabin Finish', 'Brushed Stainless Steel', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Cabin Finish', 'Premium Glass Panels', 4000);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Door Type', 'Automatic Sliding Door', 600);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Door Type', 'Center Opening Door', 1500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Door Type', 'Double Leaf Automatic', 2800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Smart Control', 'Basic Keypad', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Smart Control', 'Touch Screen Interface', 1800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Smart Control', 'AI Voice Control', 3500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Energy Saving Motor', 'Standard Motor', 700);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Energy Saving Motor', 'Variable Voltage Motor', 2200);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (3, 'Energy Saving Motor', 'Regenerative Drive System', 4000);

-- Configuration Options for Model 4 (KONE Premium)
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Speed', 'Standard Speed (2.5 m/s)', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Speed', 'High Speed (4.0 m/s)', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Speed', 'Premium Speed (6.0 m/s)', 4500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Cabin Finish', 'Standard Laminate', 800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Cabin Finish', 'Brushed Stainless Steel', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Cabin Finish', 'Premium Glass Panels', 4000);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Door Type', 'Automatic Sliding Door', 600);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Door Type', 'Center Opening Door', 1500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Door Type', 'Double Leaf Automatic', 2800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Smart Control', 'Basic Keypad', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Smart Control', 'Touch Screen Interface', 1800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Smart Control', 'AI Voice Control', 3500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Energy Saving Motor', 'Standard Motor', 700);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Energy Saving Motor', 'Variable Voltage Motor', 2200);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (4, 'Energy Saving Motor', 'Regenerative Drive System', 4000);

-- Configuration Options for Model 5 (Schindler Standard)
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Speed', 'Standard Speed (2.5 m/s)', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Speed', 'High Speed (4.0 m/s)', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Speed', 'Premium Speed (6.0 m/s)', 4500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Cabin Finish', 'Standard Laminate', 800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Cabin Finish', 'Brushed Stainless Steel', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Cabin Finish', 'Premium Glass Panels', 4000);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Door Type', 'Automatic Sliding Door', 600);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Door Type', 'Center Opening Door', 1500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Door Type', 'Double Leaf Automatic', 2800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Smart Control', 'Basic Keypad', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Smart Control', 'Touch Screen Interface', 1800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Smart Control', 'AI Voice Control', 3500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Energy Saving Motor', 'Standard Motor', 700);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Energy Saving Motor', 'Variable Voltage Motor', 2200);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (5, 'Energy Saving Motor', 'Regenerative Drive System', 4000);

-- Configuration Options for Model 6 (Schindler Premium)
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Speed', 'Standard Speed (2.5 m/s)', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Speed', 'High Speed (4.0 m/s)', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Speed', 'Premium Speed (6.0 m/s)', 4500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Cabin Finish', 'Standard Laminate', 800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Cabin Finish', 'Brushed Stainless Steel', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Cabin Finish', 'Premium Glass Panels', 4000);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Door Type', 'Automatic Sliding Door', 600);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Door Type', 'Center Opening Door', 1500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Door Type', 'Double Leaf Automatic', 2800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Smart Control', 'Basic Keypad', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Smart Control', 'Touch Screen Interface', 1800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Smart Control', 'AI Voice Control', 3500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Energy Saving Motor', 'Standard Motor', 700);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Energy Saving Motor', 'Variable Voltage Motor', 2200);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (6, 'Energy Saving Motor', 'Regenerative Drive System', 4000);

-- Configuration Options for Model 7 (Mitsubishi Standard)
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Speed', 'Standard Speed (2.5 m/s)', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Speed', 'High Speed (4.0 m/s)', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Speed', 'Premium Speed (6.0 m/s)', 4500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Cabin Finish', 'Standard Laminate', 800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Cabin Finish', 'Brushed Stainless Steel', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Cabin Finish', 'Premium Glass Panels', 4000);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Door Type', 'Automatic Sliding Door', 600);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Door Type', 'Center Opening Door', 1500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Door Type', 'Double Leaf Automatic', 2800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Smart Control', 'Basic Keypad', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Smart Control', 'Touch Screen Interface', 1800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Smart Control', 'AI Voice Control', 3500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Energy Saving Motor', 'Standard Motor', 700);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Energy Saving Motor', 'Variable Voltage Motor', 2200);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (7, 'Energy Saving Motor', 'Regenerative Drive System', 4000);

-- Configuration Options for Model 8 (Mitsubishi Premium)
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Speed', 'Standard Speed (2.5 m/s)', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Speed', 'High Speed (4.0 m/s)', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Speed', 'Premium Speed (6.0 m/s)', 4500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Cabin Finish', 'Standard Laminate', 800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Cabin Finish', 'Brushed Stainless Steel', 2500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Cabin Finish', 'Premium Glass Panels', 4000);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Door Type', 'Automatic Sliding Door', 600);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Door Type', 'Center Opening Door', 1500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Door Type', 'Double Leaf Automatic', 2800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Smart Control', 'Basic Keypad', 500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Smart Control', 'Touch Screen Interface', 1800);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Smart Control', 'AI Voice Control', 3500);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Energy Saving Motor', 'Standard Motor', 700);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Energy Saving Motor', 'Variable Voltage Motor', 2200);
INSERT INTO configuration_options (model_id, category, name, price) VALUES (8, 'Energy Saving Motor', 'Regenerative Drive System', 4000);

