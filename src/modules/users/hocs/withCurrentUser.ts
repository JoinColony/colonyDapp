import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { RootStateRecord } from '~immutable/state';
import { withImmutablePropsToJS } from '~utils/hoc';
import { currentUserSelector } from '../selectors';

const withCurrentUser = compose(
  connect((state: RootStateRecord) => ({
    currentUser: currentUserSelector(state),
  })),
  withImmutablePropsToJS,
);

export default withCurrentUser;
