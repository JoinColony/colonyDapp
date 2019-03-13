/* @flow */

import { branch, lifecycle } from 'recompose';

import { shouldFetchData } from '~immutable/utils';

import type { DataRecordType, UserRecordType } from '~immutable';

type Props = {
  userFetch: (username: string) => any,
  user: ?DataRecordType<UserRecordType>,
  address: ?string,
};

const shouldFetchUser = ({ user, address }: Props) =>
  !!(address && shouldFetchData(user, 0, true));

const fetchMissingUser = branch(
  shouldFetchUser,
  lifecycle<*, Props>({
    componentDidMount() {
      const { address, userFetch } = this.props;
      if (shouldFetchUser(this.props)) userFetch(address);
    },
  }),
);

export default fetchMissingUser;
