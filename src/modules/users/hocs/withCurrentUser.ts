import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { withImmutablePropsToJS } from '~utils/hoc';

import { RootStateRecord } from '../../state';
import { currentUserSelector } from '../selectors';

const withCurrentUser = compose(
  connect((state: RootStateRecord) => ({
    currentUser: currentUserSelector(state),
  })),
  withImmutablePropsToJS,
);

export default withCurrentUser;
