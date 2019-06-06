/* @flow */

import React from 'react';

import type { MessageProps } from '~immutable';

import { Tooltip } from '~core/Popover';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';

import styles from '../TransactionCard/TransactionStatus.css';

type Props = {
  status: $PropertyType<MessageProps, 'status'>,
};

const displayName = 'users.GasStation.MessageCard.MessageCardStatus';

const MessageCardStatus = ({ status }: Props) => (
  <div className={styles.main}>
    <Tooltip
      placement="top"
      /* Because it's in an overflow window */
      popperProps={{ positionFixed: true }}
      showArrow
      content={<span className={styles.tooltip}>Generic Message</span>}
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
        {status === 'created' && <span className={styles.counter}>1</span>}
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
        {status === 'succeeded' && (
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
        {status === 'failed' && <span className={styles.failed}>!</span>}
      </div>
    </Tooltip>
  </div>
);

MessageCardStatus.displayName = displayName;

export default MessageCardStatus;
