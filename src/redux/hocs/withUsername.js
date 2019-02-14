/* @flow */

import { connect } from 'react-redux';
import { compose, branch, lifecycle } from 'recompose';

import { usernameFromAddressProp } from '../selectors';
import { fetchUsername as fetchUsernameAction } from '../actionCreators';

/**
 * With `userAddress` in props, fetch the user's registered ensName and provide
 * as `username`.
 */
const withUsername = compose(
  connect(
    (state, props) => ({
      username: usernameFromAddressProp(state, props),
    }),
    { fetchUsername: fetchUsernameAction },
  ),
  branch(
    ({ username }) => !username,
    lifecycle({
      componentDidMount() {
        const { userAddress, fetchUsername } = this.props;
        fetchUsername(userAddress);
      },
    }),
  ),
);

export default withUsername;
