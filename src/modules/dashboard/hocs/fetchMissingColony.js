/* @flow */

import { branch, lifecycle } from 'recompose';

import { shouldFetchData } from '~immutable/utils';

const shouldFetchColony = ({ colony, ensName }) =>
  !!(ensName && shouldFetchData(colony, 0, true));

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
