/* @flow */

import generate from 'nanoid/generate';
import urlDictionary from 'nanoid/url';

export opaque type RandomId: string = string;

// eslint-disable-next-line import/prefer-default-export
export const generateUrlFriendlyId = (): RandomId =>
  generate(urlDictionary, 21);
