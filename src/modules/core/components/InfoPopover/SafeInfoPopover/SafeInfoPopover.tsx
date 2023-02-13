import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ColonySafe } from '~data/index';
import ExternalLink from '~core/ExternalLink';
import { getSafeLink } from '~externalUrls';
import { DialogType } from '~core/Dialog';
import { ETHEREUM_NETWORK, SUPPORTED_SAFE_NETWORKS } from '~constants';
import Button from '~core/Button';

import SafeInfo from './SafeInfo';

import styles from './SafeInfoPopover.css';

interface Props {
  safe: ColonySafe;
  openControlSafeDialog: (safe: ColonySafe) => DialogType<any>;
  closePopover: () => void;
}

const MSG = defineMessages({
  buttonText: {
    id: 'InfoPopover.SafeInfoPopover.buttonText',
    defaultMessage: 'Control the Safe',
  },
  linkText: {
    id: 'InfoPopover.SafeInfoPopover.linkText',
    defaultMessage: 'Go to the Safe',
  },
});

const displayName = 'InfoPopover.SafeInfoPopover';

const SafeInfoPopover = ({
  safe,
  openControlSafeDialog,
  closePopover,
}: Props) => {
  const selectedChain = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.chainId === Number(safe.chainId),
  );
  const safeLink = getSafeLink(
    selectedChain?.shortName.toLowerCase() ||
      ETHEREUM_NETWORK.shortName.toLowerCase(),
    safe.contractAddress,
  );
  return (
    <div className={styles.main}>
      <div className={styles.section}>
        <SafeInfo safe={safe} />
      </div>
      <div className={styles.section}>
        <Button
          appearance={{ theme: 'blue', size: 'small' }}
          text={MSG.buttonText}
          onClick={() => {
            openControlSafeDialog(safe);
            closePopover();
          }}
        />
        <ExternalLink href={safeLink} className={styles.safeLink}>
          <FormattedMessage {...MSG.linkText} />
        </ExternalLink>
      </div>
    </div>
  );
};

SafeInfoPopover.displayName = displayName;

export default SafeInfoPopover;
