import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import classnames from 'classnames';
import { useMediaQuery } from 'react-responsive';

import Icon from '~core/Icon';
import Popover from '~core/Popover';
import { Colony } from '~data/index';

import MemberActionsPopover from './MemberActionsPopover';

import { query700 as query } from '~styles/queries.css';
import styles from './MemberActions.css';

const MSG = defineMessages({
  memberActionsTitle: {
    id: 'core.MemberList.MemberActions.MemberActionTitle',
    defaultMessage: 'Member Actions',
  },
});

interface Props {
  userAddress: string;
  colony: Colony;
  isWhitelisted: boolean;
  isBanned: boolean;
  canAdministerComments?: boolean;
}

const displayName = 'core.MemberList.MemberActions';

const MemberActions = ({
  canAdministerComments,
  colony,
  userAddress,
  isWhitelisted,
  isBanned,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const isMobile = useMediaQuery({ query });
  const offset = isMobile ? [0, 0] : [40, 15];

  return (
    <Popover
      content={({ close }) => (
        <MemberActionsPopover
          closePopover={close}
          canAdministerComments={canAdministerComments}
          colony={colony}
          isWhitelisted={isWhitelisted}
          isBanned={isBanned}
          userAddress={userAddress}
        />
      )}
      trigger="click"
      showArrow={false}
      placement="right"
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset,
            },
          },
        ],
      }}
    >
      {({ ref, id }) => (
        <button
          id={id}
          ref={ref}
          className={classnames(styles.actionsButton, {
            [styles.activeDropdown]: isOpen,
          })}
          onClick={() => setOpen(true)}
          type="button"
        >
          <Icon
            className={styles.actionsIcon}
            name="three-dots-row"
            title={MSG.memberActionsTitle}
          />
        </button>
      )}
    </Popover>
  );
};

MemberActions.displayName = displayName;

export default MemberActions;
