/* @flow */

import type { ComponentType } from 'react';
import { compose } from 'recompose';
import withProps from 'recompose/withProps';
import { injectIntl } from 'react-intl';

import FieldComponent from './Field.jsx';

export { default } from './Field.jsx';

export const asField = (props?: Object) => (component: ComponentType<Object>) =>
  compose(
    injectIntl,
    withProps((ownProps?: Object) => ({
      component,
      ...ownProps,
      ...props,
    })),
  )(FieldComponent);

// exports a field without using redux-form
// it will not be connected to redux-form so take care of validation and stuff yourself
export const asStandaloneField = (props?: Object) =>
  asField({
    ...props,
    standalone: true,
  });
