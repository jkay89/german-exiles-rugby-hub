-- Delete existing draw for today to conduct fresh live test
DELETE FROM lottery_results WHERE draw_id = 'f828afc0-9c0f-4f19-bbde-e0049e766991';
DELETE FROM lottery_draws WHERE draw_date = '2025-09-24' AND is_test_draw = false;