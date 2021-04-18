import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { Colony } from '~data/index';

import styles from './BuyTokens.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CoinMachine.BuyTokens.title',
    defaultMessage: `Buy {tokenSymbol}`,
  },
  helpTooltip: {
    id: 'dashboard.CoinMachine.BuyTokens.helpTooltip',
    defaultMessage: `This is where you buy tokens. You put how much you want in the amount field and click the big green buy button. It’s really quite self explanatory.`,
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.CoinMachine.BuyTokens';

const BuyTokens = ({ colony: { nativeTokenAddress, tokens } }: Props) => {
  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  return (
    <div className={styles.main}>
      <Heading
        appearance={{
          margin: 'none',
          size: 'medium',
          weight: 'bold',
          theme: 'dark',
        }}
        text={MSG.title}
        textValues={{ tokenSymbol: nativeToken?.symbol }}
      />
      <QuestionMarkTooltip
        tooltipText={MSG.helpTooltip}
        className={styles.help}
        tooltipPopperProps={{
          placement: 'top',
        }}
        tooltipClassName={styles.tooltip}
      />
    </div>
  );
};

BuyTokens.displayName = displayName;

export default BuyTokens;
