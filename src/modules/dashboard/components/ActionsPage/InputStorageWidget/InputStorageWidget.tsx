import React from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { ActionTypes } from '~redux/index';
import { ActionForm, TextareaAutoresize } from '~core/Fields';

import styles from './InputStorageWidget.css';

export interface FormValues {
  inputStorageSlot?: string;
  inputNewValue?: string;
}

const CURRENT_VALUE_PLACEHOLDER =
  '0x0000000000000000000000000000000000000000000000000004939EF6B04812';

const MSG = defineMessages({
  inputStorageSlot: {
    id: 'dashboard.ActionsPage.InputStorageWidget.inputStorageSlot',
    defaultMessage: 'Input storage slot',
  },
  inputNewValue: {
    id: 'dashboard.ActionsPage.InputStorageWidget.inputNewValue',
    defaultMessage: 'Input new value',
  },
  currentValueLabel: {
    id: 'dashboard.ActionsPage.InputStorageWidget.currentValueLabel',
    defaultMessage: 'Current value: {slotValue}',
  },
  token: {
    id: 'dashboard.ActionsPage.InputStorageWidget.address',
    defaultMessage: 'Token',
  },
});

const InputStorageWidget = () => {
  const validationSchema = yup.object().shape({
    inputStorageSlot: yup.string(),
    inputNewValue: yup.string(),
  });

  return (
    <ActionForm
      initialValues={{
        inputStorageSlot: '',
        inputNewValue: '',
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_ACTION_GENERIC} // @TODO: Add in correct ActionTypes
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
    >
      {(formValues: FormikProps<FormValues>) => {
        return (
          <div className={styles.widgetForm}>
            <div className={styles.inputStorageSlotContainer}>
              <TextareaAutoresize
                label={MSG.inputStorageSlot}
                name="inputStorageSlot"
                appearance={{
                  theme: 'fat',
                  colorSchema: 'grey',
                }}
                onClick={() => {}} // @TODO: Connect with functional on click handler
              />
              <p className={styles.currentValueText}>
                <FormattedMessage
                  {...MSG.currentValueLabel}
                  values={{
                    slotValue: <span>{CURRENT_VALUE_PLACEHOLDER}</span>,
                  }}
                />
              </p>
            </div>
            <div className={styles.inputStorageSlotContainer}>
              <TextareaAutoresize
                label={MSG.inputNewValue}
                name="inputNewValue"
                appearance={{
                  theme: 'fat',
                  colorSchema: 'grey',
                }}
              />
              <div className={styles.controls}>
                <Button
                  appearance={{ theme: 'primary', size: 'medium' }}
                  onClick={() => formValues.handleSubmit()}
                  text={{ id: 'button.submit' }}
                  loading={formValues.isSubmitting}
                  disabled={!formValues.isValid}
                />
              </div>
            </div>
          </div>
        );
      }}
    </ActionForm>
  );
};

InputStorageWidget.displayName = 'dashboard.ActionsPage.InputStorageWidget';

export default InputStorageWidget;
