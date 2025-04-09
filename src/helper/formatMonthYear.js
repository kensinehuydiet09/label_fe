import { format } from 'date-fns';

const formatMonthYear = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMMM yyyy');
  } catch (e) {
    console.error('Invalid date:', e);
    return '';
  }
};

export default formatMonthYear;
