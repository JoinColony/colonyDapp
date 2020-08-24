import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import NavLink from '~core/NavLink';
import { Colony } from '~data/index';
import { Address } from '~types/index';

import styles from './ColonyBuyTokens.css';

const MSG = defineMessages({
  buyLink: {
    id: 'dashboard.ColonyHome.ColonyMeta.ColonyBuyTokens.buyLink',
    defaultMessage: 'Buy {symbol}',
  },
  title: {
    id: 'dashboard.ColonyHome.ColonyMeta.ColonyBuyTokens.title',
    defaultMessage: 'Tokens',
  },
});

interface Props {
  colonyName: string;
  nativeTokenAddress: Address;
  tokens: Colony['tokens'];
}

const displayName = 'dashboard.ColonyHome.ColonyMeta.ColonyBuyTokens';

const ColonyBuyTokens = ({ nativeTokenAddress, colonyName, tokens }: Props) => {
  // @todo use real check for this
  const canColonySellTokens = true;

  const nativeToken = tokens.find(
    (token) => token.address === nativeTokenAddress,
  );

  if (!canColonySellTokens || !nativeToken) {
    return null;
  }

  return (
    <section className={styles.main}>
      <Heading
        appearance={{ margin: 'none', size: 'normal' }}
        text={MSG.title}
      />
      <div className={styles.linkContainer}>
        <NavLink
          activeClassName={styles.activeLink}
          text={MSG.buyLink}
          textValues={{ symbol: nativeToken.symbol }}
          to={`/colony/${colonyName}/tokens/purchase`}
        />
      </div>
    </section>
  );
};

ColonyBuyTokens.displayName = displayName;

export default ColonyBuyTokens;
