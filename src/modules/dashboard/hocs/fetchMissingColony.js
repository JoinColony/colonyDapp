/* @flow */

import { branch, lifecycle } from 'recompose';

import { shouldFetchData } from '~immutable/utils';

const shouldFetchColony = ({ colony, ensName }) =>
  !!(ensName && shouldFetchData(colony));

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
