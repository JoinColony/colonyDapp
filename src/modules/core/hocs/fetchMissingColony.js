/* @flow */

import { branch, lifecycle } from 'recompose';

const fetchMissingColony = branch(
  ({ colony }) => !(colony && colony.isReady),
  lifecycle({
    componentDidMount() {
      const {
        colony,
        ensName,
        fetchColony: fetchColonyActionCreator,
      } = this.props;
      if (ensName && (!colony || !colony.isFetching))
        fetchColonyActionCreator(ensName);
    },
  }),
);

export default fetchMissingColony;
