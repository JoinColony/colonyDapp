import React, { useCallback, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { subscribeActions as subscribeToReduxActions } from 'redux-action-watch/lib/actionCreators';
import { useDispatch } from 'redux-react-hook';
import throttle from 'lodash/throttle';

import { Address } from '~types/index';
import { useDataSubscriber, useSelector } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import Button, { ActionButton } from '~core/Button';
import { Tooltip } from '~core/Popover';
import { SpinnerLoader } from '~core/Preloaders';
import { userColoniesSubscriber } from '../../../subscribers';
import { currentUserSelector } from '../../../../users/selectors';
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
  const [
    isUserColonySubscriptionChanging,
    setUserColonySubscriptionChanging,
  ] = useState(false);
  const dispatch = useDispatch();
  useEffect(
    () =>
      subscribeToReduxActions(dispatch)({
        [ActionTypes.USER_COLONY_SUBSCRIBE]: () =>
          setUserColonySubscriptionChanging(true),
        [ActionTypes.USER_COLONY_UNSUBSCRIBE]: () =>
          setUserColonySubscriptionChanging(true),
        [ActionTypes.USER_COLONY_SUBSCRIBE_ERROR]: () =>
          setUserColonySubscriptionChanging(false),
        [ActionTypes.USER_COLONY_SUBSCRIBE_SUCCESS]: () =>
          setUserColonySubscriptionChanging(false),
        [ActionTypes.USER_COLONY_UNSUBSCRIBE_ERROR]: () =>
          setUserColonySubscriptionChanging(false),
        [ActionTypes.USER_COLONY_UNSUBSCRIBE_SUCCESS]: () =>
          setUserColonySubscriptionChanging(false),
      }),
    [dispatch, setUserColonySubscriptionChanging],
  );

  const currentUser = useSelector(currentUserSelector);
  const { data: colonyAddresses } = useDataSubscriber<Address[]>(
    userColoniesSubscriber,
    [currentUser.profile.walletAddress],
    [
      currentUser.profile.walletAddress,
      currentUser.profile.metadataStoreAddress,
    ],
  );
  const isSubscribed = (colonyAddresses || []).includes(colonyAddress);
  const transform = useCallback(mergePayload({ colonyAddress }), [
    colonyAddress,
  ]);

  if (!currentUser.profile.username) {
    return null;
  }

  return (
    <>
      {isSubscribed ? (
        <Tooltip
          content={
            <span>
              <FormattedMessage {...MSG.unsubscribe} />
            </span>
          }
        >
          <ActionButton
            button={({ onClick, disabled, loading }) =>
              loading ? (
                <div className={styles.spinnerContainer}>
                  <SpinnerLoader
                    appearance={{ theme: 'primary', size: 'medium' }}
                  />
                </div>
              ) : (
                <Button
                  className={styles.unsubscribe}
                  disabled={disabled}
                  loading={loading}
                  onClick={throttle(onClick, 2000)}
                />
              )
            }
            error={ActionTypes.USER_COLONY_UNSUBSCRIBE_ERROR}
            submit={ActionTypes.USER_COLONY_UNSUBSCRIBE}
            success={ActionTypes.USER_COLONY_UNSUBSCRIBE_SUCCESS}
            transform={transform}
            loading={isUserColonySubscriptionChanging}
          />
        </Tooltip>
      ) : (
        <Tooltip
          content={
            <span>
              <FormattedMessage {...MSG.subscribe} />
            </span>
          }
        >
          <ActionButton
            button={({ onClick, disabled, loading }) =>
              loading ? (
                <div className={styles.spinnerContainer}>
                  <SpinnerLoader
                    appearance={{ theme: 'primary', size: 'medium' }}
                  />
                </div>
              ) : (
                <Button
                  className={styles.subscribe}
                  disabled={disabled}
                  loading={loading}
                  onClick={throttle(onClick, 2000)}
                />
              )
            }
            error={ActionTypes.USER_COLONY_SUBSCRIBE_ERROR}
            submit={ActionTypes.USER_COLONY_SUBSCRIBE}
            success={ActionTypes.USER_COLONY_SUBSCRIBE_SUCCESS}
            transform={transform}
            loading={isUserColonySubscriptionChanging}
          />
        </Tooltip>
      )}
    </>
  );
};

ColonySubscribe.displayName = 'dashboard.ColonyHome.ColonySubscribe';

export default ColonySubscribe;
