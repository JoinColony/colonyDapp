import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import NavLink from '~core/NavLink';
import { useColonyNativeTokenQuery, useTokenInfoLazyQuery } from '~data/index';
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
  colonyAddress: Address;
  colonyName: string;
}

const displayName = 'dashboard.ColonyHome.ColonyMeta.ColonyBuyTokens';

const ColonyBuyTokens = ({ colonyAddress, colonyName }: Props) => {
  // @todo use real check for this
  const canColonySellTokens = true;

  const { data: nativeTokenAddressData } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });

  const [fetchTokenInfo, { data: nativeTokenData }] = useTokenInfoLazyQuery();

  useEffect(() => {
    if (nativeTokenAddressData) {
      const {
        colony: { nativeTokenAddress },
      } = nativeTokenAddressData;
      fetchTokenInfo({ variables: { address: nativeTokenAddress } });
    }
  }, [fetchTokenInfo, nativeTokenAddressData]);

  if (!canColonySellTokens || !nativeTokenData) {
    return null;
  }

  const {
    tokenInfo: { symbol },
  } = nativeTokenData;

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
          textValues={{ symbol }}
          to={`/colony/${colonyName}/tokens/purchase`}
        />
      </div>
    </section>
  );
};

ColonyBuyTokens.displayName = displayName;

export default ColonyBuyTokens;
