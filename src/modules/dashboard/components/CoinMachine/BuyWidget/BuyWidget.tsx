import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';
import Button from '~core/Button';
import ExternalLink from '~core/ExternalLink';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { ProcessedTokens } from '~data/generated';

import styles from './BuyWidget.css';

const MSG = defineMessage({
  buyTokens: {
    id: 'dashbord.CoinMachine.BuyWidget.buyTokens',
    /* Later should be 'Buy <particular token>' */
    defaultMessage: 'Buy {symbol}',
  },
  mainMessage: {
    id: 'dashbord.CoinMachine.BuyWidget.mainMessage',
    defaultMessage: 'Coin Machine is empty.\nPlease come back later.',
  },
  tellMore: {
    id: 'dashbord.CoinMachine.BuyWidget.tellMore',
    defaultMessage: 'Tell me more',
  },
  getWhitelisted: {
    id: 'dashbord.CoinMachine.BuyWidget.getWhitelisted',
    defaultMessage: 'Get whitelisted',
  },
  accountWhitelisted: {
    id: 'dashbord.CoinMachine.BuyWidget.accountWhitelisted',
    defaultMessage: 'Your account is whitelisted. 😎',
  },
});

const TELL_ME_MORE_LINK = '';

interface Props {
  nativeToken?: ProcessedTokens;
}

const BuyWidget = ({ nativeToken }: Props) => {
  const isAccountWhitelisted = false;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <FormattedMessage
          {...MSG.buyTokens}
          values={{ symbol: nativeToken?.symbol || 'tokens' }}
        />
        <QuestionMarkTooltip tooltipText="TODO" />
      </div>
      <div className={styles.mainMessage}>
        <FormattedMessage {...MSG.mainMessage} />
        <div>
          <ExternalLink
            className={styles.link}
            text={MSG.tellMore}
            href={TELL_ME_MORE_LINK}
          />
        </div>
      </div>
      <div className={styles.accountStatus}>
        {!isAccountWhitelisted ? (
          <Button
            appearance={{ size: 'large', theme: 'primary' }}
            text={MSG.getWhitelisted}
          />
        ) : (
          <FormattedMessage {...MSG.accountWhitelisted} />
        )}
      </div>
    </div>
  );
};

BuyWidget.displayName = 'dashboard.CoinMachine.BuyWidget';

export default BuyWidget;
