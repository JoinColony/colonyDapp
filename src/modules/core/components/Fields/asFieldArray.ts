import { createElement } from 'react';
import { FieldArray } from 'formik';

const asFieldArray = () => (Component: any) => ({ name, ...props }: any) =>
  createElement(FieldArray, {
    name,
    render: formikProps =>
      createElement(Component, { ...props, ...formikProps }),
  });

export default asFieldArray;
