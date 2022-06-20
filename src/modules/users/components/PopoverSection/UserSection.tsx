import React from 'react';
import { defineMessages } from 'react-intl';

import { DropdownMenuItem, DropdownMenuSection } from '~core/DropdownMenu';
import NavLink from '~core/NavLink';
import { Colony, Maybe } from '~data/index';
import { CREATE_USER_ROUTE, USER_EDIT_ROUTE } from '~routes/routeConstants';

const MSG = defineMessages({
  buttonGetStarted: {
    id: 'users.PopoverSection.UserSection.buttonGetStarted',
    defaultMessage: 'Get started',
  },
  myProfile: {
    id: 'users.PopoverSection.UserSection.link.myProfile',
    defaultMessage: 'My Profile',
  },
  settings: {
    id: 'users.PopoverSection.UserSection.link.settings',
    defaultMessage: 'Settings',
  },
});

interface Props {
  colony?: Colony;
  username?: Maybe<string>;
  itemClassName?: string;
}

const displayName = 'users.PopoverSection.UserSection';

const UserSection = ({ colony, username }: Props) => (
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
      <>
        <DropdownMenuItem>
          <NavLink
            to={`/user/${username}`}
            text={MSG.myProfile}
            data-test="userProfile"
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <NavLink
            to={USER_EDIT_ROUTE}
            text={MSG.settings}
            data-test="userProfileSettings"
          />
        </DropdownMenuItem>
      </>
    )}
  </DropdownMenuSection>
);

UserSection.displayName = displayName;

export default UserSection;
