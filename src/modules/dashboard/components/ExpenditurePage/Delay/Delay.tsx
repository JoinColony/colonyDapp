import React from 'react';

interface Props {
  amount?: string;
  time?: string;
  format?: 'normal' | 'short';
}

const Delay = ({ amount, time, format = 'short' }: Props) => {
  const getShortTimeSymbol = () => {
    switch (time) {
      case 'hours':
        return 'h';
      case 'days':
        return 'day';
      case 'months':
        return 'mth';
      default:
        return null;
    }
  };

  const getNormalTimeSymbol = () => {
    switch (time) {
      case 'hours':
        return 'hour';
      case 'days':
        return 'day';
      case 'months':
        return 'month';
      default:
        return null;
    }
  };

  const getTimeSymbol = () => {
    const val = Number(amount);

    if (val && time === 'hours') {
      return 'h';
    }

    return format === 'short'
      ? `${getShortTimeSymbol()}${val > 1 ? 's' : ''}`
      : `${getNormalTimeSymbol()}${val > 1 ? 's' : ''}`;
  };

  return (
    <>
      {amount}
      {format === 'normal' ? ' ' : ''}
      {getTimeSymbol()}
    </>
  );
};

export default Delay;
