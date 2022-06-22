import React from 'react';

interface Props {
  amount?: string;
  time?: string;
}

const Delay = ({ amount, time }: Props) => {
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

  const getTimeSymbol = () => {
    const val = Number(amount);

    if (val && time === 'hours') {
      return 'h';
    }
    return `${getShortTimeSymbol()}${val > 1 && 's'}`;
  };

  return (
    <>
      {amount}
      {getTimeSymbol()}
    </>
  );
};

export default Delay;
