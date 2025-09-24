-- Clear existing draws for today to run fresh test
DELETE FROM lottery_results WHERE draw_id IN (SELECT id FROM lottery_draws WHERE draw_date = '2025-09-24' AND is_test_draw = false);
DELETE FROM lottery_draws WHERE draw_date = '2025-09-24' AND is_test_draw = false;