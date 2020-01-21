import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import Icon from '~core/Icon';
import {
  OneSuggestion,
  useAddUpvoteToSuggestionMutation,
  useRemoveUpvoteFromSuggestionMutation,
} from '~data/index';
import { Address } from '~types/index';
import { getMainClasses } from '~utils/css';

import { hasUpvotedSuggestion as hasUpvotedSuggestionCheck } from '../../checks';

import styles from './SuggestionUpvoteButton.css';

const MSG = defineMessages({
  titleAddUpvote: {
    id: 'Dashboard.SuggestionUpvoteButton.titleAddUpvote',
    defaultMessage: 'Upvote this suggestion',
  },
  titleRemoveUpvote: {
    id: 'Dashboard.SuggestionUpvoteButton.titleRemoveUpvote',
    defaultMessage: 'Remove your upvote from this suggestion',
  },
});

interface Props {
  suggestionId: OneSuggestion['id'];
  upvotes: OneSuggestion['upvotes'];
  walletAddress: Address;
}

const displayName = 'Dashboard.SuggestionUpvoteButton';

const SuggestionUpvoteButton = ({
  suggestionId,
  upvotes,
  walletAddress,
}: Props) => {
  const hasUpvoted = hasUpvotedSuggestionCheck(upvotes, walletAddress);

  const [addUpvote] = useAddUpvoteToSuggestionMutation({
    variables: {
      input: { id: suggestionId },
    },
  });
  const [removeUpvote] = useRemoveUpvoteFromSuggestionMutation({
    variables: {
      input: { id: suggestionId },
    },
  });

  const handleClick = useCallback(
    () => (hasUpvoted ? removeUpvote() : addUpvote()),
    [addUpvote, hasUpvoted, removeUpvote],
  );

  const htmlTitle = hasUpvoted ? MSG.titleRemoveUpvote : MSG.titleAddUpvote;

  return (
    <Button
      appearance={{ size: 'small', theme: 'no-style' }}
      className={getMainClasses({}, styles, {
        hasUpvoted,
      })}
      icon="upvote"
      onClick={handleClick}
      title={htmlTitle}
    >
      <Icon name="upvote" title={htmlTitle} />
    </Button>
  );
};

SuggestionUpvoteButton.displayName = displayName;

export default SuggestionUpvoteButton;
