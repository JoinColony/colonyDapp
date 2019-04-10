/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BN from 'bn.js';

import Icon from '~core/Icon';
import Numeral from '~core/Numeral';

import styles from './ColonyFee.css';

const MSG = defineMessages({
  colonyFeeText: {
    id: 'ColonyFee.colonyFeeText',
    defaultMessage: 'Colony Fee: {amount}',
  },
  helpIconTitle: {
    id: 'ColonyFee.helpIconTitle',
    defaultMessage: 'Help',
  },
});

type Props = {|
  amount: BN | string,
  symbol: string,
|};

const displayName = 'ColonyFee';

const ColonyFee = ({ amount, symbol }: Props) => (
  <>
    <div className={styles.amount}>
      <FormattedMessage
        {...MSG.colonyFeeText}
        values={{ amount: <Numeral value={amount} suffix={` ${symbol}`} /> }}
      />
    </div>
    <div className={styles.help}>
      <Icon
        appearance={{ size: 'small', theme: 'invert' }}
        name="question-mark"
        title={MSG.helpIconTitle}
      />
    </div>
  </>
);

ColonyFee.displayName = displayName;

export default ColonyFee;
