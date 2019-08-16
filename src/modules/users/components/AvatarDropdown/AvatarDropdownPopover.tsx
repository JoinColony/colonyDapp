import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

import { ActionButton } from '~core/Button';
import { ActionTypes } from '~redux/index';
import {
  USER_EDIT_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_USER_ROUTE,
} from '~routes/index';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import NavLink from '~core/NavLink';
import ExternalLink from '~core/ExternalLink';
import { UserType } from '~immutable/index';
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

interface Props {
  closePopover: () => void;
  user: UserType;
}

class AvatarDropdownPopover extends Component<Props> {
  static displayName = 'users.AvatarDropdown.AvatarDropdownPopover';

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
            <NavLink to={CREATE_USER_ROUTE} text={MSG.buttonGetStarted} />
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
        <ExternalLink
          href="https://help.colony.io/hc/en-us/community/topics/360001237594"
          text={MSG.requestFeatures}
          className={styles.externalLink}
        />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <ExternalLink
          href="https://help.colony.io/hc/en-us/community/topics/360001293833"
          text={MSG.reportBugs}
          className={styles.externalLink}
        />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <ExternalLink
          href="https://help.colony.io/"
          text={MSG.helpCenter}
          className={styles.externalLink}
        />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  renderMetaSection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <ActionButton
          className={styles.logout}
          text={MSG.signOut}
          submit={ActionTypes.USER_LOGOUT}
          error={ActionTypes.USER_LOGOUT_ERROR}
          success={ActionTypes.USER_LOGOUT_SUCCESS}
        />
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

const enhance = compose(withRouter);

export default enhance(AvatarDropdownPopover) as any;
