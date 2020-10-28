import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';
import { Address } from '~types/index';
import {
  useLoggedInUser,
  useSubscribeToColonyMutation,
  useUnsubscribeFromColonyMutation,
  useUserColonyAddressesQuery,
  cacheUpdates,
} from '~data/index';

import styles from './ColonySubscription.css';

const MSG = defineMessages({
  joinColony: {
    id: 'dashboard.ColonyHome.ColonySubscription.joinColony',
    defaultMessage: 'Join',
  },
  leaveColonyQuestion: {
    id: 'dashboard.ColonyHome.ColonySubscription.leaveColonyQuestion',
    defaultMessage: 'Leave?',
  },
});

interface Props {
  colonyAddress: Address;
}

const ColonySubscription = ({ colonyAddress }: Props) => {
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
      {!isSubscribed && (
        <button type="button" className={styles.joinColony}>
          <FormattedMessage {...MSG.joinColony} />
        </button>
      )}
      {loadingSubscribe || loadingUnsubscribe && (
        <div className={styles.spinnerContainer}>
          <SpinnerLoader appearance={{ theme: 'primary', size: 'small' }} />
        </div>
      )}
    </div>
  );
};

ColonySubscription.displayName = 'dashboard.ColonyHome.ColonySubscription';

export default ColonySubscription;
