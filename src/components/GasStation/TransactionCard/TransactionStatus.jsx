/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TransactionType } from '~immutable';

import { Tooltip } from '~components/core/Popover';
import ExternalLink from '~components/core/ExternalLink';
import { SpinnerLoader } from '~components/core/Preloaders';
import Icon from '~components/core/Icon';

import styles from './TransactionStatus.css';

const MSG = defineMessages({
  transactionState: {
    id: 'users.GasStationPopover.TransactionStatus.transactionState',
    defaultMessage: `{status, select,
      multisig {Waiting on other party to sign}
      failed {Failed transaction. Try again}
      succeeded {Transaction succeeded}
      ready {{groupCount, number} {groupCount, plural,
        one {transaction}
        other {transactions}
      } to sign}
      other {Can't report any status}
    }`,
  },
});

type Props = {
  groupCount?: number,
  hash?: string,
  status: $PropertyType<TransactionType<*, *>, 'status'>,
  // TODO-multisig See below
  // multisig: $PropertyType<TransactionType<*, *>, 'multisig'>,
};

const displayName = 'users.GasStation.TransactionStatus';

const TransactionStatus = ({ hash, status, groupCount }: Props) => (
  <div className={styles.main}>
    {hash && (
      <ExternalLink
        href={`https://rinkeby.etherscan.io/tx/${hash}`}
        text="Etherscan"
        className={styles.interaction}
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
       * @NOTE The tooltip content needs to be wrapped inside a block
       * element otherwise it won't detect the hover event
       */}
      <div>
        {groupCount && status === 'ready' && (
          <span className={styles.counter}>{groupCount}</span>
        )}
        {status === 'succeeded' && (
          <span className={styles.completed}>
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
        {status === 'pending' && (
          <div className={styles.spinner}>
            <SpinnerLoader
              appearance={{
                size: 'small',
                theme: 'primary',
              }}
            />
          </div>
        )}
        {/* TODO-multisig There is no multisig status (yet) */}
        {status === 'multisig' && <span className={styles.multisig} />}
        {status === 'failed' && <span className={styles.failed}>!</span>}
      </div>
    </Tooltip>
  </div>
);

TransactionStatus.displayName = displayName;

export default TransactionStatus;
