import React from 'react';

import Numeral from '~core/Numeral';

import { TokenData } from '../types';

import styles from './ClaimTokens.css';

interface Props {
  tokens?: TokenData[];
}

const ClaimTokens = ({ tokens }: Props) => {
  if (!tokens) {
    return null;
  }

  return (
    <div className={styles.valueContainer}>
      {tokens?.map(({ amount, token }) => (
        <div className={styles.value} key={token?.id}>
          <Numeral value={amount || 0} /> {token?.symbol}
        </div>
      ))}
    </div>
  );
};

export default ClaimTokens;
