/* @flow */

import { branch, lifecycle } from 'recompose';

import type { Address, ENSName } from '~types';

type Props = {
  colonyName?: ENSName,
  colonyAddress?: Address,
  fetchColonyName: (colonyAddress: Address) => any,
};

const shouldFetchColonyName = ({ colonyAddress, colonyName }: Props) =>
  !!(colonyAddress && !colonyName);

const fetchMissingColonyName = branch(
  shouldFetchColonyName,
  lifecycle<*, Props>({
    componentDidMount() {
      const { colonyAddress, fetchColonyName } = this.props;
      if (shouldFetchColonyName(this.props)) fetchColonyName(colonyAddress);
    },
  }),
);

export default fetchMissingColonyName;
