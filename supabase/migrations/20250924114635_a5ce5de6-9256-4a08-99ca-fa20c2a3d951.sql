-- Add lottery entries for real users for the upcoming draw
INSERT INTO lottery_entries (user_id, numbers, draw_date, line_number, is_active) VALUES
('899d2d53-5b87-4f03-84b7-72430b7d0b2a', ARRAY[1, 15, 23, 31], '2025-09-24', 1, true),
('45b37d2e-84c6-4bf8-98a0-f722db84c1ca', ARRAY[7, 12, 18, 29], '2025-09-24', 1, true),
('baf257dc-2a6d-4b59-8075-d507a54b05f7', ARRAY[3, 9, 21, 27], '2025-09-24', 1, true),
('9208a8bc-6a51-4ae8-a998-8b6d58123e99', ARRAY[5, 14, 19, 33], '2025-09-24', 1, true),
('3300ea52-43de-4a06-9ed8-b0686a0279a7', ARRAY[2, 11, 25, 30], '2025-09-24', 1, true),
('d9b10f8c-107b-45a9-8a74-286c07277827', ARRAY[8, 16, 22, 28], '2025-09-24', 1, true),
('53da6af2-3c03-4af3-872a-b0feb634a585', ARRAY[4, 13, 20, 32], '2025-09-24', 1, true);