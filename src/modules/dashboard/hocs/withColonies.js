/* @flow */

import { connect } from 'react-redux';

import type { RootStateRecord } from '~immutable';

import { coloniesListSelector } from '../selectors';

const withColonies = connect((state: RootStateRecord) => ({
  colonies: coloniesListSelector(state),
}));

export default withColonies;
