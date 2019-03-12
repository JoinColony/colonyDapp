/* @flow */

import { branch, lifecycle } from 'recompose';

import { shouldFetchData } from '~immutable/utils';

const shouldFetchDomains = ({ domains, ensName }) =>
  ensName && shouldFetchData(domains, 0, false);

const fetchMissingDomains = branch(
  shouldFetchDomains,
  lifecycle({
    componentDidMount() {
      const { ensName, fetchColonyDomains } = this.props;
      if (shouldFetchDomains(this.props)) fetchColonyDomains(ensName);
    },
  }),
);

export default fetchMissingDomains;
