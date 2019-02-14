/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { singleColonySelector } from '../selectors';
import { fetchColony } from '../actionCreators';
import fetchMissingColony from './fetchMissingColony';

import type { ENSName } from '~types';

const withColony = compose(
  connect(
    (state, { ensName }: { ensName: ENSName }) => ({
      colony: singleColonySelector(state, ensName),
    }),
    {
      fetchColony,
    },
  ),
  fetchMissingColony,
);

export default withColony;
