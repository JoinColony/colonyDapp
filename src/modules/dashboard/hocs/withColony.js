/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { colonySelector } from '../selectors';
import { fetchColony } from '../actionCreators';
import fetchMissingColony from './fetchMissingColony';

import type { Address } from '~types';

const withColony = compose(
  connect(
    (state, { colonyAddress }: { colonyAddress: Address }) => ({
      colony: colonySelector(state, colonyAddress),
    }),
    {
      fetchColony,
    },
  ),
  fetchMissingColony,
);

export default withColony;
