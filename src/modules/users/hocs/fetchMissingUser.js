/* @flow */

import { branch, lifecycle } from 'recompose';

import { shouldFetchData } from '~immutable/utils';

import type { DataRecordType, UserRecordType } from '~immutable';

type Props = {
  fetchUserProfile: (username: string) => any,
  user: ?DataRecordType<UserRecordType>,
  address: ?string,
};

const shouldFetchUser = ({ user, address }: Props) =>
  !!(address && shouldFetchData(user));

const fetchMissingUser = branch(
  shouldFetchUser,
  lifecycle<*, Props>({
    componentDidMount() {
      const { address, fetchUserProfile } = this.props;
      if (shouldFetchUser(this.props)) fetchUserProfile(address);
    },
  }),
);

export default fetchMissingUser;
