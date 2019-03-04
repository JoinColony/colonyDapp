/* @flow */

import compose from 'recompose/compose';

import { withImmutablePropsToJS } from '~utils/hoc';

import Organizations from './Organizations.jsx';

import { withDomains, withAdmins } from '../../hocs';

const enhance = compose(
  withAdmins,
  withDomains,
  withImmutablePropsToJS,
);

export default enhance(Organizations);
