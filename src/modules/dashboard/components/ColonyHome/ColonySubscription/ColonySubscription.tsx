import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import { SpinnerLoader } from '~core/Preloaders';
import Button, { ThreeDotsButton } from '~core/Button';
import Link from '~core/Link';

import {
  useLoggedInUser,
  useSubscribeToColonyMutation,
  useUnsubscribeFromColonyMutation,
  useUserColonyAddressesQuery,
  cacheUpdates,
  Colony,
} from '~data/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { CREATE_USER_ROUTE } from '~routes/index';

import ColonySubscriptionInfoPopover from './ColonySubscriptionInfoPopover';
import ColonyAddress from '../ColonyTitle/ColonyAddress';

import styles from './ColonySubscription.css';
import { query700 as query } from '~styles/queries.css';

const MSG = defineMessages({
  copyMessage: {
    id: 'dashboard.ColonyHome.ColonySubscription.copyMessage',
    defaultMessage: 'Click to copy colony address',
  },
  joinColony: {
    id: 'dashboard.ColonyHome.ColonySubscription.joinColony',
    defaultMessage: 'Join this colony',
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
  colony: { colonyAddress, colonyName },
  colony,
}: Props) => {
  const { username, walletAddress, networkId } = useLoggedInUser();

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

  const isSubscribed = (data?.user?.colonyAddresses || []).includes(
    colonyAddress,
  );

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  const isMobile = useMediaQuery({ query });

  return (
    <div className={styles.main}>
      {loadingSubscribe ||
        (loadingUnsubscribe && (
          <div className={styles.spinnerContainer}>
            <SpinnerLoader appearance={{ theme: 'primary', size: 'small' }} />
          </div>
        ))}
      <div className={isSubscribed ? styles.colonySubscribed : ''}>
        {colonyAddress && !isMobile && (
          <ColonyAddress colonyAddress={colonyAddress} />
        )}
        {isSubscribed && (
          <ColonySubscriptionInfoPopover
            colony={colony}
            onUnsubscribe={() => unsubscribe()}
            canUnsubscribe={isNetworkAllowed}
          >
            {({ isOpen, toggle, ref, id }) => (
              <ThreeDotsButton
                id={id}
                innerRef={ref}
                isOpen={isOpen}
                className={styles.menuIconContainer}
                activeStyles={styles.menuActive}
                onClick={toggle}
                tabIndex={0}
                data-test="colonyMenuPopover"
                title={MSG.colonyMenuTitle}
              />
            )}
          </ColonySubscriptionInfoPopover>
        )}
        {!isSubscribed && (
          <div className={styles.colonyJoin}>
            {username && (
              <Button
                onClick={() => subscribe()}
                appearance={{ theme: 'blue', size: 'small' }}
                data-test="joinColonyButton"
                className={styles.colonyJoinBtn}
              >
                <FormattedMessage {...MSG.joinColony} />
              </Button>
            )}
            {!username && (
              <Link
                className={styles.colonyJoinBtn}
                to={{
                  pathname: CREATE_USER_ROUTE,
                  state: { colonyURL: `/colony/${colonyName}` },
                }}
                text={MSG.joinColony}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ColonySubscription.displayName = 'dashboard.ColonyHome.ColonySubscription';

export default ColonySubscription;
