import React, { useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { ActionButton } from '~core/Button';
import Numeral from '~core/Numeral';
import CopyableAddress from '~core/CopyableAddress';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { useTokenQuery, ColonyTransaction, useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import styles from './UnclaimedTransfersItem.css';

const displayName = 'UnclaimedTransfers.UnclaimedTransfersItem';

const MSG = defineMessages({
  buttonClaim: {
    id: 'dashboard.UnclaimedTransfers.UnclaimedTransfersItem.buttonClaim',
    defaultMessage: 'Claim for colony',
  },
  from: {
    id: 'dashboard.UnclaimedTransfers.UnclaimedTransfersItem.from',
    defaultMessage: 'From {sender}',
  },
  unknownToken: {
    id: 'dashboard.UnclaimedTransfers.UnclaimedTransfersItem.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

interface Props {
  transaction: ColonyTransaction;
}

const UnclaimedTransfersItem = ({
  transaction: { amount, colonyAddress, token: tokenAddress },
}: Props) => {
  const { networkId, ethereal, username } = useLoggedInUser();

  const hasRegisteredProfile = !!username && !ethereal;

  const { data: tokenData } = useTokenQuery({
    variables: { address: tokenAddress },
  });

  const transform = useCallback(mergePayload({ colonyAddress, tokenAddress }), [
    colonyAddress,
    tokenAddress,
  ]);

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  if (!tokenData) return null;

  const { token } = tokenData;

  return (
    <li>
      <div className={styles.content}>
        <div className={styles.tokenWrapper}>
          <TokenIcon token={token} name={token.name || undefined} size="s" />
          <div className={styles.tokenName}>
            {token.symbol ? (
              <span>{token.symbol}</span>
            ) : (
              <>
                <FormattedMessage {...MSG.unknownToken} />
                <CopyableAddress>{token.address}</CopyableAddress>
              </>
            )}
          </div>
        </div>
        <div className={styles.claimWrapper}>
          <div className={styles.amountWrapper}>
            <Numeral
              value={amount}
              decimals={getTokenDecimalsWithFallback(token.decimals)}
              className={styles.amount}
            />
            <span className={styles.tokenSymbol}>{token.symbol}</span>
          </div>
          <ActionButton
            text={MSG.buttonClaim}
            className={styles.button}
            submit={ActionTypes.CLAIM_TOKEN}
            error={ActionTypes.CLAIM_TOKEN_ERROR}
            success={ActionTypes.CLAIM_TOKEN_SUCCESS}
            transform={transform}
            disabled={!isNetworkAllowed || !hasRegisteredProfile}
            dataTest="claimForColonyButton"
          />
        </div>
      </div>
    </li>
  );
};

UnclaimedTransfersItem.displayName = displayName;

export default UnclaimedTransfersItem;
