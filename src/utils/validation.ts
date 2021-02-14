export const isEmpty = (value: any) => {
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return Object.keys(value).length === 0;
  }

  return String(value).trim() === '';
};
