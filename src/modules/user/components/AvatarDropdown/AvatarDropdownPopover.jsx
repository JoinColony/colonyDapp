/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { USER_ROUTE, COLONY_HOME_ROUTE, CREATE_COLONY_ROUTE } from '~routes';

import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Link from '~core/Link';
import NavLink from '~core/NavLink';

import type { UserType } from '~types/user';

const MSG = defineMessages({
  myProfile: {
    id: 'UserDropdownPopover.link.myProfile',
    defaultMessage: 'My Profile',
  },
  settings: {
    id: 'UserDropdownPopover.link.colonySettings',
    defaultMessage: 'Settings',
  },
  createColony: {
    id: 'UserDropdownPopover.link.createColony',
    defaultMessage: 'Create a Colony',
  },
  requestFeatures: {
    id: 'UserDropdownPopover.link.requestFeatures',
    defaultMessage: 'Request Features',
  },
  reportBugs: {
    id: 'UserDropdownPopover.link.reportBugs',
    defaultMessage: 'Report Bugs',
  },
  helpCenter: {
    id: 'UserDropdownPopover.link.helpCenter',
    defaultMessage: 'Help Center',
  },
  signOut: {
    id: 'UserDropdownPopover.link.signOut',
    defaultMessage: 'Sign Out',
  },
});

type Props = {
  closePopover: () => void,
  user: UserType,
};

class UserDropdownPopover extends Component<Props> {
  static displayName = 'user.AvatarDropdown.AvatarDropdownPopover';

  renderUserSection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <NavLink to={USER_ROUTE} text={MSG.myProfile} />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <NavLink to={COLONY_HOME_ROUTE} text={MSG.settings} />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  renderColonySection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <NavLink to={CREATE_COLONY_ROUTE} text={MSG.createColony} />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  renderHelperSection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <Link to="/" text={MSG.requestFeatures} />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/" text={MSG.reportBugs} />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <a
          href="https://help.colony.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FormattedMessage {...MSG.helpCenter} />
        </a>
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  renderMetaSection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <Link to="/" text={MSG.signOut} />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  render() {
    const { closePopover } = this.props;
    return (
      <DropdownMenu onClick={closePopover}>
        {this.renderUserSection()}
        {this.renderColonySection()}
        {this.renderHelperSection()}
        {this.renderMetaSection()}
      </DropdownMenu>
    );
  }
}

export default UserDropdownPopover;
