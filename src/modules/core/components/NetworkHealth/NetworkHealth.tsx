import React, { useEffect } from 'react';
import {
  injectIntl,
  defineMessages,
  IntlShape,
  FormattedMessage,
} from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import { ConnectionType } from '~immutable/index';
import { ActionTypes } from '~redux/index';
import Popover from '~core/Popover';
import { useSelector } from '~utils/hooks';
import { NetworkHealthIconSize } from './types';
import { connection as connectionSelector } from '../../selectors';
import getNetworkHealth from './getNetworkHealth';
import getNetworkBusyState from './getNetworkBusyState';
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
      2 {fair}
      1 {poor}
    }`,
  },
  busyLabel: {
    id: 'core.NetworkHealth.busyLabel',
    defaultMessage: 'Busy...',
  },
});

type Appearance = {
  /** Size of the main network health icon that's being wrapped in the popover. */
  size?: NetworkHealthIconSize;
};

interface Props {
  appearance?: Appearance;
  className?: string;

  /** @ignore Injected by `injectIntl` */
  intl: IntlShape;
}

const displayName = 'NetworkHealth';

const NetworkHealth = ({
  appearance,
  className,
  intl: { formatMessage },
}: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ActionTypes.CONNECTION_STATS_SUB_START });
    return () => {
      dispatch({ type: ActionTypes.CONNECTION_STATS_SUB_STOP });
    };
  }, [dispatch]);

  const connection: ConnectionType = useSelector(connectionSelector);
  const networkItems = getNetworkHealth(connection);
  const busyItems = getNetworkBusyState(connection);

  // Errors are important so we set the whole thing to 1 if there are a lot (> 1)
  const health =
    connection.errors.length > 1 || connection.stats.pinners.length < 1
      ? 1
      : Math.round(
          networkItems.reduce((sum, current) => sum + current.itemHealth, 0) /
            networkItems.length,
        );
  const isNetworkBusy = busyItems.some(({ busyState }) => busyState === true);

  return (
    <div className={className}>
      <Popover
        appearance={{ theme: 'grey' }}
        content={({ close }) => (
          <NetworkHealthContent
            close={close}
            health={health}
            networkItems={networkItems}
            networkBusy={isNetworkBusy}
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
          {isNetworkBusy && (
            <span className={styles.busy}>
              <FormattedMessage {...MSG.busyLabel} />
            </span>
          )}
          <NetworkHealthIcon health={health} appearance={appearance} />
        </button>
      </Popover>
    </div>
  );
};

NetworkHealth.displayName = displayName;

export default injectIntl(NetworkHealth);
