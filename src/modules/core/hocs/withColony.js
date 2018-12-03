/* @flow */

import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { singleColony } from '../../dashboard/selectors';

import { fetchColony } from '../../dashboard/actionCreators';

import type { ENSName } from '~types';

const withFetchColony = lifecycle({
  componentDidMount() {
    const {
      colony,
      ensName,
      fetchColony: fetchColonyActionCreator,
    } = this.props;
    if (!colony) fetchColonyActionCreator(ensName);
  },
});

const withColony = compose(
  connect(
    (state, { ensName }: { ensName: ENSName }) => ({
      colony: singleColony(state, ensName),
    }),
    {
      fetchColony,
    },
  ),
  withFetchColony,
);

export default withColony;
