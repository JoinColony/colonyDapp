/* @flow */

import * as yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const colonyMeta = yup.object({
  colonyENSName: yup.string(),
});
