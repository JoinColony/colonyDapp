import React, { MouseEvent, useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { MessageProps, TRANSACTION_STATUSES } from '~immutable/index';

import CardList from '~core/CardList';
import Heading from '~core/Heading';
import Card from '~core/Card';
import { MessageCardStatus } from '../MessageCard';
import MessageCardControls from './MessageCardControls';
import { TransactionBackToList } from '../TransactionDetails';

import { getMainClasses } from '~utils/css';
import { messageCancel } from '../../../../core/actionCreators';

import styles from './MessageCardDetails.css';

const MSG = defineMessages({
  returnToSummary: {
    id: 'users.GasStation.MessageCardDetails.returnToSummary',
    defaultMessage: 'See all pending actions',
  },
  messageHeading: {
    id: 'users.GasStation.MessageCardDetails.messageHeading',
    defaultMessage: 'Message:',
  },
});

interface Props {
  message: MessageProps;
  onClose: (event: MouseEvent) => void;
}

const displayName = 'users.GasStation.MessageCardDetails';

const MessageCardDetails = ({
  message: { status, purpose, message: messageContent, id },
  message,
  onClose,
}: Props) => {
  const dispatch = useDispatch();
  const [isShowingCancelConfirmation, setShowCancelConfirmation] = useState(
    false,
  );
  const cancelMessageSigning = useCallback(() => dispatch(messageCancel(id)), [
    dispatch,
    id,
  ]);
  const canBeCancelled = status === TRANSACTION_STATUSES.CREATED;
  return (
    <div>
      <TransactionBackToList onClose={onClose} />
      <CardList appearance={{ numCols: '1' }}>
        <Card className={styles.main}>
          <div className={styles.summary}>
            <div className={styles.description}>
              <Heading
                appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
                text={{ id: `message.${purpose}.title` }}
              />
              <FormattedMessage id={`message.${purpose}.description`} />
            </div>
            <MessageCardStatus status={status} />
          </div>
          <div
            className={getMainClasses({ theme: 'message' }, styles, {
              failed: status === TRANSACTION_STATUSES.FAILED,
              succeeded: status === TRANSACTION_STATUSES.SUCCEEDED,
              isShowingCancelConfirmation,
            })}
          >
            <span className={styles.title}>
              <FormattedMessage {...MSG.messageHeading} />
              {canBeCancelled && (
                <div className={styles.confirmationButtonsWrapper}>
                  {isShowingCancelConfirmation ? (
                    <>
                      <button
                        type="button"
                        className={styles.confirmationButton}
                        onClick={cancelMessageSigning}
                      >
                        <FormattedMessage {...{ id: 'button.yes' }} />
                      </button>
                      <span className={styles.cancelDecision}>/</span>
                      <button
                        type="button"
                        className={styles.confirmationButton}
                        onClick={() => setShowCancelConfirmation(false)}
                      >
                        <FormattedMessage {...{ id: 'button.no' }} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => setShowCancelConfirmation(true)}
                    >
                      <FormattedMessage {...{ id: 'button.cancel' }} />
                    </button>
                  )}
                </div>
              )}
            </span>
            {messageContent}
          </div>
        </Card>
      </CardList>
      {(status === TRANSACTION_STATUSES.CREATED ||
        status === TRANSACTION_STATUSES.PENDING) && (
        <MessageCardControls message={message} />
      )}
    </div>
  );
};

MessageCardDetails.displayName = displayName;

export default MessageCardDetails;
