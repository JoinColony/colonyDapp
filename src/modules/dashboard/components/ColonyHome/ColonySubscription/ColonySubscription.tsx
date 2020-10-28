import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';
import {
  useLoggedInUser,
  useSubscribeToColonyMutation,
  useUnsubscribeFromColonyMutation,
  useUserColonyAddressesQuery,
  cacheUpdates,
  Colony,
} from '~data/index';
import ColonySubscriptionInfoPopover from './ColonySubscriptionInfoPopover';

import styles from './ColonySubscription.css';

const MSG = defineMessages({
  joinColony: {
    id: 'dashboard.ColonyHome.ColonySubscription.joinColony',
    defaultMessage: 'Join',
  },
  colonyMenuTitle: {
    id: 'dashboard.ColonyHome.ColonySubscription.colonyMenuTitle',
    defaultMessage: 'Colony Menu',
  },
});

interface Props {
  colony: Colony;
}

const ColonySubscription = ({
  colony: {
    colonyAddress,
    displayName: colonyDisplayName,
    colonyName,
    nativeTokenAddress,
  },
}: Props) => {
  const { username, walletAddress } = useLoggedInUser();

  const { data } = useUserColonyAddressesQuery({
    variables: { address: walletAddress },
  });

  const [
    subscribe,
    { loading: loadingSubscribe },
  ] = useSubscribeToColonyMutation({
    variables: { input: { colonyAddress } },
    update: cacheUpdates.subscribeToColony(colonyAddress),
  });
  const [
    unsubscribe,
    { loading: loadingUnsubscribe },
  ] = useUnsubscribeFromColonyMutation({
    variables: { input: { colonyAddress } },
    update: cacheUpdates.unsubscribeFromColony(colonyAddress),
  });

  if (!username || !data) return null;

  const {
    user: { colonyAddresses },
  } = data;

  const isSubscribed = (colonyAddresses || []).includes(colonyAddress);

  return (
    <div className={styles.main}>
      {/* {loadingSubscribe ||
        (loadingUnsubscribe && (
          <div className={styles.spinnerContainer}>
            <SpinnerLoader appearance={{ theme: 'primary', size: 'small' }} />
          </div>
        ))} */}
      {!isSubscribed && (
        <button
          type="button"
          className={styles.joinColony}
          onClick={() => subscribe()}
        >
          <FormattedMessage {...MSG.joinColony} />
        </button>
      )}
      {isSubscribed && (
        <ColonySubscriptionInfoPopover
          colonyAddress={colonyAddress}
          colonyDisplayName={colonyDisplayName || colonyName}
          colonyName={colonyName}
          nativeTokenAddress={nativeTokenAddress}
          onUnsubscribe={() => unsubscribe()}
        >
          <div className={styles.menuIconContainer}>
            <Icon
              className={styles.menuIcon}
              name="three-dots-row"
              title={MSG.colonyMenuTitle}
            />
          </div>
        </ColonySubscriptionInfoPopover>
      )}
    </div>
  );
};

ColonySubscription.displayName = 'dashboard.ColonyHome.ColonySubscription';

export default ColonySubscription;
