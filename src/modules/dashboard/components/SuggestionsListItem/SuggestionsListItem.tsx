import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Popover from '~core/Popover';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Icon from '~core/Icon';
import Button from '~core/Button';
import { Address } from '~types/index';
import { OneSuggestion } from '~data/index';

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
});

interface Props {
  canAdminister: boolean;
  suggestion: OneSuggestion;
  walletAddress: Address;
}

const displayName = 'Dashboard.SuggestionsListItem';

const SuggestionsListItem = ({
  canAdminister,
  suggestion: { title, creator, upvotes },
  walletAddress,
}: Props) => (
  <div className={styles.main}>
    <div className={styles.mainInner}>
      <div className={styles.actionMenuContainer}>
        <div className={styles.actionMenu}>
          {(canAdminister ||
            walletAddress === creator.profile.walletAddress) && (
            <Popover
              trigger="click"
              content={({ close }) => (
                <DropdownMenu onClick={close}>
                  <DropdownMenuSection separator>
                    {canAdminister && (
                      <DropdownMenuItem>
                        <Button
                          appearance={{ theme: 'no-style' }}
                          text={MSG.buttonAccept}
                        />
                      </DropdownMenuItem>
                    )}
                    {canAdminister && (
                      <DropdownMenuItem>
                        <Button
                          appearance={{ theme: 'no-style' }}
                          text={MSG.buttonNotPlanned}
                        />
                      </DropdownMenuItem>
                    )}
                    {(canAdminister ||
                      walletAddress === creator.profile.walletAddress) && (
                      <DropdownMenuItem>
                        <Button
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
              <div>
                <Icon name="file" appearance={{ size: 'tiny' }} />
              </div>
            </Popover>
          )}
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
