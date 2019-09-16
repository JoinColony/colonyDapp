import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TRANSACTION_STATUSES } from '~immutable/index';

import { Tooltip } from '~core/Popover';
import TransactionLink from '~core/TransactionLink';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';

import styles from './TransactionStatus.css';

const MSG = defineMessages({
  transactionState: {
    id: 'users.GasStationPopover.TransactionStatus.transactionState',
    defaultMessage: `{status, select,
      MULTISIG {Waiting on other party to sign}
      FAILED {Failed transaction. Try again}
      SUCCEEDED {Transaction succeeded}
      READY {{groupCount, number} {groupCount, plural,
        one {transaction}
        other {transactions}
      } to sign}
      other {Can't report any status}
    }`,
  },
});

/**
 * @todo Support multisig status in `TransactionStatus` component.
 */
interface Props {
  groupCount?: number;
  hash?: string;
  status: TRANSACTION_STATUSES;
  loadingRelated?: boolean;
}

const displayName = 'users.GasStation.TransactionStatus';

const TransactionStatus = ({
  hash,
  status,
  groupCount,
  loadingRelated,
}: Props) => (
  <div className={styles.main}>
    {hash && (
      <TransactionLink
        className={styles.interaction}
        hash={hash}
        text="Etherscan"
      />
    )}
    <Tooltip
      placement="top"
      /* Because it's in an overflow window */
      popperProps={{ positionFixed: true }}
      showArrow
      content={
        <span className={styles.tooltip}>
          <FormattedMessage
            {...MSG.transactionState}
            values={{
              status,
              groupCount: groupCount || 1,
            }}
          />
        </span>
      }
    >
      {/*
       * The tooltip content needs to be wrapped inside a block
       * element (otherwise it won't detect the hover event)
       */}
      <div>
        {groupCount && status === TRANSACTION_STATUSES.READY && (
          <span className={styles.counter}>{groupCount}</span>
        )}
        {status === TRANSACTION_STATUSES.SUCCEEDED && !loadingRelated && (
          <span
            className={styles.completed}
            data-test="gasStationTransactionSucceeded"
          >
            <Icon
              appearance={{ size: 'tiny' }}
              name="check-mark"
              /*
               * @NOTE We disable the title since we already
               * have a tooltip around it
               */
              title=""
            />
          </span>
        )}
        {(status === TRANSACTION_STATUSES.PENDING || loadingRelated) && (
          <div
            className={styles.spinner}
            data-test="gasStationTransactionPending"
          >
            <SpinnerLoader
              appearance={{
                size: 'small',
                theme: 'primary',
              }}
            />
          </div>
        )}
        {status === TRANSACTION_STATUSES.MULTISIG && (
          <span className={styles.multisig} />
        )}
        {status === TRANSACTION_STATUSES.FAILED && (
          <span className={styles.failed}>!</span>
        )}
      </div>
    </Tooltip>
  </div>
);

TransactionStatus.displayName = displayName;

export default TransactionStatus;
