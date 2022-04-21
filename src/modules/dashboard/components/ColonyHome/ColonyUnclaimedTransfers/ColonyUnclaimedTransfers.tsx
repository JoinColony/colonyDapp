import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  useColonyTransfersQuery,
  Colony,
  useTokenQuery,
  useLoggedInUser,
} from '~data/index';

import { ActionButton } from '~core/Button';
import Heading from '~core/Heading';
import { MiniSpinnerLoader } from '~core/Preloaders';
import NavLink from '~core/NavLink';
import Numeral from '~core/Numeral';
import Tooltip from '~core/Popover';

import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './ColonyUnclaimedTransfers.css';

const displayName = 'dashboard.ColonyUnclaimedTransfers';

interface Props {
  colony: Colony;
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyUnclaimedTransfers.title',
    defaultMessage: 'Incoming funds',
  },
  loadingData: {
    id: 'dashboard.ColonyUnclaimedTransfers.title',
    defaultMessage: 'Loading token transfers...',
  },
  claimButton: {
    id: 'dashboard.ColonyUnclaimedTransfers.claimButton',
    defaultMessage: 'Claim',
  },
  tooltip: {
    id: 'dashboard.ColonyUnclaimedTransfers.tooltip',
    defaultMessage: 'Click to claim incoming funds for this colony.',
  },
  more: {
    id: 'dashboard.ColonyUnclaimedTransfers.more',
    defaultMessage: ' more',
  },
  unknownToken: {
    id: 'dashboard.ColonyUnclaimedTransfers.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

const ColonyUnclaimedTransfers = ({
  colony,
  colony: { colonyAddress, colonyName },
}: Props) => {
  const { data, error, loading } = useColonyTransfersQuery({
    variables: { address: colony.colonyAddress },
  });

  const { networkId, ethereal, username } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  const firstItem = data?.processedColony.unclaimedTransfers[0];

  const { data: tokenData } = useTokenQuery({
    variables: { address: firstItem?.token || '' },
  });

  const transform = useCallback(
    mergePayload({ colonyAddress, tokenAddress: firstItem?.token || '' }),
    [colonyAddress, firstItem],
  );

  if (error) console.warn(error);

  if (loading) {
    return (
      <MiniSpinnerLoader
        className={styles.main}
        loadingText={MSG.loadingData}
      />
    );
  }

  const token = tokenData?.token;

  return data && data.processedColony.unclaimedTransfers.length ? (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <NavLink to={`/colony/${colonyName}/funds`}>
          <FormattedMessage {...MSG.title} />
        </NavLink>
      </Heading>
      {data && (
        <ul>
          <li className={styles.firstLineContainer}>
            <div className={styles.tokenItem}>
              <span className={styles.tokenValue}>
                <Numeral
                  unit={getTokenDecimalsWithFallback(token?.decimals)}
                  value={firstItem?.amount || ''}
                />
              </span>
              <span className={styles.tokenSymbol}>
                {token?.symbol ? (
                  <span>{token?.symbol}</span>
                ) : (
                  <FormattedMessage {...MSG.unknownToken} />
                )}
              </span>
            </div>
            <Tooltip
              appearance={{ theme: 'dark', size: 'medium' }}
              trigger="hover"
              content={
                <div className={styles.tooltip}>
                  <FormattedMessage {...MSG.tooltip} />
                </div>
              }
              /*
                Not showing arrow here.
                If the screen is narrow the tooltip gets moved and the arrow looks wacky.
              */
              showArrow={false}
              placement="top-start"
              popperProps={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [5, 8],
                    },
                  },
                ],
              }}
            >
              <ActionButton
                text={MSG.claimButton}
                className={styles.button}
                submit={ActionTypes.COLONY_CLAIM_TOKEN}
                error={ActionTypes.COLONY_CLAIM_TOKEN_ERROR}
                success={ActionTypes.COLONY_CLAIM_TOKEN_SUCCESS}
                transform={transform}
                disabled={!isNetworkAllowed || !hasRegisteredProfile}
              />
            </Tooltip>
          </li>
          <li>
            <div className={styles.tokenItem}>
              +{data?.processedColony.unclaimedTransfers.length - 1}
              <FormattedMessage {...MSG.more} />
            </div>
          </li>
        </ul>
      )}
    </div>
  ) : null;
};

ColonyUnclaimedTransfers.displayName = displayName;

export default ColonyUnclaimedTransfers;
