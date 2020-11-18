import React, { useCallback } from 'react';
import {
  FormattedMessage,
  defineMessages,
  FormattedDateParts,
} from 'react-intl';
import {
  useTokenQuery,
  ColonyTransaction,
  useUsernameQuery,
} from '~data/index';
import { mergePayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { ActionButton } from '~core/Button';
import MaskedAddress from '~core/MaskedAddress';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Icon from '~core/Icon';
import EthUsd from '~core/EthUsd';
import { tokenIsETH } from '../../../core/checks';

import styles from './UnclaimedTransfersItem.css';

const displayName = 'UnclaimedTransfers.UnclaimedTransfersItem';

const MSG = defineMessages({
  buttonClaim: {
    id: 'dashboard.UnclaimedTransfers.UnclaimedTransfersItem.buttonClaim',
    defaultMessage: 'Claim',
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

  if (!tokenData) return null;

  const { token } = tokenData;
  const username = usernameData && usernameData.username;
  const description = null; // Will be support in after network upgrade to v5
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
          title="comment"
        />
        <div className={styles.details}>
          <div className={styles.sender}>
            {senderAddress && (
              <FormattedMessage
                {...MSG.from}
                values={{
                  sender: username || <MaskedAddress address={senderAddress} />,
                }}
              />
            )}
          </div>
          {description && <span>Poker’s debt</span>}
        </div>
        <div className={styles.amountWrapper}>
          <Numeral
            value={amount}
            unit={getTokenDecimalsWithFallback(token.decimals)}
            suffix={` ${token.symbol}`}
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
        />
      </div>
    </li>
  );
};

UnclaimedTransfersItem.displayName = displayName;

export default UnclaimedTransfersItem;
