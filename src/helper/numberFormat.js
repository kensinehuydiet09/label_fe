export const formatNumber = (num) => {
    const number = Number(num);
  
    if (isNaN(number)) return '0.00';
  
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  