import * as yup from 'yup';
import { isIPFS } from 'ipfs';
import { isAddress } from 'web3-utils';
import { isValidAddress } from 'orbit-db';
import { normalize as ensNormalize } from 'eth-ens-namehash-ms';
import BigNumber from 'bn.js';
import moveDecimal from 'move-decimal-point';

import { TokenReferenceType, TokenType } from '~immutable/index';
import { bnLessThan } from '../utils/numbers';

import en from '../i18n/en-validation.json';

yup.setLocale(en);

/*
 * The ens domain regex is composed of
 * ^ start match
 * [A-Za-z0-9] allow upper case, lower case, numerals
 * [^.] negate to not allow dots / periods
 * {0,255} match at least 1 and at most 255 chars
 * $ end match
 */
// eslint-disable-next-line import/prefer-default-export
export const ENS_DOMAIN_REGEX = '^[A-Za-z0-9][^.]{0,255}$';

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
  tokenReferences: TokenReferenceType[],
  colonyTokens: TokenType[],
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
      const { balance = undefined } =
        tokenReferences.find(
          ({ address: refAddress }) => refAddress === tokenAddress,
        ) || {};
      const { decimals = undefined } =
        colonyTokens.find(
          ({ address: refAddress }) => refAddress === tokenAddress,
        ) || {};
      const amount = new BigNumber(
        moveDecimal(value, decimals ? Math.floor(decimals) : 18),
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
      return value ? !!value.match(new RegExp(ENS_DOMAIN_REGEX)) : true;
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

export class BigNumberSchemaType extends yup.object {
  _typeCheck(value: any) {
    // eslint-disable-next-line no-underscore-dangle
    return super._typeCheck(value) || BigNumber.isBN(value);
  }
}

yup.addMethod(yup.mixed, 'equalTo', equalTo);
yup.addMethod(yup.mixed, 'lessThanPot', lessThanPot);
yup.addMethod(yup.string, 'address', address);
yup.addMethod(yup.string, 'ensAddress', ensAddress);
yup.addMethod(yup.array, 'includes', includes);
yup.addMethod(yup.string, 'orbitDBAddress', orbitDBAddress);
yup.addMethod(yup.string, 'cid', cid);
