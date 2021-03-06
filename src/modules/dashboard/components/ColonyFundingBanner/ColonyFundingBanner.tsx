import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import MaskedAddress from '~core/MaskedAddress';
import { Address } from '~types/index';
import { splitAddress } from '~utils/strings';

import styles from './ColonyFundingBanner.css';

const MSG = defineMessages({
  tipText: {
    id: 'dashboard.ColonyFundingBanner.tipText',
    defaultMessage: `Tip: to fund your colony, send tokens to your colony's address:`,
  },
});

interface Props {
  colonyAddress: Address;
}

const displayName = 'dashboard.ColonyFundingBanner';

const ColonyFundingBanner = ({ colonyAddress }: Props) => {
  const formattedAddress = useMemo(() => {
    const addressElements = splitAddress(colonyAddress);
    if (!(addressElements instanceof Error)) {
      return (
        <div className={styles.address}>
          <span>
            {addressElements.header}
            {addressElements.start}
          </span>
          <span>{addressElements.middle}</span>
          <span>{addressElements.end}</span>
        </div>
      );
    }
    return <MaskedAddress address={colonyAddress} />;
  }, [colonyAddress]);

  return (
    <div className={styles.main}>
      <FormattedMessage {...MSG.tipText} />
      {formattedAddress}
    </div>
  );
};

ColonyFundingBanner.displayName = displayName;

export default ColonyFundingBanner;
