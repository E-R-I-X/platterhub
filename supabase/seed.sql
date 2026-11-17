-- Seed data for The Platter Hub (run after schema.sql)
-- Amounts are in Naira.

insert into public.menu_categories (id, name, description, sort_order) values
  ('11111111-1111-1111-1111-111111111101', 'Rice & Pasta', 'Signature rice dishes and pasta trays', 1),
  ('11111111-1111-1111-1111-111111111102', 'Proteins', 'Peppered and grilled proteins', 2),
  ('11111111-1111-1111-1111-111111111103', 'Finger Foods', 'Passed bites and party favourites', 3),
  ('11111111-1111-1111-1111-111111111104', 'Desserts', 'Sweet finishes for any gathering', 4),
  ('11111111-1111-1111-1111-111111111105', 'Fresh Fruits', 'Cups, skewers, and platters', 5);

insert into public.menu_items (id, category_id, name, description, price_small, price_medium, price_large, unit_label, sort_order) values
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'Jollof Rice', 'Party-style jollof', 50000, 80000, 110000, null, 1),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', 'Fried Rice', 'Vegetable fried rice', 70000, 100000, 120000, null, 2),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111101', 'Native Rice', 'Palm oil native rice', 80000, 120000, 150000, null, 3),
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111101', 'Pasta', 'Creamy or tomato pasta', 50000, null, null, null, 4),
  ('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111102', 'Peppered Chicken', 'Spicy peppered chicken', 60000, 90000, 130000, null, 1),
  ('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111102', 'Peppered Turkey', 'Tender peppered turkey', 80000, 110000, 160000, null, 2),
  ('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111102', 'Peppered Fish', 'Fresh fish in pepper sauce', 90000, 160000, 250000, null, 3),
  ('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111102', 'Peppered Beef', 'Slow-cooked peppered beef', 150000, 240000, 350000, null, 4),
  ('22222222-2222-2222-2222-222222222209', '11111111-1111-1111-1111-111111111103', 'Mini Meat Pie', 'Flaky mini meat pies', 6000, 10000, 14000, 'per 10 pcs', 1),
  ('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111103', 'Spring Roll', 'Crispy spring rolls', 6000, 10000, 14000, 'per 10 pcs', 2),
  ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111103', 'Samosa', 'Golden mini samosas', 6000, 10000, 14000, 'per 10 pcs', 3),
  ('22222222-2222-2222-2222-222222222212', '11111111-1111-1111-1111-111111111103', 'Puff-Puff', 'Soft fried dough balls', 8000, null, null, '50 pieces', 4),
  ('22222222-2222-2222-2222-222222222213', '11111111-1111-1111-1111-111111111104', 'Cheesecake Shooters', 'Individual shooters', 15000, 25000, 35000, 'per 10 pcs', 1),
  ('22222222-2222-2222-2222-222222222214', '11111111-1111-1111-1111-111111111104', 'Cake Slices', 'Assorted cake slices', 8000, 14000, 20000, 'per 10 pcs', 2),
  ('22222222-2222-2222-2222-222222222215', '11111111-1111-1111-1111-111111111105', 'Fresh Fruit Cups', 'Seasonal fruit cups', 5000, 8000, 12000, 'per 10 pcs', 1),
  ('22222222-2222-2222-2222-222222222216', '11111111-1111-1111-1111-111111111105', 'Fresh Fruit Platter', 'Large mixed fruit platter', 25000, 40000, 60000, null, 2);
