import React from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import ReactConfetti from 'react-confetti';

const displayName = 'Confetti';

const Confetti = () => {
  const { width, height } = useWindowSize();
  return <ReactConfetti width={width} height={height} />;
};

Confetti.displayName = displayName;

export default Confetti;
