import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { ActionButton } from '~core/Button';
import NavLink from '~core/NavLink';
import ExternalLink from '~core/ExternalLink';
import { FEEDBACK_LINK } from '~constants';

import { Colony } from '~data/index';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import { ActionTypes } from '~redux/index';
import {
  USER_EDIT_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_USER_ROUTE,
} from '~routes/index';

import styles from './AvatarDropdownPopover.css';

const MSG = defineMessages({
  buttonGetStarted: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.buttonGetStarted',
    defaultMessage: 'Get started',
  },
  myProfile: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.myProfile',
    defaultMessage: 'My Profile',
  },
  settings: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.colonySettings',
    defaultMessage: 'Settings',
  },
  createColony: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.createColony',
    defaultMessage: 'Create a Colony',
  },
  reportBugs: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.reportBugs',
    defaultMessage: 'Report Bugs',
  },
  helpCenter: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.helpCenter',
    defaultMessage: 'Help Center',
  },
  signOut: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.signOut',
    defaultMessage: 'Sign Out',
  },
  buttonConnect: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.buttonConnect',
    defaultMessage: 'Connect Wallet',
  },
});

interface Props {
  closePopover: () => void;
  username?: string | null;
  walletConnected?: boolean;
  onlyLogout?: boolean;
  colony: Colony;
}

const displayName = 'users.AvatarDropdown.AvatarDropdownPopover';

const AvatarDropdownPopover = ({
  closePopover,
  username,
  walletConnected = false,
  onlyLogout = false,
  colony,
}: Props) => {
  const renderUserSection = useCallback(() => {
    return (
      <DropdownMenuSection separator>
        {!username && (
          <DropdownMenuItem>
            <NavLink
              to={{
                pathname: CREATE_USER_ROUTE,
                state: colony?.colonyName
                  ? { colonyURL: `/colony/${colony?.colonyName}` }
                  : {},
              }}
              text={MSG.buttonGetStarted}
            />
          </DropdownMenuItem>
        )}
        {username && (
          <DropdownMenuItem>
            <NavLink
              to={`/user/${username}`}
              text={MSG.myProfile}
              data-test="userProfile"
            />
          </DropdownMenuItem>
        )}
        {username && (
          <DropdownMenuItem>
            <NavLink
              to={USER_EDIT_ROUTE}
              text={MSG.settings}
              data-test="userProfileSettings"
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuSection>
    );
  }, [colony, username]);

  const renderColonySection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <NavLink to={CREATE_COLONY_ROUTE} text={MSG.createColony} />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  const renderHelperSection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <ExternalLink
          href={FEEDBACK_LINK}
          text={MSG.reportBugs}
          className={styles.externalLink}
        />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <ExternalLink
          href="https://colony.gitbook.io/colony"
          text={MSG.helpCenter}
          className={styles.externalLink}
        />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  const renderMetaSection = () =>
    walletConnected && (
      <DropdownMenuSection separator>
        <DropdownMenuItem>
          <ActionButton
            appearance={{ theme: 'no-style' }}
            text={MSG.signOut}
            submit={ActionTypes.USER_LOGOUT}
            error={ActionTypes.USER_LOGOUT_ERROR}
            success={ActionTypes.USER_LOGOUT_SUCCESS}
          />
        </DropdownMenuItem>
      </DropdownMenuSection>
    );

  return (
    <DropdownMenu onClick={closePopover}>
      {!onlyLogout ? (
        <>
          {renderUserSection()}
          {renderColonySection()}
          {renderHelperSection()}
          {renderMetaSection()}
        </>
      ) : (
        <>{renderMetaSection()}</>
      )}
    </DropdownMenu>
  );
};

AvatarDropdownPopover.displayName = displayName;

export default AvatarDropdownPopover;
