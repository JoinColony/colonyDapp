/* @flow */

import { lifecycle } from 'recompose';

const fetchMissingColony = lifecycle({
  componentDidMount() {
    const {
      colony,
      ensName,
      fetchColony: fetchColonyActionCreator,
    } = this.props;
    if (!colony && ensName) fetchColonyActionCreator(ensName);
  },
});

export default fetchMissingColony;
