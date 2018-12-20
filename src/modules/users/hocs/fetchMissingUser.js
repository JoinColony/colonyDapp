/* @flow */

import { branch, lifecycle } from 'recompose';

const shouldFetchUser = ({ user, username, userAddress }) =>
  (username || userAddress) &&
  username !== 'user' && // TODO remove this, just for guarding against mocks
  (!user || (!user.record && !(user.isFetching || user.error)));

const fetchMissingUser = branch(
  shouldFetchUser,
  lifecycle({
    componentDidMount() {
      const { username, userAddress, fetchUserProfile } = this.props;
      if (username) {
        fetchUserProfile(username);
      } else if (userAddress) {
        fetchUserProfile(userAddress);
      }
    },
  }),
);

export default fetchMissingUser;
