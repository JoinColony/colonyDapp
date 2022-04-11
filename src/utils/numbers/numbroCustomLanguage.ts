export const numbroCustomLanguage = {
  languageTag: 'en-GB',
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  abbreviations: {
    thousand: 'K',
    million: 'M',
    billion: 'B',
    trillion: 'T',
  },
  ordinal: (number) => {
    const b = number % 10;
    if (Math.round((number % 100) / 10) === 1) {
      return 'th';
    }
    if (b === 1) {
      return 'st';
    }
    if (b === 2) {
      return 'st';
    }
    if (b === 3) {
      return 'rd';
    }
    return 'th';
  },
  currency: {
    symbol: '',
    position: 'prefix',
    code: '',
  },
  currencyFormat: {
    thousandSeparated: true,
    totalLength: 4,
    spaceSeparated: false,
    spaceSeparatedCurrency: false,
    average: true,
  },
  formats: {
    fourDigits: {
      totalLength: 4,
      spaceSeparated: false,
      average: true,
    },
    fullWithTwoDecimals: {
      thousandSeparated: true,
      spaceSeparated: false,
      mantissa: 2,
    },
    fullWithTwoDecimalsNoCurrency: {
      mantissa: 2,
      thousandSeparated: true,
    },
    fullWithNoDecimals: {
      thousandSeparated: true,
      spaceSeparated: false,
      mantissa: 0,
    },
  },
};
