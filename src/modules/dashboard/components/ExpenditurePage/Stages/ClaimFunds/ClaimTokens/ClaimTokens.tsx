import React from 'react';

import Numeral from '~core/Numeral';

import { TokenData } from '../types';

import styles from './ClaimTokens.css';

const displayName = 'dashboard.ExpenditurePage.Stages.ClaimFunds.ClaimTokens';

interface Props {
  tokens?: TokenData[];
}

const ClaimTokens = ({ tokens }: Props) => {
  if (!tokens) {
    return null;
  }

  return (
    <div className={styles.valueContainer}>
      {tokens?.map(({ amount, token, key }) => (
        <div className={styles.value} key={key}>
          <Numeral value={amount || 0} /> {token?.symbol}
        </div>
      ))}
    </div>
  );
};

ClaimTokens.displayName = displayName;

export default ClaimTokens;
