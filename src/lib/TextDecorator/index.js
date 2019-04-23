/* @flow */

import TextDecorator from './TextDecorator';

import { USERNAME_SCHEMA } from './schemas';

export { default as usernameMatcher } from './usernameMatcher';

TextDecorator.loadSchema(USERNAME_SCHEMA);

export default TextDecorator;
