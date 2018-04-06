/* @flow */
/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */

import ContractHttpLoader from '@colony/colony-js-contract-loader-http';

describe('colony-js imports', () => {
  it('should use the flow typings of `colony-js` packages', () => {
    // $ExpectError
    const loaderWithoutEndpoint = new ContractHttpLoader({
      wrong: 'constructor argument',
      parser: 'truffle',
    });

    const loaderWithCorrectArgs = new ContractHttpLoader({
      endpoint: 'myEndpoint',
      parser: 'truffle',
    });

    expect(loaderWithoutEndpoint).toBeInstanceOf(ContractHttpLoader);
    expect(loaderWithCorrectArgs).toBeInstanceOf(ContractHttpLoader);
  });
});
