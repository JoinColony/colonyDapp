import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import { OneSuggestion } from '~data/index';

import { getFriendlyName } from '../../../users/transformers';

import styles from './SuggestionsListItem.css';

const MSG = defineMessages({
  byAuthorText: {
    id: 'Dashboard.SuggestionsListItem.byAuthorText',
    defaultMessage: 'by {creator}',
  },
});

interface Props {
  suggestion: OneSuggestion;
}

const displayName = 'Dashboard.SuggestionsListItem';

const SuggestionsListItem = ({
  suggestion: { title, creator, upvotes },
}: Props) => (
  <div className={styles.main}>
    <div className={styles.mainInner}>
      <div className={styles.actionMenuContainer}>
        <div className={styles.actionMenu}>
          {/* @todo Action menu goes here */}|
        </div>
      </div>
      <div className={styles.titleContainer}>
        <Heading
          appearance={{ size: 'normal', margin: 'none', weight: 'bold' }}
          text={title}
        />
        <p className={styles.authorText}>
          <FormattedMessage
            {...MSG.byAuthorText}
            values={{ creator: getFriendlyName(creator) }}
          />
        </p>
      </div>
      <div className={styles.upvoteContainer}>
        <div className={styles.upvoteCount}>{upvotes.length}</div>
        <div className={styles.upvoteButtonContainer}>
          {/* @todo upvote button goes here */}^
        </div>
      </div>
    </div>
  </div>
);

SuggestionsListItem.displayName = displayName;

export default SuggestionsListItem;
