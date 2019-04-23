/* @flow */

import Linkify from 'linkify-it';

import { USERNAME_SCHEMA } from './schemas';

const matcher = new Linkify();

matcher
  // Remove default matchers, as we don't care about those here
  .add('http:', null)
  .add('https:', null)
  .add('//', null)
  .add('mailto:', null)
  .add(USERNAME_SCHEMA.prefix, USERNAME_SCHEMA.schema);

export default matcher;
