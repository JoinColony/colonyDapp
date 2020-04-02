import * as yup from 'yup';
import { isIPFS } from 'ipfs';
import { isAddress } from 'web3-utils';
import { normalize as ensNormalize } from 'eth-ens-namehash-ms';
import BigNumber from 'bn.js';

import en from '../i18n/en-validation.json';

// @ts-ignore
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

function address(msg) {
  return this.test({
    name: 'address',
    message: msg || en.string.address,
    test(value) {
      return typeof value == 'undefined' || isAddress(value);
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

function username(msg) {
  return this.test({
    name: 'username',
    message: msg || en.string.username,
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
    // @ts-ignore (_typeCheck is not typed in external types)
    // eslint-disable-next-line no-underscore-dangle
    return super._typeCheck(value) || BigNumber.isBN(value);
  }
}

yup.addMethod(yup.mixed, 'equalTo', equalTo);
yup.addMethod(yup.string, 'address', address);
yup.addMethod(yup.string, 'ensAddress', ensAddress);
yup.addMethod(yup.array, 'includes', includes);
yup.addMethod(yup.string, 'cid', cid);
yup.addMethod(yup.string, 'username', username);
