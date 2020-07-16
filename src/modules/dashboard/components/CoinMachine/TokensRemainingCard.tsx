import React, { useRef } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import CountUp from 'react-countup';

import Card from '~core/Card';
import Heading from '~core/Heading';
import { getMainClasses } from '~utils/css';

import styles from './CoinMachineCard.css';
import Icon from '~core/Icon';

interface Props {
  /* Target token amount for this run */
  target: number;
  /* Tokens remaining in this run */
  tokensRemaining: number;
  /* Total token supply in this run */
  totalSupply: number;
}

const displayName = 'dashboard.CoinMachine.TokensRemainingCard';

const MSG = defineMessages({
  help: {
    id: 'dashboard.CoinMachine.TokensRemainingCard.help',
    defaultMessage: 'This is the number of tokens remaining. If more',
  },
  title: {
    id: 'dashboard.CoinMachine.TokensRemainingCard.title',
    defaultMessage: 'Tokens Remaining',
  },
  soldOut: {
    id: 'dashboard.CoinMachine.TokensRemainingCard.soldOut',
    defaultMessage: 'SOLD OUT',
  },
  priceNextSale: {
    id: 'dashboard.CoinMachine.TokensRemainingCard.priceNextSale',
    defaultMessage: 'Price next sale',
  },
  priceUp: {
    id: 'dashboard.CoinMachine.TokensRemainingCard.priceUp',
    defaultMessage: 'Price is going up',
  },
  priceDown: {
    id: 'dashboard.CoinMachine.TokensRemainingCard.priceDown',
    defaultMessage: 'Price is going down',
  },
});

const TokensRemainingCard = ({
  target = 0,
  tokensRemaining = 0,
  totalSupply = 0,
}: Props) => {
  const initialTokens = useRef(tokensRemaining);
  const hurryUp = tokensRemaining / totalSupply <= 1 / 3;
  const targetReached = totalSupply - tokensRemaining >= target;
  const justSoldOut = initialTokens.current > 0 && tokensRemaining === 0;
  return (
    <Card
      className={getMainClasses({}, styles, { hurryUp, justSoldOut })}
      help={MSG.help}
    >
      <div className={styles.heading}>
        <Heading
          appearance={{
            margin: 'none',
            size: 'normal',
            theme: justSoldOut ? 'invert' : undefined,
          }}
          text={MSG.title}
          textValues={{ saleOver: !tokensRemaining }}
        />
      </div>
      <div className={styles.content}>
        {initialTokens.current === 0 && tokensRemaining === 0 ? (
          <FormattedMessage {...MSG.soldOut} />
        ) : (
          [
            <CountUp start={totalSupply} end={tokensRemaining} />,
            `/${totalSupply}`,
          ]
        )}
      </div>
      {targetReached && (
        <div className={styles.footer}>
          <FormattedMessage {...MSG.priceNextSale} />
          {tokensRemaining ? (
            <Icon
              appearance={{ size: 'extraTiny' }}
              name="triangle-up"
              title={MSG.priceUp}
            />
          ) : (
            ' 🚀'
          )}
        </div>
      )}
    </Card>
  );
};

TokensRemainingCard.displayName = displayName;

export default TokensRemainingCard;
