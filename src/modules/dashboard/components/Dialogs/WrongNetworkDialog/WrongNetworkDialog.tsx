import { Network } from '@colony/colony-js';
import React, { useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { DEFAULT_NETWORK, NETWORK_DATA } from '~constants';

import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import ExternalLink from '~core/ExternalLink';
import Heading from '~core/Heading';
import { useLoggedInUser } from '~data/helpers';

import { WALLET_CONNECT_XDAI } from '~externalUrls';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import styles from './WrongNetworkDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHome.WrongNetworkDialog.title',
    defaultMessage: 'Wrong Network',
  },
  description: {
    id: 'dashboard.ColonyHome.WrongNetworkDialog.description',
    defaultMessage: 'Please connect to {networkName}. <a>Learn more</a>',
  },
});

const displayName = 'dashboard.ColonyHome.WrongNetworkDialog';

const WrongNetworkDialog = ({ cancel }: DialogProps) => {
  const { networkId, ethereal } = useLoggedInUser();
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  const networkName = NETWORK_DATA[process.env.NETWORK || DEFAULT_NETWORK].name;

  useEffect(() => {
    if (ethereal || isNetworkAllowed) {
      cancel();
    }
  }, [ethereal, isNetworkAllowed, cancel]);

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          <Heading
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            text={MSG.title}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalContent}>
          <FormattedMessage
            {...MSG.description}
            values={{
              a: (chunks) => (
                <>
                  {process.env.NETWORK === Network.Xdai ||
                    (process.env.NETWORK === Network.XdaiFork && (
                      <ExternalLink href={WALLET_CONNECT_XDAI}>
                        {chunks}
                      </ExternalLink>
                    ))}
                </>
              ),
              networkName,
            }}
          />
        </div>
      </DialogSection>
    </Dialog>
  );
};

WrongNetworkDialog.displayName = displayName;

export default WrongNetworkDialog;
