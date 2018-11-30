/* @flow */

import React, { Component } from 'react';

import getIcon from '../../../../lib/identicon';

import Avatar from '~core/Avatar';
import UserInfo from '~core/UserInfo';
import NavLink from '../NavLink';

export type Props = {
  /** Avatar image URL (can be a base64 encoded string) */
  avatarURL?: ?string,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
  /*
   * The user's name (aka Display Name)
   */
  displayName?: string,
  /** For the title */
  username?: string,
  /** Address of the current user for identicon fallback */
  walletAddress: string,
  /* Whether to show or not show the UserInfo tooltip over the avatar */
  hasUserInfo?: boolean,
  /** Allow exceptions where you don't link to the user profile */
  link?: boolean,
};

class UserAvatarDisplay extends Component<Props> {
  static displayName = 'UserAvatarDisplay';

  static defaultProps = {
    hasUserInfo: false,
    link: true,
  };

  renderJoinAvatarAndUserInfo = () => {
    const {
      displayName,
      username,
      className,
      walletAddress,
      hasUserInfo,
      avatarURL,
      notSet,
      size,
    } = this.props;
    return (
      <UserInfo
        displayName={displayName}
        username={username}
        walletAddress={walletAddress}
        trigger={hasUserInfo ? 'hover' : 'disabled'}
      >
        <Avatar
          avatarURL={avatarURL || (!notSet ? getIcon(walletAddress) : null)}
          className={className}
          notSet={notSet}
          placeholderIcon="circle-person"
          size={size}
          title={username || walletAddress}
        />
      </UserInfo>
    );
  };

  render() {
    const { link, username } = this.props;
    return link && username ? (
      <NavLink to={`/user/${username.toLowerCase()}`}>
        {this.renderJoinAvatarAndUserInfo()}
      </NavLink>
    ) : (
      this.renderJoinAvatarAndUserInfo()
    );
  }
}

export default UserAvatarDisplay;
