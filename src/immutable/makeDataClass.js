/* @flow */

import { Record } from 'immutable';

const makeDataClass = <P: Object>(defaultValues: P) =>
  class extends Record({
    ...defaultValues,
    error: undefined,
    isFetching: false,
  })<P> {
    /* eslint-disable */
    /*::
    isFetching: boolean;
    error: string;
    */
    /* eslint-enable */

    // eslint-disable-next-line class-methods-use-this
    get isReady() {
      // Intended to be defined on extensions of this class
      return true;
    }
  };

export default makeDataClass;
