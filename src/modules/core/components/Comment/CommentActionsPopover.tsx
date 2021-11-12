import React, { ReactNode, useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import {
  ColonyRole,
  ROOT_DOMAIN_ID,
  ColonyVersion,
  Extension,
} from '@colony/colony-js';

import { useTransformer } from '~utils/hooks';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Button from '~core/Button';
import { AnyUser, useLoggedInUser } from '~data/index';
import Icon from '~core/Icon';
import styles from './CommentActionsPopover.css';
import { userHasRole } from '../../../users/checks';
import { getUserRolesForDomain } from '../../../transformers';

const MSG = defineMessages({
  deleteComment: {
    id: 'core.Comment.CommentActionsPopover.deleteComment',
    defaultMessage: 'Delete comment',
  },
  banFromChat: {
    id: 'core.Comment.CommentActionsPopover.banFromChat',
    defaultMessage: 'Ban from chat',
  },
});

interface Props {
  closePopover: () => void;
  user: AnyUser | null;
  comment?: string;
  children?: ReactNode;
  hoverState?: boolean;
}

const displayName = 'core.Comment.CommentActionsPopover';

const CommentActionsPopover = ({
  closePopover,
  user,
  comment,
  hoverState,
  children,
}: Props) => {

  const { walletAddress, networkId, ethereal, username } = useLoggedInUser();
  // const rootRoles = useTransformer(getUserRolesForDomain, [
  //   colony,
  //   walletAddress,
  //   ROOT_DOMAIN_ID,
  // ]);

  // Check for permissions to moderate
  // const canModerate =
  //   userHasRole(rootRoles, ColonyRole.Root) ||
  //   userHasRole(rootRoles, ColonyRole.Administration);
  const canModerate = true;

  // // Check for permissions to moderate
  // const canEdit =
  //   userHasRole(rootRoles, ColonyRole.Root) ||
  //   userHasRole(rootRoles, ColonyRole.Administration);
  const canEdit = false;


    user?.profile.walletAddress

  // Hide the action popover on mouseLeave comment
  useEffect(() => {
    if (!hoverState) {
      closePopover();
    }
  }, [hoverState]);

  const renderUserSection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <Button 
          appearance={{ theme: 'no-style' }}
          onClick={() => closePopover()}
        >
          <div className={styles.actionButton}>
            <Icon name="trash" title={MSG.deleteComment} />
            <FormattedMessage {...MSG.deleteComment} />
          </div>
        </Button>
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  const renderColonySection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <Button 
          appearance={{ theme: 'no-style' }}
          onClick={() => closePopover()}
        >
          <div className={styles.actionButton}>
            <Icon name="circle-minus" title={MSG.banFromChat} />
            <FormattedMessage {...MSG.banFromChat} />
          </div>
        </Button>
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  return (
    <DropdownMenu onClick={closePopover}>
      {canModerate ? (
        <>
          {renderUserSection()}
          {renderColonySection()}
        </>
      ) : (
        null
      )}
      {canEdit ? (
        <>
          {renderUserSection()}
        </>
      ) : (
        null
      )}
    </DropdownMenu>
  );
};

CommentActionsPopover.displayName = displayName;

export default CommentActionsPopover;
