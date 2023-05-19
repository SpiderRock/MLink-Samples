export const getViewFilterArray = (viewFilter: string) => {
  let viewArray = viewFilter.split('|').map((v) => v.toLowerCase());
  // This is in place to avoid filtering columns by ''
  if (viewArray.includes('')) {
    viewArray.splice(viewArray.indexOf(''), 1);
  }
  return viewArray;
};
