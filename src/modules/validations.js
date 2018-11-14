/* @flow */

import * as yup from 'yup';
import { isAddress } from 'web3-utils';
import { normalize as ensNormalize } from 'eth-ens-namehash-ms';

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

function username(msg) {
  return this.test({
    name: 'username',
    message: msg || en.string.username,
    test(value) {
      // We do not allow dots although _technically_ they are allowed in UTS46
      // http://unicode.org/reports/tr46/
      if (value && value.includes('.')) return false;
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
    message: msg || en.mixed.required,
    test(value) {
      return value.includes(searchVal);
    },
  });
}

yup.addMethod(yup.mixed, 'equalTo', equalTo);
yup.addMethod(yup.string, 'address', address);
yup.addMethod(yup.string, 'ensAddress', ensAddress);
yup.addMethod(yup.string, 'username', username);
yup.addMethod(yup.array, 'includes', includes);
