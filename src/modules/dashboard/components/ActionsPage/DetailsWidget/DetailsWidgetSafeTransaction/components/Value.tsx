import React from 'react';
import { FormattedMessage } from 'react-intl';

import Numeral from '~core/Numeral';
import Avatar from '~core/Avatar';
import Icon from '~core/Icon';
import { Erc20Token, SafeBalanceToken, SafeTransaction } from '~data/index';

import { valueMSG } from '../../DetailsWidget';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../DetailsWidgetSafeTransaction.css';

const renderTokenIcon = (tokenData: SafeBalanceToken) => {
  const isERC20Token = (token: SafeBalanceToken): token is Erc20Token => {
    if ('logoUri' in token) {
      return true;
    }

    return false;
  };

  if (tokenData.name === 'Ether') {
    return (
      <Icon className={styles.ether} name="ether-purple" title="Ether Logo" />
    );
  }

  if (isERC20Token(tokenData)) {
    return (
      <Avatar
        className={styles.tokenAvatar}
        avatarURL={tokenData.logoUri}
        notSet={!tokenData.logoUri}
        title={`${tokenData.name} token logo`}
        placeholderIcon="circle-close"
        seed={tokenData.address.toLowerCase()}
      />
    );
  }

  return (
    <Avatar
      notSet
      title={tokenData.name}
      placeholderIcon="circle-close"
      seed={tokenData.address.toLowerCase()}
    />
  );
};

interface ValueProps {
  transaction: SafeTransaction;
  token: SafeBalanceToken;
}

export const Value = ({ transaction, token }: ValueProps) => (
  <div className={widgetStyles.item}>
    <div className={widgetStyles.label}>
      <FormattedMessage {...valueMSG} />
    </div>
    {token && transaction.amount && (
      <div className={styles.tokenContainer}>
        {renderTokenIcon(token)}
        <div className={widgetStyles.value}>
          <Numeral value={transaction.amount} />
          <span>{token.symbol}</span>
        </div>
      </div>
    )}
  </div>
);
