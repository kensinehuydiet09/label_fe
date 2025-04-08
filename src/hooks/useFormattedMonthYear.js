import { useMemo } from 'react';
import { format } from 'date-fns';

const useFormattedMonthYear = (dateString) => {
  return useMemo(() => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM yyyy');
    } catch (e) {
      console.error('Invalid date:', e);
      return '';
    }
  }, [dateString]);
};

export default useFormattedMonthYear;
