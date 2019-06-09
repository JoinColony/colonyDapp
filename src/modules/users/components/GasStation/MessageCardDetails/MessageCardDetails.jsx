/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { MessageProps } from '~immutable';

import Icon from '~core/Icon';
import CardList from '~core/CardList';
import Heading from '~core/Heading';
import Card from '~core/Card';
import { MessageCardStatus } from '../MessageCard';
import MessageCardControls from './MessageCardControls';
import { getMainClasses } from '~utils/css';

import styles from './MessageCardDetails.css';

const displayName = 'users.GasStation.MessageCardDetails';

const MSG = defineMessages({
  returnToSummary: {
    id: 'users.GasStation.MessageCardDetails.returnToSummary',
    defaultMessage: 'See all pending actions',
  },
});

type Props = {|
  message: $ReadOnly<MessageProps>,
|};

const MessageCardDetails = ({
  message: { status, purpose },
  message,
}: Props) => (
  <div className={styles.main}>
    {/*
     * @TODO This might be worth extracting away now that both the transactions
     * and the messages are using it
     */}
    <button type="button" className={styles.returnToSummary}>
      <Icon
        appearance={{ size: 'small' }}
        name="caret-left"
        title={MSG.returnToSummary}
      />
      <FormattedMessage {...MSG.returnToSummary} />
    </button>
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
          })}
        >
          <span className={styles.title}>Message:</span>
          Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast
          yardarm. Pinnace holystone mizzenmast quarter crows nest nipperkin
          grog yardarm hempen halter furl. Swab barque interloper chantey
          doubloon starboard grog black jack gangway rutters. Deadlights jack
          lad schooner scallywag dance the hempen jig carouser broadside cable
          strike colors. Bring a spring upon her cable holystone blow the man
          down spanker Shiver me timbers to go on account lookout wherry
          doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm
          spyglass sheet transom heave to.
        </div>
      </Card>
    </CardList>
    {(status === 'created' || status === 'pending') && (
      <MessageCardControls message={message} />
    )}
  </div>
);

MessageCardDetails.displayName = displayName;

export default MessageCardDetails;
