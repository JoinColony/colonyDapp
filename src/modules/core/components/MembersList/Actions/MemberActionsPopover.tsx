import React, { useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { BanUserDialog } from '~core/Comment';
import ExternalLink from '~core/ExternalLink';

import styles from './MemberActionsPopover.css';

const MSG = defineMessages({
  addToAddressBook: {
    id: 'core.MembersList.MemberActionsPopover.addToAddressBook',
    defaultMessage: `Add to address book`,
  },
  banUser: {
    id: 'core.MembersList.MemberActionsPopover.banUser',
    defaultMessage: `{unban, select,
      true {Unban}
      other {Ban}
    } user`,
  },
  viewOnBlockscout: {
    id: 'core.MembersList.MemberActionsPopover.viewOnBlockscout',
    defaultMessage: 'View on Blockscout',
  },
});

interface Props {
  closePopover: () => void;
  colonyAddress: string;
  userAddress: string;
  canAdministerComments?: boolean;
}

const displayName = 'core.MembersList.MemberActionsPopover';

const MemberActionsPopover = ({
  closePopover,
  canAdministerComments,
  colonyAddress,
  userAddress,
}: Props) => {
  const openBanUserDialog = useDialog(BanUserDialog);
  const handleBanUser = useCallback(
    () =>
      openBanUserDialog({
        colonyAddress,
      }),
    [openBanUserDialog, colonyAddress],
  );

  const BLOCKSCOUT_URL = `https://blockscout.com/xdai/mainnet/address/${userAddress}/transactions`;
  const renderUserActions = () => (
    <DropdownMenuSection>
      <DropdownMenuItem>
        <Button appearance={{ theme: 'no-style' }}>
          <ExternalLink
            href={BLOCKSCOUT_URL}
            className={styles.actionButton}
            text={MSG.viewOnBlockscout}
          />
        </Button>
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  const renderModeratorOptions = () => {
    const userBanned = false;
    return (
      <DropdownMenuSection>
        <DropdownMenuItem>
          <Button appearance={{ theme: 'no-style' }}>
            <div className={styles.actionButton}>
              <FormattedMessage {...MSG.addToAddressBook} />
            </div>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            appearance={{ theme: 'no-style' }}
            onClick={() => handleBanUser()}
          >
            <div className={styles.actionButton}>
              <FormattedMessage
                {...MSG.banUser}
                values={{ unban: userBanned }}
              />
            </div>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuSection>
    );
  };

  return (
    <DropdownMenu onClick={closePopover}>
      {canAdministerComments && (
        <>{renderModeratorOptions()}</>
      )}
      <>{renderUserActions()}</>
    </DropdownMenu>
  );
};

MemberActionsPopover.displayName = displayName;

export default MemberActionsPopover;
