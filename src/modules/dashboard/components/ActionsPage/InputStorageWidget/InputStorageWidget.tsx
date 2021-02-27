import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { ActionForm, TextareaAutoresize, InputStatus } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { ensureHexPrefix } from '~utils/strings';
import { ENTER, SPACE } from '~types/index';

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
    inputStorageSlot: yup.string().max(66).hexString(),
    inputNewValue: yup.string(),
  });

  /*
   * We need to handle these manually using a ref, since the TextAreaAutoresize
   * component doesn't give us access to the native React ones :(
   */
  const handleInputStorageSlotBlur = useCallback(
    (textarea, currentValue, updateValues) => {
      if (textarea?._ref) {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        const autoResizeTextareaComponent = textarea?._ref;
        /*
         * Add 0x prefix on blur
         */
        autoResizeTextareaComponent.onblur = () =>
          updateValues('inputStorageSlot', ensureHexPrefix(currentValue));
        /*
         * Prevent entering a new line
         *
         * Based on specs we need to **fake** a multi-line input, but one
         * you can't actually create a new line manully, just if the text
         * overflows...
         *
         * While we're at it we also disable the space bar, since no value
         * that can be entered requires a space (it's just a litte nice-to-have)
         */
        autoResizeTextareaComponent.onkeypress = (event) => {
          if (event.code === ENTER || event.code === SPACE) {
            event.preventDefault();
          }
        };
      }
    },
    [],
  );

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
      {({
        handleSubmit,
        isSubmitting,
        isValid,
        errors: { inputStorageSlot: inputStorageSlotError },
        values: { inputStorageSlot: inputStorageSlotValue },
        setFieldValue,
      }: FormikProps<FormValues>) => (
        <div className={styles.widgetForm}>
          <div className={styles.inputStorageSlotContainer}>
            <TextareaAutoresize
              label={MSG.inputStorageSlot}
              name="inputStorageSlot"
              innerRef={(ref) =>
                handleInputStorageSlotBlur(
                  ref,
                  inputStorageSlotValue,
                  setFieldValue,
                )
              }
              appearance={{
                theme: 'fat',
                colorSchema: 'grey',
              }}
            />
            {inputStorageSlotError && (
              <span className={styles.inputValidationError}>
                <InputStatus error={inputStorageSlotError} />
              </span>
            )}
            <div className={styles.currentValueText}>
              <FormattedMessage
                {...MSG.currentValueLabel}
                values={{
                  slotValue: <span>{CURRENT_VALUE_PLACEHOLDER}</span>,
                }}
              />
            </div>
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
                onClick={() => handleSubmit()}
                text={{ id: 'button.submit' }}
                loading={isSubmitting}
                disabled={!isValid}
              />
            </div>
          </div>
        </div>
      )}
    </ActionForm>
  );
};

InputStorageWidget.displayName = 'dashboard.ActionsPage.InputStorageWidget';

export default InputStorageWidget;
