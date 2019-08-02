/* @flow */

import type { IntlShape } from 'react-intl';

// $FlowFixMe upgrade flow
import React, { useEffect } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import { ACTIONS } from '~redux';
import Popover from '~core/Popover';
import NetworkHealthIcon from './NetworkHealthIcon';
import NetworkHealthContent from './NetworkHealthContent';
import { capitalize } from '~utils/strings';

import type {
  NetworkHealth as NetworkHealthType,
  NetworkHealthIconSize,
} from './types';

import styles from './NetworkHealth.css';

const MSG = defineMessages({
  /*
   * Shown by the default Browser title on hover
   */
  statusTitle: {
    id: 'core.NetworkHealth.statusTitle',
    defaultMessage: 'Network Health: {health}',
  },
  /*
   * @TODO Create actual health items message descriptors
   */
  ipfsPing: {
    id: 'core.NetworkHealth.ipfsPing',
    defaultMessage: 'IPFS Ping: {ipfsPing}',
  },
  pinnerHeads: {
    id: 'core.NetworkHealth.pinnerHeads',
    defaultMessage: 'Pinner Heads: {heads}',
  },
  pubsubPeers: {
    id: 'core.NetworkHealth.pubsubPeers',
    defaultMessage: 'Pubsub Peers: {pubSubPeers}',
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

  /*
   * @TODO Replace with actual aggregated health status
   */
  const health: NetworkHealthType = 'mean';
  const networkItems = [
    {
      itemHealth: 'good',
      itemTitle: MSG.ipfsPing,
      itemTitleValues: { ipfsPing: '1000ms' },
    },
    {
      itemHealth: 'mean',
      itemTitle: MSG.pinnerHeads,
      itemTitleValues: { heads: '5' },
    },
    {
      itemHealth: 'critical',
      itemTitle: MSG.pubsubPeers,
      itemTitleValues: { pubSubPeers: '0' },
    },
  ];
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
          title={formatMessage(MSG.statusTitle, { health: capitalize(health) })}
        >
          <NetworkHealthIcon health={health} appearance={appearance} />
        </button>
      </Popover>
    </div>
  );
};

NetworkHealth.displayName = displayName;

export default injectIntl(NetworkHealth);
