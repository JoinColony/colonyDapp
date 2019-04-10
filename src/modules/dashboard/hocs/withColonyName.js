/* @flow */

import { connect } from 'react-redux';
import { compose } from 'recompose';

import fetchMissingColonyName from './fetchMissingColonyName';
import { colonyNameSelector } from '../selectors';
import { fetchColonyName } from '../actionCreators';

const withColonyName = compose(
  connect(
    (state, props) => ({
      colonyName: colonyNameSelector(state, props),
    }),
    {
      fetchColonyName,
    },
  ),
  fetchMissingColonyName,
);

export default withColonyName;
