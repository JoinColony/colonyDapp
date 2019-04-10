/* @flow */

import { branch, lifecycle } from 'recompose';

import { shouldFetchData } from '~immutable/utils';

const shouldFetchColony = ({ colony, colonyName }) =>
  !!(colonyName && shouldFetchData(colony, 0, true));

const fetchMissingColony = branch(
  shouldFetchColony,
  lifecycle({
    componentDidMount() {
      const { colonyName, fetchColony } = this.props;
      if (shouldFetchColony(this.props)) fetchColony(colonyName);
    },
  }),
);

export default fetchMissingColony;
