import React, { useCallback } from 'react';
import {
  FormattedMessage,
  defineMessages,
  FormattedDateParts,
} from 'react-intl';

import { ActionButton } from '~core/Button';
import MaskedAddress from '~core/MaskedAddress';
import Numeral from '~core/Numeral';
import Icon from '~core/Icon';
import EthUsd from '~core/EthUsd';

import {
  useTokenQuery,
  ColonyTransaction,
  useUsernameQuery,
  useLoggedInUser,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import { tokenIsETH } from '../../../core/checks';

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
});

interface Props {
  transaction: ColonyTransaction;
}

const UnclaimedTransfersItem = ({
  transaction: {
    amount,
    colonyAddress,
    date,
    token: tokenAddress,
    from: senderAddress,
  },
}: Props) => {
  const { networkId, ethereal, username } = useLoggedInUser();

  const hasRegisteredProfile = !!username && !ethereal;

  const { data: tokenData } = useTokenQuery({
    variables: { address: tokenAddress },
  });

  const { data: usernameData } = useUsernameQuery({
    variables: { address: senderAddress || '' },
  });

  const transform = useCallback(mergePayload({ colonyAddress, tokenAddress }), [
    colonyAddress,
    tokenAddress,
  ]);

  const senderUsername = usernameData && usernameData.username;
  const description = null; // Will be support after network upgrade to v5

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  if (!tokenData) return null;

  const { token } = tokenData;

  return (
    <li>
      <div className={styles.content}>
        <div className={styles.date}>
          <FormattedDateParts value={date} month="short" day="numeric">
            {(parts) => (
              <>
                <span>{parts[2].value}</span>
                <span>{parts[0].value}</span>
              </>
            )}
          </FormattedDateParts>
        </div>
        <Icon
          appearance={{ size: 'medium' }}
          className={styles.arrowIcon}
          name="circle-arrow-down"
          title="Incoming Transfer"
        />
        <div className={styles.details}>
          <div className={styles.sender}>
            {senderAddress && (
              <FormattedMessage
                {...MSG.from}
                values={{
                  sender: senderUsername || (
                    <MaskedAddress address={senderAddress} />
                  ),
                }}
              />
            )}
          </div>
          {description && <span>{description}</span>}
        </div>
        <div className={styles.amountWrapper}>
          <Numeral
            value={amount}
            unit={getTokenDecimalsWithFallback(token.decimals)}
            suffix={token.symbol}
            className={styles.amount}
          />
          {tokenIsETH(token) && <EthUsd value={amount} unit="wei" />}
        </div>
        <ActionButton
          text={MSG.buttonClaim}
          className={styles.button}
          submit={ActionTypes.COLONY_CLAIM_TOKEN}
          error={ActionTypes.COLONY_CLAIM_TOKEN_ERROR}
          success={ActionTypes.COLONY_CLAIM_TOKEN_SUCCESS}
          transform={transform}
          disabled={!isNetworkAllowed || !hasRegisteredProfile}
        />
      </div>
    </li>
  );
};

UnclaimedTransfersItem.displayName = displayName;

export default UnclaimedTransfersItem;
