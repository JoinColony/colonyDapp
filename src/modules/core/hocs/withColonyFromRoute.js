/* @flow */

import { connect } from 'react-redux';
import { compose } from 'recompose';

import { singleColonySelector } from '../../dashboard/selectors';
import { fetchColony } from '../../dashboard/actionCreators';
import fetchMissingColony from './fetchMissingColony';

import type { ENSName } from '~types';

const withColonyFromRoute = compose(
  connect(
    (
      state: *,
      { params: { ensName } = {} }: { params: { ensName: ENSName } },
    ) => ({
      colony: singleColonySelector(state, ensName),
      ensName,
    }),
    {
      fetchColony,
    },
  ),
  fetchMissingColony,
);

export default withColonyFromRoute;
