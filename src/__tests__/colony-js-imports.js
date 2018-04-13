/* @flow */
/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */

import ContractHttpLoader from '@colony/colony-js-contract-loader-http';

describe('colony-js imports', () => {
  it('should use the flow typings of `colony-js` packages', () => {
    let loaderWithoutEndpoint;
    try {
      // $ExpectError
      loaderWithoutEndpoint = new ContractHttpLoader({
        wrong: 'constructor argument',
        parser: 'truffle',
      });
    } catch (error) {
      // Ignore the JS error; we're just testing the flow typing for
      // the constructor here as an example.
    }

    const loaderWithCorrectArgs = new ContractHttpLoader({
      endpoint: 'myEndpoint',
      parser: 'truffle',
    });

    expect(loaderWithoutEndpoint).toBeUndefined();
    expect(loaderWithCorrectArgs).toBeInstanceOf(ContractHttpLoader);
  });
});
