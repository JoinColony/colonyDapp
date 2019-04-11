/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { colonySelector } from '../selectors';
import { fetchColony } from '../actionCreators';
import fetchMissingColony from './fetchMissingColony';

import type { ENSName } from '~types';

const withColony = compose(
  connect(
    (state, { colonyName }: { colonyName: ENSName }) => ({
      colony: colonySelector(state, colonyName),
    }),
    {
      fetchColony,
    },
  ),
  fetchMissingColony,
);

export default withColony;
