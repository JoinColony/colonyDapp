/* @flow */

import type { ComponentType } from 'react';

import { createElement } from 'react';

import { Consumer } from './DialogProvider.jsx';

const withDialog = () => (Component: ComponentType<{ [string]: any }>) => (
  props: Object,
) =>
  createElement(Consumer, null, value =>
    createElement(Component, { ...value, ...props }),
  );

export default withDialog;
