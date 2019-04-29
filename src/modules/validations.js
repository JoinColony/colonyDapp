/* @flow */

import * as yup from 'yup';
import { isIPFS } from 'ipfs';
import { isAddress } from 'web3-utils';
import { isValidAddress } from 'orbit-db';
import { normalize as ensNormalize } from 'eth-ens-namehash-ms';

import type { TokenType } from '~immutable';

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

// This should accept a TokenReference
function lessThanPot(availableTokens: Array<TokenType>, msg) {
  return this.test({
    name: 'lessThanPot',
    message: msg || en.mixed.lessThanPot,
    test(value) {
      // $FlowFixMe `yup.ref` not recognised
      const tokenIndex = this.resolve(yup.ref('token'));
      if (!tokenIndex) return true;
      // $FlowFixMe should be from TokenReference
      const { balance } = availableTokens[parseInt(tokenIndex, 10) - 1] || {};
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

function orbitDBAddress(msg) {
  return this.test({
    name: 'orbitDBAddress',
    message: msg || en.string.orbitDBAddress,
    test(value) {
      if (typeof value == 'undefined') return true;
      return isValidAddress(value);
    },
  });
}

function cid(msg) {
  return this.test({
    name: 'cid',
    message: msg || en.string.cid,
    test(value) {
      if (typeof value == 'undefined') return true;
      return isIPFS.cid(value);
    },
  });
}

function domainName(msg) {
  return this.test({
    name: 'domainName',
    message: msg || en.string.domainName,
    test(value) {
      return value && !value.includes('#');
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
yup.addMethod(yup.string, 'domainName', domainName);
yup.addMethod(yup.string, 'ensAddress', ensAddress);
yup.addMethod(yup.array, 'includes', includes);
yup.addMethod(yup.string, 'orbitDBAddress', orbitDBAddress);
yup.addMethod(yup.string, 'cid', cid);
