/* @flow */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

/**
 * Helper method to bind action creators with dispatch
 *
 * @method withBoundActionCreators
 *
 * @param {Object} actionCreators Object containing action creators
 */
export const withBoundActionCreators = (actionCreators: Object = {}) =>
  connect(
    null,
    (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch),
  );

const reduxUtils: Object = {
  withBoundActionCreators,
};

export default reduxUtils;
