/* @flow */

import { branch, lifecycle } from 'recompose';

const shouldFetchUser = ({ user, username }) =>
  !!(
    username &&
    username !== 'user' && // TODO remove this, just for guarding against mocks
    (!user || (!user.record && !(user.isFetching || user.error)))
  );

const fetchMissingUser = branch(
  shouldFetchUser,
  lifecycle({
    componentDidMount() {
      const { username, fetchUserProfile } = this.props;
      if (shouldFetchUser(this.props)) fetchUserProfile(username);
    },
  }),
);

export default fetchMissingUser;
