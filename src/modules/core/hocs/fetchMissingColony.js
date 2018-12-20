/* @flow */

import { branch, lifecycle } from 'recompose';

const shouldFetchColony = ({ colony, ensName }) =>
  ensName &&
  (!colony || (!colony.record && !(colony.isFetching || colony.error)));

const fetchMissingColony = branch(
  shouldFetchColony,
  lifecycle({
    componentDidMount() {
      const { ensName, fetchColony } = this.props;
      if (shouldFetchColony(this.props)) fetchColony(ensName);
    },
  }),
);

export default fetchMissingColony;
