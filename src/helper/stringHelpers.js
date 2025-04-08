// stringHelpers.js

export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  export const capitalizeWords = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => capitalizeFirst(word))
      .join(' ');
  };
  