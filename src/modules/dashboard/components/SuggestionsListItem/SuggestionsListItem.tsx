import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Popover from '~core/Popover';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Icon from '~core/Icon';
import Button from '~core/Button';
import { AbbreviatedNumeral } from '~core/Numeral';
import SuggestionUpvoteButton from '~dashboard/SuggestionUpvoteButton';
import { OneSuggestion } from '~data/index';
import { Address, DomainsMapType } from '~types/index';
import { useTransformer } from '~utils/hooks';

import { getUserRoles } from '../../../transformers';
import { canAdminister } from '../../../users/checks';
import { getFriendlyName } from '../../../users/transformers';

import styles from './SuggestionsListItem.css';

const MSG = defineMessages({
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
  titleActionMenu: {
    id: 'Dashboard.SuggestionsListItem.titleActionMenu',
    defaultMessage: 'Change status',
  },
});

interface Props {
  domains: DomainsMapType;
  onNotPlanned: (id: string) => void;
  onDeleted: (id: string) => void;
  onCreateTask: (id: string) => void;
  suggestion: OneSuggestion;
  walletAddress: Address;
}

const displayName = 'Dashboard.SuggestionsListItem';

const SuggestionsListItem = ({
  domains,
  onNotPlanned,
  onDeleted,
  onCreateTask,
  suggestion: { ethDomainId, id, title, creator, upvotes },
  walletAddress,
}: Props) => {
  const userRoles = useTransformer(getUserRoles, [
    domains,
    ethDomainId,
    walletAddress,
  ]);
  const canDelete = walletAddress === creator.profile.walletAddress;
  const canModify = canAdminister(userRoles);

  const handleNotPlanned = useCallback(() => onNotPlanned(id), [
    id,
    onNotPlanned,
  ]);
  const handleDeleted = useCallback(() => onDeleted(id), [id, onDeleted]);
  const handleCreateTask = useCallback(() => onCreateTask(id), [
    id,
    onCreateTask,
  ]);

  return (
    <div className={styles.main}>
      <div className={styles.actionMenuContainer}>
        {(canModify || canDelete) && (
          <Popover
            trigger="click"
            content={({ close }) => (
              <DropdownMenu onClick={close}>
                <DropdownMenuSection separator>
                  {canAdminister && (
                    <DropdownMenuItem>
                      <Button
                        onClick={handleCreateTask}
                        appearance={{ theme: 'no-style' }}
                        text={MSG.buttonAccept}
                      />
                    </DropdownMenuItem>
                  )}
                  {canAdminister && (
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
        <div className={styles.upvoteCount}>
          <AbbreviatedNumeral
            formatOptions={{
              notation: 'compact',
            }}
            value={upvotes.length}
          />
        </div>
        <div className={styles.upvoteButtonContainer}>
          <SuggestionUpvoteButton
            suggestionId={id}
            upvotes={upvotes}
            walletAddress={walletAddress}
          />
        </div>
      </div>
    </div>
  );
};

SuggestionsListItem.displayName = displayName;

export default SuggestionsListItem;
