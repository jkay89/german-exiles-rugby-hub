// Utility functions for lottery draw date calculations
import { supabase } from "@/integrations/supabase/client";

export const getNextDrawDate = (): Date => {
  const now = new Date();
  // Next draw is the last day of next month (fallback)
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return nextMonth;
};

export const getNextDrawDateFromSettings = async (): Promise<Date> => {
  try {
    // Fetch next draw date from lottery_settings
    const { data: dateData, error: dateError } = await supabase
      .from('lottery_settings')
      .select('setting_value')
      .eq('setting_key', 'next_draw_date')
      .maybeSingle();
    
    const { data: timeData, error: timeError } = await supabase
      .from('lottery_settings')
      .select('setting_value')
      .eq('setting_key', 'draw_time')
      .maybeSingle();
    
    if (dateError || timeError) throw dateError || timeError;
    
    if (dateData && timeData) {
      const drawDate = new Date(dateData.setting_value + 'T' + timeData.setting_value + ':00');
      return drawDate;
    }
  } catch (error) {
    console.error('Error fetching next draw date from settings:', error);
  }
  
  // Fallback to calculating next month if settings not found
  return getNextDrawDate();
};

export const getCurrentDrawDate = (): Date => {
  const now = new Date();
  // Current draw is the last day of this month
  const currentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return currentMonth;
};

export const formatDrawDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const isCurrentDrawPeriod = (drawDate: Date): boolean => {
  const now = new Date();
  const currentDraw = getCurrentDrawDate();
  
  // Check if the draw date matches the current month's draw
  return drawDate.getMonth() === currentDraw.getMonth() && 
         drawDate.getFullYear() === currentDraw.getFullYear();
};

export const isPastDraw = (drawDate: Date): boolean => {
  const now = new Date();
  return drawDate < now;
};