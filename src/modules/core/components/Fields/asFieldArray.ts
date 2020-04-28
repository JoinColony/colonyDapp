import { createElement } from 'react';
import { FieldArray, FieldArrayRenderProps } from 'formik';

export type AsFieldArrayEnhancedProps<P> = P & FieldArrayRenderProps;

const asFieldArray = () => (Component: any) => ({ name, ...props }) =>
  createElement(FieldArray, {
    name,
    render: (formikProps) =>
      createElement(Component, { ...props, ...formikProps }),
  });

export default asFieldArray;
