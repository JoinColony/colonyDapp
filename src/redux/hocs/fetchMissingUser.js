/* @flow */

import { branch, lifecycle } from 'recompose';

import { shouldFetchData } from '~immutable/utils';

import type { DataRecordType, UserRecordType } from '~immutable';

type Props = {
  fetchUserProfile: (username: string) => any,
  user: ?DataRecordType<UserRecordType>,
  username: ?string,
};

const shouldFetchUser = ({ user, username }: Props) =>
  !!(
    username &&
    username !== 'user' && // TODO remove this, just for guarding against mocks
    shouldFetchData(user)
  );

const fetchMissingUser = branch(
  shouldFetchUser,
  lifecycle<*, Props>({
    componentDidMount() {
      const { username, fetchUserProfile } = this.props;
      if (shouldFetchUser(this.props)) fetchUserProfile(username);
    },
  }),
);

export default fetchMissingUser;
