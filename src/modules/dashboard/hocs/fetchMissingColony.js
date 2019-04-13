/* @flow */

import { branch, lifecycle } from 'recompose';

import { shouldFetchData } from '~immutable/utils';

const shouldFetchColony = ({ colony, colonyAddress }) =>
  !!(colonyAddress && shouldFetchData(colony, 0, true));

const fetchMissingColony = branch(
  shouldFetchColony,
  lifecycle({
    componentDidMount() {
      const { colonyAddress, fetchColony } = this.props;
      if (shouldFetchColony(this.props)) fetchColony(colonyAddress);
    },
  }),
);

export default fetchMissingColony;
