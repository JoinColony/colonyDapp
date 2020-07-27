import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Tag from '~core/Tag';
import Button from '~core/Button';
import DropdownMenu, {
  DropdownMenuItem,
  DropdownMenuSection,
} from '~core/DropdownMenu';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import { AbbreviatedNumeral } from '~core/Numeral';
import Popover from '~core/Popover';
import SuggestionUpvoteButton from '~dashboard/SuggestionUpvoteButton';
import { Colony, OneSuggestion, SuggestionStatus } from '~data/index';
import { Address } from '~types/index';
import { useTransformer } from '~utils/hooks';

import { getUserRolesForDomain } from '../../../transformers';
import { canAdminister } from '../../../users/checks';
import { getFriendlyName } from '../../../users/transformers';

import styles from './SuggestionsListItem.css';

const MSG = defineMessages({
  badgeTextAccepted: {
    id: 'Dashboard.SuggestionsListItem.badgeTextAccepted',
    defaultMessage: 'Accepted',
  },
  badgeTextNotPlanned: {
    id: 'Dashboard.SuggestionsListItem.badgeTextNotPlanned',
    defaultMessage: 'Not Planned',
  },
  byAuthorText: {
    id: 'Dashboard.SuggestionsListItem.byAuthorText',
    defaultMessage: 'by {creator}',
  },
  buttonAccept: {
    id: 'Dashboard.SuggestionsListItem.buttonAccept',
    defaultMessage: 'Accept',
  },
  buttonNotPlanned: {
    id: 'Dashboard.SuggestionsListItem.buttonNotPlanned',
    defaultMessage: 'Not planned',
  },
  buttonDelete: {
    id: 'Dashboard.SuggestionsListItem.buttonDelete',
    defaultMessage: 'Delete',
  },
  buttonReopen: {
    id: 'Dashboard.SuggestionsListItem.buttonReopen',
    defaultMessage: 'Open',
  },
  titleActionMenu: {
    id: 'Dashboard.SuggestionsListItem.titleActionMenu',
    defaultMessage: 'Change status',
  },
  linkGoToTask: {
    id: 'Dashboard.SuggestionsListItem.linkGoToTask',
    defaultMessage: 'Go to task',
  },
});

const suggestionStatusBadgeText = {
  [SuggestionStatus.Accepted]: MSG.badgeTextAccepted,
  [SuggestionStatus.NotPlanned]: MSG.badgeTextNotPlanned,
};

interface Props {
  colony: Colony;
  onNotPlanned: (id: string) => void;
  onDeleted: (id: string) => void;
  onCreateTask: (id: string) => void;
  onReopen: (id: string) => void;
  suggestion: OneSuggestion;
  walletAddress: Address;
}

const displayName = 'Dashboard.SuggestionsListItem';

const SuggestionsListItem = ({
  colony,
  colony: { colonyName },
  onNotPlanned,
  onDeleted,
  onCreateTask,
  onReopen,
  suggestion: { ethDomainId, id, status, title, creator, upvotes, taskId },
  walletAddress,
}: Props) => {
  const userRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    ethDomainId,
  ]);
  const canDelete = walletAddress === creator.profile.walletAddress;
  const canModify = canAdminister(userRoles);
  const isAccepted = status === SuggestionStatus.Accepted;
  const isRejected = status === SuggestionStatus.NotPlanned;
  const isOpen = status === SuggestionStatus.Open;

  const handleNotPlanned = useCallback(() => onNotPlanned(id), [
    id,
    onNotPlanned,
  ]);
  const handleDeleted = useCallback(() => onDeleted(id), [id, onDeleted]);
  const handleCreateTask = useCallback(() => onCreateTask(id), [
    id,
    onCreateTask,
  ]);
  const handleReopen = useCallback(() => onReopen(id), [id, onReopen]);

  const statusBadgeText = suggestionStatusBadgeText[status];

  return (
    <div className={styles.main}>
      <div className={styles.actionMenuContainer}>
        {(canModify || canDelete) && (
          <Popover
            trigger="click"
            content={({ close }) => (
              <DropdownMenu onClick={close}>
                <DropdownMenuSection separator>
                  {canModify && isRejected && (
                    <DropdownMenuItem>
                      <Button
                        onClick={handleReopen}
                        appearance={{ theme: 'no-style' }}
                        text={MSG.buttonReopen}
                      />
                    </DropdownMenuItem>
                  )}
                  {canModify && !isAccepted && (
                    <DropdownMenuItem>
                      <Button
                        onClick={handleCreateTask}
                        appearance={{ theme: 'no-style' }}
                        text={MSG.buttonAccept}
                      />
                    </DropdownMenuItem>
                  )}
                  {canModify && isOpen && (
                    <DropdownMenuItem>
                      <Button
                        onClick={handleNotPlanned}
                        appearance={{ theme: 'no-style' }}
                        text={MSG.buttonNotPlanned}
                      />
                    </DropdownMenuItem>
                  )}
                  {(canDelete || canModify) && (
                    <DropdownMenuItem>
                      <Button
                        onClick={handleDeleted}
                        appearance={{ theme: 'no-style' }}
                        text={MSG.buttonDelete}
                      />
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSection>
              </DropdownMenu>
            )}
            placement="bottom"
          >
            <Button className={styles.actionMenuButton}>
              <Icon
                className={styles.actionMenuIcon}
                name="three-dots-row"
                title={MSG.titleActionMenu}
              />
            </Button>
          </Popover>
        )}
      </div>
      <div className={styles.titleContainer}>
        <Heading
          appearance={{ size: 'normal', margin: 'none', weight: 'bold' }}
        >
          <span className={styles.titleContentContainer}>{title}</span>
          {statusBadgeText && (
            <span className={styles.badgeContainer}>
              &nbsp;
              <Tag text={statusBadgeText} />
            </span>
          )}
          {taskId && (
            <Link
              className={styles.taskLink}
              to={`/colony/${colonyName}/task/${taskId}`}
              text={MSG.linkGoToTask}
            />
          )}
        </Heading>
        <p className={styles.authorText}>
          <FormattedMessage
            {...MSG.byAuthorText}
            values={{
              creator:
                creator && creator.profile && creator.profile.username ? (
                  <Link to={`/user/${creator.profile.username}`}>
                    {getFriendlyName(creator)}
                  </Link>
                ) : (
                  getFriendlyName(creator)
                ),
            }}
          />
        </p>
      </div>
      <div className={styles.upvoteContainer}>
        <div className={styles.upvoteCount}>
          <AbbreviatedNumeral
            formatOptions={{
              notation: 'compact',
            }}
            value={upvotes.length}
          />
        </div>
        <div className={styles.upvoteButtonContainer}>
          <SuggestionUpvoteButton suggestionId={id} upvotes={upvotes} />
        </div>
      </div>
    </div>
  );
};

SuggestionsListItem.displayName = displayName;

export default SuggestionsListItem;
