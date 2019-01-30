/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { routerColonySelector, ensNameFromRouter } from '../selectors';
import { fetchColony } from '../actionCreators';
import fetchMissingColony from './fetchMissingColony';

const withColonyFromRoute = compose(
  connect(
    (state, props) => ({
      colony: routerColonySelector(state, props),
      ensName: ensNameFromRouter(state, props),
    }),
    {
      fetchColony,
    },
  ),
  fetchMissingColony,
);

export default withColonyFromRoute;
