/* @flow */

import * as yup from 'yup';
import { List } from 'immutable';
import { isAddress } from 'web3-utils';
import { normalize as ensNormalize } from 'eth-ens-namehash-ms';

import type { TokenRecord } from '~immutable';

import { bnLessThan } from '../utils/numbers';

import en from '../i18n/en-validation.json';

yup.setLocale(en);

/* Custom validators */
function equalTo(ref, msg) {
  return this.test({
    name: 'equalTo',
    message: msg || en.mixed.equalTo,
    params: {
      reference: ref.path,
    },
    test(value) {
      return value === this.resolve(ref);
    },
  });
}

// Used by `TaskEditDialog` to check there are sufficient funds for the
// selected token.
function lessThanPot(availableTokens: List<TokenRecord>, msg) {
  return this.test({
    name: 'lessThanPot',
    message: msg || en.mixed.lessThanPot,
    test(value) {
      // $FlowFixMe `yup.ref` not recognised
      const tokenIndex = this.resolve(yup.ref('token'));
      if (!tokenIndex) return true;
      const { balance } =
        availableTokens.get(parseInt(tokenIndex, 10) - 1) || {};
      return balance === undefined || bnLessThan(value, balance);
    },
  });
}

function address(msg) {
  return this.test({
    name: 'address',
    message: msg || en.string.address,
    test(value) {
      if (typeof value == 'undefined') return true;
      return isAddress(value);
    },
  });
}

function ensAddress(msg) {
  return this.test({
    name: 'ensAddress',
    message: msg || en.string.ensAddress,
    test(value) {
      try {
        ensNormalize(value);
      } catch (e) {
        return false;
      }
      return true;
    },
  });
}

function includes(searchVal, msg) {
  return this.test({
    name: 'includes',
    message: msg || en.array.includes,
    params: {
      searchVal,
    },
    test(value) {
      return value.includes(searchVal);
    },
  });
}

yup.addMethod(yup.mixed, 'equalTo', equalTo);
yup.addMethod(yup.mixed, 'lessThanPot', lessThanPot);
yup.addMethod(yup.string, 'address', address);
yup.addMethod(yup.string, 'ensAddress', ensAddress);
yup.addMethod(yup.array, 'includes', includes);
