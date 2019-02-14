/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { getColonyDomains } from '../selectors';
import { fetchColonyDomains } from '../actionCreators';
import fetchMissingDomains from './fetchMissingDomains';

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

const withDomains = compose(
  connect(
    (state: RootStateRecord, { ensName }: { ensName: ENSName }) => ({
      colonyDomains: getColonyDomains(state, ensName),
    }),
    {
      fetchColonyDomains,
    },
  ),
  fetchMissingDomains,
);

export default withDomains;
