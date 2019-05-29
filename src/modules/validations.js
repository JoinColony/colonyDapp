/* @flow */

import * as yup from 'yup';
import { isIPFS } from 'ipfs';
import { isAddress } from 'web3-utils';
import { isValidAddress } from 'orbit-db';
import { normalize as ensNormalize } from 'eth-ens-namehash-ms';
import BigNumber from 'bn.js';
import moveDecimal from 'move-decimal-point';

import type { TokenReferenceType, TokenType } from '~immutable';

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
function lessThanPot(
  tokenReferences: Array<TokenReferenceType>,
  colonyTokens: Array<TokenType>,
  msg,
) {
  return this.test({
    name: 'lessThanPot',
    message: msg || en.mixed.lessThanPot,
    params: {
      tokenReferences,
    },
    test(value) {
      const tokenAddress = this.resolve(yup.ref('token'));
      if (!tokenAddress) return true;
      const { balance } =
        tokenReferences.find(
          ({ address: refAddress }) => refAddress === tokenAddress,
        ) || {};
      const { decimals } =
        colonyTokens.find(
          ({ address: refAddress }) => refAddress === tokenAddress,
        ) || {};
      const amount = new BigNumber(
        moveDecimal(value, decimals ? parseInt(decimals, 10) : 18),
      );
      return balance === undefined || bnLessThan(amount, balance);
    },
  });
}

function address(msg) {
  return this.test({
    name: 'address',
    message: msg || en.string.address,
    test(value) {
      return typeof value == 'undefined' || isAddress(value);
    },
  });
}

function orbitDBAddress(msg) {
  return this.test({
    name: 'orbitDBAddress',
    message: msg || en.string.orbitDBAddress,
    test(value) {
      return typeof value == 'undefined' || isValidAddress(value);
    },
  });
}

function cid(msg) {
  return this.test({
    name: 'cid',
    message: msg || en.string.cid,
    test(value) {
      return typeof value == 'undefined' || isIPFS.cid(value);
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
