import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useMediaQuery } from 'react-responsive';
import classnames from 'classnames';

import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';
import Button from '~core/Button';
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

import styles from './ColonySubscription.css';
import { mobile } from '~utils/mediaQueries';

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

  const isMobile = useMediaQuery({ query: mobile });

  if (isMobile) MSG.joinColony.defaultMessage = 'Join this colony';

  return (
    <div className={styles.main}>
      {loadingSubscribe ||
        (loadingUnsubscribe && (
          <div className={styles.spinnerContainer}>
            <SpinnerLoader appearance={{ theme: 'primary', size: 'small' }} />
          </div>
        ))}
      {!isSubscribed && username && (
        <Button
          onClick={() => subscribe()}
          appearance={{ theme: 'blue', size: 'small' }}
          data-test="joinColonyButton"
          className={styles.joinButton}
        >
          <FormattedMessage {...MSG.joinColony} />
        </Button>
      )}
      {!isSubscribed && !username && (
        <Link
          className={`${styles.joinButton} ${styles.createUserRedirect}`}
          to={{
            pathname: CREATE_USER_ROUTE,
            state: { colonyURL: `/colony/${colonyName}` },
          }}
          text={MSG.joinColony}
        />
      )}
      {isSubscribed && (
        <ColonySubscriptionInfoPopover
          colony={colony}
          onUnsubscribe={() => unsubscribe()}
          canUnsubscribe={isNetworkAllowed}
        >
          {({ isOpen, toggle, ref, id }) => (
            <div
              id={id}
              ref={ref}
              className={classnames(styles.menuIconContainer, {
                [styles.menuActive]: isOpen,
              })}
              onClick={toggle}
              onKeyDown={toggle}
              role="button"
              tabIndex={0}
              data-test="colonyMenuPopover"
            >
              <Icon
                className={styles.menuIcon}
                name="three-dots-row"
                title={MSG.colonyMenuTitle}
              />
            </div>
          )}
        </ColonySubscriptionInfoPopover>
      )}
    </div>
  );
};

ColonySubscription.displayName = 'dashboard.ColonyHome.ColonySubscription';

export default ColonySubscription;
