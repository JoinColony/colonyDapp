/* @flow */

import type { IntlShape } from 'react-intl';

// $FlowFixMe upgrade flow
import React, { useEffect } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import { ACTIONS } from '~redux';
import Popover from '~core/Popover';
import { useSelector } from '~utils/hooks';

import type { NetworkHealthIconSize } from './types';

import { connection as connectionStatsSelector } from '../../selectors';
import getNetworkHealth from './getNetworkHealth';
import NetworkHealthIcon from './NetworkHealthIcon';
import NetworkHealthContent from './NetworkHealthContent';

import styles from './NetworkHealth.css';

const MSG = defineMessages({
  /*
   * Shown by the default Browser title on hover
   */
  statusTitle: {
    id: 'core.NetworkHealth.statusTitle',
    defaultMessage: `Network Health: {health, select,
      3 {good}
      2 {so so}
      1 {poor}
    }`,
  },
});

type Appearance = {|
  /** Size of the main network health icon that's being wrapped in the popover. */
  size?: NetworkHealthIconSize,
|};

type Props = {|
  appearance?: Appearance,
  className?: string,
  /** @ignore Injected by `injectIntl` */
  intl: IntlShape,
|};

const displayName = 'NetworkHealth';

const NetworkHealth = ({
  appearance,
  className,
  intl: { formatMessage },
}: Props) => {
  const dispatch = useDispatch();
  useEffect(
    () => {
      dispatch({ type: ACTIONS.CONNECTION_STATS_SUB_START });
    },
    [dispatch],
  );

  const connectionStats = useSelector(connectionStatsSelector);
  const networkItems = getNetworkHealth(connectionStats);

  const health = Math.round(
    networkItems.reduce((sum, current) => sum + current.itemHealth, 0) /
      networkItems.length,
  );

  return (
    <div className={className}>
      <Popover
        appearance={{ theme: 'grey' }}
        content={({ close }) => (
          <NetworkHealthContent
            close={close}
            health={health}
            networkItems={networkItems}
          />
        )}
        placement="bottom"
        showArrow={false}
      >
        <button
          type="button"
          className={styles.main}
          title={formatMessage(MSG.statusTitle, { health })}
        >
          <NetworkHealthIcon health={health} appearance={appearance} />
        </button>
      </Popover>
    </div>
  );
};

NetworkHealth.displayName = displayName;

export default injectIntl(NetworkHealth);
