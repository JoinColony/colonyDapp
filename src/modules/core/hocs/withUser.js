/* @flow */

import { compose, branch, withProps } from 'recompose';

import { User } from '~immutable';

const withUser = compose(
  branch(
    props => props.username || props.userAddress,
    withProps({
      user: User(),
    }),
  ),
);

export default withUser;
