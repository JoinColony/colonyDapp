/* @flow */

import { connect } from 'react-redux';
import { compose } from 'recompose';

import fetchMissingColonyENSName from './fetchMissingColonyENSName';
import { colonyNameSelector } from '../selectors';
import { fetchColonyENSName } from '../actionCreators';

const withColonyENSName = compose(
  connect(
    (state, props) => ({
      ensName: colonyNameSelector(state, props),
    }),
    {
      fetchColonyENSName,
    },
  ),
  fetchMissingColonyENSName,
);

export default withColonyENSName;
