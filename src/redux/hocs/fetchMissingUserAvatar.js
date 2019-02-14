/* @flow */

import { branch, lifecycle } from 'recompose';

const shouldFetchUserAvatar = ({ avatarData, user }) =>
  !avatarData &&
  (user && user.record && user.record.profile && user.record.profile.avatar);

const fetchMissingUserAvatar = branch(
  shouldFetchUserAvatar,
  lifecycle({
    componentDidMount() {
      const { user, fetchUserAvatar } = this.props;
      if (shouldFetchUserAvatar(this.props))
        fetchUserAvatar(user.record.profile.avatar);
    },
  }),
);

export default fetchMissingUserAvatar;
