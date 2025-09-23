// Utility functions for lottery draw date calculations

export const getNextDrawDate = (): Date => {
  const now = new Date();
  // Next draw is the last day of next month
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return nextMonth;
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