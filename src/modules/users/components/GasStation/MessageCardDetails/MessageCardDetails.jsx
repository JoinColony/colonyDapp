/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { MessageProps } from '~immutable';
import type { Action } from '~redux';

import CardList from '~core/CardList';
import Heading from '~core/Heading';
import Card from '~core/Card';
import { MessageCardStatus } from '../MessageCard';
import MessageCardControls from './MessageCardControls';
import { TransactionBackToList } from '../TransactionDetails';

import { ACTIONS } from '~redux';
import { getMainClasses } from '~utils/css';

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
  message: $ReadOnly<MessageProps>,
  onClose: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
  cancelMessage: (id: string) => Action<typeof ACTIONS.MESSAGE_CANCEL>,
|};

type State = {|
  isShowingCancelConfirmation: boolean,
|};

class MessageCardDetails extends Component<Props, State> {
  static displayName = 'users.GasStation.MessageCardDetails';

  state = {
    isShowingCancelConfirmation: false,
  };

  cancelMessage = () => {
    const {
      message: { id },
      cancelMessage,
    } = this.props;
    cancelMessage(id);
  };

  toggleCancelConfirmation = () =>
    this.setState(({ isShowingCancelConfirmation }) => ({
      isShowingCancelConfirmation: !isShowingCancelConfirmation,
    }));

  renderCancel() {
    const { isShowingCancelConfirmation } = this.state;
    return (
      <div className={styles.confirmationButtonsWrapper}>
        {isShowingCancelConfirmation ? (
          <Fragment>
            <button
              type="button"
              className={styles.confirmationButton}
              onClick={this.cancelMessage}
            >
              <FormattedMessage {...{ id: 'button.yes' }} />
            </button>
            <span className={styles.cancelDecision}>/</span>
            <button
              type="button"
              className={styles.confirmationButton}
              onClick={this.toggleCancelConfirmation}
            >
              <FormattedMessage {...{ id: 'button.no' }} />
            </button>
          </Fragment>
        ) : (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={this.toggleCancelConfirmation}
          >
            <FormattedMessage {...{ id: 'button.cancel' }} />
          </button>
        )}
      </div>
    );
  }

  render() {
    const {
      message: { status, purpose, message: messageContent },
      message,
      onClose,
    } = this.props;
    const { isShowingCancelConfirmation } = this.state;
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
                {canBeCancelled && this.renderCancel()}
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
  }
}

export default MessageCardDetails;
