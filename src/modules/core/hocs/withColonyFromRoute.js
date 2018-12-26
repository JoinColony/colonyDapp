/* @flow */

import { connect } from 'react-redux';
import { compose } from 'recompose';

import {
  routerColonySelector,
  ensNameFromRouter,
} from '../../dashboard/selectors';
import { fetchColony } from '../../dashboard/actionCreators';
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
