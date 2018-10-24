/* @flow */

import * as yup from 'yup';
import { isAddress } from 'web3-utils';

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
      return isAddress(value);
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
yup.addMethod(yup.array, 'includes', includes);
