/* @flow */

import { branch, lifecycle } from 'recompose';

import type { Address, ENSName } from '~types';

type Props = {
  ensName?: ENSName,
  colonyAddress?: Address,
  fetchColonyENSName: (colonyAddress: Address) => any,
};

const shouldFetchColonyENSName = ({ colonyAddress, ensName }: Props) =>
  !!(colonyAddress && !ensName);

const fetchMissingColonyENSName = branch(
  shouldFetchColonyENSName,
  lifecycle<*, Props>({
    componentDidMount() {
      const { colonyAddress, fetchColonyENSName } = this.props;
      if (shouldFetchColonyENSName(this.props))
        fetchColonyENSName(colonyAddress);
    },
  }),
);

export default fetchMissingColonyENSName;
