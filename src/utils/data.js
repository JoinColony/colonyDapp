/* @flow */

import generate from 'nanoid/generate';
import urlDictionary from 'nanoid/url';

// eslint-disable-next-line import/prefer-default-export
export const generateUrlFriendlyId = () => generate(urlDictionary, 21);
