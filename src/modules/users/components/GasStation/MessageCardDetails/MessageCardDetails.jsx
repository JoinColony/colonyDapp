/* @flow */

import type { MessageProps } from '~immutable';

/*
 * Due to our version of Flow no knowing about the existence of React Hooks
 */
// $FlowFixMe
import React, { Fragment, useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

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

type Props = {|
  message: MessageProps,
  onClose: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
|};

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
  const canBeCancelled = status === 'created';
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
              failed: status === 'failed',
              succeeded: status === 'succeeded',
              isShowingCancelConfirmation,
            })}
          >
            <span className={styles.title}>
              <FormattedMessage {...MSG.messageHeading} />
              {canBeCancelled && (
                <div className={styles.confirmationButtonsWrapper}>
                  {isShowingCancelConfirmation ? (
                    <Fragment>
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
                    </Fragment>
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
      {(status === 'created' || status === 'pending') && (
        <MessageCardControls message={message} />
      )}
    </div>
  );
};

MessageCardDetails.displayName = displayName;

export default MessageCardDetails;
