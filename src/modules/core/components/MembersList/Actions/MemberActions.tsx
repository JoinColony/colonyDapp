import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import classnames from 'classnames';

import Icon from '~core/Icon';
import Popover from '~core/Popover';

import MemberActionsPopover from './MemberActionsPopover';

import styles from './MemberActions.css';

const MSG = defineMessages({
  memberActionsTitle: {
    id: 'core.MemberList.MemberActions.MemberActionTitle',
    defaultMessage: 'Member Actions',
  },
});

interface Props {
  currentUserPermission: string;
  colonyAddress: string;
  userAddress: string;
}

const displayName = 'core.MemberList.MemberActions';

const MemberActions = ({
  currentUserPermission,
  colonyAddress,
  userAddress,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Popover
      content={({ close }) => (
        <MemberActionsPopover
          closePopover={close}
          currentUserPermission={currentUserPermission}
          colonyAddress={colonyAddress}
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
              offset: [40, 15],
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
