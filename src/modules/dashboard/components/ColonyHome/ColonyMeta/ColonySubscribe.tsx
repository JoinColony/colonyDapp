import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import Button from '~core/Button';
import { Tooltip } from '~core/Popover';
import { SpinnerLoader } from '~core/Preloaders';
import {
  useLoggedInUser,
  useSubscribeToColonyMutation,
  useUnsubscribeFromColonyMutation,
  useUserColonyAddressesQuery,
  ColonySubscribedUsersDocument,
} from '~data/index';

import styles from './ColonySubscribe.css';

const MSG = defineMessages({
  changingSubscription: {
    id: 'dashboard.ColonyHome.ColonySubscribe.changingSubscription',
    defaultMessage: 'Please wait',
  },
  subscribe: {
    id: 'dashboard.ColonyHome.ColonySubscribe.subscribe',
    defaultMessage: 'Add to My Colonies',
  },
  unsubscribe: {
    id: 'dashboard.ColonyHome.ColonySubscribe.unsubscribe',
    defaultMessage: 'Remove from My Colonies',
  },
});

interface Props {
  colonyAddress: Address;
}

const ColonySubscribe = ({ colonyAddress }: Props) => {
  const { username, walletAddress } = useLoggedInUser();
  const { data } = useUserColonyAddressesQuery({
    variables: { address: walletAddress },
  });

  const [
    subscribe,
    { loading: loadingSubscribe },
  ] = useSubscribeToColonyMutation({
    variables: { input: { colonyAddress } },
    refetchQueries: [
      {
        query: ColonySubscribedUsersDocument,
        variables: { colonyAddress },
      },
    ],
  });
  const [
    unsubscribe,
    { loading: loadingUnsubscribe },
  ] = useUnsubscribeFromColonyMutation({
    variables: { input: { colonyAddress } },
    refetchQueries: [
      {
        query: ColonySubscribedUsersDocument,
        variables: { colonyAddress },
      },
    ],
  });

  if (!username || !data) return null;

  const {
    user: { colonyAddresses },
  } = data;

  const isSubscribed = (colonyAddresses || []).includes(colonyAddress);

  if (loadingSubscribe || loadingUnsubscribe) {
    return (
      <div className={styles.spinnerContainer}>
        <SpinnerLoader appearance={{ theme: 'primary', size: 'small' }} />
      </div>
    );
  }

  return (
    <Tooltip
      content={
        <span>
          <FormattedMessage
            {...(isSubscribed ? MSG.unsubscribe : MSG.subscribe)}
          />
        </span>
      }
    >
      <Button
        className={isSubscribed ? styles.unsubscribe : styles.subscribe}
        onClick={isSubscribed ? unsubscribe : subscribe}
      />
    </Tooltip>
  );
};

ColonySubscribe.displayName = 'dashboard.ColonyHome.ColonySubscribe';

export default ColonySubscribe;
