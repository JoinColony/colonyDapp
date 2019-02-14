/* @flow */

import compose from 'recompose/compose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import Organizations from './Organizations.jsx';

import { withDomains, withAdmins } from '~redux/hocs';

const enhance = compose(
  withAdmins,
  withDomains,
  withImmutablePropsToJS,
);

export default enhance(Organizations);
