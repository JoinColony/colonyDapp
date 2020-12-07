import React from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';

import { ActionTypes } from '~redux/index';
import { ActionForm } from '~core/Fields';

import InputStorageWidgetForm from './InputStorageWidgetForm';

export interface FormValues {
  inputStorageLot?: string;
  inputNewValue?: string;
}

const InputStorageWidget = () => {
  const validationSchema = yup.object().shape({
    inputStorageLot: yup.string().required(),
    inputNewValue: yup.string().required(),
  });

  return (
    <ActionForm
      initialValues={{
        inputStorageLot: undefined,
        inputNewValue: undefined,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.MOVE_FUNDS_BETWEEN_POTS} // @TODO Add in correct ActionTypes
      error={ActionTypes.MOVE_FUNDS_BETWEEN_POTS_ERROR}
      success={ActionTypes.MOVE_FUNDS_BETWEEN_POTS}
    >
      {(formValues: FormikProps<FormValues>) => {
        return <InputStorageWidgetForm {...formValues} />;
      }}
    </ActionForm>
  );
};

InputStorageWidget.displayName = 'dashboard.InputStorageWidget';

export default InputStorageWidget;
