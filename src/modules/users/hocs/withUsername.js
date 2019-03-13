/* @flow */

import { connect } from 'react-redux';
import { compose, branch, lifecycle } from 'recompose';

import type { RootStateRecord } from '~immutable';

import { usernameSelector } from '../selectors';
import { usernameFetch } from '../actionCreators';

type Props = {
  username?: string,
  address: string,
};

/*
 * With `address` in props, fetch the user's registered ensName and provide
 * as `username`.
 */
const withUsername = compose(
  connect(
    (state: RootStateRecord, props: Props) => ({
      username: usernameSelector(state, props),
    }),
    { usernameFetch },
  ),
  branch(
    ({ username }: Props) => !username,
    lifecycle({
      componentDidMount() {
        this.props.fetchUsername(this.props.address);
      },
    }),
  ),
);

export default withUsername;
