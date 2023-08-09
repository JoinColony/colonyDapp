import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  useColonyTransfersQuery,
  Colony,
  useTokenQuery,
  useLoggedInUser,
} from '~data/index';

import { ActionButton } from '~core/Button';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';
import Link from '~core/Link';
import { MiniSpinnerLoader } from '~core/Preloaders';
import ClickableHeading from '~core/ClickableHeading';

import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './ColonyUnclaimedTransfers.css';

const displayName = 'dashboard.ColonyHome.ColonyUnclaimedTransfers';

interface Props {
  colony: Colony;
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.title',
    defaultMessage: 'Incoming funds',
  },
  claimButton: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.claimButton',
    defaultMessage: 'Claim',
  },
  tooltip: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.tooltip',
    defaultMessage: 'Click to claim incoming funds for this colony.',
  },
  more: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.more',
    defaultMessage: '+ {extraClaims} more',
  },
  unknownToken: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.unknownToken',
    defaultMessage: 'Unknown Token',
  },
  loadingData: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.title',
    defaultMessage: 'Fetching incoming token transfers...',
  },
  timeLeftTooltip: {
    id: 'dashboard.ColonyHome.ColonyUnclaimedTransfers.timeLeftTooltip',
    defaultMessage: 'Estimated time remaining: {timeLeft}',
  },
});

const ColonyUnclaimedTransfers = ({
  colony,
  colony: { colonyAddress, colonyName, tokens },
}: Props) => {
  const ESTIMATED_SECS_TO_FETCH_TOKEN_TRANSFERS = 20;
  const [secsLeft, updateSecsLeft] = useState(
    ESTIMATED_SECS_TO_FETCH_TOKEN_TRANSFERS * (tokens.length || 1),
  );

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

  const claimsLength = data?.processedColony?.unclaimedTransfers?.length;
  const extraClaims = (claimsLength || 0) - 1;

  if (error) console.warn(error);

  const token = tokenData?.token;

  useEffect(() => {
    const timer = setInterval(() => {
      updateSecsLeft(secsLeft - 1);
    }, 1000);
    if (secsLeft < 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [loading, secsLeft]);

  if (loading) {
    return (
      <div className={styles.main}>
        <ClickableHeading linkTo={`/colony/${colonyName}/funds`}>
          <FormattedMessage {...MSG.title} />
        </ClickableHeading>
        <Tooltip
          content={
            <div className={styles.estimatedTimeTooltip}>
              <FormattedMessage
                {...MSG.timeLeftTooltip}
                values={{
                  timeLeft: `${String(Math.floor(secsLeft / 60)).padStart(
                    2,
                    '0',
                  )}:${String(secsLeft % 60).padStart(2, '0')}`,
                }}
              />
            </div>
          }
          trigger={secsLeft >= 0 ? 'hover' : null}
        >
          <div className={styles.loading}>
            <MiniSpinnerLoader loadingText={MSG.loadingData} />
          </div>
        </Tooltip>
      </div>
    );
  }

  return claimsLength ? (
    <div className={styles.main}>
      <ClickableHeading linkTo={`/colony/${colonyName}/funds`}>
        <FormattedMessage {...MSG.title} />
      </ClickableHeading>
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
            trigger="hover"
            content={
              <div className={styles.tooltip}>
                <FormattedMessage {...MSG.tooltip} />
              </div>
            }
            placement="top"
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 5],
                  },
                },
              ],
            }}
          >
            <ActionButton
              text={MSG.claimButton}
              className={styles.button}
              submit={ActionTypes.CLAIM_TOKEN}
              error={ActionTypes.CLAIM_TOKEN_ERROR}
              success={ActionTypes.CLAIM_TOKEN_SUCCESS}
              transform={transform}
              disabled={!isNetworkAllowed || !hasRegisteredProfile}
            />
          </Tooltip>
        </li>
        {claimsLength > 1 && (
          <li>
            <Link
              className={styles.manageFundsLink}
              to={`/colony/${colonyName}/funds`}
              data-test="manageFunds"
            >
              <div className={styles.tokenItem}>
                <FormattedMessage {...MSG.more} values={{ extraClaims }} />
              </div>
            </Link>
          </li>
        )}
      </ul>
    </div>
  ) : null;
};

ColonyUnclaimedTransfers.displayName = displayName;

export default ColonyUnclaimedTransfers;
