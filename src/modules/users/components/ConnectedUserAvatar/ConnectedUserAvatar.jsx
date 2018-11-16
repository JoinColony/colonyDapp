/* @flow */

import React, { Component } from 'react';
import compose from 'recompose/compose';

import type { Props as UserAvatarProps } from '~core/UserAvatar/UserAvatar.jsx';
import type { UserRecord } from '~types/UserRecord';

import UserAvatar from '~core/UserAvatar';
import { avatarCache } from '~core/Avatar';

import { withUser } from '../../composers';

import {
  USER_AVATAR_FETCH,
  USER_AVATAR_FETCH_SUCCESS,
  USER_AVATAR_FETCH_ERROR,
} from '../../actionTypes';
import promiseListener from '../../../../createPromiseListener';

type Props = UserAvatarProps & {
  user?: UserRecord,
};

type State = {
  avatarData?: string,
};

class ConnectedUserAvatar extends Component<Props, State> {
  fetchUserAvatar: (hash: string) => Promise<*>;

  constructor(props: Props) {
    super(props);
    const { user } = props;
    this.state = {
      avatarData:
        user && user.avatar ? avatarCache.get(user.avatar) : undefined,
    };
    this.fetchUserAvatar = promiseListener.createAsyncFunction({
      start: USER_AVATAR_FETCH,
      resolve: USER_AVATAR_FETCH_SUCCESS,
      reject: USER_AVATAR_FETCH_ERROR,
    });
  }

  componentDidMount() {
    const { user } = this.props;
    if (user && user.avatar && !avatarCache.get(user.avatar))
      this.fetchUserAvatar
        .asyncFunction({ hash: user.avatar })
        .then(() =>
          this.setState({ avatarData: avatarCache.get(user.avatar) }),
        );
  }

  componentWillUnmount() {
    this.fetchUserAvatar.unsubscribe();
  }

  render() {
    const { avatarData } = this.state;
    return <UserAvatar {...this.props} avatarURL={avatarData} />;
  }
}

export default compose(withUser)(ConnectedUserAvatar);
