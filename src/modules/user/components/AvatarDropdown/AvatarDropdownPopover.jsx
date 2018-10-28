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

import type { UserRecord } from '~types/UserRecord';

const MSG = defineMessages({
  myProfile: {
    id: 'user.AvatarDropdown.AvatarDropdownPopover.link.myProfile',
    defaultMessage: 'My Profile',
  },
  settings: {
    id: 'user.AvatarDropdown.AvatarDropdownPopover.link.colonySettings',
    defaultMessage: 'Settings',
  },
  createColony: {
    id: 'user.AvatarDropdown.AvatarDropdownPopover.link.createColony',
    defaultMessage: 'Create a Colony',
  },
  requestFeatures: {
    id: 'user.AvatarDropdown.AvatarDropdownPopover.link.requestFeatures',
    defaultMessage: 'Request Features',
  },
  reportBugs: {
    id: 'user.AvatarDropdown.AvatarDropdownPopover.link.reportBugs',
    defaultMessage: 'Report Bugs',
  },
  helpCenter: {
    id: 'user.AvatarDropdown.AvatarDropdownPopover.link.helpCenter',
    defaultMessage: 'Help Center',
  },
  signOut: {
    id: 'user.AvatarDropdown.AvatarDropdownPopover.link.signOut',
    defaultMessage: 'Sign Out',
  },
});

type Props = {
  closePopover: () => void,
  user: UserRecord,
};

class AvatarDropdownPopover extends Component<Props> {
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

export default AvatarDropdownPopover;
