/* @flow */

// $FlowFixMe
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Address } from '~types';

import { useDataFetcher, useSelector } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import { ACTIONS } from '~redux';

import { ActionButton } from '~core/Button';
import { Tooltip } from '~core/Popover';

import { currentUserColoniesFetcher } from '../../../fetchers';
import { currentUsernameSelector } from '../../../../users/selectors';

import styles from './ColonySubscribe.css';

const MSG = defineMessages({
  subscribe: {
    id: 'dashboard.ColonyHome.ColonySubscribe.subscribe',
    defaultMessage: 'Add to My Colonies',
  },
  unsubscribe: {
    id: 'dashboard.ColonyHome.ColonySubscribe.unsubscribe',
    defaultMessage: 'Remove from My Colonies',
  },
});

type Props = {|
  colonyAddress: Address,
|};

const ColonySubscribe = ({ colonyAddress }: Props) => {
  const { data: colonyAddresses } = useDataFetcher<Address[]>(
    currentUserColoniesFetcher,
    [],
    [],
  );
  const isSubscribed = (colonyAddresses || []).includes(colonyAddress);
  const transform = useCallback(mergePayload({ colonyAddress }), [
    colonyAddress,
  ]);
  const username: ?string = useSelector(currentUsernameSelector);

  if (!username) {
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
            className={styles.unsubscribe}
            error={ACTIONS.USER_COLONY_UNSUBSCRIBE_ERROR}
            submit={ACTIONS.USER_COLONY_UNSUBSCRIBE}
            success={ACTIONS.USER_COLONY_UNSUBSCRIBE_SUCCESS}
            transform={transform}
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
            className={styles.subscribe}
            error={ACTIONS.USER_COLONY_SUBSCRIBE_ERROR}
            submit={ACTIONS.USER_COLONY_SUBSCRIBE}
            success={ACTIONS.USER_COLONY_SUBSCRIBE_SUCCESS}
            transform={transform}
          />
        </Tooltip>
      )}
    </>
  );
};

ColonySubscribe.displayName = 'dashboard.ColonyHome.ColonySubscribe';

export default ColonySubscribe;
