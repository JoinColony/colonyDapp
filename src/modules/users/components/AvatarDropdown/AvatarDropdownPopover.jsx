/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { OpenDialog } from '~core/Dialog/types';
import withDialog from '~core/Dialog/withDialog';
import { unfinishedProfileOpener } from '~users/UnfinishedProfileDialog';

import {
  USER_EDIT_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_USER_ROUTE,
} from '~routes';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Link from '~core/Link';
import NavLink from '~core/NavLink';

import type { UserType } from '~immutable';

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
  requestFeatures: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.requestFeatures',
    defaultMessage: 'Request Features',
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
});

type Props = {
  closePopover: () => void,
  user: UserType,
  openDialog: OpenDialog,
};

class AvatarDropdownPopover extends Component<Props> {
  static displayName = 'users.AvatarDropdown.AvatarDropdownPopover';

  handleSetup = () => {
    const {
      openDialog,
      user: {
        profile: { balance },
      },
    } = this.props;
    return unfinishedProfileOpener(openDialog, balance);
  };

  renderUserSection = () => {
    const {
      user: {
        profile: { username },
      },
    } = this.props;
    return (
      <DropdownMenuSection separator>
        {!username && (
          <DropdownMenuItem>
            <NavLink
              to={CREATE_USER_ROUTE}
              text={MSG.buttonGetStarted}
              data-test="pickUserCreation"
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
  };

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

export default withDialog()(AvatarDropdownPopover);
