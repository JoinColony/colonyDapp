/* @flow */

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withImmutablePropsToJS } from '~utils/hoc';

import { currentUserBalanceSelector } from '../../../selectors';

import GasStationFooter from './GasStationFooter.jsx';

import type { RootStateRecord } from '~immutable';

export type InProps = {|
  close: () => void,
|};

const enhance = compose(
  connect((state: RootStateRecord) => ({
    balance: currentUserBalanceSelector(state),
  })),
  withImmutablePropsToJS,
);

export default enhance(GasStationFooter);
