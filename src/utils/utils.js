export const formatPriceChange = price => {
  if (!price) {
    return {
      text: '0.00 $',
      className: 'color-success',
    };
  }

  const formattedPrice = Number(price.toFixed(2));

  const isPositivePrice = formattedPrice >= 0;

  return {
    text: `${formattedPrice.toFixed(2)} $`,
    className: isPositivePrice ? 'color-success' : 'color-danger',
  };
};

export const formatMarketCap = (value, currency = '$', decimals = 1) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '—';
  }

  const num = Number(value);
  const absNum = Math.abs(num);

  let suffix = '';
  let divisor = 1;

  if (absNum >= 1e12) {
    suffix = 'трлн';
    divisor = 1e12;
  } else if (absNum >= 1e9) {
    suffix = 'млрд';
    divisor = 1e9;
  } else if (absNum >= 1e6) {
    suffix = 'млн';
    divisor = 1e6;
  } else if (absNum >= 1e3) {
    suffix = 'тыс';
    divisor = 1e3;
  }

  const formatted = (absNum / divisor).toFixed(decimals);

  const cleanFormatted = parseFloat(formatted).toString();

  return `${cleanFormatted} ${suffix} ${currency}`;
};
