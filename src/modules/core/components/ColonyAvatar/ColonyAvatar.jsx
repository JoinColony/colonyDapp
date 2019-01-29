/* @flow */
import React, { Component } from 'react';

import getIcon from '../../../../lib/identicon';

import Avatar from '../Avatar';

import type { ColonyRecord } from '~immutable';

type Props = {|
  address: $PropertyType<ColonyRecord, 'address'>,
  avatarHash: $PropertyType<ColonyRecord, 'avatar'>,
  /** Base64 image */
  avatarData: string,
  ensName: $PropertyType<ColonyRecord, 'ensName'>,
  name: $PropertyType<ColonyRecord, 'name'>,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
  /** Action creator */
  fetchColonyAvatar: (hash: string) => void,
|};

class ColonyAvatar extends Component<Props> {
  componentDidMount() {
    const { avatarHash, avatarData, fetchColonyAvatar } = this.props;
    if (avatarHash && !avatarData) {
      fetchColonyAvatar(avatarHash);
    }
  }

  render() {
    const { address, name, avatarData, ...otherProps } = this.props;
    return (
      <Avatar
        avatarURL={avatarData || getIcon(address)}
        placeholderIcon="at-sign-circle"
        title={name}
        {...otherProps}
      />
    );
  }
}

export default ColonyAvatar;
