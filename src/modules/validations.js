/* @flow */

import * as yup from 'yup';
import { setLocale } from 'yup/lib/customLocale';

import en from '../i18n/en-validation.json';

setLocale(en);

/* Custom validators */
function equalTo(ref, msg) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    message: msg || en.mixed.equalTo,
    params: {
      reference: ref.path,
    },
    test(value) {
      return value === this.resolve(ref);
    },
  });
}

yup.addMethod(yup.mixed, 'equalTo', equalTo);
