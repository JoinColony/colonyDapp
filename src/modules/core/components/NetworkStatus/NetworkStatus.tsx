import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { MiniSpinnerLoaderWrapper } from '~core/MiniSpinnerLoaderWrapper';
import styles from './NetworkStatus.css';
import {
  useLatestRpcBlockQuery,
  useColonyServerLivenessQuery,
  useLatestSubgraphBlockQuery,
  useReputationOracleLivenessQuery,
} from '~data/index';

import Popover from '~core/Popover';
import Icon from '~core/Icon';
import ExternalLink from '~core/ExternalLink';
import { NETWORK_HEALTH } from '~externalUrls';

const MSG = defineMessages({
  networkHealthHeader: {
    id: 'pages.NavigationWrapper.UserNavigation.networkHealthHeader',
    defaultMessage: `Network health is {networkHealth}`,
  },

  networkHealthDescription: {
    id: 'pages.NavigationWrapper.UserNavigation.networkHealthDescription',
    defaultMessage: `{networkHealth, select,
      poor
        {You should be able to perform actions, however,
        there is problem retrieving new information from the
        chain. We are working to resolve this.}
      critical
        {You will have trouble performing actions and retrieving
        information from the chain. We are working to resolve this.}
        other {Network is healthy.}}`,
  },
});

const NetworkStatus = () => {
  type NetworkHealthType = 'healthy' | 'poor' | 'critical';
  const [networkHealth, setNetworkHealth] = useState<NetworkHealthType>('poor');

  const networkCheckInterval = 10 * 1000; // 3 minutes

  /* const TIMEOUT = 20 * 1000; // Timeout requests after 20 seconds */
  const networkHealthLoadingTime = 1 * 2000; // Show the mini spinner loader for 2 seconds

  const {
    data: latestRpcBlock,
    /* loading: latestRpcBlockLoading, */
    /* error: latestRpcBlockError, */
  } = useLatestRpcBlockQuery({
    pollInterval: networkCheckInterval,
  });

  const { data: isColonyServerAlive } = useColonyServerLivenessQuery({
    pollInterval: networkCheckInterval,
  });

  const { data: isReputationOracleAlive } = useReputationOracleLivenessQuery({
    pollInterval: networkCheckInterval,
  });

  const {
    data: latestSubgraphBlock,
    /* error: latestSubgraphBlockError, */
  } = useLatestSubgraphBlockQuery({
    pollInterval: networkCheckInterval,
  });

  const { formatMessage } = useIntl();

  useEffect(() => {
    const networkCheckTwo = setInterval(async () => {
      if (
        !isReputationOracleAlive?.isReputationOracleAlive ||
        !isColonyServerAlive?.isServerAlive ||
        (latestRpcBlock &&
          latestSubgraphBlock &&
          latestRpcBlock.latestRpcBlock >
            latestSubgraphBlock.latestSubgraphBlock)
      ) {
        setNetworkHealth('poor');
      } else {
        // If everything is okay, set health to healthy (to correct for the previous state)
        setNetworkHealth('healthy');
      }
      // @TODO the critical cases
    }, networkCheckInterval);
    return () => clearInterval(networkCheckTwo);
  });
  return (
    <>
      {networkHealth !== 'healthy' && (
        <div>
          <MiniSpinnerLoaderWrapper milliseconds={networkHealthLoadingTime}>
            <Popover
              appearance={{ theme: 'grey' }}
              showArrow={false}
              placement="bottom-start"
              content={() => (
                <div className={styles.networkHealth}>
                  <div className={styles.networkHealthHeading}>
                    <span
                      className={cx(
                        styles[`networkHealthIcon-${networkHealth}`],
                        styles.networkHealthIcon,
                      )}
                    >
                      <Icon name="triangle-warning" />
                    </span>
                    <span>
                      {formatMessage(MSG.networkHealthHeader, {
                        networkHealth,
                      })}
                    </span>
                  </div>
                  <span className={styles.networkHealthDescription}>
                    {formatMessage(MSG.networkHealthDescription, {
                      networkHealth,
                    })}
                  </span>

                  <ExternalLink
                    text={{ id: 'text.learnMore' }}
                    className={styles.link}
                    href={NETWORK_HEALTH}
                  />
                </div>
              )}
              popperProps={{
                modifiers: [
                  {
                    name: 'offset',
                    options: { offset: [0, 9] },
                  },
                ],
              }}
            >
              <div
                className={`${styles.elementWrapper}
                            ${styles.networkInfo}
                            ${styles.networkHealthHeading}`}
              >
                <span
                  className={cx(
                    styles[`networkHealthIcon-${networkHealth}`],
                    styles.networkHealthIcon,
                  )}
                >
                  <Icon name="triangle-warning" />
                </span>
                Network
              </div>
            </Popover>
          </MiniSpinnerLoaderWrapper>
        </div>
      )}
    </>
  );
};

export default NetworkStatus;
