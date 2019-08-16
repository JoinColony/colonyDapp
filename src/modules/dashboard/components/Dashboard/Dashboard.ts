import { connect } from 'react-redux';
import compose from 'recompose/compose';

// @ts-ignore
import Dashboard from './Dashboard.tsx';
import { currentUserSelector } from '../../../users/selectors';
import { RootStateRecord } from '~immutable/state';
import { withImmutablePropsToJS } from '~utils/hoc';

const enhance = compose(
  connect(
    (state: RootStateRecord) => ({
      currentUser: currentUserSelector(state),
    }),
    null,
  ),
  withImmutablePropsToJS,
);

export default enhance(Dashboard);
