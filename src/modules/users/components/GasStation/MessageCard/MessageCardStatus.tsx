import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TransactionStatusType, TRANSACTION_STATUSES } from '~immutable/index';

import { Tooltip } from '~core/Popover';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';

import styles from '../TransactionCard/TransactionStatus.css';

const MSG = defineMessages({
  messageState: {
    id: 'users.GasStation.MessageCard.MessageCardStatus.messageState',
    defaultMessage: `{status, select,
      CREATED {The message is ready to be signed}
      PENDING {The message is being signed}
      SUCCEEDED {The message was signed successfully}
      FAILED {Failed to sign the message}
      other {Can't report any status}
    }`,
  },
});

interface Props {
  status?: TransactionStatusType;
}

const displayName = 'users.GasStation.MessageCard.MessageCardStatus';

const MessageCardStatus = ({ status }: Props) => (
  <div className={styles.main}>
    <Tooltip
      placement="top"
      /* Because it's in an overflow window */
      popperProps={{ positionFixed: true }}
      showArrow
      content={
        <span className={styles.tooltip}>
          <FormattedMessage {...MSG.messageState} values={{ status }} />
        </span>
      }
    >
      {/*
       * @NOTE The tooltip content needs to be wrapped inside a block
       * element otherwise it won't detect the hover event
       */}
      <div>
        {/*
         * @NOTE There's never going to be more then a message to sign at a
         * given time, so the counter will always show 1
         */}
        {status === TRANSACTION_STATUSES.CREATED && (
          <span className={styles.counter}>1</span>
        )}
        {status === TRANSACTION_STATUSES.PENDING && (
          <div className={styles.spinner}>
            <SpinnerLoader
              appearance={{
                size: 'small',
                theme: 'primary',
              }}
            />
          </div>
        )}
        {status === TRANSACTION_STATUSES.SUCCEEDED && (
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
        {status === TRANSACTION_STATUSES.FAILED && (
          <span className={styles.failed}>!</span>
        )}
      </div>
    </Tooltip>
  </div>
);

MessageCardStatus.displayName = displayName;

export default MessageCardStatus;
