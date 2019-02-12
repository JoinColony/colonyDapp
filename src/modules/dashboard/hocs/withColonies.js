/* @flow */

import { connect } from 'react-redux';

import type { RootStateRecord } from '~immutable';

import { coloniesSelector } from '../selectors';

const withColonies = connect((state: RootStateRecord) => ({
  colonies: coloniesSelector(state),
}));

export default withColonies;
