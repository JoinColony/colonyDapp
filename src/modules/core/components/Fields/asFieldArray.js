/* @flow */
import { createElement } from 'react';
import { withProps } from 'recompose';
import { FieldArray } from 'formik';

const asFieldArray = () => (Component: any) => ({ name, ...props }: Object) => {
  const ComponentWithProps = withProps({ name, ...props })(Component);
  return createElement(FieldArray, { name, component: ComponentWithProps });
};

export default asFieldArray;
