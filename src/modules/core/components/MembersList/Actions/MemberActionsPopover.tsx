import React, { useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { getBlockscoutUserURL } from '~externalUrls';
import { Colony } from '~data/index';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { BanUserDialog } from '~core/Comment';
import ExternalLink from '~core/ExternalLink';
import ManageWhitelistDialog from '~dashboard/Dialogs/ManageWhitelistDialog';

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
  colony: Colony;
  userAddress: string;
  isWhitelisted: boolean;
  isBanned: boolean;
  canAdministerComments?: boolean;
}

const displayName = 'core.MembersList.MemberActionsPopover';

const MemberActionsPopover = ({
  closePopover,
  canAdministerComments,
  colony,
  userAddress,
  isWhitelisted,
  isBanned,
}: Props) => {
  const openBanUserDialog = useDialog(BanUserDialog);
  const handleBanUser = useCallback(
    () =>
      openBanUserDialog({
        colonyAddress: colony.colonyAddress,
        isBanning: !isBanned,
        addressToBan: userAddress,
      }),
    [openBanUserDialog, colony, userAddress, isBanned],
  );
  const openManageWhitelistDialog = useDialog(ManageWhitelistDialog);
  const handleManageWhitelist = useCallback(
    () => openManageWhitelistDialog({ userAddress, colony }),
    [openManageWhitelistDialog, userAddress, colony],
  );

  const renderUserActions = () => (
    <DropdownMenuItem>
      <Button appearance={{ theme: 'no-style' }}>
        <ExternalLink
          href={getBlockscoutUserURL(userAddress)}
          className={styles.actionButton}
          text={MSG.viewOnBlockscout}
        />
      </Button>
    </DropdownMenuItem>
  );

  const renderModeratorOptions = () => {
    return (
      <>
        {!isWhitelisted && (
          <DropdownMenuItem>
            <Button
              appearance={{ theme: 'no-style' }}
              onClick={() => handleManageWhitelist()}
            >
              <div className={styles.actionButton}>
                <FormattedMessage {...MSG.addToAddressBook} />
              </div>
            </Button>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Button
            appearance={{ theme: 'no-style' }}
            onClick={() => handleBanUser()}
          >
            <div className={styles.actionButton}>
              <FormattedMessage {...MSG.banUser} values={{ unban: isBanned }} />
            </div>
          </Button>
        </DropdownMenuItem>
      </>
    );
  };

  return (
    <DropdownMenu onClick={closePopover}>
      <DropdownMenuSection>
        {canAdministerComments && renderModeratorOptions()}
        {renderUserActions()}
      </DropdownMenuSection>
    </DropdownMenu>
  );
};

MemberActionsPopover.displayName = displayName;

export default MemberActionsPopover;
