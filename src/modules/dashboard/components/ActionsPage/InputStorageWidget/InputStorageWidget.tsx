import React from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import ExternalLink from '~core/ExternalLink';
import { ActionTypes } from '~redux/index';
import { ActionForm, Input } from '~core/Fields';

import styles from './InputStorageWidget.css';

export interface FormValues {
  inputStorageSlot?: string;
  inputNewValue?: string;
}

const LEARN_MORE_URL = '#CHANGEME';
const CURRENT_VALUE_PLACEHOLDER =
  '0x0000000000000000000000000000000000 000000000000000004939EF6B04812';

const MSG = defineMessages({
  inputStorageSlot: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.inputStorageSlot',
    defaultMessage: 'Input storage lot',
  },
  inputNewValue: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.inputNewValue',
    defaultMessage: 'Input new value',
  },
  currentValueLabel: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.currentValueLabel',
    defaultMessage: 'Current value:',
  },
  currentValue: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.currentValue',
    defaultMessage: '{currentValue}',
  },
  token: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.address',
    defaultMessage: 'Token',
  },
  learnMoreLink: {
    id: 'dashboard.InputStorageWidget.InputStorageWidgetForm.learnMoreLink',
    defaultMessage: 'Learn more',
  },
});

const InputStorageWidget = () => {
  const validationSchema = yup.object().shape({
    inputStorageSlot: yup.string().required(),
    inputNewValue: yup.string().required(),
  });

  return (
    <ActionForm
      initialValues={{
        inputStorageSlot: '',
        inputNewValue: '',
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.MOVE_FUNDS_BETWEEN_POTS} // @TODO: Add in correct ActionTypes
      error={ActionTypes.MOVE_FUNDS_BETWEEN_POTS_ERROR}
      success={ActionTypes.MOVE_FUNDS_BETWEEN_POTS}
    >
      {(formValues: FormikProps<FormValues>) => {
        return (
          <div className={styles.widgetForm}>
            <ExternalLink
              className={styles.learnMoreLink}
              text={MSG.learnMoreLink}
              href={LEARN_MORE_URL}
            />
            <div className={styles.inputStorageSlotContainer}>
              <Input
                label={MSG.inputStorageSlot}
                name="inputStorageSlot"
                appearance={{
                  theme: 'fat',
                  colorSchema: 'grey',
                }}
                onClick={() => {}} // @TODO: Connect with functional on click handler
              />
            </div>
            <p className={styles.currentValueText}>
              <FormattedMessage {...MSG.currentValueLabel} />
            </p>
            <p className={styles.currentValueText}>
              <FormattedMessage
                {...MSG.currentValue}
                values={{ currentValue: CURRENT_VALUE_PLACEHOLDER }}
              />
            </p>
            <Input
              label={MSG.inputNewValue}
              name="inputNewValue"
              appearance={{
                theme: 'fat',
                colorSchema: 'grey',
              }}
            />
            <div className={styles.formFooter}>
              <Button
                appearance={{ theme: 'primary', size: 'medium' }}
                onClick={() => formValues.handleSubmit()}
                text={{ id: 'button.submit' }}
                loading={formValues.isSubmitting}
                disabled={!formValues.isValid}
              />
            </div>
          </div>
        );
      }}
    </ActionForm>
  );
};

InputStorageWidget.displayName = 'dashboard.InputStorageWidget';

export default InputStorageWidget;
